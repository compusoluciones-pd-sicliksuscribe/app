(function () {
  var ProductosFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postBuscarProductos = function (Busqueda) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'BuscarProductos', Busqueda);
    };

    factory.postComplementos = function (Producto) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'BuscarComplementos', Producto);
    };

    factory.getProductos = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Productos');
    };

    factory.getMisProductos = function (IdEmpresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'MisProductos/' + IdEmpresa);
    };

    factory.putMiProducto = function (producto) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'MiProducto', producto);
    };

    factory.putMisProductos = function (productos) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'ActualizarMisProductos', productos);
    };

    factory.getBaseSubscription = function (IdProducto) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/subscription/base/' + IdProducto);
    };

    factory.putBaseSubscription = function (body) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'autodesk/subscription/base', body);
    };

    factory.getProductContracts = function (idEmpresaUsuarioFinal, idProducto) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/contacts/' + idEmpresaUsuarioFinal + '/contract/' + idProducto);
    };

    return factory;
  };

  ProductosFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ProductosFactory', ProductosFactory);
}());
