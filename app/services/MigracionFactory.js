(function () {
  var MigracionFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getMigraciones = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'migrations');
    };

    factory.getMigracion = function (IdMigracion) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'migrations/' + IdMigracion);
    };

    factory.postMigracion = function (migracion) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'migrations', migracion);
    };

    factory.patchMigracion = function (migracion) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'migrations', migracion);
    };

    factory.getDominio = function (obj) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'migrations/customer/' + obj.Contexto + '/' + obj.Dominio);
    };

    factory.postUsuario = function (user) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'migrations/user', user);
    };

    factory.postCliente = function (cliente) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'migrations/customer', cliente);
    };

    return factory;
  };

  MigracionFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('MigracionFactory', MigracionFactory);
}());
