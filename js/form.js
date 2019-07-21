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
})();
