(function () {
  var FacturacionFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.postDarDeAlta = function (datos) {
      factory.refreshToken();
      console.log(datos)
      // return $http.post($rootScope.API + 'billing-to-third-parties/signup', datos, {
      //       transformRequest: angular.identity,
      //       headers: {'Content-Type': undefined}
      //   });
      return $http({
        method: 'POST',
        url: $rootScope.API + 'billing-to-third-parties/signup',
        headers: {
          'Content-Type': undefined,
          'token': Session.Token
        },
        data: datos
      });
    }
    return factory;
  };

  FacturacionFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('FacturacionFactory', FacturacionFactory);
}());
