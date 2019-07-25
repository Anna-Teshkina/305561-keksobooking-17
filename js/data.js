'use strict';

// модуль, который формирует массив данных - метки объявлений
(function () {
  // var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var TYPES = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
  var PRICES = [1000, 2000, 100, 500, 900];
  var TIMES = ['12:00', '13:00', '14:00'];
  var MAP_TOP = 130;
  var MAP_BOTTOM = 630;
  var ADVERT_COUNT = 8;
  var PEAK_HEIGHT = 22; // высота пика

  // var ESC_CODE = 27;

  var map = document.querySelector('.map'); // блок карты
  var adverts = []; // массив объявлений

  var getAdvert = function (i) {
    var avatarSrc = 'img/avatars/user0' + parseInt(i + 1, 10) + '.png';

    var offerType = TYPES[window.util.getRandomFromInterval(0, TYPES.length - 1)];
    var offerTitle = 'Заголовок ' + i;
    var offerAddress = 'Здесь будет адрес локации ' + i;
    var offerPrice = PRICES[window.util.getRandomFromInterval(0, PRICES.length - 1)];
    var offerTimeStart = TIMES[window.util.getRandomFromInterval(0, TIMES.length - 1)];
    var offerTimeEnd = TIMES[window.util.getRandomFromInterval(0, TIMES.length - 1)];

    var mapWidth = map.offsetWidth; // ширина карты
    var locationX = window.util.getRandomFromInterval(0, mapWidth);
    var locationY = window.util.getRandomFromInterval(MAP_TOP, MAP_BOTTOM);

    var advert = {
      author: {
        avatar: avatarSrc,
      },
      offer: {
        title: offerTitle,
        address: offerAddress,
        price: offerPrice,
        type: offerType,
        rooms: window.util.getRandomFromInterval(1, 5),
        guests: window.util.getRandomFromInterval(1, 5),
        checkin: offerTimeStart,
        checkout: offerTimeEnd,
        features: {
          0: 'wifi',
          1: 'dishwasher',
          2: 'parking',
          3: 'washer',
          4: 'elevator',
          5: 'conditioner'
        },
        photos: {
          0: 'https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/5a29d708-9396-40bf-b002-92c5fdeb5c90.jpeg',
          1: 'https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/23e332cb-1379-4582-85ac-901d6c441635.jpeg',
          2: 'https://cdn.ostrovok.ru/t/x500/carsolize/images/hotels/1c859bbf-61d6-4295-b463-c1d0cbf62592.jpeg'
        }
      },
      location: {
        x: locationX,
        y: locationY
      },
      id: i
    };
    return advert;
  };

  /* сформируем массив объявлений */
  for (var i = 0; i < ADVERT_COUNT; i++) {
    var advertItem = getAdvert(i);
    adverts.push(advertItem);
  }

  // console.log(adverts);

  window.data = {
    adverts: adverts,
    map: map,
    PEAK_HEIGHT: PEAK_HEIGHT
  };
})();
