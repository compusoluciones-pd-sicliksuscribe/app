(function () {
    var Confirmar3dsController = function ($scope, $log, $cookies, $location, $uibModal, $filter, PedidoDetallesFactory, $routeParams) {

        

      $scope.init = function () {


        window.onload = function() {
            // window.onbeforeunload = confirmExit;
            // function confirmExit() {
            //     return "Por favor no te salgas xd";
            // }
          };




       console.log($cookies.getObject('status'));
       console.log($cookies.getAll()); 
      };
      $scope.init();
  
    };

    const confirmarPago = () => {
        console.log('pago confirmado');
        // angular.element(document.getElementById('divComprar')).scope().CreditCardPayment($cookies.getObject('status'), $cookies.getObject('id'));
    };



    Confirmar3dsController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', '$routeParams'];
  
    angular.module('marketplace').controller('Confirmar3dsController', Confirmar3dsController);
  }());
  