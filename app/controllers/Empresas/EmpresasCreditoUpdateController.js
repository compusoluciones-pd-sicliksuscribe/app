(function () {
  var EmpresasCreditoUpdateController = function ($scope, $log, $location, $cookies, $routeParams, EmpresasFactory) {
    var IdEmpresa = $routeParams.IdEmpresa;

    var Session = {};

    Session = $cookies.getObject('Session');

    $scope.Empresa = {};

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasFactory.getEmpresa(IdEmpresa)
        .success(function (Empresa) {
          $scope.Empresa = Empresa[0];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
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
        .success(function (result) {
          if (result.success === 1) {
            $scope.ShowToast(result.message, 'success');
            $location.path("/Empresas");
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.EmpresaCancel = function () {
      $location.path("/Empresas");
    };

    //BUDGET

    $scope.EmpresaUpdateBudget = function () {
      var Empresa =
        {
          IdEmpresa: $scope.Empresa.IdEmpresa,
          Cliente: $scope.Empresa.IdERP,
          Anticipo: $scope.Empresa.Anticipo,
          TipoAnticipo: $scope.Empresa.TipoAnticipo
        };

      console.log("Empresa");
      console.log(Empresa);

      // EmpresasFactory.putEmpresa(Empresa)
      //   .success(function (result) {
      //     if (result.success === 1) {
      //       $scope.ShowToast(result.message, 'success');
      //       $location.path("/Empresas");
      //     } else {
      //       $scope.ShowToast(result.message, 'danger');
      //     }
      //   })
      //   .error(function (data, status, headers, config) {
      //     $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      //   });
    };
  };

  

  EmpresasCreditoUpdateController.$inject = ['$scope', '$log', '$location', '$cookies', '$routeParams', 'EmpresasFactory'];

  angular.module('marketplace').controller('EmpresasCreditoUpdateController', EmpresasCreditoUpdateController);
}());
