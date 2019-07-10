(function () {
    var MonitorDetalleAwsController = function ($scope, $cookies, $location, AmazonDataFactory) {

      $scope.init = function () {
        $scope.IdCustomer = 0;
        $scope.CheckCookie();
   
     AmazonDataFactory.getDataServiceAws()
    .success(function (Services) {
      $scope.selectServices = Services;
      $scope.selectServicesBase = Services;
    })
    .error(function (data, status, headers, config) {
      $scope.ShowToast('No pudimos cargar la lista de consumos, por favor intenta de nuevo más tarde.', 'danger');
    });

    AmazonDataFactory.getCustomersAws()
    .success(function (CustomersAws) {
      $scope.selectCustomersAws = CustomersAws;
     
    })
    .error(function (data, status, headers, config) {

      $scope.ShowToast('No pudimos cargar la lista de clientes de Amazon, por favor intenta de nuevo más tarde.', 'danger');
        });
        
    };

    const getFilteredByKey = function (key, value) {
      return $scope.selectServicesBase.filter(function(e) {
        return e[key] == value;
      });
    }

    $scope.getServicesAws = function (IdCustomer) {
      IdCustomer ? (
        $scope.selectServices =  getFilteredByKey("IdDistribuidor", IdCustomer),
        $scope.selectConsoles = [... new Set($scope.selectServices.map(x => x.NombreConsola))]
       ) : (
        $scope.selectServices = $scope.selectServicesBase
       );
    };
  
    $scope.init();
    };
    
    MonitorDetalleAwsController.$inject = ['$scope', '$cookies', '$location', 'AmazonDataFactory'];
  
    angular.module('marketplace').controller('MonitorDetalleAwsController', MonitorDetalleAwsController);
  }());
  