(function () {
  var MonitorMPNFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getInfoDistribuidores = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/getSuppliers');
    };

    factory.getMPIDInformation = function (MPNID) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/validateMPNID/' + MPNID);
    };

    factory.updateMPNID = function (IdEmpresa, MPNID) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'microsoft/updateMPNID', {IdEmpresa, MPNID});
    };

    factory.updateOrderDetails = function (IdEmpresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'microsoft/updateOrderDetails', {IdEmpresa});
    };

    return factory;
  };

  MonitorMPNFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('MonitorMPNFactory', MonitorMPNFactory);
}());
