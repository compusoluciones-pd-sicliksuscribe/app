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
      .success(function (Empresa) {
        const consultaEmpresa = Empresa.data.filter(function (getEnterprise) {
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
      .error(function (data, status, headers, config) {
        $scope.ShowToast('No pudimos cargar la información de tus clientes, por favor intenta de nuevo más tarde.', 'danger');

        $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      });
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
              }
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
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
        .success(function (result) {
          $cookies.putObject('Session', Session, { secure: $rootScope.secureCookie });
          $scope.ActualizarDatosSession();
          $location.path('/index');
          $scope.ShowToast('Empresa Actualizada', 'success');
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast(data.message, 'danger');
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
