'use strict';

// модуль, который работает с формой объявления
(function () {
  var MIN_Y = 130;
  var MAX_Y = 630;
  var MIN_X = 0;
  var MAX_X = 1135;

  // При первом открытии, страница находится в неактивном состоянии:
  // блок с картой находится в неактивном состоянии, форма подачи заявления заблокирована.

  // элементы управления формы (input, select и т.д.) должны быть неактивны в исходном состоянии
  var formAd = document.querySelector('.ad-form');

  var formInput = formAd.querySelectorAll('input');
  for (var i = 0; i < formInput.length; i++) {
    formInput[i].setAttribute('disabled', 'disabled');
  }

  var formSelect = formAd.querySelectorAll('select');
  for (i = 0; i < formSelect.length; i++) {
    formSelect[i].setAttribute('disabled', 'disabled');
  }

  var formBtns = formAd.querySelectorAll('button');
  for (i = 0; i < formBtns.length; i++) {
    formBtns[i].setAttribute('disabled', 'disabled');
  }

  var formTextarea = formAd.querySelector('textarea');
  formTextarea.setAttribute('disabled', 'disabled');

  // элементы управления формы с фильтрами .map__filters заблокирована так же, как и форма .ad-form;
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersSelect = mapFilters.querySelectorAll('select');
  for (i = 0; i < mapFiltersSelect.length; i++) {
    mapFiltersSelect[i].setAttribute('disabled', 'disabled');
  }

  var pinMain = window.data.map.querySelector('.map__pin--main');
  var widthPinMain = pinMain.offsetWidth; // ширина метки
  var radiusPinMain = widthPinMain / 2; // радиус метки
  // console.log('widthPinMain', widthPinMain);
  // console.log('radiusPinMain', radiusPinMain);


  var leftPinMain = pinMain.offsetLeft; // расстояние от метки до левого края карты
  var topPinMain = pinMain.offsetTop; // расстояние от метки до верха карты
  // console.log('leftPinMain', leftPinMain);
  // console.log('topPinMain', topPinMain);


  var xPinMain = leftPinMain + radiusPinMain; // начальная координата метки до смещения (ось абсцисс)
  var yPinMain = topPinMain + radiusPinMain; // начальная координата метки до смещения (ось ординат)
  // console.log('xPinMain', widthPinMain);
  // console.log('yPinMain', radiusPinMain);

  // поле адреса должно быть заполнено, исходное значение поля адреса - середина метки
  var inputAddress = formAd.querySelector('#address');
  inputAddress.setAttribute('value', xPinMain + ', ' + yPinMain);

  // модуль 5.

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var startPinCoords = {
      x: leftPinMain + radiusPinMain,
      y: topPinMain + widthPinMain + window.PEAK_HEIGHT
    };

    var dragged = false; // флаг (true - перемещение было, false - перемещения не было)

    var onMouseMove = function (moveEvt) {
      dragged = true;
      moveEvt.preventDefault();

      // console.log(moveEvt.clientX, moveEvt.clientY);

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      // console.log(shift.x, shift.y);
      // console.log("---------------------------------");

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // console.log(pinMain.offsetTop - shift.y);
      // console.log(pinMain.offsetLeft - shift.x);
      // console.log(pinMain.offsetTop);
      // console.log("---------------------------------");
      // console.log("---------------------------------");

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
        y: topPinMain + widthPinMain + window.data.PEAK_HEIGHT
      };

      // поле адреса должно быть заполнено, исходное значение поля адреса - острый конец метки
      inputAddress.setAttribute('value', startPinCoords.x + ', ' + startPinCoords.y);
    };

    var onMouseUp = function () {
      // переводим карту в активное состояние
      window.data.map.classList.remove('map--faded');

      // переводим форму и поля формы в активное состояние
      formAd.classList.remove('ad-form--disabled');

      // в активном состоянии элементы управления формы (input, select и т.д.) должны быть активны
      for (i = 0; i < formInput.length; i++) {
        formInput[i].removeAttribute('disabled', 'disabled');
      }

      for (i = 0; i < formSelect.length; i++) {
        formSelect[i].removeAttribute('disabled', 'disabled');
      }

      for (i = 0; i < formBtns.length; i++) {
        formBtns[i].removeAttribute('disabled', 'disabled');
      }

      formTextarea.removeAttribute('disabled', 'disabled');

      // выводим метки на страницу
      window.data.advertList.appendChild(window.data.fragment);

      if (!dragged) {
        startPinCoords = {
          x: leftPinMain + radiusPinMain,
          y: topPinMain + widthPinMain + window.data.PEAK_HEIGHT
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
