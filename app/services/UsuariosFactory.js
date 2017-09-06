(function () {
  var UsuariosFactory = function ($http, $cookieStore, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookieStore.get('Session');
      if (!Session) { Session = { Token: 'no' }; }
      $http.defaults.headers.common['token'] = Session.Token;
    };

    factory.refreshToken();

    factory.getUsuarios = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Usuarios');
    };

    factory.getUsuario = function (IdUsuario) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Usuarios/' + IdUsuario);
    };

    factory.getCorreo = function (Usuario) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Usuarios/Correo', Usuario);
    };

    factory.postUsuario = function (Usuario) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Usuarios', Usuario);
    };

    factory.postUsuarioCliente = function (Usuario) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'users', Usuario);
    };

    factory.putUsuario = function (Usuario) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'Usuarios', Usuario);
    };

    factory.postUsuarioIniciarSesion = function (usuario) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Usuarios/Login', usuario);
    };

    factory.postRecuperar = function (usuario) {
      factory.refreshToken();
      return $http.post($rootScope.API + 'Usuarios/Recuperar', usuario);
    };

    factory.getCerrarSession = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Usuarios/CerrarSession');
    };

    factory.desbloquearCuenta = function (encryptedObject) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Usuarios/Desbloquear/' + encryptedObject);
    };

    factory.confirmarCuenta = function (encryptedObject) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'Usuarios/ConfirmarCuenta/' + encryptedObject);
    };

    factory.getUsuariosContacto = function (idEmpresaUsuarioFinal) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'users/' + idEmpresaUsuarioFinal);
    };

    factory.getUsuariosPropios = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'users');
    };

    factory.getAccessosParaDistribuidor = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'users-access');
    };

    return factory;
  };

  UsuariosFactory.$inject = ['$http', '$cookieStore', '$rootScope'];

  angular.module('marketplace').factory('UsuariosFactory', UsuariosFactory);
}());

