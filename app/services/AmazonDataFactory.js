
(function () {
  var AmazonDataFactory = function ($http, $cookies, $rootScope) {
  var factory = {};
  var Session = {};

  factory.refreshToken = function () {
    Session = $cookies.getObject('Session');
    if (!Session) { Session = { Token: 'no' }; }
    $http.defaults.headers.common['token'] = Session.Token;
  };

  factory.refreshToken();

  factory.getDataServiceAws = function () {
    factory.refreshToken();
    return $http.get($rootScope.API + 'aws/getDataServicesAws');
  };

  factory.getCustomersAws = function () {
    factory.refreshToken();
    return $http.get($rootScope.API + 'aws/getCustomersAws');
  };

  factory.getConsolesAws = function (IdCustomer) {
    factory.refreshToken();
    return $http.get($rootScope.API + 'aws/getConsolesAws/'+IdCustomer);
  };

  factory.getSearchServiceAws = function (body) {
    factory.refreshToken();
    return $http.get($rootScope.API + 'aws/getSearchServiceAws/' + body.IdDistribuidor + '/' + body.IdConsola);
  };

  factory.createOrdersAws = function () {
    factory.refreshToken();
    return $http.get($rootScope.API + 'aws/CreateOrders');
  };
  return factory;

  };
  
  AmazonDataFactory.$inject = ['$http', '$cookies', '$rootScope'];

angular.module('marketplace').factory('AmazonDataFactory', AmazonDataFactory);
}());
