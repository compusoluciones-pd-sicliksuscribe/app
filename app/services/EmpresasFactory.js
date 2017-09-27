(function () {
  var EmpresasFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.validaMail = function (mail) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'validaMail/', { mail: mail });
    };

    factory.getCliente = function (Id) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Importar/', { IdMicrosoft: Id });
    };

    factory.getEmpresas = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Empresas');
    };

    factory.getEmpresasMicrosoft = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Empresa/Microsoft');
    };

    factory.getEmpresa = function (IdEmpresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Empresas/' + IdEmpresa);
    };

    factory.postEmpresa = function (Empresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresas', Empresa);
    };

    factory.postEmpresaMicrosoft = function (ObjMicrosoft) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresa/Microsoft', ObjMicrosoft);
    };

    factory.putEmpresaFormaPago = function (parametros) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas/FormaPago', parametros);
    };

    factory.putEmpresa = function (Empresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas', Empresa);
    };

    factory.revisarDominio = function (Empresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Empresa/Dominio/' + Empresa);
    };

    factory.revisarRFC = function (ObjRFC) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresa/RFC', ObjRFC);
    };

    factory.checkRFC = function (ObjRFC) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresa/check', ObjRFC);
    };

    factory.validarBajaEmpresa = function (Empresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresa/ValidarBajaEmpresa', Empresa);
    };

    factory.postCartaConfirmacion = function (Empresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresas/CartaConfirmacion', Empresa);
    };

    factory.putActualizarNivelDistribuidor = function (Empresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas/NivelDistribuidor', Empresa);
    };

    factory.putActualizarAgenteMarca = function (Empresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas/AgenteMarca', Empresa);
    };

    factory.getMiSitio = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'MiSitio');
    };

    factory.putMiSitio = function (miSitio) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'MiSitio', miSitio);
    };

    factory.getSitio = function (Subdominio) {
      return $http.get($rootScope.API + 'Sitio/' + Subdominio);
    };

    factory.getCreditoDisponibleUF = function (IdEmpresaDistribuidor) {
      return $http.get($rootScope.API + 'CreditoDisponible/' + IdEmpresaDistribuidor);
    };

    factory.getValidarCreditoUF = function (IdEmpresaDistribuidor) {
      return $http.get($rootScope.API + 'ValidarCredito/' + IdEmpresaDistribuidor);
    };

    factory.updateAutomaticPayment = function (RealizarCargoProximo) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'enterprise/update-automatic-payment/' + RealizarCargoProximo);
    };

    factory.getClientes = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'enterprise/clients');
    };

    return factory;
  };

  EmpresasFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('EmpresasFactory', EmpresasFactory);
}());
