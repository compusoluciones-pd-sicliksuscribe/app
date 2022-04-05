(function () {
    var ManejoLicencias = function ($http, $cookies, $rootScope) {
      var factory = {};
      var Session = {};
  
      factory.refreshToken = () => {
        Session = $cookies.getObject('Session');
        if (!Session) { Session = { Token: 'no' }; }
        $http.defaults.headers.common['token'] = Session.Token;
      };
  
      factory.cotermByUF = function (IdEmpresaUsuarioFinal) {
        factory.refreshToken();
        return $http.get(`${$rootScope.MAPI}subscriptions/coterm/by/${IdEmpresaUsuarioFinal}`);
      };

      return factory;
    };
  
    ManejoLicencias.$inject = ['$http', '$cookies', '$rootScope'];
  
    angular.module('marketplace').factory('ManejoLicencias', ManejoLicencias);
  }());