(function () {
  var FacturacionCreateController = function ($scope, $log, $cookieStore, $location, $uibModal, $filter, FacturacionFactory, $routeParams) {
    $scope.InfoFactura = {};
    $scope.InfoFactura.nombre = $scope.SessionCookie.NombreEmpresa;
    $scope.InfoFactura.IdEmpresa = $scope.SessionCookie.IdEmpresa;
    $scope.InfoFactura.IdUsuario = $scope.SessionCookie.IdUsuario;

    function isItReadyYet() {
      if (!$scope.InfoFactura.CSD_B64 || !$scope.InfoFactura.key_B64) {
        setTimeout(isItReadyYet, 100);
      }
    }

    $scope.DarDeAlta = function () {
      if (!$scope.frm.$invalid) {
        var CSD_B64 = document.getElementById('CSD_B64').files[0];
        var key_B64 = document.getElementById('key_B64').files[0];
        var InfoFactura = $scope.InfoFactura;
        var formData = new FormData();
        formData.append('CSD_B64', CSD_B64);
        formData.append('key_B64', key_B64);
        formData.append('rfc', InfoFactura.rfc);
        formData.append('nombre', InfoFactura.nombre);
        formData.append('IdEmpresa', InfoFactura.IdEmpresa);
        formData.append('IdUsuario', InfoFactura.IdUsuario);
        formData.append('contrasenaCSD', InfoFactura.contrasenaCSD);
        setTimeout(isItReadyYet, 100);
        FacturacionFactory.postDarDeAlta(formData)
          .success(function (resultado) {
            if (resultado.success === 1) {
              $scope.ShowToast('Datos confirmados.', 'success');
            } else {
              if (resultado.message) {
                $scope.Mensaje = resultado.message;
                $scope.ShowToast(resultado.message, 'danger');
              } else {
                $scope.Mensaje = 'No pudimos enviar tu solicitud, por favor verifica tus datos o intenta de nuevo más tarde.';
                $scope.ShowToast('No pudimos enviar tu solicitud, por favor verifica tus datos o intenta de nuevo más tarde.', 'danger');
              }
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            }
          })
          .error(function (data, status, headers, config) {
            if (resultado.message) {
                $scope.Mensaje = resultado.message;
                $scope.ShowToast(resultado.message, 'danger');
              } else {
                $scope.Mensaje = 'No pudimos enviar tu solicitud, por favor verifica tus datos o intenta de nuevo más tarde.';
                $scope.ShowToast('No pudimos enviar tu solicitud, por favor verifica tus datos o intenta de nuevo más tarde.', 'danger');
              }
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };
  };
  FacturacionCreateController.$inject = ['$scope', '$log', '$cookieStore', '$location', '$uibModal', '$filter', 'FacturacionFactory', '$routeParams'];

  angular.module('marketplace').controller('FacturacionCreateController', FacturacionCreateController);
}());