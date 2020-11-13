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

    factory.actualizarToken = (idEmpresaDistribuidor, contrasena) => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'super-user/get-new-session', { Contrasena: contrasena, IdEmpresaDistribuidor: idEmpresaDistribuidor });
    };

    return factory;
  };
  CambiarDistribuidorFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('CambiarDistribuidorFactory', CambiarDistribuidorFactory);
}());
