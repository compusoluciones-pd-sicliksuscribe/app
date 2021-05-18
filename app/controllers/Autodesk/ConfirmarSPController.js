(function () {
  var ConfirmarSPController = function ($scope, $log, $location, $cookies, $routeParams, SpecialPetitionFactory, $anchorScroll, lodash) {
    const getSPs = () => {
      SpecialPetitionFactory.getOrders()
        .then(result => {
          console.log(result.data.data);
          $scope.ordenes = result.data.data;
        });
    };

    $scope.init = () => {
      getSPs();
    };

    $scope.init();
  };

  ConfirmarSPController.$inject =
        ['$scope', '$log', '$location', '$cookies', '$routeParams', 'SpecialPetitionFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ConfirmarSPController', ConfirmarSPController);
}());
