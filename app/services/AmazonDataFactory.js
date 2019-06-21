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

  factory.getDataConsumptionAws = function () {
    factory.refreshToken();
    return $http.get($rootScope.API + 'aws/getConsumptionAws');
  };

  factory.postRequestDataAwsProduct= function (body) {
    factory.refreshToken();
    return $http.post($rootScope.API + 'aws/requestDatAwsProducts', body);
  };

  return factory;

  };
  
  AmazonDataFactory.$inject = ['$http', '$cookies', '$rootScope'];

angular.module('marketplace').factory('AmazonDataFactory', AmazonDataFactory);
}());