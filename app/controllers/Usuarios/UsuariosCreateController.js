(function () {
  var UsuariosCreateController = function ($scope, $log, $cookies, $location, UsuariosFactory, TiposAccesosFactory, EmpresasFactory) {
    var Session = {};
    Session = $cookies.getObject('Session');
    $scope.Session = Session;
    $scope.Usuario = {};
    $scope.empresa = 0;
    $scope.Usuario.Formulario = false;

    $scope.init = function () {
      $scope.CheckCookie();
      if (Session.IdTipoAcceso !== 2) {
        TiposAccesosFactory.getTiposAccesos()
          .success(function (TiposAccesos) {
            $scope.selectTiposAccesos = TiposAccesos;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      };

      if (Session.IdTipoAcceso === 2) {
        UsuariosFactory.getAccessosParaDistribuidor()
          .success(function (TiposAccesos) {
            $scope.selectTiposAccesos = TiposAccesos.data;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
        EmpresasFactory.getClientes()
          .success(function (Empresas) {
            $scope.selectEmpresas = Empresas.data;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }

      $scope.Usuario.Lada = 52;

      if (Session.IdTipoAcceso == 1) {
        EmpresasFactory.getEmpresas()
          .success(function (Empresas) {
            $scope.selectEmpresas = Empresas;
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };

    $scope.init();

    $scope.UsuarioCreate = function () {
      if ($scope.frm.$valid) {
        delete $scope.Usuario.Formulario;
        if(Session.IdTipoAcceso === 4) {
          $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
          $scope.Usuario.IdEmpresaDistribuidor = $scope.currentDistribuidor.IdEmpresa;
          UsuariosFactory.postUsuarioFinal($scope.Usuario)
            .success(function (result) {
              if(!result.statusCode) {
                if (result.data[0].success == true) {
                  $location.path("/Usuarios/uf");
                  $scope.ShowToast(result.data[0].message, 'success');
                }
                else {
                  $scope.ShowToast(result.data[0].message, 'danger');
                }
              } else {
                $scope.ShowToast(result.message, 'danger');
              }
              })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        }
        else if (Session.IdTipoAcceso !== 2) {
          UsuariosFactory.postUsuario($scope.Usuario)
            .success(function (result) {
              if (result[0].Success == true) {
                $location.path("/Usuarios");
                $scope.ShowToast(result[0].Message, 'success');
              }
              else {
                $scope.ShowToast(result[0].Message, 'danger');
              }
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
        }
        if (Session.IdTipoAcceso === 2) {
          const user = Object.assign({}, $scope.Usuario);
          if ($scope.Usuario.IdTipoAcceso === 4 || $scope.Usuario.IdTipoAcceso === 6) {
            user.TipoUsuario = 'END_USER';
            user.IdTipoAcceso = $scope.Usuario.IdTipoAcceso.toString();
            user.Lada = $scope.Usuario.Lada.toString();
            UsuariosFactory.postUsuarioCliente(user)
              .success(function (result) {
                if (result.success === 1) {
                  $location.path("/Usuarios");
                  $scope.ShowToast(result.message, 'success');
                } else {
                  $scope.ShowToast(result.message, 'danger');
                  return;
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          }
          if ($scope.Usuario.IdTipoAcceso != 4 && $scope.Usuario.IdTipoAcceso != 6) {
            UsuariosFactory.postUsuario($scope.Usuario)
              .success(function (result) {
                if (result[0].Success == true) {
                  $location.path("/Usuarios");
                  $scope.ShowToast(result[0].Message, 'success');
                }
                else {
                  $scope.ShowToast(result[0].Message, 'danger');
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          }
        }
      } else $scope.ShowToast('Alguno de los campos es invalido', 'danger');
    };

    $scope.UsuarioCancel = function () {
      $location.path("/Usuarios");
    };
  };

  UsuariosCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'UsuariosFactory', 'TiposAccesosFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosCreateController', UsuariosCreateController);
}());
