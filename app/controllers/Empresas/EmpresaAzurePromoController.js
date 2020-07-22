(function () {

    var EmpresaAzurePromoController = function ($scope, $log, $cookies, $location, $uibModal, $filter, EmpresasXEmpresasFactory, EmpresasFactory, NivelesDistribuidorFactory, $routeParams) {
      $scope.MostrarMensajeError = false;
      $scope.Empresas = [];
      $scope.Niveles = [];
      $scope.CreditoDisponible = 0;
  
      var error = function (error) {
        $scope.ShowToast(!error ? 'Ha ocurrido un error, intentelo mas tarde.' : error.message, 'danger');
        $scope.Mensaje = 'No pudimos contectarnos a la base de datos, por favor intenta de nuevo más tarde.';
      };
  
      const getFechaDisplay = function (cancelDate) {
        const cancelDateShort = new Date(cancelDate);
        return cancelDateShort;
      };
  
      function checkDateNull (empresa) {
        const date = new Date();
        const oldDate = date - 365;
        if (empresa.cancelDate <= oldDate) {
          empresa.cancelDate = 'dd/mm/aaaa';
        } else {
          empresa.cancelDate = getFechaDisplay(empresa.cancelDate);
        }
        return empresa;
      }
  
      var obtenerEmpresas = function () {
        EmpresasXEmpresasFactory.getExchangeRateByIdEmpresa($routeParams.IdEmpresa)
          .then(function (respuesta) {        
            var data = respuesta.data;
            var respuestaExitosa = data.success === 1;
            var empresas = data.data;           
            if (respuestaExitosa) {                                    
              var empresasConFormato = empresas.map(function (empresa) {
                const dateNull = checkDateNull(empresa);
                empresa.FechaActivo = new Date(empresa.FechaActivo);
                empresa.cancelDate = getFechaDisplay(dateNull.cancelDate);
                return empresa;
              });
              $scope.Empresas = empresasConFormato;
              $scope.actualizarCantidades();
            }
          })
          .catch(function (result) { error(result.data); });
      };

      
      
    $scope.actualizarCantidades = function (Empresa = undefined) {
      CreditoPorRepartirPorcentaje();
      CreditoRepartidoPorcentaje();
      $scope.CreditoRepartido();
      $scope.CreditoPorRepartir();
      if (Empresa !== undefined) {
        if ($scope.CreditoRepartidoPorcentajeTotal > 100 || Empresa.PorcentajeAzureBudget === undefined) {
          $scope.ShowToast('No puedes repartir una cantidad mayor al 100 %', 'danger');
          Empresa.maxlength = true;
        } else {
          Empresa.maxlength = false;
        }
      }
    };

    var obtenerAzureBudget = function (){
      EmpresasFactory.getBudgetAzureByEnterprise($routeParams.IdEmpresa)
      .success(function (Empresa) {
        if (Empresa.data[0] !== undefined) {
          $scope.Validacion = 1;
          if (Empresa.data[0].Cantidad !== null) {
            $scope.CreditoDisponible = Empresa.data[0].Cantidad;
          } else {
            $scope.CreditoDisponible = 0;
          }
        } else {
          $scope.CreditoDisponible = 0;
          $scope.Validacion = 0;
          $scope.ShowToast('No cuentas con Azure Budget', 'danger');
        }
      })
      .error(function (data, status, headers, config) {
        $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      });
    }
  
      $scope.init = function () {
        obtenerEmpresas();
        obtenerAzureBudget();
      };
  
      $scope.init();
  
      var promoValida = function (promo) {
        return Number(promo) < 7 ? true : false;
      };

      $scope.UpdatePromo = function (empresa) {
          if(promoValida(empresa.DescuentoPromo)) {
            const bodyData = {
                IdEmpresasXEmpresa: empresa.IdEmpresasXEmpresa,
                DescuentoPromo: Number(empresa.DescuentoPromo)
            };
            EmpresasXEmpresasFactory.updateDiscountAzure(bodyData)
              .then(function (response) {
                  if (response.data.success) {
                    $scope.ShowToast('Porcentaje actualizado', 'success');
                  } else {
                    error(response.data)
                  }
              })
              .catch(function (result) { error(result.data); });
          } else {
            $scope.ShowToast('La cantidad no debe ser mayor a 6', 'danger');
          }
      }
      
      $scope.removerPromo = function (empresa) {
        const bodyData = {
            IdEmpresasXEmpresa: empresa.IdEmpresasXEmpresa,
            DescuentoPromo: 0
        };
        EmpresasXEmpresasFactory.updateDiscountAzure(bodyData)
          .then(function (response) {
              if (response.data.success) {
                $scope.ShowToast('Se actulizó el porcentaje', 'success');
                empresa.DescuentoPromo = 0;
              } else {
                error(response.data)
              }
          })
          .catch(function (result) { error(result.data); });
    }

    const CreditoRepartidoPorcentaje = () => {
      let totalAsignadoPorcentaje = 0;

      if ($scope.Empresas !== undefined) {
        $scope.Empresas.map(empresa => {
          if (empresa.PorcentajeAzureBudget != undefined && empresa.PorcentajeAzureBudget != null) {
            totalAsignadoPorcentaje += empresa.PorcentajeAzureBudget;
          }
        });
      }
      $scope.CreditoRepartidoPorcentajeTotal = totalAsignadoPorcentaje;
    };

    const CreditoPorRepartirPorcentaje = () => {
      let totalPorRepartirPorcentaje = 100;
      if ($scope.Empresas !== undefined) {
        $scope.Empresas.map(empresa => {
          if (empresa.PorcentajeAzureBudget != undefined && empresa.PorcentajeAzureBudget != null) {
            totalPorRepartirPorcentaje -= empresa.PorcentajeAzureBudget;
          }
        });
      }
      $scope.PorcentajeAzureBudget = totalPorRepartirPorcentaje;
    };

    $scope.CreditoRepartido = function () {
      $scope.CreditoRepartidoTotal = (($scope.CreditoDisponible * $scope.CreditoRepartidoPorcentajeTotal) / 100).toFixed(4);
    };

    $scope.CreditoPorRepartir = function () {
      $scope.CreditoPorRepartirTotal = (($scope.CreditoDisponible * $scope.PorcentajeAzureBudget) / 100).toFixed(4);
    };

    $scope.ActualizarCredito = function (Empresa) { 
      const EmpresaActualizar = {
        PorcentajeAzureBudget: Empresa.PorcentajeAzureBudget,
        IdEmpresaDistribuidor: parseInt($routeParams.IdEmpresa),
        IdEmpresaUsuarioFinal: Empresa.IdEmpresaUsuarioFinal,
        
      };
      if (EmpresaActualizar.PorcentajeAzureBudget === null) EmpresaActualizar.PorcentajeAzureBudget = 0;

      var total = 0;
      if (Empresa.PorcentajeAzureBudget != undefined && Empresa.PorcentajeAzureBudget != null) {
        if (Empresa.PorcentajeAzureBudget < 0) {
          $scope.ShowToast('Cantidad no válida', 'danger');
          return;
        } else if ($scope.CreditoRepartidoPorcentajeTotal > 100 ) {
          $scope.ShowToast('Sobrepasas el 100 por ciento', 'danger');
          return false;
        } else {
          total += Empresa.PorcentajeAzureBudget;
        }
      } else {
        Empresa.PorcentajeAzureBudget = 0;
      }

      EmpresasXEmpresasFactory.putEmpresasXEmpresaAzureBudget(EmpresaActualizar)
        .success(function (resultado) {
          if (resultado.success === true  || resultado.success === 1) {
            $scope.ShowToast(resultado.message, 'success');
          } else {
            $scope.ShowToast(resultado.message, 'danger');

            $scope.init();
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos actualizar el crédito, por favor intenta de nuevo más tarde', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    };
  
    EmpresaAzurePromoController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'NivelesDistribuidorFactory', '$routeParams'];
  
    angular.module('marketplace').controller('EmpresaAzurePromoController', EmpresaAzurePromoController);
  }());
  