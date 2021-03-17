(function () {
  var ActualizarCSNController = function ($scope, $log, $location, $cookies, $routeParams, ActualizarCSNFactory, ImportarPedidosAutodeskFactory, $anchorScroll, lodash) {
    const getSuppliers = () => {
      return ImportarPedidosAutodeskFactory.getAutodeskSuppliers()
        .then(result => {
          $scope.distribuidores = result.data;
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de distribuidores, por favor intenta más tarde.', 'danger');
        });
    };

    const pagination = () => {
      $scope.filtered = [];
      $scope.currentPage = 1;
      $scope.numPerPage = 8;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        let begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;
        $scope.filtered = $scope.UFs.slice(begin, end);
      });
    };

    $scope.init = () => {
      if ($scope.SessionCookie.IdTipoAcceso !== 2) getSuppliers();
      if ($scope.SessionCookie.IdTipoAcceso === 10) $scope.IdEmpresa = $scope.SessionCookie.IdEmpresa;
      if ($scope.SessionCookie.IdTipoAcceso === 2 || $scope.SessionCookie.IdTipoAcceso === 10) $scope.getUfsCSN();
      pagination();
    };

    $scope.getUfsCSN = () => {
      let idDist;
      $scope.busqueda = '';
      $scope.SessionCookie.IdTipoAcceso === 2 ? idDist = $scope.SessionCookie.IdEmpresa : idDist = $scope.IdEmpresa;
      ActualizarCSNFactory.getUfsCSN(idDist)
          .then(result => {
            if (result.data.success) {
              $scope.UFs = $scope.ufsCSN = result.data.data;
              $scope.mensajeCSN = new Array($scope.UFs.length);
            } else $scope.ShowToast('No fue posible obtener los csn del los clientes', 'danger');
            pagination();
          })
          .catch(() => {
            $scope.ShowToast('No fue posible obtener los csn del los clientes, por favor intenta más tarde.', 'danger');
          });
    };

    $scope.buscar = function (valor) {
      let resultados = [];
      $scope.ufsCSN.forEach(uf => {
        if (uf.NombreEmpresa.toString().toUpperCase().indexOf(valor.toUpperCase()) >= 0) resultados.push(uf);
      });
      $scope.UFs = resultados;
      pagination();
    };

    $scope.updateUfCSN = (IdEmpresaUf, csn) => {
      ActualizarCSNFactory.updateUfCSN(IdEmpresaUf, csn)
          .then(result => {
            result.data.success ? $scope.ShowToast('Información actualizada.', 'success') : $scope.ShowToast('No fue posible actualizar la información', 'danger');
          })
          .catch(() => {
            $scope.ShowToast('No fue posible actualizar la información, por favor intenta más tarde.', 'danger');
          });
    };

    $scope.validateCSN = (csn, index) => {
      ActualizarCSNFactory.validateCSN(csn)
      .then(result => {
        if (result.data.success) {
          const data = result.data.data;
          !data.victimCsn ? $scope.mensajeCSN[index] = `CSN valido. Pertenece a ${data.name}`
          : $scope.mensajeCSN[index] = `CSN victima. El CSN correcto es ${data.csn}. Pertenece a ${data.name}`;
        } else $scope.ShowToast('No fue posible actualizar la información', 'danger');
      })
      .catch(() => {
        $scope.ShowToast('No fue posible validar el CSN del cliente, por favor intenta más tarde.', 'danger');
      });
    };

    $scope.init();
  };

  ActualizarCSNController.$inject =
      ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ActualizarCSNFactory', 'ImportarPedidosAutodeskFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ActualizarCSNController', ActualizarCSNController);
}());
