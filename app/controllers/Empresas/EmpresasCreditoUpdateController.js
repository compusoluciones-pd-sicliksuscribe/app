(function () {
  var EmpresasCreditoUpdateController = function ($scope, $log, $location, $cookies, $routeParams, EmpresasFactory) {
    var IdEmpresa = $routeParams.IdEmpresa;

    // eslint-disable-next-line no-unused-vars
    var Session = {};

    Session = $cookies.getObject('Session');

    $scope.Empresa = {};

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasFactory.getEmpresa(IdEmpresa)
        .then(Empresa => {
          $scope.Empresa = Empresa.data[0];
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init();

    $scope.EmpresaUpdate = function () {
      var Empresa =
        {
          IdEmpresa: $scope.Empresa.IdEmpresa,
          Cliente: $scope.Empresa.IdERP,
          Credito: $scope.Empresa.Credito
        };

      EmpresasFactory.putEmpresa(Empresa)
        .then(result => {
          if (result.data.success === 1) {
            $scope.ShowToast(result.data.message, 'success');
            $location.path('/Empresas');
          } else {
            $scope.ShowToast(result.data.message, 'danger');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.EmpresaCancel = function () {
      $location.path('/Empresas');
    };
  };

  EmpresasCreditoUpdateController.$inject = ['$scope', '$log', '$location', '$cookies', '$routeParams', 'EmpresasFactory'];

  angular.module('marketplace').controller('EmpresasCreditoUpdateController', EmpresasCreditoUpdateController);
}());
