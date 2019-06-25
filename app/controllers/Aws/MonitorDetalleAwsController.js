(function () {
    var MonitorDetalleAwsController = function ($scope, $cookies, $location, AmazonDataFactory) {

      $scope.setCustomer = function(IdCustomer ){
        $scope.IdCustomer=IdCustomer;
        AmazonDataFactory.getConsolesAws($scope.IdCustomer)
            .success(function (ConsolesAws) {
            $scope.selectConsoles = ConsolesAws;
            
            })
            .error(function (data, status, headers, config) {

            $scope.ShowToast('No pudimos cargar la lista de consolas de Amazon, por favor intenta de nuevo más tarde.', 'danger');
                });
                
            
        }
      

    //   $scope.setRfcAndNameEnterprise = function(rfc,name){
    //     $scope.rfc=rfc;
    //     $scope.nameEnterprise=name;
    //   }
      
      $scope.init = function () {
        $scope.IdCustomer = 0;
        $scope.CheckCookie();
   
     AmazonDataFactory.getDataServiceAws()
    .success(function (Customers) {
      $scope.selectCustomers = Customers;
     
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
   
    $scope.init();
    };
    
    MonitorDetalleAwsController.$inject = ['$scope', '$cookies', '$location', 'AmazonDataFactory'];
  
    angular.module('marketplace').controller('MonitorDetalleAwsController', MonitorDetalleAwsController);
  }());
  