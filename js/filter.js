'use strict';

// фильтр пинов
(function () {
  var MIN_SELECT_PRICE = 10000;
  var MAX_SELECT_PRICE = 50000;

  var ANY_VALUE = 'any';
  var LOW_PRICE_VALUE = 'low';
  var MIDDLE_PRICE_VALUE = 'middle';

  window.filterForm = document.querySelector('.map__filters'); // блок с фильтром

  var filterType = document.querySelector('#housing-type'); // фильтр по типу жилья
  var filterPrice = document.querySelector('#housing-price'); // фильтр по цене
  var filterRoom = document.querySelector('#housing-rooms'); // фильтр по количеству комнат
  var filterGuests = document.querySelector('#housing-guests'); // фильтр по количеству гостей

  var filterWifi = document.querySelector('#filter-wifi'); // фильтр по наличию wifi
  var filterConditioner = document.querySelector('#filter-conditioner'); // фильтр по наличию кондиционера
  var filterDishwasher = document.querySelector('#filter-dishwasher'); // фильтр по наличию посудомоечной машины
  var filterParking = document.querySelector('#filter-parking'); // фильтр по наличию парковки
  var filterWasher = document.querySelector('#filter-washer'); // фильтр по наличию стиральной машины
  var filterElevator = document.querySelector('#filter-elevator'); // фильтр по наличию лифта

  var onFilterChange = function () {
    window.util.hideCards(); // скрываем открытые карточки с информацией при каждой фильтрации

    var filterTypeValue = filterType.value;
    var filterPriceValue = filterPrice.value;
    var filterRoomValue = filterRoom.value;
    var filterGuestValue = filterGuests.value;

    var filterAdverts = window.data.adverts;

    // фильтр по типу жилья
    if (filterTypeValue !== ANY_VALUE) {
      filterAdverts = filterAdverts.filter(function (it) {
        return it.offer.type === filterTypeValue;
      });
    }

    // фильтр по цене
    if (filterPriceValue !== ANY_VALUE) {
      filterAdverts = filterAdverts.filter(function (it) {
        if (filterPriceValue === LOW_PRICE_VALUE) {
          return it.offer.price < MIN_SELECT_PRICE;
        } else if (filterPriceValue === MIDDLE_PRICE_VALUE) {
          return it.offer.price >= MIN_SELECT_PRICE && it.offer.price < MAX_SELECT_PRICE;
        } else {
          return it.offer.price >= MAX_SELECT_PRICE;
        }
      });
    }

    // фильтр по количеству комнат
    if (filterRoomValue !== ANY_VALUE) {
      filterAdverts = filterAdverts.filter(function (it) {
        return it.offer.rooms.toString() === filterRoomValue;
      });
    }

    // фильтр по количеству гостей
    if (filterGuestValue !== ANY_VALUE) {
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

    window.util.deletePins(); // удалим все текущие пины со страницы
    var filterNumber = Math.min(filterAdverts.length, window.data.ADVERTS_COUNT); // проверим кол-во найденных элементов больше пяти?

    var fragmentFiltered = window.util.generatePins(filterAdverts, filterNumber); // генерируем фрагмент с отфильтрованными пинами
    window.pin.pinList.appendChild(fragmentFiltered); // выводим метки на страницу
    window.pinElements = document.querySelectorAll('.map__pin'); // обновляем коллекцию меток
  };

  window.filterForm.addEventListener('change', window.debounce(onFilterChange));
})();
