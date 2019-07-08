(function () {
    var MonitorDetalleAwsController = function ($scope, $cookies, $location, AmazonDataFactory) {

      $scope.init = function () {
        $scope.IdCustomer = 0;
        $scope.CheckCookie();
   
     AmazonDataFactory.getDataServiceAws()
    .success(function (Services) {
      $scope.selectServices = Services;
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

    $scope.getServicesAws = function (IdCustomer) {
      const payload = {
        IdDistribuidor: $scope.MonitorIdCustomer || 'all',
        IdConsola: $scope.MonitorIdConsole || 'all'
      };
      AmazonDataFactory.getSearchServiceAws(payload)
      .success(function (Services) {
        $scope.selectServices = Services;
      })
      .error(function (data, status, headers, config) {
        $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';

        $scope.ShowToast('No pudimos cargar la lista de solicitudes, por favor intenta de nuevo más tarde.', 'danger');

        $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      });

      $scope.rfc=$scope.selectServices.RFC;     
      AmazonDataFactory.getConsolesAws(IdCustomer)
      .success(function (ConsolesAws) {
      $scope.selectConsoles = ConsolesAws;
      
      })
      .error(function (data, status, headers, config) {

      $scope.ShowToast('No pudimos cargar la lista de consolas de Amazon, por favor intenta de nuevo más tarde.', 'danger');
          });
          
      



    };

  
   
    $scope.init();
    };
    
    MonitorDetalleAwsController.$inject = ['$scope', '$cookies', '$location', 'AmazonDataFactory'];
  
    angular.module('marketplace').controller('MonitorDetalleAwsController', MonitorDetalleAwsController);
  }());
  