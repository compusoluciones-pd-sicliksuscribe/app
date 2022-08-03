/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
(function () {
  var RegistrarEmpresaTuclickController = function ($scope, $log, $cookies, $location, EmpresasFactory, EstadosFactory, UsuariosFactory) {
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

    $scope.Estados = [
      { id: 'AG', name: 'Aguascalientes' },
      { id: 'BC', name: 'Baja California' },
      { id: 'BS', name: 'Baja California Sur' },
      { id: 'CH', name: 'Chihuahua' },
      { id: 'CL', name: 'Colima' },
      { id: 'CM', name: 'Campeche' },
      { id: 'CS', name: 'Chiapas' },
      { id: 'CO', name: 'Coahuila' },
      { id: 'DF', name: 'CDMX' },
      { id: 'DG', name: 'Durango' },
      { id: 'GT', name: 'Guanajuato' },
      { id: 'GR', name: 'Guerrero' },
      { id: 'HG', name: 'Hidalgo' },
      { id: 'JA', name: 'Jalisco' },
      { id: 'MX', name: 'México' },
      { id: 'MI', name: 'Michoacán' },
      { id: 'MO', name: 'Morelos' },
      { id: 'NA', name: 'Nayarit' },
      { id: 'NL', name: 'Nuevo León' },
      { id: 'OA', name: 'Oaxaca' },
      { id: 'PU', name: 'Puebla' },
      { id: 'QT', name: 'Querétaro' },
      { id: 'QR', name: 'Quintana Roo' },
      { id: 'SI', name: 'Sinaloa' },
      { id: 'SO', name: 'Sonora' },
      { id: 'TB', name: 'Tabasco' },
      { id: 'TM', name: 'Tamaulipas' },
      { id: 'TL', name: 'Tlaxcala' },
      { id: 'VE', name: 'Veracruz' },
      { id: 'YU', name: 'Yucatán' },
      { id: 'ZA', name: 'Zacatecas' },
      { id: 'SL', name: 'San Luis Potosí' }
    ];

    $scope.tel = function () {
      if ($scope.Empresa.TelefonoContacto.length == 10) {
        var value = $scope.Empresa.TelefonoContacto;
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
    };

    $scope.change = function () {
      $scope.Empresa.DominioMicrosoft = $scope.Empresa.DominioMicrosoft.trim();
      if ($scope.Empresa.DominioMicrosoft) {
        EmpresasFactory.revisarDominio($scope.Empresa.DominioMicrosoft)
          .then(result => {
            if (result === 'false') {
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
    };

    $scope.EmpresaCreate = function () {
      $scope.Empresa.IdEmpresaDistribuidor = $scope.currentDistribuidor.IdEmpresa;
      UsuariosFactory.getCorreoTuclick($scope.Empresa)
        .then(result => {
          if (!result.data.success) {
            $scope.AlertaDominio = result.data.message;
          } else {
            if ($scope.frm.NombreEmpresa.$invalid == true) {
              $scope.frm.NombreEmpresa.$pristine = false;
            }
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
            $scope.loading = true;
            $scope.Empresa.Formulario = true;
            EmpresasFactory.postEmpresaTuclick($scope.Empresa)
              .then(result => {
                if (result.data.success) {
                  document.getElementById('formulario').innerHTML = '<div style="align:center;"><h4>' + result.data.message + '</h4></div>';
                  $scope.ShowToast(result.data.message, 'success');
                } else {
                  $scope.ShowToast(result.data.message, 'danger');
                }
              })
              .catch(error => {
                $scope.ShowToast(error.data.message, 'danger');
              });
          }
        })
        .catch(error => {
        });
    };

    $scope.EmpresaCancel = function () {
      $location.path('/Clientes');
    };
  };

  RegistrarEmpresaTuclickController.$inject = ['$scope', '$log', '$cookies', '$location', 'EmpresasFactory', 'EstadosFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('RegistrarEmpresaTuclickController', RegistrarEmpresaTuclickController);
}());
