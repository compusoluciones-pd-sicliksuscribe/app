(function () {
  var ComprasUFFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postComprasUF = function (producto, currentDistribuidor) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'ComprasUF/' + currentDistribuidor, producto);
    };

    factory.getComprasUF = function (IdEmpresaDistribuidor, ActualizarPrecios) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ComprasUF/' + IdEmpresaDistribuidor + '/' + ActualizarPrecios);
    };

    factory.deleteComprasUF = function (IdCompraUF) {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'ComprasUF/' + IdCompraUF);
    };

    factory.getCantidadProductosCarrito = function (IdEmpresaDistribuidor) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'CantidadProductosCarritoUF/' + IdEmpresaDistribuidor);
    };

    factory.getComprarUF = function (IdEmpresaDistribuidor) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'ComprarUF/' + IdEmpresaDistribuidor);
    };

    return factory;
  };

  ComprasUFFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ComprasUFFactory', ComprasUFFactory);
}());
