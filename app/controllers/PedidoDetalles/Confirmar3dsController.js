/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
(function () {
  var Confirmar3dsController = function ($scope, $log, $cookies, $location, $uibModal, $filter, PedidoDetallesFactory, $routeParams) {
    $scope.showGif = true;
    $scope.buttonBack = false;

    const printError = (messageError) => {
      $('#responseDiv').html(messageError).removeClass('ocultar').removeClass().addClass('alert alert-danger');
    };

    $scope.redireccionCarrito = () => {
      window.location.href = '#/Carrito';
    };

    const redireccionPagado = (openpayStatus, paymentId) => {
      angular.element(document.getElementById('divComprar')).scope().CreditCardPayment(openpayStatus, paymentId);
    };

    const redireccionMal = () => {
      setTimeout($scope.redireccionCarrito, 5000);
    };
    const redireccionBien = (openpayStatus, paymentId) => {
      setTimeout(redireccionPagado(openpayStatus, paymentId), 5000);
    };

    const verificarPago = () => {
      const idCharge = $cookies.getObject('paymentId');
      PedidoDetallesFactory.verificarEstatus3ds(idCharge)
        .then(function (response) {
          if (response.data.statusCode === 200 && response.data.content.openpayStatus == 'completed') {
            redireccionBien(response.data.content.openpayStatus, response.data.content.paymentId);
          } else {
            if (response.data.statusCode === 400 && response.data.content.openpayStatus == 'expired') {
              printError(`<b>${response.data.message}</b> Por favor intenta realizar una nueva compra, serás redireccionado al carrito.`);
              redireccionMal();
            } else if (response.data.statusCode === 400 && response.data.content.openpayStatus == 'charge_pending') {
              printError(`<b>${response.data.message}</b> Tu pago aún no se confirma, es necesario concluirlo (serás redireccionado al carrito).`);
              redireccionMal();
            } else {
              printError(`<b>${response.data.message}</b> Por favor intenta realizar una nueva compra.`);
              $scope.showGif = false;
              $scope.buttonBack = true;
            }
          }
        })
        .catch(function (response) {
          $scope.ShowToast('Ocurrió un error al verificar el pago. de tipo: ' + response.data.message, 'danger');
        });
    };

    $scope.init = function () {
      window.onload = function () {
        window.onbeforeunload = confirmExit;
        function confirmExit () {
          return 'Por favor, permanece en la página.';
        }
      };
      verificarPago();
    };
    $scope.init();
  };

  Confirmar3dsController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'PedidoDetallesFactory', '$routeParams'];

  angular.module('marketplace').controller('Confirmar3dsController', Confirmar3dsController);
}());
