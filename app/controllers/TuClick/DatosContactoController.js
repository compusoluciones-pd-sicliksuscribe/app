(function () {
    var DatosContactoController = function ($scope, $log, $cookies,  $sce) {
       $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
       $scope.UrlContacto = $sce.trustAsResourceUrl($scope.currentDistribuidor.UrlContacto);
    };
  
    DatosContactoController.$inject = ['$scope', '$log', '$cookies', '$sce'];
  
    angular.module('marketplace').controller('DatosContactoController', DatosContactoController);
  }());
  