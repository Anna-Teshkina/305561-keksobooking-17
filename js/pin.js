'use strict';
// модуль, который отвечает за создание меток на странице
(function () {
  var ADVERT_WIDTH = 50; // ширина метки
  var ADVERT_HEIGHT = 70; // высота метки

  var pinList = document.querySelector('.map__pins');

  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

  var render = function (advert) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.dataset.id = advert.id;
    var pinImg = pinElement.querySelector('img');

    pinElement.style.left = advert.location.x - ADVERT_WIDTH / 2 + 'px';
    pinElement.style.top = advert.location.y - ADVERT_HEIGHT + 'px';
    pinImg.src = advert.author.avatar;
    // pinImg.alt = advert.offer.type;
    pinList.appendChild(pinElement);

    var onPinClick = function () {
      // у всех карточек удаляем класс --active
      Array.from(window.pinElements).forEach(function (item) {
        if (item.classList.contains('map__pin--active')) {
          item.classList.remove('map__pin--active');
        }
      });

      // добавляем класс --active только текущей карточке
      pinElement.classList.add('map__pin--active');

      Array.from(window.popupList).forEach(function (item) {
        if (item.getAttribute('data-id') === pinElement.getAttribute('data-id')) {
          item.style.display = 'block'; // открываем только нужную карточку
        } else {
          item.style.display = 'none'; // скрываем все открытые карточки
        }
      });
    };

    var onPinEscPress = function (evt) {
      if (evt.keycode === window.ENTER_CODE) {
        onPinClick();
      }
    };

    // при клике на пин/ нажатии ENTER появляется карточка соответствующего объявления
    pinElement.addEventListener('click', onPinClick);

    // при клике на пин появляется карточка соответствующего объявления
    pinElement.addEventListener('keydown', onPinEscPress);

    return pinElement;
  };

  window.pin = {
    render: render,
    pinList: pinList
  };
})();
