(function () {
    var UsoAzureFactory = function ($http, $cookies, $rootScope) {
      var factory = {};
      var Session = {};
  
      factory.refreshToken = function () {
        Session = $cookies.getObject('Session');
        if (!Session) Session = { Token: 'no' }
        $http.defaults.headers.common['token'] = Session.Token;
      };
  
      factory.refreshToken();
  
      factory.getDataChart = function (chartData) {
        factory.refreshToken();
        return $http.post($rootScope.API + 'azure-usage/records/graphics', chartData);
      };
  
      factory.getEnterprises = function (chartData) {
        factory.refreshToken();
        return $http.post($rootScope.API + 'azure-usage/distributors', chartData);
      };

      return factory;
    };
  
    UsoAzureFactory.$inject = ['$http', '$cookies', '$rootScope'];
  
    angular.module('marketplace').factory('UsoAzureFactory', UsoAzureFactory);
  }());
  