(function () {
  var ImportarPedidosAutodeskFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getAutodeskSuppliers = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/suppliers');
    };

    factory.getAutodeskUF = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/final-users');
    };

    factory.getRenovationScheme = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/renovation-scheme');
    };

    factory.getProducts = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/products');
    };

    factory.getSKUData = function (numeroContrato) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/orders/getSKUData/' + numeroContrato);
    };

    factory.postEmpresa = function (infoEmpresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'enterprise/createEnterpriceAltern', infoEmpresa);
    };

    factory.getCSN = IdEmpresa => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/get-csn/dist/' + IdEmpresa);
    };

    factory.postContratoOtroMayorista = infoContrato => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/otherWholesaler', infoContrato);
    };

    return factory;
  };
  ImportarPedidosAutodeskFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ImportarPedidosAutodeskFactory', ImportarPedidosAutodeskFactory);
}());
