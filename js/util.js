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
    }
  };
})();
