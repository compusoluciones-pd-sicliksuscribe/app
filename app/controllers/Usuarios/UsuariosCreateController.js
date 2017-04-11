(function () {
  var UsuariosCreateController = function ($scope, $log, $cookieStore, $location, UsuariosFactory, TiposAccesosFactory, EmpresasFactory) {
    var Session = {};
    Session = $cookieStore.get('Session');
    $scope.Session = Session;
    $scope.Usuario = {};
    $scope.Usuario.Formulario = false;

    $scope.init = function () {
      $scope.CheckCookie();

      TiposAccesosFactory.getTiposAccesos()
        .success(function (TiposAccesos) {
          $scope.selectTiposAccesos = TiposAccesos;
          if (Session.IdTipoAcceso == 2 || Session.IdTipoAcceso == 4)
            $scope.Usuario.MuestraComboEmpresas = 0;
          else
            $scope.Usuario.MuestraComboEmpresas = 1;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

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
      if (($scope.frm.$invalid)) {
        if ($scope.frm.Nombre.$invalid == true) {
          $scope.frm.Nombre.$pristine = false;
        }
        if ($scope.frm.CorreoElectronico.$invalid == true) {
          $scope.frm.CorreoElectronico.$pristine = false;
        }
        if ($scope.frm.IdTipoAcceso.$invalid == true) {
          $scope.frm.IdTipoAcceso.$pristine = false;
        }
        $scope.ShowToast("Datos inválidos, favor de verificar", 'danger');
      } else {
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
    };

    $scope.UsuarioCancel = function () {
      $location.path("/Usuarios");
    };
  };

  UsuariosCreateController.$inject = ['$scope', '$log', '$cookieStore', '$location', 'UsuariosFactory', 'TiposAccesosFactory', 'EmpresasFactory'];

  angular.module('marketplace').controller('UsuariosCreateController', UsuariosCreateController);
}());
