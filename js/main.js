'use strict';

var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MAP_TOP = 130;
var MAP_BOTTOM = 630;
var ADVERT_COUNT = 5;
var ADVERT_WIDTH = 50;
var ADVERT_HEIGHT = 70;

var adverts = []; // массив объявлений

var map = document.querySelector('.map'); // блок карты
map.classList.remove('map--faded');

var advertList = document.querySelector('.map__pins');
var advertTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

// функция генерации случайного числа
var getRandomFromInterval = function (min, max) {
  var random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random;
};

var getAdvert = function () {
  var avatarSrc = 'img/avatars/user0' + getRandomFromInterval(1, 8) + '.png';
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
  var advertItem = getAdvert();
  adverts.push(advertItem);
}

// console.log(adverts);

var renderAdvert = function (advert) {
  var advertElement = advertTemplate.cloneNode(true);
  var advertImg = advertElement.querySelector('img');

  advertElement.style.left = advert.location.x - ADVERT_WIDTH / 2 + 'px';
  advertElement.style.top = advert.location.y - ADVERT_HEIGHT + 'px';
  advertImg.setAttribute('src', advert.author.avatar);
  advertImg.setAttribute('alt', advert.offer.type);
  advertList.appendChild(advertElement);

  return advertElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < adverts.length; i++) {
  fragment.appendChild(renderAdvert(adverts[i]));
}

advertList.appendChild(fragment);
