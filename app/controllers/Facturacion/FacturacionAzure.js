(function () {
  var FacturacionController = function ($scope, $cookies, FacturacionAzure) {
    $scope.pedidosActualizados = false;
    $scope.pendienteDeActualizar = false;

    const obtenerOrdenes = async () => {
      FacturacionAzure.ordersBillAzure()
        .then(result => {
          if (result.data.consumption.length) {
            subscripcionesActivas(result.data);

            $scope.pedidosActualizados = true;
            pendienteDeActualizar = false;

          } else {
            $scope.pendienteDeActualizar = true;
            $scope.pedidosActualizados = false;
          }
        });
    }

    $scope.actualizarFacturas = () => {
      FacturacionAzure.invoices()
        .then(actualizarReconciliacion())
        .catch(error => $scope.ShowToast(`Error al actualizar facturas: ${error}`, 'danger'));
    }

    const actualizarReconciliacion = () => {
      FacturacionAzure.reconciliationAzurePlan()
        .then( actualizarConsumoReconciliacion())
        .catch(error => $scope.ShowToast(`Error al actualizar detalles de reconciliación: ${error}`, 'danger'));
    }

    const actualizarConsumoReconciliacion = () => {
      FacturacionAzure.updateDetailOrdersAzurePlan()
        .then(obtenerOrdenes())
        .catch(error => $scope.ShowToast(`Error al actualizar consumo: ${error}`, 'danger'));
    }

    const subscripcionesActivas = async (infosubs) => {
      const infoCompleta = [];
      const infoNoCompleta = [];

      const consumo = infosubs.consumption;
      const pedidos = infosubs.orders;


      await consumo.forEach(async sub => {
        const pedidoCompleto = await pedidos.find(pedido => pedido.IdLicencia === sub.IdLicencia);
        pedidoCompleto ? infoCompleta.push({ ...pedidoCompleto, ...sub }) : infoNoCompleta.push(sub);
      });

      actualizarMonitor(infoCompleta);
    }

    const actualizarMonitor = (info) => {
      $scope.monitorCompleto = info;
      $scope.$apply();
    }

    $scope.init = function () {
      obtenerOrdenes();
    };

    $scope.init();
  };

  FacturacionController.$inject = ['$scope', '$cookies', 'FacturacionAzure'];

  angular.module('marketplace').controller('FacturacionController', FacturacionController);
}());
