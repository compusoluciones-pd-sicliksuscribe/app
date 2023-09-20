(function () {
  var EmpresasReadController = function ($scope, $log, $location, $cookies, EmpresasFactory, NivelesDistribuidorFactory) {
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.TablaVisible = false;
    $scope.cambiaAgente = false;
    $scope.cambiaAgenteAutodesk = false;

    const STATUS_ADENDUM = {
      TRUE: true,
      ACCEPTED: 1,
      DENIED: 0
    };
    
    const ERROR_CODE_AZURE = {
      ACCEPTED: 'Estado de Adendum actualizado',
      DENIED: 'No se pudo Actualizar su estado'
    };

    const IDENTIFIERS = {
      SUCCESS: 'success',
      DANGER: 'danger'
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.Empresas = null;
      $scope.TablaVisible = false;
      $scope.cambiaAgente = false;
      $scope.cambiaAgenteAutodesk = false;

      NivelesDistribuidorFactory.getNivelesDistribuidor()
        .success(function (NivelesDistribuidor) {
          if (NivelesDistribuidor.success) {
            $scope.selectNivelesDistribuidor = NivelesDistribuidor.data;
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.BajaEmpresa = function (index, IdEmpresa) {
      var Datos = { IdEmpresa: IdEmpresa, Activo: 0 };
      EmpresasFactory.validarBajaEmpresa(Datos)
        .success(function (result) {
          if (result[0].Success == true) {
            $scope.Empresas.splice(index, 1);
            EmpresasFactory.putEmpresa(Datos)
              .success(function (result) {
                if (result[0].Success == false) {
                  $scope.ShowToast(result[0].Message, 'danger');
                } else {
                  $scope.ShowToast('Empresa dada de baja', 'success');
                }
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          } else {
            $scope.ShowToast(result[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.BuscarEmpresas = function (busqueda) {
      EmpresasFactory.getEmpresa($scope.Empresa.Busqueda)
        .success(function (Empresas) {
          if (Empresas) {
            try {
              if (Empresas[0].Success == false || Empresas.length == null || Empresas.length == 'undefined') {
                $scope.Empresas = null;
                $scope.TablaVisible = false;
              } else {
                $scope.Empresas = Empresas;
                if ($scope.Empresas.length > 0) {
                  for (let i = 0; i < $scope.Empresas.length; i++) {
                    EmpresasFactory.getTerminosNuevoComercio($scope.Empresas[i].IdEmpresa)
                    .success(result => {
                      result.Firma === 1 ?
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
        .error(function (data, status, headers, config) {
          $scope.TablaVisible = false;
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarConfirmacionCarta = function (Empresa) {
      var CartaConfirmacion1;
      var CartaConfirmacion2;
      if (Empresa.CartaConfirmacion1 == true || Empresa.CartaConfirmacion1 == 1) { CartaConfirmacion1 = 1; } else { CartaConfirmacion1 = 0; }
      if (Empresa.CartaConfirmacion2 == true || Empresa.CartaConfirmacion2 == 1) { CartaConfirmacion2 = 1; } else { CartaConfirmacion2 = 0; }
      var parametros = { IdEmpresa: Empresa.IdEmpresa, CartaConfirmacion1: CartaConfirmacion1, CartaConfirmacion2: CartaConfirmacion2 };
      EmpresasFactory.postCartaConfirmacion(parametros)
        .success(function (result) {
          if (result.success) {
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarTerminosMicrosoft = function (Empresa) {
      EmpresasFactory.postTerminosNuevoComercio(Empresa)
        .success(function (result) {
          $scope.ShowToast('Estado de terminos actualizado', 'success');
        })
    }

    $scope.ActualizarAdendumMS = function (Empresa) {
      var AdendumAzureMSCheck;
      if (Empresa.AdendumAzure == STATUS_ADENDUM.TRUE || Empresa.AdendumAzure == STATUS_ADENDUM.ACCEPTED) { AdendumAzureMSCheck = STATUS_ADENDUM.DENIED; } else { AdendumAzureMSCheck = STATUS_ADENDUM.ACCEPTED; }
      var parametros = { IdEmpresa: Empresa.IdEmpresa, AdendumAzure: AdendumAzureMSCheck };
      EmpresasFactory.postActualizarAdendumMS(parametros)
        .success(function (result) {
          $scope.ShowToast(ERROR_CODE_AZURE.ACCEPTED, IDENTIFIERS.SUCCESS);
        })
        .error(function(result){
          $scope.ShowToast(ERROR_CODE_AZURE.DENIED,  IDENTIFIERS.DANGER);
        })
    }

    $scope.ActualizarIdNivelDistribuidor = function (Empresa) {
      var parametros = { IdEmpresa: Empresa.IdEmpresa, IdNivelDistribuidor: Empresa.IdNivelDistribuidor };
      EmpresasFactory.putActualizarNivelDistribuidor(parametros)
        .success(function (result) {
          if (result.success) {
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.ActualizarIdNivelDistribuidorMicrosoft = function (Empresa) {
      var parametros = { IdEmpresa: Empresa.IdEmpresa, IdNivelDistribuidor: Empresa.IdNivelDistribuidorMicrosoft };
      EmpresasFactory.putActualizarNivelDistribuidorMicrosoft(parametros)
        .success(function (result) {
          if (result.success) {
            $scope.ShowToast(result.message, 'success');
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        }
      )
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
      };

    $scope.ActualizarAgentes = function (Empresa) {
      var parametros = { IdEmpresa: Empresa.IdEmpresa, AgenteMicrosoft: Empresa.AgenteMicrosoft, AgenteAutodesk: Empresa.AgenteAutodesk, AgenteAutodeskRenovacion: Empresa.AgenteAutodeskRenovacion ,AgenteAmazon : Empresa.AgenteAmazon };
      if (typeof Empresa.AgenteMicrosoft === 'undefined' || typeof Empresa.AgenteAutodesk === 'undefined' || typeof Empresa.AgenteAutodeskRenovacion === 'undefined'|| typeof Empresa.AgenteAmazon === 'undefined') {
        $scope.ShowToast('El nombre del agente solo debe contener letras y una longitud menor a 10 caracteres.', 'danger');
      } else {
        EmpresasFactory.putActualizarAgenteMarca(parametros)
          .success(function (result) {
            if (result.success) {
              $scope.ShowToast(result.message, 'success');
              Empresa.cambiaAgente = false;
              Empresa.cambiaAgenteAutodesk = false;
            } else {
              $scope.ShowToast(result.message, 'danger');
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
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
