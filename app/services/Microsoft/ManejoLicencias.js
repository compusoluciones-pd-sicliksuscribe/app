(function () {
    var ManejoLicencias = function ($http, $cookies, $rootScope) {
      var factory = {};
      var Session = {};
  
      factory.refreshToken = () => {
        Session = $cookies.getObject('Session');
        if (!Session) { Session = { Token: 'no' }; }
        $http.defaults.headers.common['token'] = Session.Token;
      };
  
      factory.cotermByUF = function (IdEmpresaUsuarioFinal,idDis) {
        factory.refreshToken();
        return $http.get(`${$rootScope.MAPI}subscriptions/coterm/by/${idDis}/${IdEmpresaUsuarioFinal}`);
      };

      factory.GetMicrosoftID = function (IdEmpresaDistribuidor) {
        factory.refreshToken();
        return $http.get(`${$rootScope.MAPI}subscriptions/microsoftMPN/by/${IdEmpresaDistribuidor}`);
      };

      factory.updateStatusAutoRenew = function ( IdCustomer, IdSubscription, Status, IdPedidoDetalle, Cantidad, CantidadProxima) {
        factory.refreshToken();
        return $http.post(`${$rootScope.MAPI}subscriptions/updateAutoRenewById`, { IdCustomer, IdSubscription, Status, IdPedidoDetalle, Cantidad, CantidadProxima });
      };

      factory.updateQuantityRenew = function ( IdCustomer, IdSubscription, CantidadProxima ) {
        factory.refreshToken();
        return $http.post(`${$rootScope.MAPI}subscriptions/updateQuantityRenewById`, { IdCustomer, IdSubscription, CantidadProxima });
      };
        
      return factory;
    };
  
    ManejoLicencias.$inject = ['$http', '$cookies', '$rootScope'];
  
    angular.module('marketplace').factory('ManejoLicencias', ManejoLicencias);
  }());