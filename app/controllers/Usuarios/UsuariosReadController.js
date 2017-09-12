(function () {
  var UsuariosReadController = function ($scope, $log, $location, $cookieStore, UsuariosFactory, UsuariosXEmpresasFactory, EmpresasFactory) {

    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.empresaSel = '';
    const Session = $cookieStore.get('Session');
    if (Session.IdTipoAcceso === 1) {
      $scope.empresaActual = 'CompuSoluciones';
    }
    if (Session.IdTipoAcceso === 2) {
      $scope.empresaActual = Session.NombreEmpresa;
    }

    $scope.init = function () {
      $scope.CheckCookie();
      if (Session.IdTipoAcceso !== 2) {
        EmpresasFactory.getEmpresas()
          .success(function (Empresas) {
            $scope.selectEmpresas = Empresas;
            if ($scope.SessionCookie.IdTipoAcceso != 1) {
              $scope.empresaSel = $scope.selectEmpresas[0].IdEmpresa;
            }

            $scope.MostrarUsuariosEmp(isNaN(parseInt($scope.empresaSel)) ? 0 : parseInt($scope.empresaSel));
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
      if (Session.IdTipoAcceso === 2) {
        console.log('Pide mis clientes');
        EmpresasFactory.getClientes()
          .success(function (Empresas) {
            console.log(Empresas);
            $scope.selectEmpresas = Empresas.data;
            $scope.ObtenerUsuariosPropios();
          })
          .error(function (data, status, headers, config) {
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
          console.log($scope.Usuarios);
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

    $scope.MostrarUsuariosEmp = function (IdEmpresa) {
      if (Session.IdTipoAcceso === 2) {
        if (IdEmpresa) {
          $scope.ObtenerUsuariosPorCliente(IdEmpresa);
        } else {
          $scope.ObtenerUsuariosPropios();
        }
      } else {
        UsuariosXEmpresasFactory.getUsuariosXEmpresa(IdEmpresa)
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

  UsuariosReadController.$inject = ['$scope', '$log', '$location', '$cookieStore', 'UsuariosFactory', 'UsuariosXEmpresasFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosReadController', UsuariosReadController);
}());
