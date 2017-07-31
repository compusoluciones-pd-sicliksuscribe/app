(function(){
  var VersionController = function ($scope, $log, $location, $cookieStore, $route, VersionFactory) {
    $scope.versiones = [];
    $scope.currentPath = $location.path();

    $scope.init = function () {
      if ($scope.currentPath === '/Version') {
        $scope.CheckCookie();
        $scope.obtenerVersiones();
      }
    };

    $scope.obtenerVersiones = function () {
      VersionFactory.getVersiones()
        .success(function(versiones){
          $scope.versiones = versiones.data;
          $scope.obtenerDetalle();
        })
        .error(function (data, status, headers, config) {
            $scope.ShowToast('No pudimos traer las versiones.', 'danger');
            $location.path('/uf/Carrito');
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.obtenerDetalle = function () {
      var IdVersion = $scope.versiones[0].Id;
      VersionFactory.getVersionDetalle(IdVersion)
        .success(function(versiones){
          $scope.detalleVersion = versiones.data;
        })
        .error(function (data, status, headers, config) {
            $scope.ShowToast('No pudimos traer el detalle de la versión.', 'danger');
            $location.path('/uf/Carrito');
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

  };
    
  VersionController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$route', 'VersionFactory'];
  angular.module('marketplace').controller('VersionController', VersionController);
}());