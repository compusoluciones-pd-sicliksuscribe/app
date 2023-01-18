(function () {
  var ContactsFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.insertContact = contact => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/contacts', contact);
    };

    factory.editContact = contact => {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'autodesk/contacts', contact);
    };

    factory.deleteContact = contactId => {
      factory.refreshToken();
      return $http.delete($rootScope.API + 'autodesk/contacts/' + contactId);
    };

    return factory;
  };

  ContactsFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ContactsFactory', ContactsFactory);
}());
