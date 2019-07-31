'use strict';
// модуль с общими методами
(function () {
  window.util = {
    // функция генерации случайного числа
    getRandomFromInterval: function (min, max) {
      var random = Math.floor(Math.random() * (max - min + 1)) + min;
      return random;
    },

    // случайная генерация true / false
    // getRandomBoolean: function () {
    //   // флаг, если произвольноечисло > 0.5 flag = true, иначе - false.
    //   var flag = true;
    //   if (Math.random() > 0.5) {
    //       flag = false;
    //   }
    //   return flag;
    // },

    // склонение числительных
    declOfNum: function (number, titles) {
      var cases = [2, 0, 1, 1, 1, 2];
      return titles [(number % 100 > 4 && number % 100 < 20) ? 2 : cases [(number % 10 < 5) ? number % 10 : 5]];
    },

    // генерируем фрагмент с пинами
    generatePins: function (array, count) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < count; i++) {
        // console.log(array[i]);
        fragment.appendChild(window.pin.renderPin(array[i]));
      }
      return fragment;
    },

    deletePins: function () {
      var pins = window.pin.pinList.querySelectorAll('.map__pin');
      for (var i = 1; i < pins.length; i++) {
        window.pin.pinList.removeChild(pins[i]);
      }
    }
  };
})();
