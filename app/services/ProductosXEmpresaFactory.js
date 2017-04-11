(function () {
  var ProductosXEmpresaFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postBuscarProductosXEmpresa = function (Busqueda) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'BuscarProductosXEmpresa', Busqueda);
    };

    return factory;
  };

  ProductosXEmpresaFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('ProductosXEmpresaFactory', ProductosXEmpresaFactory);
}());
