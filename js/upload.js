'use strict';

// модуль загрузки изображений
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // загрузка аватара пользователя
  // ---------------------------------------------------------------
  var fileChooser = document.querySelector('.ad-form-header__input');
  var preview = document.querySelector('.ad-form-header__preview img');

  var checkType = function (name) {
    var matches = FILE_TYPES.some(function (it) {
      return name.endsWith(it);
    });
    return matches;
  };

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name;
    var check = checkType(fileName);
    if (check) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  // загрузка фото локации
  // ---------------------------------------------------------------
  var photoContainer = document.querySelector('.ad-form__photo-container');
  var photoChooser = photoContainer.querySelector('#images');
  var photoBlock = photoContainer.querySelector('div.ad-form__photo');

  photoChooser.addEventListener('change', function () {
    var file = photoChooser.files[0];
    var fileName = file.name;
    var check = checkType(fileName);
    if (check) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var img = document.createElement('img');
        img.src = reader.result;
        img.className = 'ad-form__photo';
        photoContainer.insertBefore(img, photoBlock);
      });
      reader.readAsDataURL(file);
    }
  });

  window.upload = {
    preview: preview,
    photoContainer: photoContainer
  };
})();
