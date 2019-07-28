'use strict';

// модуль, который формирует массив данных - метки объявлений
(function () {
  var onSuccess = function (data) {
    var serverData = data;
    // console.log(data);
    var adverts = []; // массив объявлений

    for (var i = 0; i < serverData.length; i++) {
      var advertItem = serverData[i];
      advertItem.id = i;
      adverts.push(advertItem);
    }
    // console.log(adverts);


    var fragmentCard = document.createDocumentFragment(); // генерируем фрагмент с карточками объявлений
    for (i = 0; i < adverts.length; i++) {
      fragmentCard.appendChild(window.card.renderCard(adverts[i]));
    }
    document.body.appendChild(fragmentCard); // выводим все карточки на страницу
    var popupList = document.querySelectorAll('.popup');
    for (i = 0; i < popupList.length; i++) { // изначально все карточки скрыты
      popupList[i].style.display = 'none';
    }
    // ---------------------------------------------------------------------------------
    var fragmentPin = document.createDocumentFragment(); // генерируем фрагмент с пинами
    for (i = 0; i < adverts.length; i++) {
      fragmentPin.appendChild(window.pin.renderPin(adverts[i]));
    }


    window.data = {
      adverts: adverts,
      popupList: popupList,
      fragmentPin: fragmentPin
    };
  };

  var onError = function () {
    // console.error(message);
    // console.log("Ошибка");

    var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

    var errorElement = errorTemplate.cloneNode(true);
    // console.log(errorElement);
    document.body.appendChild(errorElement);

    errorElement.addEventListener('click', function () {
      errorElement.style.display = 'none';
      window.load('https://js.dump.academy/keksobooking/data', onSuccess, onError);
    });
  };

  window.load('https://js.dump.academy/keksobooking/data', onSuccess, onError);
})();
