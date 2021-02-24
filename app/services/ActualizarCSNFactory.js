(function () {
  var ActualizarCSNFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = () => {
      Session = $cookies.getObject('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getUfsCSN = idEmpresaDistribuidor => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/get-ufs-csn/' + idEmpresaDistribuidor);
    };

    factory.updateUfCSN = (IdEmpresa, csn) => {
      factory.refreshToken();
      return $http.post($rootScope.API + 'autodesk/update-uf-csn', { IdEmpresa, csn });
    };

    factory.getUfCSN = idEmpresaUsuarioFinal => {
      factory.refreshToken();
      return $http.get($rootScope.API + 'autodesk/get-csn/uf/' + idEmpresaUsuarioFinal);
    };

    return factory;
  };
  ActualizarCSNFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('ActualizarCSNFactory', ActualizarCSNFactory);
}());
