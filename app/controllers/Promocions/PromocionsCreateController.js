(function () {
  var PromocionsCreateController = function ($scope, $log, $cookies, $location, PromocionsFactory, FileUploader, AccesosAmazonFactory) {
    $scope.Promocion = {};
    $scope.IdPromocionNueva = 0;
    $scope.SubiendoArchivos = false;

    $scope.init = function () {
      $scope.CheckCookie();
    };

    $scope.init();

    var uploader = $scope.uploader = new FileUploader({
    });
    uploader.filters.push({
      name: 'imageFilter',
      fn: function (item /* {File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return this.queue.length < 1 && '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    uploader.onWhenAddingFileFailed = function (item /* {File|FileLikeObject}*/, filter, options) {

    };

    uploader.onAfterAddingFile = function (fileItem) {

    };

    uploader.onAfterAddingAll = function (addedFileItems) {

    };

    uploader.onBeforeUploadItem = function (item) {
      var extension = item.file.name.split('.');
      console.log($scope.Promocion);
      item.file.name = $scope.Promocion.Url + '.' + extension[1];
    };

    uploader.onProgressItem = function (fileItem, progress) {

    };

    uploader.onProgressAll = function (progress) {

    };

    uploader.onSuccessItem = function (fileItem, response, status, headers) {

    };

    uploader.onErrorItem = function (fileItem, response, status, headers) {

    };

    uploader.onCancelItem = function (fileItem, response, status, headers) {

    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
      AccesosAmazonFactory.getAccesosAmazon()
        .success(function (result) {
          if (result[0].Success == true) {
            subirImagen(fileItem, result);
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error al intentar subir la imagen.', 'danger');
        });
    };

    uploader.onCompleteAll = function () {

    };

    /* app.directive('ngThumb', ['$window', function ($window) {
      var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
          return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
          var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
      };

      return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (scope, element, attributes) {
          if (!helper.support) return;

          var params = scope.$eval(attributes.ngThumb);

          if (!helper.isFile(params.file)) return;
          if (!helper.isImage(params.file)) return;

          var canvas = element.find('canvas');
          var reader = new FileReader();

          reader.onload = onLoadFile;
          reader.readAsDataURL(params.file);

          function onLoadFile (event) {
            var img = new Image();
            img.onload = onLoadImage;
            img.src = event.target.result;
          }

          function onLoadImage () {
            var width = params.width || this.width / this.height * params.height;
            var height = params.height || this.height / this.width * params.width;
            canvas.attr({ width: width, height: height });
            canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
          }
        }
      };
    }]);
*/
    $scope.PromocionCreate = function () {
      if (($scope.frm.$invalid)) {
        if ($scope.frm.Nombre.$invalid == true) {
          $scope.frm.Nombre.$pristine = false;
        }
        if ($scope.frm.CodigoProducto.$invalid == true) {
          $scope.frm.CodigoProducto.$pristine = false;
        }
        $scope.ShowToast('Datos inválidos, favor de verificar', 'danger');
      } else {
        $scope.SubiendoArchivos = true;
        var fileChooser = document.getElementById('archivo_promocion');
        var file = fileChooser.files[0];
        if (file) {
          if (!(/\.(jpeg|jpg|png)$/i.test(file.name))) {
            $scope.SubiendoArchivos = false;
            $scope.ShowToast('Extensión de archivo no válida', 'danger');
          } else {
            PromocionsFactory.postPromocion($scope.Promocion)
              .success(function (result) {
                $scope.Promocion.IdPromocionNueva = result.Dato.insertId;
                $scope.Promocion.Url = result.Dato.Url;
                $scope.Promocion.IdPromocion = result.Dato.insertId;
                uploader.queue[0].upload();
              })
              .error(function (data, status, headers, config) {
                $scope.SubiendoArchivos = false;
                $scope.ShowToast(data.message, 'danger');
              });
          }
        } else {
          $scope.SubiendoArchivos = false;
          $scope.ShowToast('Debe adjuntar un archivo', 'danger');
        }
      }
    };

    $scope.PromocionCancel = function () {
      $location.path('/Promocions');
    };

    function subirImagen(fileItem, data) {
      var fileChooser = document.getElementById('archivo_promocion');
      var file = fileChooser.files[0];
      $scope.Promocion.Url = 'https://s3.amazonaws.com/marketplace.compusoluciones.com/Anexos/' + fileItem.file.name;
      AWS.config.update({ accessKeyId: data[0].AccessKey, secretAccessKey: data[0].SecretAccess });
      var bucketName = data[0].Bucket;
      var bucket = new AWS.S3({ params: { Bucket: bucketName } });
      var objKey = 'Anexos' + '/' + fileItem.file.name;
      var params = { Key: objKey, ContentType: fileItem.type, Body: file, ACL: 'public-read' };
      bucket.putObject(params, function (err, data) {
        if (err) {
          $scope.ShowToast(err, 'danger');
        } else {
          $scope.Promocion.Activo = 1;
          PromocionsFactory.putPromocion($scope.Promocion)
            .success(function (result) {
              $location.path('/Promocions');
              $scope.ShowToast('Promoción registrada', 'success');
            })
            .error(function (data, status, headers, config) {
              $scope.SubiendoArchivos = false;
              $scope.ShowToast(data.message, 'danger');
            });
        }
      });
    }
  };

  PromocionsCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'PromocionsFactory', 'FileUploader', 'AccesosAmazonFactory'];

  angular.module('marketplace').controller('PromocionsCreateController', PromocionsCreateController);
}());
