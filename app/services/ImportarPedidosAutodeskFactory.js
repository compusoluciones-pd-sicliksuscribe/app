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

    factory.importarPedido = function (infoPedido) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/orders/import', infoPedido);
    };

    factory.getSKUData = function (IdEmpresaDistribuidor, numeroContrato) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/orders/getSKUData/' + IdEmpresaDistribuidor + '/' + numeroContrato);
    };

    return factory;
  };
  ImportarPedidosAutodeskFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ImportarPedidosAutodeskFactory', ImportarPedidosAutodeskFactory);
}());
