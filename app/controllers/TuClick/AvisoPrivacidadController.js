(function () {
    var AvisoPrivacidadController = function ($scope, $log, $cookies,  $sce) {
       $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
       $scope.UrlAvisoPrivacidad = $sce.trustAsResourceUrl($scope.currentDistribuidor.UrlAvisoPrivacidad);
    };
  
    AvisoPrivacidadController.$inject = ['$scope', '$log', '$cookies', '$sce'];
  
    angular.module('marketplace').controller('AvisoPrivacidadController', AvisoPrivacidadController);
  }());
  