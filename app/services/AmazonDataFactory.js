
(function () {
  var AmazonDataFactory = function ($http, $cookies, $rootScope) {
  var factory = {};
  var Session = {};

  factory.postRequestDataAWSProduct = function (Product) {
    factory.refreshToken();
    return $http.post($rootScope.API + 'amazonWebServices/requestDataAWSProducts', Product);
  };

  factory.refreshToken = function () {
    Session = $cookies.getObject('Session');
    if (!Session) { Session = { Token: 'no' }; }
    $http.defaults.headers.common['token'] = Session.Token;
  };

  factory.refreshToken();

  factory.getDataServiceAWS = function () {
    factory.refreshToken();
    return $http.get($rootScope.API + 'amazonWebServices/getDataServicesAWS');
  };

  factory.getCustomersAWS = function () {
    factory.refreshToken();
    return $http.get($rootScope.API + 'amazonWebServices/getCustomersAWS');
  };

  factory.getConsolesAWS = function (IdCustomer) {
    factory.refreshToken();
    return $http.get($rootScope.API + 'amazonWebServices/getConsolesAWS/' + IdCustomer);
  };

  factory.getSearchServiceAWS = function (body) {
    factory.refreshToken();
    return $http.get($rootScope.API + 'amazonWebServices/getSearchServiceAWS/' + body.IdDistribuidor + '/' + body.IdConsola);
  };

  return factory;

  };
  
  AmazonDataFactory.$inject = ['$http', '$cookies', '$rootScope'];

angular.module('marketplace').factory('AmazonDataFactory', AmazonDataFactory);
}());
