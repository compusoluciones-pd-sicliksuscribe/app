(function () {
  var OpenCSNController = function ($scope, OpenCSNFactory) {

    $scope.getOrders = () => {
      OpenCSNFactory.getOpenOrders()
      .then(result => {
        if (result.data.success) $scope.orders = result.data.data;
      });
    };

    $scope.init = async () => {
      await $scope.getOrders();
    };

    $scope.init();

  };

  OpenCSNController.$inject = ['$scope', 'OpenCSNFactory'];

  angular.module('marketplace').controller('OpenCSNController', OpenCSNController);
}());
