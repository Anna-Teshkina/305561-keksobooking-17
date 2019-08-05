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

  var PIN_START_X = 570; // начальная координата пина x
  var PIN_START_Y = 375; // начальная координта пина y

  var PEAK_HEIGHT = 22; // высота пика
  var map = document.querySelector('.map'); // блок карты
  var mapFilters = document.querySelector('.map__filters'); // блок фильтра

  var formElements = window.form.formAd.querySelectorAll('fieldset'); // поля формы
  var filterElements = mapFilters.querySelectorAll('fieldset, select'); // поля фильтра

  var pinMain = map.querySelector('.map__pin--main'); // метка

  // устанавливает пин в исходное положение
  var setMainPin = function () {
    pinMain.style.top = PIN_START_Y + 'px';
    pinMain.style.left = PIN_START_X + 'px';
  };

  var widthPinMain = pinMain.offsetWidth; // ширина метки
  var radiusPinMain = widthPinMain / 2; // радиус метки

  var leftPinMain = PIN_START_X; // расстояние от метки до левого края карты
  var topPinMain = PIN_START_Y; // расстояние от метки до верха карты

  var xPinMain = leftPinMain + radiusPinMain; // начальная координата метки до смещения (ось абсцисс)
  var yPinMain = topPinMain + radiusPinMain; // начальная координата метки до смещения (ось ординат)

  var inputAddress = window.form.formAd.querySelector('#address'); // поле адреса
  window.isFormSend = false;

  var setInactiveAddress = function (x, y) {
    inputAddress.setAttribute('value', x + ', ' + y);
  };

  var resetForm = function () {
    window.form.formAd.reset(); // сбрасываем все поля формы
    window.upload.preview.src = 'img/muffin-grey.svg'; // сброс аватара пользователя

    // сброс загруженных изображений
    var uploadPhoto = window.form.formAd.querySelectorAll('img.ad-form__photo');
    for (var i = 0; i < uploadPhoto.length; i++) {
      window.upload.photoContainer.removeChild(uploadPhoto[i]);
    }
  };

  var setInactiveStatus = function () {
    // В неактивном состоянии:
    // блок с картой находится в неактивном состоянии, форма подачи заявления заблокирована.
    // элементы управления формы (input, select и т.д.) и фильтра должны быть неактивны в исходном состоянии

    // если деактивация вызвана отправкой формы
    if (window.isFormSend) {
      map.classList.add('map--faded'); // переводим карту в неактивное состояние
      window.form.formAd.classList.add('ad-form--disabled'); // переводим форму в неактивное состояние
    }

    // вернем пин в исходное состояние
    setMainPin();

    // удалим все текущие пины со страницы
    window.util.deletePins();

    // элементы управления формы (input, select и т.д.) и фильтра должны быть неактивны в исходном состоянии
    window.util.setDisabledAttribute(formElements);
    window.util.setDisabledAttribute(filterElements);

    setInactiveAddress(xPinMain, yPinMain);

    resetForm();
  };

  setInactiveStatus();

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

      // по условию движение метки ограничено по оси Y от 130 до 630
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
      map.classList.remove('map--faded'); // переводим карту в активное состояние
      window.form.formAd.classList.remove('ad-form--disabled'); // переводим форму в активное состояние

      // в активном состоянии элементы управления формы и фильтра (input, select и т.д.) должны быть активны
      window.util.removeDisabledAttribute(formElements);
      window.util.removeDisabledAttribute(filterElements);


      var checkInterval = setInterval(function () {
        if (window.data !== undefined) {
          clearInterval(checkInterval);
          var fragmentPin = window.util.generatePins(window.data.adverts, window.data.ADVERTS_COUNT); // генерируем фрагмент с пинами
          window.pin.pinList.appendChild(fragmentPin); // выводим метки на страницу
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

  window.map = {
    map: map,
    setInactiveStatus: setInactiveStatus,
    setInactiveAddress: setInactiveAddress,
    xPinMain: xPinMain,
    yPinMain: yPinMain
  };
})();
