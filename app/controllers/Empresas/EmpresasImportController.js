(function () {
  var EmpresasImportController = function ($scope, $log, $location, $cookies, $routeParams, EmpresasFactory, EmpresasXEmpresasFactory, EstadosFactory, UsuariosFactory) {

    var IdEmpresa = $routeParams.IdEmpresa;
    $scope.IdEmpresaDistribuidor = IdEmpresa;
    $scope.EmpresasM = {};
    $scope.Empresas = {};
    $scope.Combo = {};

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasFactory.getEmpresa(IdEmpresa)
        .success(function (Empresa) {
          $scope.Empresa = Empresa[0];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EmpresasFactory.getEmpresasMicrosoft()
        .success(function (Empresas) {
          $scope.EmpresasM = Empresas.value;
          $scope.Combo.TipoRFC = [{ Nombre: 'Persona Física' }, { Nombre: 'Persona Moral' }];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.Regresar = function () {
      $location.path("/Empresas");
    };

    $scope.ImportarEmpresa = function (IdEmpresaDistribuidor, IdMicrosoft, Dominio, Name) {
      $location.path("/Empresas/Importar/" + IdEmpresaDistribuidor + "/" + IdMicrosoft + "/" + Dominio + "/" + Name);
    };
  };

  EmpresasImportController.$inject = ['$scope', '$log', '$location', '$cookies', '$routeParams', 'EmpresasFactory', 'EmpresasXEmpresasFactory', 'EstadosFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('EmpresasImportController', EmpresasImportController);
}());
