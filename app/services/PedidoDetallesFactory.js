(function () {
  var PedidoDetallesFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    // Agregar al carrito
    factory.postPedidoDetalle = pedidoDetalle => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart', pedidoDetalle);
    };

    // Agregar al carrito final user
    factory.postPedidoDetalleFinalUser = function (PedidoDetalle, currentDistribuidor) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/final-user/' + currentDistribuidor, PedidoDetalle);
    };

    // Obtener productos del carrito
    factory.getPedidoDetalles = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'shopping-cart');
    };

    // Obtener productos del carrito
    factory.getPedidoDetallesUf = function (currentDistribuidor) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'shopping-cart/final-user/' + currentDistribuidor);
    };

    // Preparar productos del carrito
    factory.getPrepararCompra = function (commission) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/prepare-purchase/' + commission);
    };

    // Preparar productos del carrito
    factory.getPrepararCompraFinalUser = function (commission, currentDistribuidor) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/prepare-purchase/final-user/' + commission + '/distribuidor/' + currentDistribuidor);
    };

    // Eliminar productos del carrito
    factory.deletePedidoDetalles = function (IdPedidoDetalle) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'shopping-cart/' + IdPedidoDetalle);
    };

    // Comprar productos
    factory.getComprar = function () {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/buy');
    };

    // Comprar productos final user
    factory.getComprarFinalUser = function (currentDistribuidor) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/final-user-purchase/' + currentDistribuidor);
    };

    // Valida el credito de los clientes
    factory.getValidarCarrito = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'shopping-cart/validate-cart');
    };

    factory.postPedidoDetallesAddOns = function (Producto) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'PedidoDetalles/AddOns', Producto);
    };

    factory.getOrderPerCustomer = function (customer) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'monitor/orders-per-customer/' + customer.IdEmpresaUsuarioFinal + '/maker/' + customer.IdFabricante);
    };

    factory.getOrderPerCustomerTuClick = function (customer) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'monitor/orders-per-customer/' + customer.IdEmpresaUsuarioFinal + '/maker/' + customer.IdFabricante + '/type/' + customer.AutoRenovable + '/tuclick/' + customer.IdDistribuidorTuClick);
    };

    factory.updateSubscriptionNextQuantity = function (detail) {
      factory.refreshToken();
      const url = $rootScope.API + 'monitor/orders/' + detail.IdPedido + '/details/' + detail.IdPedidoDetalle + '/subscriptions/';
      return $http.patch(url, detail);
    };

    factory.postMonitor = function (IdEmpresaUsuarioFinal) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Monitor', IdEmpresaUsuarioFinal);
    };

    factory.putPedidoDetalle = function (PedidoDetalle) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'PedidoDetalles', PedidoDetalle);
    };

    factory.putPedidoDetalleMicrosoft = function (PedidoDetalle) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'orders/update-status', PedidoDetalle);
    };

    factory.getContarProductos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'PedidoDetalles/ContarProductos');
    };

    factory.postWarningCredito = function (params) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'warningCredito', params);
    };

    factory.getPrepararTarjetaCredito = function () {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/credit-card-payments');
    };
    
    factory.pagarTarjetaOpenpay = function (charges) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/credit-card-payments/openpay', charges);
    };

    factory.getPrepararSPEI = function () {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/spei-payment');
    };
    
    factory.getgenerarPdfSPEI = function (charge) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/spei/get-pdf', charge);
    };
    
    factory.verificarEstatus3ds = function (idCharge) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'shopping-cart/credit-card-payments/openpay/checkStatus3ds/' + idCharge);
    };

    factory.getPrepararTarjetaCreditoFinalUser = function (currentDistribuidor) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/credit-card-payments/final-user/' + currentDistribuidor);
    };

    factory.getOwnCreditCardData = function (currentDistribuidor) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'tuclick/details-uf/creditCard/' + currentDistribuidor);
    };

    factory.prepararPaypal = function (params) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'paypal/order', params);
    };

    factory.prepararPaypalFinalUser = function (params) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'paypal/order/final-user', params);
    };

    factory.confirmarPaypal = function (params) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'paypal/order/confirm', params);
    };

    factory.getAzureUsage = function (IdPedido) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/billing/azure-usage-report/' + IdPedido);
    };

    factory.getPendingOrdersToPay = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'orders/get-pending-orders-to-pay/1');
    };

    factory.getPendingOrdersToPayTuClick = function (currentDistribuidor) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'orders/get-pending-orders-to-pay/tuclick/' + currentDistribuidor);
    };

    factory.monitorCalculations = function (Pedidos) { 
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pending-orders-monitor-calculations/1', Pedidos);
    };

    factory.monitorCalculationsTuClick = function (Pedidos, currentDistribuidor, metodoPago) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pending-orders-monitor-calculations/' + metodoPago + '/tuclick/' + currentDistribuidor, Pedidos);
    };

    factory.monitorCalculationsPayPal = function (Pedidos) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/renovations/payments/paypal/1', Pedidos);
    };

    factory.monitorCalculationsPrepaid = function (Pedidos, moneda) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/renovations/payments/prepaid/1/' + moneda, Pedidos);
    };

    factory.payWithPrePaid = function (Pedidos, moneda) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pay-with-prepaid/' + moneda, Pedidos);
    };

    factory.payWidthCard = function (Pedidos) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pay-width-card', Pedidos);
    };

    factory.payWidthSPEI = function (Pedidos) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pay-width-spei', Pedidos);
    };

    factory.payWidthCardTuClick = function (Pedidos, currentDistribuidor) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pay-width-card/tuclick/' + currentDistribuidor, Pedidos);
    };

    factory.removeRenew = function (pedido) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'shopping-cart/renew/order/' + pedido.IdPedido);
    };

    factory.preparePayPal = function (params) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'paypal/order', params);
    };

    factory.confirmPayPal = function (params) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'paypal/order/confirm', params);
    };

    factory.payWithPaypal = function (Pedidos) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pay-with-paypal', Pedidos);
    };

    factory.payWithPaypalTuClick = function (Pedidos, currentDistribuidor) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/pay-with-paypal/tuclick/' + currentDistribuidor, Pedidos);
    }

    factory.getDistributorData = function (params) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'search-distributor/data', params);
    };

    factory.datesOrders = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'dates-orders');
    };

    factory.getFinalUser = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'monitor-final-user');
    };

    factory.acceptAgreement = function (IdEmpresaUsuarioFinal) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'agreements/accept-agreement/' + IdEmpresaUsuarioFinal);
    };

    factory.idOrderComparePaymentCurrency = function (params) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'previouslyOrderToCompare', params);
    };

    factory.getUseCFDI = () => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'shopping-cart/use-CFDI');
    };

    factory.putUseCFDI = function (UsoCFDI, IdPedido) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'shopping-cart/update-use-CFDI/' + UsoCFDI + '/id-pedido/' + IdPedido);
    };

    factory.getProratePriceMonth = function ({ FechaInicio }, { PrecioNormal }) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'orders/prorateMonth/fechaInicio/' + FechaInicio + '/precio/' + PrecioNormal);
    };

    factory.getProratePriceAnnual = function ({ FechaInicio }, { PrecioNormal }) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'orders/prorateAnnual/fechaInicio/' + FechaInicio + '/precio/' + PrecioNormal);
    };

    factory.getMPIDInformation = function (MPNID) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/validateMPNID/' + MPNID);
    };

    factory.postPartitionFlag = function (pedido) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/update-quantity', pedido);
    };

    factory.removeExt = pedido => {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'shopping-cart/remove-contract-extension/order/' + pedido.IdPedido);
    };

    factory.actualizarUsuarioCompra = (idPedidos, IdUsuarioCompra) => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'super-user/update-purchase-user', { IdPedidos: idPedidos, IdUsuarioCompra });
    };

    factory.actualizarOrdenesCompra = ordenes => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/update-purchase-order', ordenes);
    };

    factory.marcarSP = (idPedido, marcado, promo) => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/mark-sp', { IdPedido: idPedido, Marcado: marcado, promo });
    };

    factory.actualizarFechaInicio = (idContrato, fechaInicio, idEsquemaRenovacion) => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'orders/update-start-date', { IdContrato: idContrato, FechaInicio: fechaInicio, IdEsquemaRenovacion: idEsquemaRenovacion });
    };

    factory.setCreditCardType = (PedidoDetalles, tipoTarjeta) => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'shopping-cart/set-creditCardType', { PedidoDetalles, tipoTarjeta });
    };

    factory.InsertarOrdenCompra = (idPedido, ordenCompraProxima) => {
      factory.refreshToken();
      return $http.put($rootScope.API + 'orders/InsertOrdenCompraProxima/', { idPedido: idPedido, ordenCompraProxima: ordenCompraProxima });
    };

    return factory;
  };

  PedidoDetallesFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('PedidoDetallesFactory', PedidoDetallesFactory);
}());
