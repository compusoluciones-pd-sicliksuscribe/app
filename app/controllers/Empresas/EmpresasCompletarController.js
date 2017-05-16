(function () {
  var EmpresasCompletarController = function ($scope, $log, $location, $cookieStore, $routeParams, EmpresasFactory, EmpresasXEmpresasFactory, EstadosFactory, UsuariosFactory, UsuariosXEmpresasFactory) {
    var IdEmpresaDistribuidor = $routeParams.IdEmpresa;
    var IdMicrosoft = $routeParams.IdMicrosoft;
    var Dominio = $routeParams.Dominio;
    var DatosMicrosoft;
    $scope.Name = $routeParams.Name;
    $scope.mensajerfc = '';
    $scope.mensajeL = '';
    $scope.Combo = {};
    $scope.Empresa = {};
    $scope.Empresa.Lada = '52';
    $scope.MostrarCorreo = false;
    $scope.CorreoRepetido = false;
    $scope.direccionValidada = false;

    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.CheckCookie();
      EmpresasFactory.getEmpresa(IdEmpresaDistribuidor)
        .success(function (Empresa) {
          $scope.EmpresaD = Empresa[0];
          $scope.Combo.TipoRFC = [{
            Nombre: 'Persona Física'
          }, {
            Nombre: 'Persona Moral'
          }];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EmpresasFactory.getCliente(IdMicrosoft)
        .success(function (Empresa) {
          if (!$scope.direccionValida(Empresa.default_address)) {
            $scope.ShowToast('El cliente no cuenta con toda la información para ser importado, actualiza sus datos entrando a partner center ', 'danger');
            return;
          }
          $scope.direccionValidada = true;
          DatosMicrosoft = Empresa;
          if (!Empresa.email) {
            $scope.MostrarCorreo = true;
          } else {
            $scope.MostrarCorreo = false;
            $scope.Empresa.CorreoContacto = Empresa.email;
            $scope.validiaMail(Empresa.email);
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.direccionValida = function (direccion) {
      if (direccion.address_line1 && direccion.city && direccion.country && direccion.phone_number
        && direccion.postal_code && direccion.region) return true;
      return false;
    };

    $scope.validiaMail = function (email, callMeMaybe) {
      EmpresasFactory.validaMail(email)
        .success(function (mail) {
          if (mail.data[0].Existe === 1) {
            $scope.MostrarCorreo = true;
            $scope.CorreoRepetido = true;
          } else {
            $scope.CorreoRepetido = false;
            $scope.MostrarCorreo = false;
          }
          if (callMeMaybe && $scope.CorreoRepetido === false) {
            callMeMaybe();
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.intentaImportar = function () {
      $scope.validiaMail($scope.Empresa.CorreoContacto, $scope.EmpresaImportar);
    };
    $scope.EmpresaImportar = function () {
      $scope.ValidarRFC();
      var ObjRFC = {
        RFC: $scope.Empresa.RFC
      };
      EmpresasFactory.revisarRFC(ObjRFC)
        .success(function (result) {
          if (result[0].Success === 1) {
            $scope.frm.RFC.$invalid = true;
            $scope.frm.RFC.$pristine = false;
            $scope.mensajerfc = result[0].Message;
          } else {
            UsuariosXEmpresasFactory.getUsuariosXEmpresa(IdEmpresaDistribuidor)
              .success(function (UsuariosXEmpresas) {
                if (UsuariosXEmpresas.length === 0) {
                  $scope.ShowToast('Agrega un administrador, para el distribuidor.', 'danger');
                } else {         
                  var ObjMicrosoft = {
                    RFC: $scope.Empresa.RFC,
                    NombreEmpresa: DatosMicrosoft.company_name,
                    Direccion: DatosMicrosoft.default_address.address_line1,
                    Ciudad: DatosMicrosoft.default_address.city,
                    Estado: DatosMicrosoft.default_address.region,
                    CodigoPostal: DatosMicrosoft.default_address.postal_code,
                    NombreContacto: DatosMicrosoft.first_name || DatosMicrosoft.default_address.first_name,
                    ApellidosContacto: DatosMicrosoft.last_name || DatosMicrosoft.default_address.last_name,
                    CorreoContacto: $scope.Empresa.CorreoContacto,
                    TelefonoContacto: DatosMicrosoft.default_address.phone_number,
                    ZonaImpuesto: 'Normal',
                    Lada: '52',
                    IdMicrosoftUF: IdMicrosoft,
                    DominioMicrosoftUF: Dominio,
                    IdEmpresaDistribuidor: IdEmpresaDistribuidor,
                    IdUsuario: UsuariosXEmpresas[0].IdUsuario
                  };                  
                  EmpresasFactory.postEmpresaMicrosoft(ObjMicrosoft)
                    .success(function (result) {
                      $location.path("/Empresas");
                      $scope.ShowToast('Se esta importando la empresa, por favor espere ', 'success');
                    })
                    .error(function (data, status, headers, config) {
                      $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                    });
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    function isNumeric(num) {
      return !isNaN(num);
    }

    $scope.EmpresaCancel = function () {
      $location.path('/Empresas/Importar/' + IdEmpresaDistribuidor);
    };

    $scope.ValidarRFC = function () {
      EmpresasFactory.checkRFC({ RFC: $scope.Empresa.RFC })
        .success(function (result) {
          if (result[0].Success === 1) {
            for (var i = 0; i < $scope.Empresa.RFC.length; i++) {
              if ($scope.Empresa.RFC[i] == '-' || $scope.Empresa.RFC[i] == ' ' || $scope.Empresa.RFC[i] == '/' || $scope.Empresa.RFC[i] == '.' || $scope.Empresa.RFC[i] == ',') {
                $scope.frm.RFC.$invalid = true;
                $scope.frm.RFC.$pristine = false;
                $scope.valido = false;
                $scope.mensajerfc = 'El RFC es Incorrecto';
              } else {
                $scope.valido = true;
                $scope.frm.RFC.$invalid = false;

                if ($scope.Empresa.TipoRFC == undefined) {
                  $scope.frm.RFC.$invalid = true;
                  $scope.frm.RFC.$pristine = false;
                  $scope.mensajerfc = 'Selecciona un tipo RFC';
                } else {
                  $scope.valido = true;
                  $scope.frm.RFC.$invalid = false;
                  if ($scope.Empresa.TipoRFC === 'Persona Física') {
                    if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true || isNumeric($scope.Empresa.RFC[3]) === true) {
                      $scope.frm.RFC.$invalid = true;
                      $scope.frm.RFC.$pristine = false;
                      $scope.valido = false;
                      $scope.mensajerfc = 'Los primeros 4 digitos deben ser letras.';
                    } else {
                      if ($scope.Empresa.RFC.length != '13') {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'El RFC debe tener 13 digitos.';
                      } else {
                        $scope.valido = true;
                        $scope.frm.RFC.$invalid = false;
                      }
                    }
                  }

                  if ($scope.Empresa.TipoRFC === 'Persona Moral') {
                    if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true) {
                      $scope.frm.RFC.$invalid = true;
                      $scope.frm.RFC.$pristine = false;
                      $scope.valido = false;
                      $scope.mensajerfc = 'Los primeros 3 digitos deben ser letras.';
                    } else {
                      if ($scope.Empresa.RFC.length != '12') {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'El RFC debe tener 12 digitos.';
                      } else {
                        $scope.valido = true;
                        $scope.frm.RFC.$invalid = false;
                      }
                    }
                  }
                }
              }
            }
          } else {
            $scope.frm.RFC.$invalid = true;
            $scope.frm.RFC.$pristine = false;
            $scope.valido = false;
            $scope.mensajerfc = 'Este RFC ya esta registrado como distribuidor.';
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ComboRFC = function () {
      EmpresasFactory.checkRFC({ RFC: $scope.Empresa.RFC })
        .success(function (result) {
          if (result[0].Success === 1) {
            if ($scope.Empresa.TipoRFC == undefined) {
              $scope.frm.RFC.$invalid = true;
              $scope.frm.RFC.$pristine = false;
              $scope.valido = false;
              $scope.mensajerfc = 'Selecciona un tipo RFC';
            } else {
              $scope.valido = true;
              $scope.frm.RFC.$invalid = false;
              if ($scope.Empresa.RFC != undefined) {
                for (var i = 0; i < $scope.Empresa.RFC.length; i++) {
                  if ($scope.Empresa.RFC[i] == '-' || $scope.Empresa.RFC[i] == ' ' || $scope.Empresa.RFC[i] == '/' || $scope.Empresa.RFC[i] == '.' || $scope.Empresa.RFC[i] == ',') {
                    $scope.frm.RFC.$invalid = true;
                    $scope.frm.RFC.$pristine = false;
                    $scope.valido = false;
                    $scope.mensajerfc = 'El RFC es Incorrecto';
                  } else {
                    $scope.frm.RFC.$invalid = false;
                    $scope.valido = true;

                    if ($scope.Empresa.TipoRFC === 'Persona Física') {
                      if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true || isNumeric($scope.Empresa.RFC[3]) === true) {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'Los primeros 4 digitos deben ser letras.';
                      } else {
                        if ($scope.Empresa.RFC.length != '13') {
                          $scope.frm.RFC.$invalid = true;
                          $scope.frm.RFC.$pristine = false;
                          $scope.valido = false;
                          $scope.mensajerfc = 'El RFC debe tener 13 digitos.';
                        } else {
                          $scope.valido = true;
                          $scope.frm.RFC.$invalid = false;
                        }
                      }
                    }

                    if ($scope.Empresa.TipoRFC === 'Persona Moral') {
                      if (isNumeric($scope.Empresa.RFC[0]) === true || isNumeric($scope.Empresa.RFC[1]) === true || isNumeric($scope.Empresa.RFC[2]) === true) {
                        $scope.frm.RFC.$invalid = true;
                        $scope.frm.RFC.$pristine = false;
                        $scope.valido = false;
                        $scope.mensajerfc = 'Los primeros 3 digitos deben ser letras.';
                      } else {
                        if ($scope.Empresa.RFC.length != '12') {
                          $scope.frm.RFC.$invalid = true;
                          $scope.frm.RFC.$pristine = false;
                          $scope.valido = false;
                          $scope.mensajerfc = 'El RFC debe tener 12 digitos.';
                        } else {
                          $scope.valido = true;
                          $scope.frm.RFC.$invalid = false;
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            $scope.frm.RFC.$invalid = true;
            $scope.frm.RFC.$pristine = false;
            $scope.valido = false;
            $scope.mensajerfc = 'Este RFC ya esta registrado como distribuidor.';
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  };

  EmpresasCompletarController.$inject = ['$scope', '$log', '$location', '$cookieStore', '$routeParams', 'EmpresasFactory', 'EmpresasXEmpresasFactory', 'EstadosFactory', 'UsuariosFactory', 'UsuariosXEmpresasFactory'];

  angular.module('marketplace').controller('EmpresasCompletarController', EmpresasCompletarController);
} ());
