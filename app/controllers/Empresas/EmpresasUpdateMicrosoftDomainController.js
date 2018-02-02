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

      // EmpresasFactory.getClientes(IdEmpresa)
      EmpresasFactory.getClientes()
      .success(function (Empresa) {
        const consultaEmpresa = Empresa.data.filter(function (getEnterprise) {
          if (getEnterprise.IdEmpresa === Number(IdEmpresa)) {
            console.log(getEnterprise);
            return getEnterprise;
          };
          return false;
        })[0];
        if (!consultaEmpresa) {
          $scope.ShowToast('No tienes permisos para editar.', 'danger');
         // $scope.Empresa = Empresa[0];
          // Redirecciona a producto
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
    
    function ActualizarDominio () {
      EmpresasFactory.putEmpresa($scope.Empresa) // Preguntar que ruta es la que mando
        .success(function (result) {
          if (result[0].Success == true) {
            Session.NombreEmpresa = $scope.Empresa.NombreEmpresa;
            $cookies.putObject('Session', Session, { secure: $rootScope.secureCookie });
            $scope.ActualizarDatosSession();
            $location.path("/index");
            $scope.ShowToast("Empresa Actualizada", 'success');
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    }

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
