(function () {
  var SpecialPetitionFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = () => {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getOrders = () => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/get-SPs');
    };

    factory.updateSubtotal = (idDetalle, descuento, descuentoSp, subtotal) => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/update-subtotal', {IdPedidoDetalle: idDetalle, PorcentajeDescuento: descuento, PorcentajeDescuentoProxima: descuentoSp, PrecioUnitario: subtotal});
    };

    return factory;
  };

  SpecialPetitionFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('SpecialPetitionFactory', SpecialPetitionFactory);
}());
