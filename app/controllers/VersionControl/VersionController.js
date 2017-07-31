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
          obtenerDetalle();
        })
        .error(function (data, status, headers, config) {
            $scope.ShowToast('No pudimos traer las versiones.', 'danger');
            $location.path('/uf/Carrito');
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    var obtenerDetalle = function (Id) {
      var IdVersion = Id || $scope.versiones[0].Id;
      VersionFactory.getVersionDetalle(IdVersion)
      .success(function(versiones){
        $scope.detalleVersion = versiones.data;
        SetTitulo();
      })
      .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos traer el detalle de la versión.', 'danger');
          $location.path('/uf/Carrito');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      });
    };

    $scope.init();

    $scope.GetDetalle = function (IdVersion, text) {
      console.log(text);
      if(!IdVersion){
        IdVersion=4;
      }
      obtenerDetalle(IdVersion); 
    };

    var SetTitulo = function (){
      var selectedIndex = document.getElementsByName("Versiones")[0].selectedIndex-1;
      if(selectedIndex < 0) {
        selectedIndex = 0;
      }
      $scope.Titulo = $scope.versiones[selectedIndex].Version;
    };
  };
    
  VersionController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$route', 'VersionFactory'];
  angular.module('marketplace').controller('VersionController', VersionController);
}());