(function () {
  var MonitorPremiumController = function ($scope, PlanPremiumFactory) {
    $scope.init = () => {};

    $scope.init();

    $scope.getTeams = () => {
      PlanPremiumFactory.getTeams($scope.email)
      .then(result => {
        console.log(result);
        $scope.asientosElegibles = 0;
        $scope.asientosComprados = 0;
        $scope.equipos = [];
        if (result.data.success) {
          $scope.asientosElegibles = result.data.data.totalPremiumElegibleSeats;
          $scope.asientosComprados = result.data.data.totalPurchasedPremiumSeats;
          $scope.equipos = result.data.data.teams;
        } else $scope.ShowToast('No hay resultados para este correo electrónico.', 'warning');
      });
    };
  };

  MonitorPremiumController.$inject = ['$scope', 'PlanPremiumFactory'];

  angular.module('marketplace').controller('MonitorPremiumController', MonitorPremiumController);
}());
