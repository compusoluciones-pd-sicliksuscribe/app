(function () {
  var ProductosXEmpresaFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
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

  ProductosXEmpresaFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ProductosXEmpresaFactory', ProductosXEmpresaFactory);
}());
