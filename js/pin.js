'use strict';
// модуль, который отвечает за создание меток на странице
(function () {
  var ADVERT_WIDTH = 50; // ширина метки
  var ADVERT_HEIGHT = 70; // высота метки

  var pinList = document.querySelector('.map__pins');

  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');

  var renderPin = function (advert) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.dataset.id = advert.id;
    var pinImg = pinElement.querySelector('img');

    pinElement.style.left = advert.location.x - ADVERT_WIDTH / 2 + 'px';
    pinElement.style.top = advert.location.y - ADVERT_HEIGHT + 'px';
    pinImg.src = advert.author.avatar;
    // pinImg.alt = advert.offer.type;
    pinList.appendChild(pinElement);

    // при клике на пин появляется карточка соответствующего объявления
    pinElement.addEventListener('click', function () {
      for (var i = 0; i < window.data.popupList.length; i++) {
        window.data.popupList[i].style.display = 'none'; // скрываем все открытые карточки
        // открываем только нужную карточку
        if (window.data.popupList[i].getAttribute('data-id') === pinElement.getAttribute('data-id')) {
          window.data.popupList[i].style.display = 'block';
        }
      }
    });

    return pinElement;
  };

  window.pin = {
    renderPin: renderPin,
    pinList: pinList
  };
})();
