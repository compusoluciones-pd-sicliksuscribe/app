/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
(function () {
  var PromocionsUpdateController = function ($scope, $log, $location, $cookies, $routeParams, PromocionsFactory, FileUploader, AccesosAmazonFactory) {
    var IdPromocion = $routeParams.IdPromocion;
    $scope.Promocion = {};
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
      $scope.Promocion.Url = 'uploads/' + fileItem.file.name;
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

          function onLoadFile(event) {
            var img = new Image();
            img.onload = onLoadImage;
            img.src = event.target.result;
          }

          function onLoadImage() {
            var width = params.width || this.width / this.height * params.height;
            var height = params.height || this.height / this.width * params.width;
            canvas.attr({ width: width, height: height });
            canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
          }
        }
      };
    }]);
*/
    $scope.init = function () {
      $scope.CheckCookie();

      PromocionsFactory.getPromocion(IdPromocion)
        .then(Promocion => {
          $scope.Promocion = Promocion.data[0];
          $scope.Promocion.estatusImagen = 1;
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init();

    $scope.PromocionUpdate = function () {
      if (($scope.frm.$invalid)) {
        if ($scope.frm.Nombre.$invalid == true) {
          $scope.frm.Nombre.$pristine = false;
        }
        if ($scope.frm.CodigoProducto.$invalid == true) {
          $scope.frm.CodigoProducto.$pristine = false;
        }
        $scope.ShowToast('Datos inválidos, favor de verificar', 'danger');
      } else {
        $scope.Promocion.Activo = 1;
        PromocionsFactory.putPromocion($scope.Promocion)
          .then(result => {
            $location.path('/Promocions');
            console.log(result.data);
            $scope.ShowToast(result.data.Message, 'success');
          })
          .catch(error => {
            $scope.ShowToast(error.data.Message, 'danger');
          });
      }
    };

    $scope.PromocionDelete = function () {
      $scope.Promocion.Activo = 0;
      console.log($scope.Promocion);
      PromocionsFactory.putPromocion($scope.Promocion)
        .then(result => {
          $location.path('/Promocions');
          $scope.ShowToast('Promoción dada de baja', 'success');
        })
        .catch(error => {
          $scope.ShowToast(error.data.message, 'danger');
        });

      AccesosAmazonFactory.getAccesosAmazon()
        .then(result => {
          if (result.data[0].Success == true) {
            eliminarImagen(result.data);
          } else {
            $scope.ShowToast(result.data[0].Message, 'danger');
          }
        })
        .catch(error => {
          $scope.ShowToast(result.data[0].Message, 'danger');
        });
    };

    $scope.PromocionCancel = function () {
      $location.path('/Promocions');
    };

    $scope.ImagenDelete = function () {
      $scope.Promocion.estatusImagen = 0;
    };

    function eliminarImagen (data) {
      var Url = $scope.Promocion.Url;
      if (Url) {
        var resultado = Url.split('/');
        var picturePath = 'Anexos' + '/' + resultado[5];
        var s3Client = new AWS.S3({
          accessKeyId: data[0].AccessKey,
          secretAccessKey: data[0].SecretAccess,
          params: {
            Bucket: data[0].Bucket
          }
        });

        s3Client.deleteObject({
          Key: picturePath
        }, function (err, data) {

        });
      }
    };
  };

  PromocionsUpdateController.$inject = ['$scope', '$log', '$location', '$cookies', '$routeParams', 'PromocionsFactory', 'FileUploader', 'AccesosAmazonFactory'];

  angular.module('marketplace').controller('PromocionsUpdateController', PromocionsUpdateController);
}());
