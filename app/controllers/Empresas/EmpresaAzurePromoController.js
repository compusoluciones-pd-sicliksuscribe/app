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
            }
          })
          .catch(function (result) { error(result.data); });
    };

    $scope.init = function () {
      obtenerEmpresas();
    };

    $scope.init();

    var promoValida = function (promo) {
      return Number(promo) < 7;
    };

    $scope.UpdatePromo = function (empresa) {
      if (promoValida(empresa.DescuentoPromo)) {
        const bodyData = {
          IdEmpresasXEmpresa: empresa.IdEmpresasXEmpresa,
          DescuentoPromo: Number(empresa.DescuentoPromo)
        };
        EmpresasXEmpresasFactory.updateDiscountAzure(bodyData)
              .then(function (response) {
                if (response.data.success) {
                  $scope.ShowToast('Porcentaje actualizado', 'success');
                } else {
                  error(response.data);
                }
              })
              .catch(function (result) { error(result.data); });
      } else {
        $scope.ShowToast('La cantidad no debe ser mayor a 6', 'danger');
      }
    };

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
              error(response.data);
            }
          })
          .catch(function (result) { error(result.data); });
    };
  };

  EmpresaAzurePromoController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'NivelesDistribuidorFactory', '$routeParams'];

  angular.module('marketplace').controller('EmpresaAzurePromoController', EmpresaAzurePromoController);
}());
