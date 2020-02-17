/* eslint-disable no-return-assign */
(function () {
  var MonitorAgenteController = function ($scope, $log, $location, $cookies, $routeParams, MonitorAgenteFactory, $anchorScroll, lodash) {
    $scope.countryList = ['Afghanistan', 'Albania'];
    $scope.complete = function (string) {
      if (string) {
        var output = [];
        angular.forEach($scope.countryList, function (country) {
          if (country.toLowerCase().indexOf(string.toLowerCase()) >= 0) {
            output.push(country);
          }
        });
        $scope.filterCountry = output;
      } else $scope.filterCountry = null;
    };

    $scope.fillTextbox = function (string) {
      $scope.country = string;
      $scope.filterCountry = null;
    };

    const getFilteredByKey = function (key, value) {
      return $scope.selectServicesBase.filter(function (e) {
        return e[key] === value;
      });
    };

    const getAgentes = function () {
      console.log(':D');
      return MonitorAgenteFactory.getOrdersMonitor()
        .then(result => {
          console.log(result.data.data);
          $scope.lista = result.data.data;
          pagination();
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de detalles, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const pagination = () => {
      $scope.filtered = []
      , $scope.currentPage = 1
      , $scope.numPerPage = 10
      , $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;

        $scope.filtered = $scope.lista.slice(begin, end);
      });
    };

    $scope.init = function () {
      getAgentes();
    };

    $scope.init();
  };

  MonitorAgenteController.$inject =
    ['$scope', '$log', '$location', '$cookies', '$routeParams', 'MonitorAgenteFactory', '$anchorScroll'];

  angular.module('marketplace').controller('MonitorAgenteController', MonitorAgenteController);
}());
