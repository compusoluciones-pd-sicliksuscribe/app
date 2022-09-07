(function () {
  var OpenCSNFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getOpenOrders = () => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/openOrders');
    };

    return factory;
  };

  OpenCSNFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('OpenCSNFactory', OpenCSNFactory);
}());
