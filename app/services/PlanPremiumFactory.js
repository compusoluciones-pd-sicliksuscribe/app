(function () {
  var PlanPremiumFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = () => {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getTeams = email => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/get-summary/' + email);
    };

    return factory;
  };

  PlanPremiumFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('PlanPremiumFactory', PlanPremiumFactory);
}());
