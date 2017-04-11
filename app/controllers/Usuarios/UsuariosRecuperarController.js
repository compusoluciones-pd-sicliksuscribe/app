(function () {
  var UsuariosRecuperarController = function ($scope, $log, $location, UsuariosFactory) {
    $scope.Usuario = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
    };

    $scope.init();


    $scope.RecuperarContrasena = function () {
      UsuariosFactory.postRecuperar($scope.Usuario)
        .success(function (Result) {
          $scope.Usuario.Respuesta = Result;
          $scope.ShowToast(Result, 'success');
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  UsuariosRecuperarController.$inject = ['$scope', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('UsuariosRecuperarController', UsuariosRecuperarController);
}());
