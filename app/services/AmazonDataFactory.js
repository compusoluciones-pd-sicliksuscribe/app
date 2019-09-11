
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

  factory.postRequestDataAWSProduct= function (body) {
    factory.refreshToken();
    return $http.post($rootScope.API + 'amazonWebServices/requestDataAWSProducts', body);
  };
  
  factory.getDataServiceAWS = function () {
    factory.refreshToken();
    return $http.get($rootScope.API + 'amazonWebServices/getDataServicesAWS');
  };

  factory.getConsolesAWS = function (IdCustomer) {
    factory.refreshToken();
    return $http.get($rootScope.API + 'amazonWebServices/getConsolesAWS/'+IdCustomer);
  };


  factory.getConsumptionByCustomer = function (IdCustomer) {
    factory.refreshToken();
    return $http.get($rootScope.API + 'amazonWebService/getTotalConsumptionByCustomer/'+IdCustomer);
  };

  return factory;

  };
  
  AmazonDataFactory.$inject = ['$http', '$cookies', '$rootScope'];

angular.module('marketplace').factory('AmazonDataFactory', AmazonDataFactory);
}());
