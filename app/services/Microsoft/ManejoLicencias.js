(function () {
    var ManejoLicencias = function ($http, $cookies, $rootScope) {
      var factory = {};
      var Session = {};
  
      factory.refreshToken = () => {
        Session = $cookies.getObject('Session');
        if (!Session) { Session = { Token: 'no' }; }
        $http.defaults.headers.common['token'] = Session.Token;
      };
  
      factory.cotermByUF = function (IdEmpresaUsuarioFinal) {
        factory.refreshToken();
        return $http.get(`${$rootScope.MAPI}subscriptions/coterm/by/${IdEmpresaUsuarioFinal}`);
      };

      factory.updateStatusAutoRenew = function ( IdCustomer, IdSubscription, Status, IdPedidoDetalle ) {
        factory.refreshToken();
        return $http.post(`${$rootScope.MAPI}subscriptions/updateAutoRenewById`, { IdCustomer, IdSubscription, Status, IdPedidoDetalle });
      };
      
      return factory;
    };
  
    ManejoLicencias.$inject = ['$http', '$cookies', '$rootScope'];
  
    angular.module('marketplace').factory('ManejoLicencias', ManejoLicencias);
  }());