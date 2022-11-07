(function () {
  var ContractSearchFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getContractsData = contracNumber => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/contract-search/get-data/' + contracNumber);
    };

    return factory;
  };

  ContractSearchFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ContractSearchFactory', ContractSearchFactory);
}());
