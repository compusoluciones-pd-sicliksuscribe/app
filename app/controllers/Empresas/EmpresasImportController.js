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
        .then(Empresa => {
          $scope.Empresa = Empresa.data[0];
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });

      EmpresasFactory.getEmpresasMicrosoft()
        .then(Empresas => {
          $scope.EmpresasM = Empresas.data.items;
          $scope.Combo.TipoRFC = [{ Nombre: 'Persona Física' }, { Nombre: 'Persona Moral' }];
          $scope.listaAux = $scope.EmpresasM;
          pagination();
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.filter = () => {
      $scope.listaAux = $scope.EmpresasM.filter(str => { return str.companyProfile.companyName.indexOf($scope.EmpresaFilter) !== -1; });
      pagination();
    };

    const pagination = () => {
      $scope.filtered = [];
      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        // eslint-disable-next-line one-var
        let begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;
        $scope.filtered = $scope.listaAux.slice(begin, end);
      });
    };

    $scope.init();

    $scope.Regresar = function () {
      $location.path('/Empresas');
    };

    $scope.ImportarEmpresa = function (IdEmpresaDistribuidor, IdMicrosoft, Dominio, Name) {
      $location.path(`/Empresas/Importar/${IdEmpresaDistribuidor}/${IdMicrosoft}/${Dominio}/${Name}`);
    };
  };

  EmpresasImportController.$inject = ['$scope', '$log', '$location', '$cookies', '$routeParams', 'EmpresasFactory', 'EmpresasXEmpresasFactory', 'EstadosFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('EmpresasImportController', EmpresasImportController);
}());
