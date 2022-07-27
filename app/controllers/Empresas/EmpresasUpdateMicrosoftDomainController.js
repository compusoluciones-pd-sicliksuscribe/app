(function () {
  var EmpresasUpdateMicrosoftDomainController = function ($scope, $log, $cookies, $location, $routeParams, EmpresasFactory, $rootScope) {
    $scope.Empresa = {};
    $scope.AlertaDominio = '';
    $scope.Empresa.IdERP = null;
    $scope.loading = false;
    $scope.Empresa.Formulario = false;
    $scope.valido;
    $scope.mensajerfc = '';
    $scope.DominioMicrosoft = true;
    $scope.usuariosSinDominio = {};
    const IdEmpresa = $routeParams.IdEmpresa;
    var Session = {};
    Session = $cookies.getObject('Session');

    $scope.init = function () {
      Session = $cookies.getObject('Session');
      $scope.CheckCookie();

      EmpresasFactory.getClientes()
      .then(Empresa => {
        const consultaEmpresa = Empresa.data.data.filter(function (getEnterprise) {
          if (getEnterprise.IdEmpresa === Number(IdEmpresa)) {
            $scope.Empresa = getEnterprise;
            return getEnterprise;
          };
          return false;
        })[0];
        if (!consultaEmpresa) {
          $scope.ShowToast('No tienes permisos para editar.', 'danger');
          $scope.domainCancel();
        }
      })
      .catch(error => {
        $scope.ShowToast('No pudimos cargar la información de tus clientes, por favor intenta de nuevo más tarde.', 'danger');

        $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
      });
    };

    $scope.init();

    $scope.change = function () {
      $scope.Empresa.DominioMicrosoft = $scope.Empresa.DominioMicrosoft.trim();
      if ($scope.Empresa.DominioMicrosoft) {
        EmpresasFactory.revisarDominio($scope.Empresa.DominioMicrosoft)
            .then(result => {
              if (result === 'false') {
                $scope.frm.DominioMicrosoft.$pristine = false;
                $scope.frm.DominioMicrosoft.$invalid = true;
                $scope.Empresa.MensajeDominio = 'Ya existe el dominio, Intenta con uno diferente.';
              } else {
                $scope.frm.DominioMicrosoft.$pristine = true;
              }
            })
            .catch(error => {
              $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
            });
      } else {
        $scope.frm.DominioMicrosoft.$pristine = false;
        $scope.frm.DominioMicrosoft.$invalid = true;
        $scope.Empresa.MensajeDominio = 'Ingresa un dominio válido.';
      }
    };

    $scope.ActualizarDominio = function () {
      const enterprise = {
        DominioMicrosoft: $scope.Empresa.DominioMicrosoft
      };
      if ($scope.frm.DominioMicrosoft.$invalid) {
        $scope.frm.DominioMicrosoft.$pristine = false;
        $scope.Empresa.MensajeDominio = 'Ingresa un Dominio Válido.';
      } else {
        EmpresasFactory.changeDomain($scope.Empresa.IdEmpresa, enterprise)
        .then(result => {
          $cookies.putObject('Session', Session, { secure: $rootScope.secureCookie });
          $scope.ActualizarDatosSession();
          $location.path('/index');
          $scope.ShowToast('Empresa Actualizada', 'success');
        })
        .catch(error => {
          $scope.ShowToast(error.message, 'danger');
        });
      }
    };

    $scope.EmpresaCancel = function () {
      $location.path('/Clientes');
    };
    $scope.domainCancel = function () {
      $location.path('Productos/');
    };
  };

  EmpresasUpdateMicrosoftDomainController.$inject = ['$scope', '$log', '$cookies', '$location', '$routeParams', 'EmpresasFactory', 'EstadosFactory', 'UsuariosFactory', '$cookies', '$rootScope'];

  angular.module('marketplace').controller('EmpresasUpdateMicrosoftDomainController', EmpresasUpdateMicrosoftDomainController);
}());
