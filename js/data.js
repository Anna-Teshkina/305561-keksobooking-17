'use strict';

// модуль, который формирует массив данных - метки объявлений
(function () {
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  window.ESC_CODE = 27; // код клавиши esc
  window.ENTER_CODE = 13; // код клавиши enter
  var ADVERTS_COUNT = 5; // максимальное кол-во выводимых на страницу объявлений

  var onSuccess = function (data) {
    var serverData = data;

    var adverts = []; // массив объявлений
    var isLoad = false;

    // для каждого объекта добавим новый ключ id
    serverData.forEach(function (item, i) {
      var advertItem = item;
      advertItem.id = i;
      adverts.push(advertItem);
    });

    window.data = {
      adverts: adverts,
      isLoad: isLoad,
      ADVERTS_COUNT: ADVERTS_COUNT
    };
  };

  var onError = function () {
    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

    var errorElement = errorTemplate.cloneNode(true);
    document.body.appendChild(errorElement);

    var closeLoadErrorPopup = function () {
      document.body.removeChild(errorElement);
      document.removeEventListener('keydown', onLoadPopupEsc);
      window.load(LOAD_URL, onSuccess, onError);
    };

    var onLoadPopupEsc = function (evt) {
      if (evt.keyCode === window.ESC_CODE) {
        closeLoadErrorPopup();
      }
    };

    document.addEventListener('keydown', onLoadPopupEsc);
    errorElement.addEventListener('click', closeLoadErrorPopup);
  };

  window.load(LOAD_URL, onSuccess, onError);
})();
