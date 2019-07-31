'use strict';

// модуль, который отвечает за перемещение метки по карте,
// установку координат метки в поле адреса
(function () {
  // ограничение по оси Y
  var MIN_Y = 130;
  var MAX_Y = 630;

  // ограничение по оси X
  var MIN_X = 0;
  var MAX_X = 1135;

  var PEAK_HEIGHT = 22; // высота пика
  var map = document.querySelector('.map'); // блок карты

  // При первом открытии, страница находится в неактивном состоянии:
  // блок с картой находится в неактивном состоянии, форма подачи заявления заблокирована.
  // элементы управления формы (input, select и т.д.) должны быть неактивны в исходном состоянии

  var formInput = window.form.formAd.querySelectorAll('input');
  var formSelect = window.form.formAd.querySelectorAll('select');
  var formBtns = window.form.formAd.querySelectorAll('button');
  var formTextarea = window.form.formAd.querySelector('textarea');

  // в исходном состоянии устанавливаем для элементов формы атрибут disabled
  var setDisabledAttribute = function (array) {
    for (var i = 0; i < array.length; i++) {
      array[i].setAttribute('disabled', 'disabled');
    }
  };

  setDisabledAttribute(formInput);
  setDisabledAttribute(formSelect);
  setDisabledAttribute(formBtns);
  setDisabledAttribute(formTextarea);

  // элементы управления формы с фильтрами .map__filters заблокирована так же, как и форма .ad-form;
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersSelect = mapFilters.querySelectorAll('select');
  setDisabledAttribute(mapFiltersSelect);
  // for (var i = 0; i < mapFiltersSelect.length; i++) {
  //   mapFiltersSelect[i].setAttribute('disabled', 'disabled');
  // }

  var pinMain = map.querySelector('.map__pin--main');
  var widthPinMain = pinMain.offsetWidth; // ширина метки
  var radiusPinMain = widthPinMain / 2; // радиус метки

  var leftPinMain = pinMain.offsetLeft; // расстояние от метки до левого края карты
  var topPinMain = pinMain.offsetTop; // расстояние от метки до верха карты

  var xPinMain = leftPinMain + radiusPinMain; // начальная координата метки до смещения (ось абсцисс)
  var yPinMain = topPinMain + radiusPinMain; // начальная координата метки до смещения (ось ординат)

  // поле адреса должно быть заполнено, исходное значение поля адреса - середина метки
  var inputAddress = window.form.formAd.querySelector('#address');
  inputAddress.setAttribute('value', xPinMain + ', ' + yPinMain);

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var startPinCoords = {
      x: leftPinMain + radiusPinMain,
      y: topPinMain + widthPinMain + PEAK_HEIGHT
    };

    var dragged = false; // флаг (true - перемещение было, false - перемещения не было)

    var onMouseMove = function (moveEvt) {
      dragged = true;
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // сначала поставим ограничение на движение пина по оси Х
      // ширина карты 1200px, т.о для абсолютно-спозиционированного элемента
      // ограничение для левой координаты: 0px и (1200 - 65) = 1135px
      // расчет координат указан с учетом ширины макера (пункт 4.5 ТЗ)

      if (pinMain.offsetLeft - shift.x < MIN_X) {
        leftPinMain = MIN_X;
        pinMain.style.left = MIN_X;
      } else if (pinMain.offsetLeft - shift.x > MAX_X) {
        leftPinMain = MAX_X;
        pinMain.style.left = MAX_X;
      } else {
        leftPinMain = pinMain.offsetLeft;
        pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
      }

      // по условию движение метки ограничено по оси Y от 130 до 630
      // т.к. речь идет именно о положении острого конца пина, то
      // верхняя координата равна 130 - высота пина;
      // высота пина равна высоте пика + диаметр метки (=ширин метки)
      // if (pinMain.offsetTop - shift.y < MIN_Y - PEAK_HEIGHT - widthPinMain) {
      //   topPinMain = MIN_Y - PEAK_HEIGHT - widthPinMain;
      //   pinMain.style.top = MIN_Y - PEAK_HEIGHT - widthPinMain;
      // } else if (pinMain.offsetTop - shift.y > MAX_Y) {
      //   topPinMain = MAX_Y;
      //   pinMain.style.top = MAX_Y;
      // } else {
      //   topPinMain = pinMain.offsetTop;
      //   pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
      // }

      if (pinMain.offsetTop - shift.y < MIN_Y) {
        topPinMain = MIN_Y;
        pinMain.style.top = MIN_Y;
      } else if (pinMain.offsetTop - shift.y > MAX_Y) {
        topPinMain = MAX_Y;
        pinMain.style.top = MAX_Y;
      } else {
        topPinMain = pinMain.offsetTop;
        pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
      }

      startPinCoords = {
        x: leftPinMain + radiusPinMain,
        y: topPinMain + widthPinMain + PEAK_HEIGHT
      };

      // поле адреса должно быть заполнено, исходное значение поля адреса - острый конец метки
      inputAddress.setAttribute('value', startPinCoords.x + ', ' + startPinCoords.y);
    };

    var onMouseUp = function () {
      // переводим карту в активное состояние
      map.classList.remove('map--faded');

      // переводим форму и поля формы в активное состояние
      window.form.formAd.classList.remove('ad-form--disabled');

      // в активном состоянии элементы управления формы и фильра (input, select и т.д.) должны быть активны
      var removeDisabledAttribute = function (array) {
        for (var i = 0; i < array.length; i++) {
          array[i].removeAttribute('disabled', 'disabled');
        }
      };

      removeDisabledAttribute(formInput);
      removeDisabledAttribute(formSelect);
      removeDisabledAttribute(formBtns);
      removeDisabledAttribute(formTextarea);
      removeDisabledAttribute(mapFiltersSelect);


      var checkInterval = setInterval(function () {
        if (window.data !== undefined) {
          clearInterval(checkInterval);
          window.pin.pinList.appendChild(window.data.fragmentPin); // выводим метки на страницу
        }
      }, 100);


      if (!dragged) {
        startPinCoords = {
          x: leftPinMain + radiusPinMain,
          y: topPinMain + widthPinMain + PEAK_HEIGHT
        };

        // поле адреса должно быть заполнено, исходное значение поля адреса - острый конец метки
        inputAddress.setAttribute('value', startPinCoords.x + ', ' + startPinCoords.y);
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
