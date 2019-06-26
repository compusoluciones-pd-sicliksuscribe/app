(function () {
  var UsuariosRestablecerController = function ($scope, $log, $location, UsuariosFactory) {
    $scope.Usuario = {};

    $scope.init = function () {
      $scope.navCollapsed = true;
    };

    $scope.init();

    $scope.RestablecerContrasena = function () {
      if (document.getElementById('emailForPassReset').value != '' ) {
        UsuariosFactory.postRestablecer($scope.Usuario)
          .success(function (result) {
            $scope.Usuario.Respuesta = result.message;
            $scope.ShowToast(result.message, 'success');
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
      }
    };
  };

  UsuariosRestablecerController.$inject = ['$scope', '$log', '$location', 'UsuariosFactory'];

  angular.module('marketplace').controller('UsuariosRestablecerController', UsuariosRestablecerController);
}());
