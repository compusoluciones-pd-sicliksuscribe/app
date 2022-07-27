/* eslint-disable eqeqeq */
(function () {
  var EmpresasCompletarController = function ($scope, $log, $location, $cookies, $routeParams, EmpresasFactory, EmpresasXEmpresasFactory, EstadosFactory, UsuariosFactory, UsuariosXEmpresasFactory) {
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
    $scope.selectIndustrias = {};

    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.CheckCookie();
      EmpresasFactory.getEmpresa(IdEmpresaDistribuidor)
        .then(Empresa => {
          $scope.EmpresaD = Empresa.data[0];
          $scope.Combo.TipoRFC = [{
            Nombre: 'Persona Física'
          }, {
            Nombre: 'Persona Moral'
          }];
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });

      EmpresasFactory.getCliente(IdMicrosoft)
        .then(Empresa => {
          if (!$scope.direccionValida(Empresa.data.defaultAddress)) {
            $scope.ShowToast('El cliente no cuenta con toda la información para ser importado, actualiza sus datos entrando a partner center ', 'danger');
            return;
          }
          $scope.direccionValidada = true;
          DatosMicrosoft = Empresa.data;
          if (!Empresa.data.email) {
            $scope.MostrarCorreo = true;
          } else {
            $scope.MostrarCorreo = false;
            $scope.Empresa.CorreoContacto = Empresa.data.email;
            $scope.validiaMail(Empresa.data.email);
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });

      EmpresasFactory.getIndustrias()
      .then(result => {
        $scope.selectIndustrias = result.data.data;
      })
      .catch(error => {
        $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
      });
    };

    $scope.init();

    $scope.direccionValida = function (direccion) {
      if (direccion.addressLine1 && direccion.city && direccion.country && direccion.phoneNumber &&
        direccion.postalCode && direccion.state) return true;
      return false;
    };

    $scope.validiaMail = function (email, callMeMaybe) {
      EmpresasFactory.validaMail(email)
        .then(mail => {
          if (mail.data.data[0].Existe === 1) {
            $scope.MostrarCorreo = true;
            $scope.CorreoRepetido = true;
          } else {
            $scope.CorreoRepetido = false;
            $scope.MostrarCorreo = false;
          }
          if (callMeMaybe) {
            callMeMaybe();
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.intentaImportar = function () {
      $scope.validiaMail($scope.Empresa.CorreoContacto, $scope.EmpresaImportar);
    };
    $scope.EmpresaImportar = function () {
      $scope.ValidarRFC();
      if ($scope.Empresa.MonedaPago !== 'Pesos' && $scope.Empresa.MonedaPago !== 'Dólares') {
        return $scope.ShowToast('Selecciona una moneda de pago.', 'danger');
      }
      // eslint-disable-next-line eqeqeq
      if ($scope.Empresa.IdFormaPagoPredilecta != 1 && $scope.Empresa.IdFormaPagoPredilecta != 2) {
        return $scope.ShowToast('Selecciona una forma de pago.', 'danger');
      }
      // eslint-disable-next-line eqeqeq
      if ($scope.Empresa.MonedaPago === 'Dólares' && $scope.Empresa.IdFormaPagoPredilecta == 1) {
        return $scope.ShowToast('Para pagar con tarjeta es necesario que la moneda sea Pesos.', 'danger');
      }

      var ObjRFC = {
        RFC: $scope.Empresa.RFC
      };
      EmpresasFactory.revisarRFC(ObjRFC)
        .then(result => {
          if (result.data[0].Success === 1) {
            $scope.frm.RFC.$invalid = true;
            $scope.frm.RFC.$pristine = false;
            $scope.mensajerfc = result.data[0].Message;

            EmpresasFactory.checkRFCImport($scope.Empresa.RFC)
            .then(result => {
              const empresaxempresa = result.data.datosUf.empresaXEmpresa[0];
              const empresaexist = result.data.datosUf.validateExist[0];
              if (IdEmpresaDistribuidor == empresaxempresa.IdEmpresaDistribuidor) {
                $scope.abrirModal('avisoModal');
              } else if (empresaexist.idEmpresa) {
                $scope.abrirModal('confirmarModal');
              }
            });
          } else {
            $scope.importar();
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.importar = function () {
      UsuariosXEmpresasFactory.getUsuariosXEmpresa(IdEmpresaDistribuidor)
      .then(UsuariosXEmpresas => {
        if (UsuariosXEmpresas.data.length === 0) {
          $scope.ShowToast('Agrega un administrador, para el distribuidor.', 'danger');
        } else {
          var ObjMicrosoft = {
            RFC: $scope.Empresa.RFC,
            NombreEmpresa: DatosMicrosoft.companyName,
            Direccion: DatosMicrosoft.defaultAddress.addressLine1,
            Ciudad: DatosMicrosoft.defaultAddress.city,
            Estado: DatosMicrosoft.defaultAddress.state,
            CodigoPostal: DatosMicrosoft.defaultAddress.postalCode,
            NombreContacto: DatosMicrosoft.firstName,
            ApellidoPaterno: DatosMicrosoft.lastName,
            CorreoElectronico: $scope.Empresa.CorreoContacto,
            TelefonoContacto: DatosMicrosoft.defaultAddress.phoneNumber,
            ZonaImpuesto: 'Normal',
            Lada: '52',
            IdMicrosoftUF: IdMicrosoft,
            DominioMicrosoftUF: Dominio,
            IdIndustria: $scope.Empresa.IdIndustria,
            IdEmpresaDistribuidor: IdEmpresaDistribuidor,
            IdUsuario: UsuariosXEmpresas.data[0].IdUsuario,
            MonedaPago: $scope.Empresa.MonedaPago,
            IdFormaPagoPredilecta: $scope.Empresa.IdFormaPagoPredilecta,
            ImportarOrdenes: $scope.Empresa.importarOrdenes
          };
          EmpresasFactory.postEmpresaMicrosoft(ObjMicrosoft)
            .then(() => {
              $location.path('/Empresas');
              $scope.ShowToast('Se está importando la empresa, por favor espere ', 'success');
            })
            .catch(error => {
              $scope.ShowToast(error.message, 'danger');
              $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
            });
        }
      })
      .catch(error => {
        $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
      });
    };

    function isNumeric (num) {
      return !isNaN(num);
    }

    $scope.EmpresaCancel = function () {
      $location.path('/Empresas/Importar/' + IdEmpresaDistribuidor);
    };

    $scope.ValidarRFC = function () {
      EmpresasFactory.checkRFC({ RFC: $scope.Empresa.RFC })
        .then(result => {
          if (result.data[0].Success === 1) {
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
            $scope.valido = true;
            $scope.frm.RFC.$invalid = false;
            $scope.mensajerfc = 'Este RFC ya está registrado como distribuidor.';
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };
    $scope.abrirModal = function (modal) {
      document.getElementById(modal).style.display = 'block';
    };
    $scope.cerrarModal = function (modal) {
      document.getElementById(modal).style.display = 'none';
    };
    $scope.ComboRFC = function () {
      EmpresasFactory.checkRFC({ RFC: $scope.Empresa.RFC })
        .then(result => {
          if (result.data[0].Success === 1) {
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
            $scope.mensajerfc = 'Este RFC ya está registrado como distribuidor.';
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };
  };

  EmpresasCompletarController.$inject = ['$scope', '$log', '$location', '$cookies', '$routeParams', 'EmpresasFactory', 'EmpresasXEmpresasFactory', 'EstadosFactory', 'UsuariosFactory', 'UsuariosXEmpresasFactory'];

  angular.module('marketplace').controller('EmpresasCompletarController', EmpresasCompletarController);
}());
