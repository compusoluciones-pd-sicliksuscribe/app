(function () {
    var TerminosYCondicionesController = function ($scope, $log, $cookies,  $sce) {
       $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
       $scope.terminosPDF = $sce.trustAsResourceUrl($scope.currentDistribuidor.TerminosYCondiciones);
    };
  
    TerminosYCondicionesController.$inject = ['$scope', '$log', '$cookies', '$sce'];
  
    angular.module('marketplace').controller('TerminosYCondicionesController', TerminosYCondicionesController);
  }());
  