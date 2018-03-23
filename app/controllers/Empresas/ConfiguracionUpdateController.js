(function () {
  var ConfiguracionUpdateController = function ($scope, $log, $location, $cookies, $routeParams, EmpresasFactory, FileUploader, AccesosAmazonFactory) {

    $scope.init = function () {
      $scope.CheckCookie();
      var cookie = $cookies.getObject('Session');
      $scope.IdEmpresa = cookie.IdEmpresa;
      EmpresasFactory.getMiSitio()
        .success(function (miClickSuscribe) {
          if (miClickSuscribe.success) {
            $scope.miSitio = miClickSuscribe.data[0];
          } else {
            $scope.ShowToast(miClickSuscribe.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la información de tu sitio, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    /** Actualiza los datos de la empresa para su sitio **/
    function putMiSitio() {
      EmpresasFactory.putMiSitio($scope.miSitio)
        .success(function (actualizacion) {
          if (actualizacion.success) {
            $scope.ShowToast(actualizacion.message, 'success');
          } else {
            $scope.ShowToast(actualizacion.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos cargar la lista de productos, por favor intenta de nuevo más tarde.', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    }

    /** Declaro el uploader como un nuevo FileUploader **/
    var uploader = $scope.uploader = new FileUploader({});

    /** Al momento de anexar el archivo se hace la validación del formato, si no es el esperado no permite subir el archivo y manda un mensaje **/
    uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        var extension = item.type.slice(item.type.lastIndexOf('/') + 1);
        if (!(extension === 'jpeg' || extension === 'jpg' || extension === 'gif' || extension === 'png')) {
          $scope.ShowToast('Archivo no válido, por favor adjunta formatos jpeg, jpg, gif o png.', 'danger');
          $scope.miSitio.UrlLogo = null;
        }
        return this.queue.length < 1 && '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    /** Antes de subir el archivo le cambio el nombre por el Id de la empresa para hacerlo único **/
    uploader.onBeforeUploadItem = function (item) {
      var extension = item.file.name.split('.');
      item.file.name = $scope.IdEmpresa.toString() + '.' + extension[1];
    };

    /** Subo la imágen y establesco la liga para ser guardada despues si no hay errores **/
    function subirImagen(fileItem, data) {
      var fileChooser = document.getElementById('fileUploadImagen');
      var file = fileChooser.files[0];
      $scope.miSitio.UrlLogo = 'https://s3.amazonaws.com/marketplace.compusoluciones.com/Anexos/logos/' + fileItem.file.name;
      AWS.config.update({ accessKeyId: data[0].AccessKey, secretAccessKey: data[0].SecretAccess });
      var bucketName = data[0].Bucket;
      var bucket = new AWS.S3({ params: { Bucket: bucketName } });
      var objKey = 'Anexos/logos/' + fileItem.file.name;
      var params = { Key: objKey, ContentType: fileItem.type, Body: file, ACL: 'public-read' };
      bucket.putObject(params, function (err, data) {
        if (err) {
          $scope.ShowToast(err, 'danger');
        } else {
          putMiSitio();
        }
      });
    }

    /** Una vez que se termino de anexar va y busca las credenciales de Amazon y lasa pasa a la función subirImagen junto con el archivo para comenzar la subida **/
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
      AccesosAmazonFactory.getAccesosAmazon()
        .success(function (result) {
          if (result[0].Success === true) {
            subirImagen(fileItem, result);
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('Error al obtener la conexión', 'danger');
        });
    };

    /** Si trae anexo algo lo sube, si no hace el puro update sin actualizar nada**/
    $scope.Guardar = function () {
      if (uploader.queue[0]) {
        uploader.queue[0].upload();
      } else {
        if ($scope.miSitio.UrlLogo) {
          $scope.miSitio.UrlLogo = $scope.miSitio.UrlLogo.split('?')[0];
        }
        putMiSitio();
      }
    };

// options - if a list is given then choose one of the items. The first item in the list will be the default
    $scope.options = {
      // html attributes
      required: false,
      disabled: false,
      placeholder: '',
      inputClass: '',
      id: undefined,
      name: undefined,
      // validation
      restrictToFormat: false,
      preserveInputFormat: false,
      allowEmpty: false,
      // color
      format: 'hex',
      case: 'lower',
      // sliders
      hue: true,
      saturation: true,
      lightness: true, // Note: In the square mode this is HSV and in round mode this is HSL
      alpha: true,
      dynamicHue: true,
      dynamicSaturation: true,
      dynamicLightness: true,
      dynamicAlpha: true,
      // swatch
      swatch: true,
      swatchPos: 'left',
      swatchBootstrap: true,
      swatchOnly: false,
      // popup
      round: true,
      pos: 'left',
      inline: false,
      horizontal: true,
      // show/hide
      show: {
        swatch: true,
        focus: true
      },
      hide: {
        blur: false,
        escape: true,
        click: true
      }
    };
  };

  ConfiguracionUpdateController.$inject = ['$scope', '$log', '$location', '$cookies', '$routeParams', 'EmpresasFactory', 'FileUploader', 'AccesosAmazonFactory'];

  angular.module('marketplace').controller('ConfiguracionUpdateController', ConfiguracionUpdateController);
}());
