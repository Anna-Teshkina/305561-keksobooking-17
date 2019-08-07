'use strict';

// модуль, который работает с формой объявления
(function () {
  var MAX_ROOMS = 100;
  var formAd = document.querySelector('.ad-form');

  // Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»
  // Вместе с минимальным значением цены нужно изменять и плейсхолдер.

  var selectType = formAd.querySelector('#type'); // селектор - тип жилья
  var selectedTypeValue = selectType.value; // значение выбранного типа жилья
  var inputPrice = formAd.querySelector('#price'); // поле - цена за ночь

  // ключ объекта: тип жилья, значение: минимальная цена соответствующая данному типу жилья
  var minPricesArray = {
    bungalo: 0,
    flat: 1000,
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

  // сброс всех полей
  var resetBtn = formAd.querySelector('.ad-form__reset');
  resetBtn.addEventListener('click', function () {
    window.isFormSend = true;
    window.map.setInactiveStatus();
  });

  /* --------------------------------------------------------------- */
  var selectRooms = formAd.querySelector('#room_number'); // селектор с выбором кол-ва комнат
  var selectGuests = formAd.querySelector('#capacity'); // селектор с выбором кол-ва гостей

  // я изменила разметку и в изначальном варианте поставила 100 комнат/ не для гостей,
  // это валидный вариант, поэтому сообщение об ошибке установим только на событие onChange

  var setCustomValidationMessage = function () {
    var customMessage = ''; // сообщение об ошибке
    var rooms = parseInt(selectRooms.value, 10); // кол-во комнат
    var guests = parseInt(selectGuests.value, 10); // кол-во гостей

    if ((rooms < guests) && (rooms !== MAX_ROOMS) && (guests !== 0)) {
      customMessage = 'Кол-во комнат не может быть меньше кол-ва гостей';
    } else if ((rooms === MAX_ROOMS) && (guests !== 0)) {
      customMessage = 'Выберите вариант: не для гостей.';
    } else if ((rooms !== MAX_ROOMS) && (guests === 0)) {
      customMessage = 'Не для гостей доступен только вариант 100 комнат.';
    }

    selectRooms.setCustomValidity(customMessage);
  };

  selectRooms.addEventListener('change', setCustomValidationMessage);
  selectGuests.addEventListener('change', setCustomValidationMessage);

  /* --------------------------------------------------------------- */

  var showSuccessMessage = function () {
    var successElement = window.server.successTemplate.cloneNode(true);
    document.body.appendChild(successElement);

    var closeSendSuccessPopup = function () {
      document.body.removeChild(successElement);
      document.removeEventListener('keydown', onSendSuccessPopupEsc);
    };

    var onSendSuccessPopupEsc = function (evt) {
      if (evt.keyCode === window.ESC_CODE) {
        closeSendSuccessPopup(successElement);
        document.removeEventListener('keydown', onSendSuccessPopupEsc);
      }
    };

    successElement.addEventListener('click', closeSendSuccessPopup);
    document.addEventListener('keydown', onSendSuccessPopupEsc);
  };

  var onSendSuccess = function () {
    window.isFormSend = true;
    window.map.setInactiveStatus();
    showSuccessMessage();
  };

  var onSendError = function () {
    var errorElement = window.server.errorTemplate.cloneNode(true);
    document.body.appendChild(errorElement);

    var closeSendErrorPopup = function () {
      document.body.removeChild(errorElement);
      document.removeEventListener('keydown', onSendPopupEsc);
      window.server.send(new FormData(formAd), onSendSuccess, onSendError);
    };

    var onSendPopupEsc = function (evt) {
      if (evt.keyCode === window.ESC_CODE) {
        closeSendErrorPopup();
      }
    };

    errorElement.addEventListener('click', closeSendErrorPopup);
    document.addEventListener('keydown', onSendPopupEsc);
  };

  // отправка данных на сервер
  formAd.addEventListener('submit', function (evt) {
    window.server.send(new FormData(formAd), onSendSuccess, onSendError);
    evt.preventDefault();
  });

  window.formAd = formAd;
})();
