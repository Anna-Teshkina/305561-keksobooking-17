'use strict';

// модуль, который отвечает за создание карточек на странице
(function () {
  var PHOTO_WIDTH = 45;
  var PHOTO_HEIGHT = 40;

  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  var typesMap = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
    'palace': 'Дворец'
  };

  var render = function (advert) {
    var cardElement = cardTemplate.cloneNode(true);
    cardElement.dataset.id = advert.id;

    var cardImg = cardElement.querySelector('.popup__avatar'); // аватар пользователя
    var cardTitle = cardElement.querySelector('.popup__title'); // заголовок объявления
    var cardAddress = cardElement.querySelector('.popup__text--address'); // адрес
    var cardPrice = cardElement.querySelector('.popup__text--price'); // цена
    var cardType = cardElement.querySelector('.popup__type'); // тип жилья
    var cardCapacity = cardElement.querySelector('.popup__text--capacity'); // количество гостей и комнат
    var cardTime = cardElement.querySelector('.popup__text--time'); // время заезда и выезда
    var feturesBlock = cardElement.querySelector('.popup__features'); // блок со списком удобств
    var photosBlock = cardElement.querySelector('.popup__photos'); // блок со списком фотографий

    cardImg.src = advert.author.avatar;
    cardImg.alt = advert.offer.type;
    cardTitle.textContent = advert.offer.title;
    cardAddress.textContent = advert.offer.address;
    cardPrice.innerHTML = advert.offer.price + '&#x20bd;<span>/ночь</span>';
    cardType.textContent = typesMap[advert.offer.type];
    cardCapacity.textContent = advert.offer.rooms + ' ' + window.util.declOfNum(advert.offer.rooms, ['комната', 'комнаты', 'комнат']) + ' для ' + advert.offer.guests + ' ' + window.util.declOfNum(advert.offer.guests, ['гостя', 'гостей', 'гостей']);
    cardTime.textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

    /* ----------------------------------------------------------- */
    var cardFeatures = cardElement.querySelectorAll('.popup__feature'); // список удобств

    // Из карточек удобств локации (блок capacity) удалим все дочерние элементы
    Array.from(cardFeatures).forEach(function (feature) {
      feturesBlock.removeChild(feature);
    });

    // для каждого объявления смотрим, какие удобства есть в локации
    // и выводим, только те, которые указаны в объявлении
    // если удобств нет, блок не выводится

    var features = Object.values(advert.offer.features);

    features.forEach(function (item) {
      var feature = document.createElement('li');
      feature.className = 'popup__feature popup__feature--' + item;
      feturesBlock.appendChild(feature);
    });

    /* ----------------------------------------------------------- */
    var cardPhotos = cardElement.querySelectorAll('.popup__photo'); // список фотографий

    // Удалим все дочерние элементы
    Array.from(cardPhotos).forEach(function (item) {
      photosBlock.removeChild(item);
    });

    var photos = Object.values(advert.offer.photos);

    photos.forEach(function (item) {
      var photo = document.createElement('img');
      photo.className = 'popup__photo';
      photo.src = item;
      photo.alt = 'Фотография жилья';
      photo.width = PHOTO_WIDTH;
      photo.height = PHOTO_HEIGHT;
      feturesBlock.appendChild(photo);
    });

    cardElement.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscPress);
    return cardElement;
  };

  // при нажатии на крестик и esc карточка закрывается
  var onPopupCloseClick = function () {
    window.util.hideCards(); // скрываем все карточки
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.ESC_CODE) {
      window.util.hideCards(); // скрываем все карточки
    }
  };

  window.card = {
    render: render,
    onPopupEscPress: onPopupEscPress,
    onPopupCloseClick: onPopupCloseClick
  };
})();
