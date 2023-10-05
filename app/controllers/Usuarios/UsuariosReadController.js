(function () {
  var UsuariosReadController = function ($scope, $log, $location, $cookies, UsuariosFactory, UsuariosXEmpresasFactory, EmpresasFactory) {

    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.empresaSel = '';
    $scope.selectEmpresas = [];
    const Session = $cookies.getObject('Session');

    $scope.init = function () {
      let empresaActual = '';
      const availableCredit = 0;
      if (Session.IdTipoAcceso === 1 || Session.IdTipoAcceso === 8) empresaActual = { NombreEmpresa: 'CompuSoluciones', IdEmpresa: 1 };
      if (Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 10) empresaActual = { NombreEmpresa: Session.NombreEmpresa, IdEmpresa: Session.IdEmpresa };
      $scope.CheckCookie();
      if (Session.IdTipoAcceso !== 2) {
        EmpresasFactory.getEmpresas()
          .success(function (Empresas) {
            $scope.selectEmpresas = Empresas;
            $scope.selectEmpresas.unshift(empresaActual);
            if (!($scope.SessionCookie.IdTipoAcceso === 1 || $scope.SessionCookie.IdTipoAcceso === 8)) {
              $scope.empresaSel = $scope.selectEmpresas[0].IdEmpresa;
            }
            $scope.MostrarUsuariosEmp($scope.empresaSel);
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
      if (Session.IdTipoAcceso === 2 || Session.IdTipoAcceso === 10) {
        EmpresasFactory.getClientes(availableCredit)
          .then(Empresas => {
            $scope.selectEmpresas = Empresas.data;
            $scope.selectEmpresas.unshift(empresaActual);
            $scope.MostrarUsuariosEmp($scope.empresaSel);
          })
          .catch(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.ObtenerUsuariosPropios = function () {
      UsuariosFactory.getUsuariosPropios()
        .success(function (UsuariosXEmpresas) {
          $scope.Usuarios = UsuariosXEmpresas.data;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ObtenerUsuariosPorCliente = function (IdEmpresa) {
      UsuariosFactory.getUsuariosContacto(IdEmpresa)
        .success(function (UsuariosXEmpresas) {
          $scope.Usuarios = UsuariosXEmpresas.data;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
    
    $scope.Confirmar = function (IdUsuario) {
      $scope.Usuarios.forEach(function (Usuario) {
        if (Usuario.IdUsuario === IdUsuario) {
          Usuario.Mostrar = !Usuario.Mostrar;
        }
      }, this);
    };

    $scope.BajaUsuario = function (Usuario) {
      UsuariosFactory.putDeleteFinalUser(Usuario)
      .success(function (data) {
        if (data) {
          $scope.ShowToast(data.message, 'success');

          $scope.init();
        } else {
          $scope.ShowToast(data.message, 'danger');
        }
      })
      .error(function (data, status, headers, config) {
        $scope.ShowToast('No pudimos dar de baja tu solicitud, por favor intenta de nuevo más tarde', 'danger');

        $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      });
    };

    $scope.MostrarUsuariosEmp = function (IdEmpresa) {
      const empresa = IdEmpresa || false;

      if (Session.IdTipoAcceso === 2) {
        if (Number(empresa) === Session.IdEmpresa) {
          $scope.ObtenerUsuariosPropios();
        } else if (empresa) {
          $scope.ObtenerUsuariosPorCliente(empresa);
        }
      } else {
        UsuariosXEmpresasFactory.getUsuariosXEmpresa(empresa)
          .success(function (UsuariosXEmpresas) {

            $scope.Usuarios = UsuariosXEmpresas;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init();

    $scope.IniciarTourColaborador = function () {
      $scope.Tour = new Tour({
        steps: [
          {
            element: ".searchOption",
            placement: "bottom",
            title: "Busqueda de colaboradores",
            content: "Puedes filtrar a tus colaboradores buscando por su nombre, apellidos o correo electrónico.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: ".newColaborator",
            placement: "bottom",
            title: "Agrega nuevos colaboradores",
            content: "Para poder dar de alta un nuevo colaborador da click aquí y llena la información que se te solicite.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          }
        ],

        backdrop: true,
        storage: false
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };
  };

  UsuariosReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'UsuariosFactory', 'UsuariosXEmpresasFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosReadController', UsuariosReadController);
}());
