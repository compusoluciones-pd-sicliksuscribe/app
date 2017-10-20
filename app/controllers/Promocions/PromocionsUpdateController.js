(function () {
  var PromocionsUpdateController = function ($scope, $log, $location, $cookieStore, $routeParams, PromocionsFactory, FileUploader, AccesosAmazonFactory) {

    var IdPromocion = $routeParams.IdPromocion;
    $scope.Promocion = {};
    var uploader = $scope.uploader = new FileUploader({
    });

    uploader.filters.push({
      name: 'imageFilter',
      fn: function (item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return this.queue.length < 1 && '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {

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
        .success(function (Promocion) {
          $scope.Promocion = Promocion[0];
          $scope.Promocion.estatusImagen = 1;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
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
        $scope.ShowToast("Datos inválidos, favor de verificar", 'danger');
      }
      else {
        PromocionsFactory.putPromocion($scope.Promocion)
          .success(function (result) {
            if (result[0].Success == true) {
              $location.path("/Promocions");
              $scope.ShowToast(result[0].Message, 'success');
            }
            else {
              $scope.ShowToast(result[0].Message, 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.PromocionDelete = function () {
      $scope.Promocion.Activo = 0;
      PromocionsFactory.putPromocion($scope.Promocion)
        .success(function (result) {

          if (result[0].Success == true) {
            $location.path("/Promocions");
            $scope.ShowToast("Promoción dada de baja", 'success');
          }
          else {
            $scope.ShowToast(result[0].Message, 'danger');
          }

        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      AccesosAmazonFactory.getAccesosAmazon()
        .success(function (result) {
          if (result[0].Success == true) {
            eliminarImagen(result);
          }
          else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast(result[0].Message, 'danger');
        });
    };

    $scope.PromocionCancel = function () {
      $location.path("/Promocions");
    };

    $scope.ImagenDelete = function () {
      $scope.Promocion.estatusImagen = 0;
    };

    function eliminarImagen(data) {
      var Url = $scope.Promocion.Url;
      if (Url) {
        var resultado = Url.split("/");
        var picturePath = 'Anexos' + '/' + resultado[5];
        var s3Client = new AWS.S3({
          accessKeyId: data[0].AccessKey,
          secretAccessKey: data[0].SecretAccess,
          params: {
            Bucket: data[0].Bucket,
          },
        });
  
        s3Client.deleteObject({
          Key: picturePath,
        }, function (err, data) {
  
        });
      }
    };
  };

  PromocionsUpdateController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'PromocionsFactory', 'FileUploader', 'AccesosAmazonFactory'];

  angular.module('marketplace').controller('PromocionsUpdateController', PromocionsUpdateController);
}());
