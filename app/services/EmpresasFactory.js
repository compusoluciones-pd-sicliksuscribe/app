(function () {
  var EmpresasFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
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
      return $http.get($rootScope.API + 'microsoft/customers/' + Id);
    };

    factory.getEmpresas = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Empresas');
    };

    factory.getIndustrias = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'enterprise/Industrias');
    };

    factory.getEmpresasMicrosoft = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/customers');
    };

    factory.getEmpresa = function (IdEmpresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Empresas/' + IdEmpresa);
    };

    factory.postEmpresa = function (Empresa) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'enterprise', Empresa);
    };

    factory.postEmpresaMicrosoft = function (ObjMicrosoft) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'enterprise/microsoft', ObjMicrosoft);
    };

    factory.putEmpresaFormaPago = function (parametros) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas/FormaPago', parametros);
    };

    factory.putEmpresaFormaPagoFinalUser = function (parametros) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas/FormaPago/FinalUser', parametros);
    };

    factory.putEmpresaCambiaMoneda = function (parametros) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas/CambiaMoneda', parametros);
    };

    factory.putEmpresaCambiaMonedaFinalUser = function (parametros) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas/CambiaMoneda/FinalUser', parametros);
    };

    factory.putEmpresa = function (Empresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas', Empresa);
    };

    factory.revisarDominio = function (dominio) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'microsoft/domains/' + dominio);
    };

    factory.revisarRFC = function (ObjRFC) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresa/RFC', ObjRFC);
    };

    factory.checkRFC = function (ObjRFC) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Empresa/check', ObjRFC);
    };

    factory.checkRFCImport = function (ObjRFC) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'enterprise/checkImport/' + ObjRFC);
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

    factory.getDetailsUF = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'tuclick/details-uf');
    };

    factory.updateAutomaticPayment = function (RealizarCargoProximo) {
      factory.refreshToken();
      return $http.patch($rootScope.API + 'enterprise/update-automatic-payment/' + RealizarCargoProximo);
    };

    factory.getClientes = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'enterprise/clients');
    };

    factory.putEmpresa = function (Empresa) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Empresas', Empresa);
    };

    factory.changeDomain = function (enterpriseId, Enterprise) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'enterprises/microsoft-domains/' + enterpriseId, Enterprise);
    };

    factory.getDominioMsByIdUF = function (Empresa) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'enterprise/domain-ms/final-user/' + Empresa);
    };

    factory.putActualizarNivelDistribuidorMicrosoft = function (parametros) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'enterprises/level-descount-microsoft', parametros);
    };

    return factory;
  };

  EmpresasFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('EmpresasFactory', EmpresasFactory);
}());
