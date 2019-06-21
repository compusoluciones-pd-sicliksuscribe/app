// (function () {
//     var MonitorDetalleAwsController = function ($scope, $cookies, $location, AmazonDataFactory) {
//       console.log("si agarro el controlador ya de perdida xD ");
//       // $scope.consumptions = {};
      
//       $scope.init = function () {
//         $scope.CheckCookie();
  
  
//         AmazonDataFactory.getDataConsumptionAws()
//         .success(function (Customers) {
//           $scope.selectCustomersAws = Customers;
//         })
//         .error(function (data, status, headers, config) {
  
//           $scope.ShowToast('No pudimos cargar la lista de fabricantes, por favor intenta de nuevo más tarde.', 'danger');
  
//           $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
//         });
//       };
//       $scope.init();
//     };
  
//     MonitorDetalleAwsController.$inject = ['$scope', '$cookies', '$location', 'AmazonDataFactory'];
  
//     angular.module('marketplace').controller('MonitorDetalleAwsController', MonitorDetalleAwsController);
//   }());
  