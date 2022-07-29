/* eslint-disable one-var */
(function () {
  var MonitorMPNController = function ($scope, $log, $location, $cookies, $routeParams, MonitorMPNFactory, $anchorScroll, lodash) {
    const getMonitorData = function () {
      return MonitorMPNFactory.getInfoDistribuidores()
        .then(result => {
          $scope.listaDist = result.data;
          $scope.listaDistAux = result.data;
          pagination();
        })
        .catch(() => {
          $scope.ShowToast('No pudimos cargar la lista de detalles, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const pagination = () => {
      $scope.filtered = [];
      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        let begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;
        $scope.filtered = $scope.listaDist.slice(begin, end);
      });
    };

    $scope.init = function () {
      getMonitorData();
    };

    $scope.init();

    $scope.buscar = function (valor) {
      let resultados = [];
      $scope.listaDistAux.forEach(dist => {
        if (dist.NombreEmpresa.toLowerCase().indexOf(valor.toLowerCase()) >= 0) {
          resultados.push(dist);
        }
      });
      $scope.listaDist = resultados;
      pagination();
    };

    $scope.actializarMPN = function (IdEmpresa, mpn) {
      if (mpn) {
        return MonitorMPNFactory.getMPIDInformation(mpn)
        .then(response => {
          response.data.data.status === 'active' ? $scope.isMPNIDActive = true : $scope.isMPNIDActive = false;
          if ($scope.isMPNIDActive) {
            MonitorMPNFactory.updateMPNID(IdEmpresa, mpn)
              .then(MonitorMPNFactory.updateOrderDetails(IdEmpresa))
              .then(() => {
                $scope.ShowToast('El MPNID ha sido actualizado. Se intentará pedir las ordenes pendientes a Microsoft.', 'success');
                $scope.ShowToast('Recuerda actualizar el MPNID en Intelisis para conservar los cambios.', 'success');
              });
          } else {
            $scope.ShowToast('El MPNID no es válido. El campo no será actualizado.', 'danger');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
      } else {
        $scope.ShowToast('Actualice el valor en la columna MPNID para hacer la actualización.', 'warning');
      }
    };

    $scope.verificarMPN = function (valor) {
      if (valor) {
        return MonitorMPNFactory.getMPIDInformation(valor)
        .then(response => {
          response.data.data.status === 'active' ? $scope.isMPNIDActive = true : $scope.isMPNIDActive = false;
          if ($scope.isMPNIDActive) {
            $scope.partnerName = response.data.data.responseMS.partnerName;
            $scope.ShowToast(`El MPNID corresponde al distribuidor ${$scope.partnerName}`, 'success');
          } else {
            $scope.ShowToast('El MPNID no es válido.', 'danger');
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
      } else {
        $scope.ShowToast('Actualice el valor en la columna MPNID para hacer la validación.', 'warning');
      }
    };
  };

  MonitorMPNController.$inject =
      ['$scope', '$log', '$location', '$cookies', '$routeParams', 'MonitorMPNFactory', '$anchorScroll'];

  angular.module('marketplace').controller('MonitorMPNController', MonitorMPNController);
}());
