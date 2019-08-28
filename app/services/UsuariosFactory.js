(function () {
  var UsuariosFactory = function ($http, $cookies, $rootScope) {
    var factory = {};
    var Session = {};

    factory.refreshToken = function () {
      Session = $cookies.getObject('Session');
      if (!Session) Session = { Token: 'no' }
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

    factory.getCorreoTuclick = function (Usuario) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'tuclick/get-email/'+ Usuario.CorreoElectronico);
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

    factory.getUsuariosContactoTuClick = function (idEmpresaUsuarioFinal, currentDistribuidor) {
      factory.refreshToken();
      return $http.get($rootScope.API + 'users/' + idEmpresaUsuarioFinal + '/distribuidor/' + currentDistribuidor);
    };

    factory.getUsuariosPropios = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'users');
    };

    factory.getAccessosParaDistribuidor = function () {
      factory.refreshToken();
      return $http.get($rootScope.API + 'users-access');
    };
    
    
    factory.putDeleteFinalUser = function (IdUsuario) {
      factory.refreshToken();
      console.log("entro aqui",IdUsuario);
      return $http.put($rootScope.API + 'BajaUsuarioFinal/'+ IdUsuario);
  };

    factory.putUpdateFinalUserData = function (finalUser) {
      factory.refreshToken();
      return $http.put($rootScope.API + 'finalUserData/', finalUser);
    };
    return factory;
  };

  UsuariosFactory.$inject = ['$http', '$cookies', '$rootScope'];

  angular.module('marketplace').factory('UsuariosFactory', UsuariosFactory);
}());
