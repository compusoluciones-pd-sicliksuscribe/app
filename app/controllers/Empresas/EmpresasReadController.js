(function () {
  var EmpresasReadController = function ($scope, $log, $location, $cookies, EmpresasFactory, NivelesDistribuidorFactory) {
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.TablaVisible = false;
    $scope.cambiaAgente = false;
    $scope.cambiaAgenteAutodesk = false;

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.Empresas = null;
      $scope.TablaVisible = false;
      $scope.cambiaAgente = false;
      $scope.cambiaAgenteAutodesk = false;

      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .then(NivelesDistribuidor => {
          if (NivelesDistribuidor.data.success) {
            $scope.selectNivelesDistribuidor = NivelesDistribuidor.data.data;
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init();

    $scope.BajaEmpresa = function (index, IdEmpresa) {
      var Datos = { IdEmpresa: IdEmpresa, Activo: 0 };
      EmpresasFactory.validarBajaEmpresa(Datos)
        .then(result => {
          if (result.data[0].Success == true) {
            $scope.Empresas.splice(index, 1);
            EmpresasFactory.putEmpresa(Datos)
              .then(result => {
                if (result.data[0].Success == false) {
                  $scope.ShowToast(result.data[0].Message, 'danger');
                } else {
                  $scope.ShowToast('Empresa dada de baja', 'success');
                }
              })
              .catch(error => {
                $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
              });
          } else {
            $scope.ShowToast(result.data[0].Message, 'danger');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.BuscarEmpresas = function (busqueda) {
      EmpresasFactory.getEmpresa($scope.Empresa.Busqueda)
        .then(Empresas => {
          if (Empresas) {
            try {
              if (Empresas.data[0].Success == false || Empresas.data.length == null || Empresas.data.length == 'undefined') {
                $scope.Empresas = null;
                $scope.TablaVisible = false;
              } else {
                $scope.Empresas = Empresas.data;
                if ($scope.Empresas.length > 0) {
                  for (let i = 0; i < $scope.Empresas.length; i++) {
                    EmpresasFactory.getTerminosNuevoComercio($scope.Empresas[i].IdEmpresa)
                    .then(result => {
                      result.data.Firma === 1 ?
                        $scope.Empresas[i].CartaTerminosMicrosoft = 1: 
                        $scope.Empresas[i].CartaTerminosMicrosoft = 0;
                    });
                  };
                  $scope.TablaVisible = true;
                } else {
                  $scope.Empresas = null;

                  $scope.TablaVisible = false;
                }
              }
            } catch (error) {
              $scope.Empresas = null;
              $scope.TablaVisible = false;
            }
          } else {
            $scope.Empresas = null;

            $scope.TablaVisible = false;
          }
        })
        .catch(error => {
          $scope.TablaVisible = false;
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.ActualizarConfirmacionCarta = function (Empresa) {
      var CartaConfirmacion1;
      var CartaConfirmacion2;
      if (Empresa.CartaConfirmacion1 == true || Empresa.CartaConfirmacion1 == 1) { CartaConfirmacion1 = 1; } else { CartaConfirmacion1 = 0; }
      if (Empresa.CartaConfirmacion2 == true || Empresa.CartaConfirmacion2 == 1) { CartaConfirmacion2 = 1; } else { CartaConfirmacion2 = 0; }
      var parametros = { IdEmpresa: Empresa.IdEmpresa, CartaConfirmacion1: CartaConfirmacion1, CartaConfirmacion2: CartaConfirmacion2 };
      EmpresasFactory.postCartaConfirmacion(parametros)
        .then(result => {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
          } else {
            $scope.ShowToast(result.data.message, 'danger');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.ActualizarTerminosMicrosoft = function (Empresa) {
      EmpresasFactory.postTerminosNuevoComercio(Empresa)
        .then(result => {
          $scope.ShowToast('Estado de terminos actualizado', 'success');
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.ActualizarIdNivelDistribuidor = function (Empresa) {
      var parametros = { IdEmpresa: Empresa.IdEmpresa, IdNivelDistribuidor: Empresa.IdNivelDistribuidor };
      EmpresasFactory.putActualizarNivelDistribuidor(parametros)
        .then(result => {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
          } else {
            $scope.ShowToast(result.data.message, 'danger');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.ActualizarIdNivelDistribuidorMicrosoft = function (Empresa) {
      var parametros = { IdEmpresa: Empresa.IdEmpresa, IdNivelDistribuidor: Empresa.IdNivelDistribuidorMicrosoft };
      EmpresasFactory.putActualizarNivelDistribuidorMicrosoft(parametros)
        .then(result => {
          if (result.data.success) {
            $scope.ShowToast(result.data.message, 'success');
          } else {
            $scope.ShowToast(result.data.message, 'danger');
          }
        }
      )
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.ActualizarAgentes = function (Empresa) {
      var parametros = { IdEmpresa: Empresa.IdEmpresa, AgenteMicrosoft: Empresa.AgenteMicrosoft, AgenteAutodesk: Empresa.AgenteAutodesk, AgenteAutodeskRenovacion: Empresa.AgenteAutodeskRenovacion, AgenteAmazon: Empresa.AgenteAmazon };
      if (typeof Empresa.AgenteMicrosoft === 'undefined' || typeof Empresa.AgenteAutodesk === 'undefined' || typeof Empresa.AgenteAutodeskRenovacion === 'undefined' || typeof Empresa.AgenteAmazon === 'undefined') {
        $scope.ShowToast('El nombre del agente solo debe contener letras y una longitud menor a 10 caracteres.', 'danger');
      } else {
        EmpresasFactory.putActualizarAgenteMarca(parametros)
          .then(result => {
            if (result.data.success) {
              $scope.ShowToast(result.data.message, 'success');
              Empresa.cambiaAgente = false;
              Empresa.cambiaAgenteAutodesk = false;
            } else {
              $scope.ShowToast(result.data.message, 'danger');
            }
          })
          .catch(error => {
            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          });
      }
    };
    $scope.cambiarBoton = function (Empresa) {
      Empresa.cambiaAgente = true;
    };

    $scope.cambiarBotonAutodesk = function (Empresa) {
      Empresa.cambiaAgenteAutodesk = true;
    };
  };

  EmpresasReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'EmpresasFactory', 'NivelesDistribuidorFactory'];

  angular.module('marketplace').controller('EmpresasReadController', EmpresasReadController);
}());
