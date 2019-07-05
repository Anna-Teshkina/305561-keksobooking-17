'use strict';

/* MODULE3_TASK1 */
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MAP_TOP = 130;
var MAP_BOTTOM = 630;
var ADVERT_COUNT = 8;
var ADVERT_WIDTH = 50;
var ADVERT_HEIGHT = 70;

// var PEAK_WIDTH = 10; // ширина пика
var PEAK_HEIGHT = 22; // высота пика

var adverts = []; // массив объявлений

var map = document.querySelector('.map'); // блок карты

var advertList = document.querySelector('.map__pins');
var advertTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

// функция генерации случайного числа
var getRandomFromInterval = function (min, max) {
  var random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random;
};

var getAdvert = function (i) {
  var avatarSrc = 'img/avatars/user0' + parseInt(i + 1, 10) + '.png';
  var offerType = TYPES[getRandomFromInterval(0, TYPES.length - 1)];
  var mapWidth = map.offsetWidth; // ширина карты
  var locationX = getRandomFromInterval(0, mapWidth);
  var locationY = getRandomFromInterval(MAP_TOP, MAP_BOTTOM);

  var advert = {
    author: {
      avatar: avatarSrc,
    },
    offer: {
      type: offerType,
    },
    location: {
      x: locationX,
      y: locationY
    }
  };

  return advert;
};

/* сформируем массив объявлений */
for (var i = 0; i < ADVERT_COUNT; i++) {
  var advertItem = getAdvert(i);
  adverts.push(advertItem);
}

// console.log(adverts);

var renderAdvert = function (advert) {
  var advertElement = advertTemplate.cloneNode(true);
  var advertImg = advertElement.querySelector('img');

  advertElement.style.left = advert.location.x - ADVERT_WIDTH / 2 + 'px';
  advertElement.style.top = advert.location.y - ADVERT_HEIGHT + 'px';
  advertImg.src = advert.author.avatar;
  advertImg.alt = advert.offer.type;
  advertList.appendChild(advertElement);

  return advertElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < adverts.length; i++) {
  fragment.appendChild(renderAdvert(adverts[i]));
}


/* MODULE4_TASK1 */
// При первом открытии, страница находится в неактивном состоянии:
// блок с картой находится в неактивном состоянии, форма подачи заявления заблокирована.

// элементы управления формы (input, select и т.д.) должны быть неактивны в исходном состоянии
var formAd = document.querySelector('.ad-form');

var formInput = formAd.querySelectorAll('input');
for (i = 0; i < formInput.length; i++) {
  formInput[i].setAttribute('disabled', 'disabled');
}

var formSelect = formAd.querySelectorAll('select');
for (i = 0; i < formSelect.length; i++) {
  formSelect[i].setAttribute('disabled', 'disabled');
}

var formBtns = formAd.querySelectorAll('button');
for (i = 0; i < formBtns.length; i++) {
  formBtns[i].setAttribute('disabled', 'disabled');
}

var formTextarea = formAd.querySelector('textarea');
formTextarea.setAttribute('disabled', 'disabled');

// элементы управления формы с фильтрами .map__filters заблокирована так же, как и форма .ad-form;
var mapFilters = document.querySelector('.map__filters');
var mapFiltersSelect = mapFilters.querySelectorAll('select');
for (i = 0; i < mapFiltersSelect.length; i++) {
  mapFiltersSelect[i].setAttribute('disabled', 'disabled');
}

var pinMain = map.querySelector('.map__pin--main');
var widthPinMain = pinMain.offsetWidth; // ширина метки
var radiusPinMain = widthPinMain / 2; // радиус метки

var leftPinMain = pinMain.offsetLeft; // расстояние от метки до левого края карты
var topPinMain = pinMain.offsetTop; // расстояние от метки до верха карты

var xPinMain = leftPinMain + radiusPinMain; // начальная координата метки до смещения (ось абсцисс)
var yPinMain = topPinMain + radiusPinMain; // начальная координата метки до смещения (ось ординат)

// поле адреса должно быть заполнено, исходное значение поля адреса - середина метки
var inputAddress = formAd.querySelector('#address');
inputAddress.setAttribute('value', xPinMain + ', ' + yPinMain);

pinMain.addEventListener('mouseup', function () {
  // переводим карту в активное состояние
  map.classList.remove('map--faded');

  // переводим форму и поля формы в активное состояние
  formAd.classList.remove('ad-form--disabled');

  // в активном состоянии элементы управления формы (input, select и т.д.) должны быть активны
  for (i = 0; i < formInput.length; i++) {
    formInput[i].removeAttribute('disabled', 'disabled');
  }

  for (i = 0; i < formSelect.length; i++) {
    formSelect[i].removeAttribute('disabled', 'disabled');
  }

  for (i = 0; i < formBtns.length; i++) {
    formBtns[i].removeAttribute('disabled', 'disabled');
  }

  formTextarea.removeAttribute('disabled', 'disabled');

  // расчитаем начальные координаты метки в момент активации
  var xPinStart = xPinMain;
  var yPinStart = topPinMain + widthPinMain + PEAK_HEIGHT;

  // поле адреса должно быть заполнено, исходное значение поля адреса - острый конец метки
  inputAddress.setAttribute('value', xPinStart + ', ' + yPinStart);

  // выводим метки на страницу
  advertList.appendChild(fragment);
});


/* MODULE4_TASK2 */
// Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»
// Вместе с минимальным значением цены нужно изменять и плейсхолдер.

var selectType = formAd.querySelector('#type'); // селектор - тип жилья
// var selectedTypeIndex = selectType.options.selectedIndex; // индекс выбранного типа жилья
var selectedTypeValue = selectType.value;
console.log("selectedTypeValue =", selectedTypeValue);
var inputPrice = formAd.querySelector('#price'); // поле - цена за ночь

// ключ объекта: тип жилья, значение: минимальная цена соответствующая данному типу жилья
var minPricesArray = {
  bungalo: 0,
  flat: 2500,
  house: 5000,
  palace: 10000
};

// в зависимости от типа жилья изменяет минимальную цену за ночь
var setMinPrice = function (value) {
  inputPrice.setAttribute('min', minPricesArray[value]);
  inputPrice.setAttribute('placeholder', minPricesArray[value]);
};

// при загрузке определяем выбранный тип жилья и выставляем соответствующую минимальную цену
setMinPrice(selectedTypeValue);

// при изменении выбранного типа жилья выставляем соответствующую минимальную цену
selectType.addEventListener('change', function () {
  selectedTypeValue = selectType.value;
  setMinPrice(selectedTypeValue);
});

// Поля «Время заезда» и «Время выезда» синхронизированы:
// при изменении значения одного поля, во втором выделяется соответствующее ему.
var selectTimeIn = formAd.querySelector('#timein'); // время заезда
var selectTimeOut = formAd.querySelector('#timeout'); // время выезда

var changeTime = function (timeChanged, timeForChanging) {
  var index = timeChanged.options.selectedIndex;
  timeForChanging.options[index].selected = true;
};

// при изменении поля «Время заезда» меняем поле «Время выезда» и наоборот
selectTimeIn.addEventListener('change', function () {
  changeTime(selectTimeIn, selectTimeOut);
});

selectTimeOut.addEventListener('change', function () {
  changeTime(selectTimeOut, selectTimeIn);
});
