(function () {
  var ProductosFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    const encodeQueryData = function (params) {
      let query = [];
      Object.keys(params).forEach(function (property) {
        if (params[property] != null) query.push(encodeURIComponent(property) + '=' + encodeURIComponent(params[property]));
      });
      return query.length > 0 ? '?' + query.join('&') : '';
    };

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getBuscarProductos = function (params) {
      factory.refreshToken();
      const query = encodeQueryData(params);
      return $http.get($rootScope.API + 'products' + query);
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

    factory.putBaseSubscription = function (body) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'autodesk/subscription/base', body);
    };

    factory.getProductContracts = function (idEmpresaUsuarioFinal, idProducto) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/contacts/' + idEmpresaUsuarioFinal + '/contract/' + idProducto);
    };

    factory.getProductExists = function (idEmpresaUsuarioFinal, idProducto, idContrato) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/contact/' + idEmpresaUsuarioFinal + '/product/' + idProducto + '/contract/' + idContrato);
    };

    factory.getQuantity = function (idEmpresaUsuarioFinal, idProducto) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'pickit/contact/' + idEmpresaUsuarioFinal + '/product/' + idProducto);
    };

    factory.getProductContractsTuClick = function (idEmpresaUsuarioFinal, idProducto, currentDistribuidor) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/contacts/' + idEmpresaUsuarioFinal + '/contract/' + idProducto + '/distribuidor/' + currentDistribuidor);
    };

    factory.getValidateEmail = function (email) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'r&c-solutions/validate-user/' + email);
    };

    factory.postIdERP = function () {
      factory.refreshToken();
      return $http.post($rootScope.API + 'r&c-solutions/postIdERP');
    };

    factory.postRequestDataVwareProduct = function (body) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'requestDataVwareProduct', body);
    };

    return factory;
  };

  ProductosFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ProductosFactory', ProductosFactory);
}());
