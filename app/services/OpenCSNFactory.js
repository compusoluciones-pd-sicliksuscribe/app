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

    factory.updateResellerCSN = (resellerCSN, resellerId) => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/openOrders/updateResellerCSN', {resellerCSN, resellerId});
    };

    factory.confirmOrder = orderId => {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'autodesk/openOrders/confirmOrder', {orderId});
    };

    return factory;
  };

  OpenCSNFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('OpenCSNFactory', OpenCSNFactory);
}());
