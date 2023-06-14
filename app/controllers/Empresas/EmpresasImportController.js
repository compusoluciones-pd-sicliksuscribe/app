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
          $scope.EmpresasM = Empresas.items;
          $scope.Combo.TipoRFC = [{ Nombre: 'Persona Física' }, { Nombre: 'Persona Moral' }];
          $scope.listaAux = $scope.EmpresasM;
          pagination();

        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.filter = () => {
      $scope.listaAux = $scope.EmpresasM.filter(function (str) {
        return str.companyProfile.companyName.indexOf($scope.EmpresaFilter) !== -1;
      });
      pagination();
    };

    const pagination = () => {
      $scope.filtered = [];
      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        let begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;
        $scope.filtered = $scope.listaAux.slice(begin, end);
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
