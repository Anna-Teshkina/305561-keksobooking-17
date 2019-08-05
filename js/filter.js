'use strict';

// фильтр пинов
(function () {
  var filterForm = document.querySelector('.map__filters'); // блок с фильтром

  var filterType = document.querySelector('#housing-type'); // фильтр по типу жилья
  var filterPrice = document.querySelector('#housing-price'); // фильтр по цене
  var filterRoom = document.querySelector('#housing-rooms'); // фильтр по количеству комнат
  var filterGuests = document.querySelector('#housing-guests'); // фильтр по количеству гостей
  // -----------------------------------------------------------------------------------
  var filterWifi = document.querySelector('#filter-wifi'); // фильтр по наличию wifi
  var filterConditioner = document.querySelector('#filter-conditioner'); // фильтр по наличию кондиционера
  var filterDishwasher = document.querySelector('#filter-dishwasher'); // фильтр по наличию посудомоечной машины
  var filterParking = document.querySelector('#filter-parking'); // фильтр по наличию парковки
  var filterWasher = document.querySelector('#filter-washer'); // фильтр по наличию стиральной машины
  var filterElevator = document.querySelector('#filter-elevator'); // фильтр по наличию лифта

  // window.isFiltered = false; // флаг - не было фильтрации

  var onFilterChange = function () {
    window.util.hideCards(); // скрываем открытые карточки с информацией при каждой фильтрации

    var filterTypeValue = filterType.value;
    var filterPriceValue = filterPrice.value;
    var filterRoomValue = filterRoom.value;
    var filterGuestValue = filterGuests.value;

    var filterAdverts = window.data.adverts;

    // фильтр по типу жилья
    if (filterTypeValue !== 'any') {
      filterAdverts = filterAdverts.filter(function (it) {
        return it.offer.type === filterTypeValue;
      });
    }

    // фильтр по цене
    if (filterPriceValue !== 'any') {
      filterAdverts = filterAdverts.filter(function (it) {
        // switch (filterPriceValue) {
        //   case 'low':
        //     return it.offer.price < 10000;
        //   case 'middle':
        //     return it.offer.price >= 10000 && it.offer.price < 50000;
        //   case 'high':
        //     return it.offer.price >= 50000;
        // }

        if (filterPriceValue === 'low') {
          return it.offer.price < 10000;
        } else if (filterPriceValue === 'middle') {
          return it.offer.price >= 10000 && it.offer.price < 50000;
        } else {
          return it.offer.price >= 50000;
        }
      });
    }

    // фильтр по количеству комнат
    if (filterRoomValue !== 'any') {
      filterAdverts = filterAdverts.filter(function (it) {
        return it.offer.rooms.toString() === filterRoomValue;
      });
    }

    // фильтр по количеству гостей
    if (filterGuestValue !== 'any') {
      filterAdverts = filterAdverts.filter(function (it) {
        return it.offer.guests.toString() === filterGuestValue;
      });
    }

    // фильтр по удобствам
    var filterFeatures = function (input) {
      if (input.checked) {
        filterAdverts = filterAdverts.filter(function (it) {
          return it.offer.features.indexOf(input.value) !== -1;
        });
      }
    };

    filterFeatures(filterWifi);
    filterFeatures(filterConditioner);
    filterFeatures(filterDishwasher);
    filterFeatures(filterParking);
    filterFeatures(filterWasher);
    filterFeatures(filterElevator);

    window.util.deletePins();// удалим все текущие пины со страницы

    var filterNumber = filterAdverts.length;
    if (filterAdverts.length > window.data.ADVERTS_COUNT) { // проверим кол-во найденных элементов больше пяти?
      filterNumber = window.data.ADVERTS_COUNT;
    }
    var fragmentFiltered = window.util.generatePins(filterAdverts, filterNumber); // генерируем фрагмент с отфильтрованными пинами
    window.pin.pinList.appendChild(fragmentFiltered); // выводим метки на страницу
    window.pinElements = document.querySelectorAll('.map__pin'); // обновляем коллекцию меток
  };

  filterForm.addEventListener('change', window.debounce(onFilterChange));

  window.filter = {
    filterForm: filterForm
  };
})();
