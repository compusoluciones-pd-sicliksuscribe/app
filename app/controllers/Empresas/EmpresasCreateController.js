/* eslint-disable eqeqeq */
(function () {
  var EmpresasCreateController = function ($scope, $log, $cookies, $location, EmpresasFactory, EstadosFactory, UsuariosFactory) {
    $scope.Empresa = {};
    $scope.AlertaDominio = '';
    $scope.Empresa.IdERP = null;
    $scope.Combo = {};
    $scope.loading = false;
    $scope.Empresa.Formulario = false;
    $scope.Empresa.TelefonoContacto = '';
    $scope.Empresa.TelefonoContacto2 = '';
    $scope.valido;
    $scope.mensajerfc = '';
    $scope.aceptarButton = true;
    $scope.selectIndustrias = {};

    $scope.init = function () {
      $scope.CheckCookie();

      EstadosFactory.getEstados()
        .then(result => {
          $scope.Combo.EstadoOptions = result.data;
          $scope.Combo.TipoRFC = [{ Nombre: 'Persona Física' }, { Nombre: 'Persona Moral' }];
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });

      $scope.Empresa.Lada = 52;

      EmpresasFactory.getIndustrias()
        .then(result => {
          $scope.selectIndustrias = result.data.data;
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init();

    $scope.tel = function () {
      if ($scope.Empresa.TelefonoContacto.length == 10) {
        var value = $scope.Empresa.TelefonoContacto;
        // eslint-disable-next-line no-unused-vars
        var country, city, number;

        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);

        number = number.slice(0, 3) + '-' + number.slice(3);
        $scope.Empresa.TelefonoContacto2 = (' (' + city + ') ' + number).trim();
      }
    };

    function isNumeric (num) {
      return !isNaN(num);
    }

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

    $scope.change = function () {
      $scope.Empresa.DominioMicrosoft = $scope.Empresa.DominioMicrosoft.trim();
      if ($scope.Empresa.DominioMicrosoft) {
        EmpresasFactory.revisarDominio($scope.Empresa.DominioMicrosoft)
          .then(result => {
            if (result.data === false) {
              $scope.frm.DominioMicrosoft.$pristine = false;
              $scope.frm.DominioMicrosoft.$invalid = true;
              $scope.Empresa.MensajeDominio = 'Ya existe el dominio, Intenta con uno diferente.';
            } else {
              $scope.frm.DominioMicrosoft.$pristine = true;
              $scope.frm.RFC.$invalid = false;
              $scope.aceptarButton = true;
            }
          })
          .catch(error => {
            $scope.ShowToast(error.message, 'danger');
            $scope.aceptarButton = false;
          });
      }
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

    $scope.EmpresaCreate = function () {
      UsuariosFactory.getCorreo($scope.Empresa)
        .then(result => {
          if (result.data[0].Success == 0) {
            $scope.AlertaDominio = 'El Correo ya está registrado, intenta con un correo diferente.';
          } else {
            if ($scope.frm.NombreEmpresa.$invalid == true) {
              $scope.frm.NombreEmpresa.$pristine = false;
            }
              // if ($scope.frm.DominioMicrosoft.$invalid == true) {
              //   $scope.frm.DominioMicrosoft.$pristine = false;
              //   $scope.Empresa.MensajeDominio = 'Ingresa un Dominio.';
              // }
            if ($scope.frm.Direccion1.$invalid == true) {
              $scope.frm.Direccion1.$pristine = false;
            }
            if ($scope.frm.RFC.$invalid == true) {
              $scope.frm.RFC.$pristine = false;
            }
            if ($scope.frm.Ciudad.$invalid == true) {
              $scope.frm.Ciudad.$pristine = false;
            }
            if ($scope.Empresa.Estado == undefined) {
              $scope.frm.Estado.$pristine = false;
            }
            if ($scope.frm.Postal.$invalid == true) {
              $scope.frm.Postal.$pristine = false;
            }
            if ($scope.frm.Nombre.$invalid == true) {
              $scope.frm.Nombre.$pristine = false;
            }
            if ($scope.frm.Apellidos.$invalid == true) {
              $scope.frm.Apellidos.$pristine = false;
            }
            if ($scope.frm.CorreoElectronico.$invalid == true) {
              $scope.frm.CorreoElectronico.$pristine = false;
            }
            if ($scope.frm.Telefono.$invalid == true) {
              $scope.frm.Telefono.$pristine = false;
            }
            if (!$scope.Empresa.DominioMicrosoft || $scope.Empresa.DominioMicrosoft === '') {
              delete $scope.Empresa.DominioMicrosoft;
            }
            console.log($scope.Empresa);
            $scope.loading = true;
            $scope.Empresa.Formulario = true;
            EmpresasFactory.postEmpresa($scope.Empresa)
                .then(result => {
                  var re, me, dat;
                  if (result.data[0]) {
                    re = result.data[0].Success;
                    me = result.data[0].Message;
                    dat = result.data[0].Dato;
                  } else {
                    re = result.data.success;
                    me = result.data.message;
                    dat = result.data.dato;
                  }
                  if (re) {
                    $scope.loading = false;
                    $location.path('/Clientes');
                  } else {
                    $scope.ShowToast(me, 'danger');
                    $scope.loading = false;
                    $scope.Empresa.Formulario = false;

                    if (dat == 20002) {
                      $scope.Empresa.DominioMicrosoft = '';
                      $scope.AlertaDominio = 'El dominio Microsoft ya existe, intenta con uno diferente.';
                    }
                  }
                })
                .catch(error => {
                  $scope.ShowToast(error.message, 'danger');
                });
          }
        })
        .catch(error => {
          $log.log(error);
        });
    };

    $scope.EmpresaCancel = function () {
      $location.path('/Clientes');
    };
  };

  EmpresasCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'EmpresasFactory', 'EstadosFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('EmpresasCreateController', EmpresasCreateController);
}());
