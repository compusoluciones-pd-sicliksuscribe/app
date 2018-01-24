(function () {
  var EmpresasUpdateMicrosoftDomainController = function ($scope, $log, $cookies, $location, EmpresasFactory, EstadosFactory, UsuariosFactory) {
    $scope.Empresa = {};
    $scope.AlertaDominio = '';
    $scope.Empresa.IdERP = null;
    $scope.loading = false;
    $scope.Empresa.Formulario = false;
    $scope.valido;
    $scope.mensajerfc = '';
    $scope.DominioMicrosoft = true;
    $scope.usuariosSinDominio = {};
  
    $scope.init = function () {
      $scope.CheckCookie();
    };
  
    $scope.init();
  
    $scope.change = function () {
      $scope.Empresa.DominioMicrosoft = $scope.Empresa.DominioMicrosoft.trim();
      if ($scope.Empresa.DominioMicrosoft) {
        EmpresasFactory.revisarDominio($scope.Empresa.DominioMicrosoft)
            .success(function (result) {
              if (result === 'false') {
                $scope.frm.DominioMicrosoft.$pristine = false;
                $scope.frm.DominioMicrosoft.$invalid = true;
                $scope.Empresa.MensajeDominio = 'Ya existe el dominio, Intenta con uno diferente.';
              } else {
                $scope.frm.DominioMicrosoft.$pristine = true;
                $scope.frm.RFC.$invalid = false;
              }
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
      } else {
        $scope.frm.DominioMicrosoft.$pristine = false;
        $scope.frm.DominioMicrosoft.$invalid = true;
        $scope.Empresa.MensajeDominio = 'Ingresa un dominio valido.';
      }
    };
  
    $scope.EmpresaCancel = function () {
      $location.path('/Clientes');
    };
  };
  
  EmpresasUpdateMicrosoftDomainController.$inject = ['$scope', '$log', '$cookies', '$location', 'EmpresasFactory', 'EstadosFactory', 'UsuariosFactory'];
  
  angular.module('marketplace').controller('EmpresasUpdateMicrosoftDomainController', EmpresasUpdateMicrosoftDomainController);
}());
