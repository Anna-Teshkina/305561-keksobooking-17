'use strict';

// модуль, который работает с формой объявления
(function () {
  var formAd = document.querySelector('.ad-form');

  // Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»
  // Вместе с минимальным значением цены нужно изменять и плейсхолдер.

  var selectType = formAd.querySelector('#type'); // селектор - тип жилья
  var selectedTypeValue = selectType.value; // значение выбранного типа жилья
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

  // сброс всех полей
  var formReset = formAd.querySelector('.ad-form__reset');
  formReset.addEventListener('click', function () {
    formAd.reset(); // сбрасываем все поля формы

    window.upload.preview.src = 'img/muffin-grey.svg'; // сброс аватара пользователя

    // сброс загруженных изображений
    var uploadPhoto = formAd.querySelectorAll('img.ad-form__photo');
    for (var i = 0; i < uploadPhoto.length; i++) {
      window.upload.photoContainer.removeChild(uploadPhoto[i]);
    }
  });

  /* --------------------------------------------------------------- */
  // вводим объекты: guestsToRooms, roomsToGuests - соответствие между value комнат и value кол-ва гостей
  // в объектах для каждого value перечисляем доступные варианты
  var guestsToRooms = {
    '1': [1, 2, 3],
    '2': [2, 3],
    '3': [3],
    '0': [100]
  };

  var roomsToGuests = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0]
  };

  var selectRooms = formAd.querySelector('#room_number'); // селектор с выбором кол-ва комнат
  var selectGuests = formAd.querySelector('#capacity'); // селектор с выбором кол-ва гостей
  var flag = false;

  // я изменила разметку и в изначальном варианте поставила 100 комнат/ не для гостей,
  // это валидный вариант, поэтому устанавливаем для комнат и гостей начальное сообщние = "",
  // т.е. проходит валидацию
  selectRooms.setCustomValidity('');
  selectGuests.setCustomValidity('');

  selectRooms.addEventListener('change', function () {
    var selectedRoomsValue = selectRooms.value; // value выбранной комнаты
    var availableGuests = roomsToGuests[selectedRoomsValue]; // смотрим для данного value какое кол-во гостей нам подходит
    var guestsOptionArray = selectGuests.querySelectorAll('option'); // список вариантов выбора гостей

    // изначально ставим флаг - false, т.е. кол-во гостей не соответствует кол-ву комнат, устанавливаем сообщение об ошибке
    // затем если проверка выполнится, меняем флаг на true, удаляем сообщение об ошибке
    selectRooms.setCustomValidity('Количество комнат не может быть меньше кол-ва гостей. \n Вариант 100 комнат предназначен не для гостей.');

    for (var i = 0; i < guestsOptionArray.length; i++) {
      if ((guestsOptionArray[i].selected === true) && (availableGuests.indexOf(parseInt(guestsOptionArray[i].value, 10)) !== -1)) {
        flag = true;
      }
    }

    if (flag) {
      selectRooms.setCustomValidity('');
      selectGuests.setCustomValidity('');
    }
  });

  selectGuests.addEventListener('change', function () {
    var selectedGuestsValue = selectGuests.value; // value выбранного кол-ва гостей
    var availableRooms = guestsToRooms[selectedGuestsValue]; // смотрим для данного value какие варианты комнат нам подходит
    var roomsOptionArray = selectRooms.querySelectorAll('option'); // список вариантов комнат

    // изначально ставим флаг - false, т.е. кол-во гостей не соответствует кол-ву комнат, устанавливаем сообщение об ошибке
    // затем если проверка выполнится, меняем флаг на true, удаляем сообщение об ошибке
    selectGuests.setCustomValidity('Количество гостей не может быть больше кол-ва комнат. \n Вариант 100 комнат предназначен не для гостей.');

    for (var i = 0; i < roomsOptionArray.length; i++) {
      if ((roomsOptionArray[i].selected === true) && (availableRooms.indexOf(parseInt(roomsOptionArray[i].value, 10)) !== -1)) {
        flag = true;
      }
    }

    if (flag) {
      selectRooms.setCustomValidity('');
      selectGuests.setCustomValidity('');
    }
  });

  window.form = {
    formAd: formAd
  };
})();
