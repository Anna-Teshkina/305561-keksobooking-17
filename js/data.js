'use strict';

// модуль, который формирует массив данных - метки объявлений
(function () {
  var onSuccess = function (data) {
    var serverData = data;
    // console.log(data);
    var adverts = []; // массив объявлений
    var ADVERTS_COUNT = 5;

    for (var i = 0; i < serverData.length; i++) {
      var advertItem = serverData[i];
      advertItem.id = i;
      adverts.push(advertItem);
    }

    // console.log(adverts);
    // console.log(filterType);
    // -------------------------------------------------------------------------------------------------
    var fragmentCard = document.createDocumentFragment(); // генерируем фрагмент с карточками объявлений
    for (i = 0; i < ADVERTS_COUNT; i++) {
      fragmentCard.appendChild(window.card.renderCard(adverts[i]));
    }
    document.body.appendChild(fragmentCard); // выводим все карточки на страницу
    var popupList = document.querySelectorAll('.popup');
    for (i = 0; i < popupList.length; i++) { // изначально все карточки скрыты
      popupList[i].style.display = 'none';
    }
    // -------------------------------------------------------------------------------------------------

    var fragmentPin = window.util.generatePins(adverts, ADVERTS_COUNT);

    var filterType = document.querySelector('#housing-type'); // фильтр по типу жилья

    filterType.addEventListener('change', function () {
      var filterTypeValue = filterType.value;

      // var filterAdverts = adverts.filter(function (it) {
      //   if (filterTypeValue !== 'any') {
      //     return it.offer.type === filterTypeValue;
      //   } else {
      //     return it.offer.type;
      //   }
      // });

      var filterAdverts = adverts;
      if (filterTypeValue !== 'any') {
        filterAdverts = adverts.filter(function (it) {
          return it.offer.type === filterTypeValue;
        });
      }

      // удалим все текущие пины со страницы
      window.util.deletePins();

      // проверим кол-во найденных элементов больше пяти?
      var filterNumber = filterAdverts.length;
      if (filterAdverts.length > ADVERTS_COUNT) {
        filterNumber = ADVERTS_COUNT;
      }
      var fragmentFiltered = window.util.generatePins(filterAdverts, filterNumber);


      window.pin.pinList.appendChild(fragmentFiltered); // выводим метки на страницу
    });

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
