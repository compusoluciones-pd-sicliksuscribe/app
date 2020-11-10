(function () {
  var CambiarDistribuidorController = ($scope, $log, $location, $cookies, $routeParams, CambiarDistribuidorFactory, EmpresasFactory, $anchorScroll, lodash) => {
    $scope.reverse = false;
    $scope.TablaVisible = false;

    $scope.init = () => {
      $scope.CheckCookie();
      $scope.Empresas = null;
      $scope.TablaVisible = false;
    };

    $scope.init();

    $scope.OrdenarPor = Atributo => {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.BuscarEmpresas = () => {
      EmpresasFactory.getEmpresa($scope.Empresa.Busqueda)
        .success(Empresas => {
          if (Empresas) {
            try {
              if (Empresas[0].Success === false || !Empresas.length) {
                $scope.Empresas = null;
                $scope.TablaVisible = false;
              } else {
                $scope.Empresas = Empresas;
                if ($scope.Empresas.length > 0) {
                  $scope.TablaVisible = true;
                } else {
                  $scope.Empresas = null;

                  $scope.TablaVisible = false;
                }
              }
            } catch (error) {
              $scope.Empresas = null;
              $scope.TablaVisible = false;
            }
          } else {
            $scope.Empresas = null;

            $scope.TablaVisible = false;
          }
        })
          .error((data, status, headers, config) => {
            $scope.TablaVisible = false;
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
    };

    $scope.AccederADistribuidor = () => {
    };
  };

  CambiarDistribuidorController.$inject =
      ['$scope', '$log', '$location', '$cookies', '$routeParams', 'CambiarDistribuidorFactory', 'EmpresasFactory', '$anchorScroll'];

  angular.module('marketplace').controller('CambiarDistribuidorController', CambiarDistribuidorController);
}());
