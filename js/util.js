'use strict';
// модуль с общими методами
(function () {
  window.util = {
    // функция генерации случайного числа
    getRandomFromInterval: function (min, max) {
      var random = Math.floor(Math.random() * (max - min + 1)) + min;
      return random;
    },

    // склонение числительных
    declOfNum: function (number, titles) {
      var cases = [2, 0, 1, 1, 1, 2];
      return titles [(number % 100 > 4 && number % 100 < 20) ? 2 : cases [(number % 10 < 5) ? number % 10 : 5]];
    },

    // генерируем фрагмент с пинами
    generatePins: function (array, count) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < count; i++) {
        fragment.appendChild(window.pin.render(array[i]));
      }
      return fragment;
    },

    // генерируем фрагмент с карточками
    generateCards: function (array) {
      var fragment = document.createDocumentFragment();
      array.forEach(function (item) {
        fragment.appendChild(window.card.render(item));
      });
      return fragment;
    },

    // удаление пинов со страницы
    deletePins: function () {
      var pins = window.pin.pinList.querySelectorAll('.map__pin');
      // main__pin - первый в разметке, удаляем со второго элемента
      for (var i = 1; i < pins.length; i++) {
        window.pin.pinList.removeChild(pins[i]);
      }
    },

    // скрывает все карточки
    hideCards: function () {
      Array.from(window.popupList).forEach(function (card) {
        card.style.display = 'none';
      });
    },

    // устанавливает атрибут disabled (для полей формы)
    setDisabledAttribute: function (array) {
      array.forEach(function (item) {
        item.disabled = true;
      });
    },

    // удаляет атрибут disabled (для полей формы)
    removeDisabledAttribute: function (array) {
      array.forEach(function (item) {
        item.disabled = false;
      });
    },
  };
})();
