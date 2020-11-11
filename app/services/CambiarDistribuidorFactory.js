(function () {
  var CambiarDistribuidorFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = () => {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.actualizarDistribuidor = IdEmpresaDistribuidor => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'super-user/update-supplier', { IdEmpresaDistribuidor: IdEmpresaDistribuidor });
    };

    return factory;
  };
  CambiarDistribuidorFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('CambiarDistribuidorFactory', CambiarDistribuidorFactory);
}());
