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

    const pagination = (currentPage = 1) => {
      $scope.filtered = [];
      $scope.currentPage = currentPage;
      $scope.numPerPage = 8;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        let begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;
        $scope.filtered = $scope.UFs.slice(begin, end);
        $scope.csnValue = $scope.filtered.map(uf => uf.IdAutodeskUF);
        $scope.mensajeCSN = new Array($scope.filtered.length);
        $scope.color = new Array($scope.filtered.length);
      });
    };

    $scope.init = () => {
      if ($scope.SessionCookie.IdTipoAcceso !== 2) getSuppliers();
      if ($scope.SessionCookie.IdTipoAcceso === 10) $scope.IdEmpresa = $scope.SessionCookie.IdEmpresa;
      if ($scope.SessionCookie.IdTipoAcceso === 2 || $scope.SessionCookie.IdTipoAcceso === 10) $scope.getUfsCSN();
    };

    $scope.getUfsCSN = async () => {
      let idDist;
      $scope.busqueda = '';
      $scope.SessionCookie.IdTipoAcceso === 2 ? idDist = $scope.SessionCookie.IdEmpresa : idDist = $scope.IdEmpresa;
      return ActualizarCSNFactory.getUfsCSN(idDist)
          .then(result => {
            if (result.data.success) {
              $scope.UFs = $scope.ufsCSN = result.data.data;
            } else $scope.ShowToast('No fue posible obtener los csn del los clientes', 'danger');
            pagination($scope.currentPage);
          })
          .catch(() => {
            $scope.ShowToast('No fue posible obtener los csn del los clientes, por favor intenta más tarde.', 'danger');
          });
    };

    $scope.buscar = function () {
      $scope.buscado = $scope.busqueda;
      let resultados = [];
      $scope.ufsCSN.forEach(uf => {
        if (uf.NombreEmpresa.toString().toUpperCase().indexOf($scope.busqueda.toUpperCase()) >= 0) resultados.push(uf);
      });
      $scope.UFs = resultados;
      pagination();
    };

    $scope.updateUfCSN = async (IdEmpresaUf, csn, index) => {
      csn = !csn ? null : csn;
      await validateCSN(csn)
      .then (async (r) => { 
      if (r.estatus) {
        ActualizarCSNFactory.updateUfCSN(IdEmpresaUf, csn)
          .then(async result => {
            result.data.success ? $scope.ShowToast('Información actualizada.', 'success') : $scope.ShowToast('No fue posible actualizar la información', 'danger');
            if (!$scope.busqueda) await $scope.getUfsCSN();
            $scope.mensajeCSN[index] = r.mensaje;
            $scope.color[index] = 'rgb(25,185,50)';
          })
          .catch(() => {  
            $scope.ShowToast('No fue posible actualizar la información, por favor intenta más tarde.', 'danger');
          });
        } else {
          if (!$scope.busqueda) await $scope.getUfsCSN();
             $scope.busqueda =  $scope.buscado;
            $scope.mensajeCSN[index] =  r.mensaje;
            $scope.color[index] = 'rgb(230,8,8)';
            $scope.$apply();
        }
      })
    };

    const validateCSN = async (csn) => {
    if (!csn) return { mensaje: `CSN vacío.`, estatus: false}
    return ActualizarCSNFactory.validateCSN(csn)
      .then(result => {
        if (result.data.success) {
          if (result.data.data.error) return { mensaje: `CSN: ${csn} no válido.`, estatus: false};
          else if (result.data.data.csn) {
            const data = result.data.data;
            return !data.victimCsn ? { mensaje: `CSN: ${csn} válido. Pertenece a ${data.name}`, estatus: true}
            : { mensaje: `CSN: ${csn} víctima. El CSN correcto es ${data.csn}. Pertenece a ${data.name}`, estatus: false};
          } else return { mensaje: `CSN ${csn} no válido.`, estatus: false};
        } else {
          return { mensaje: `CSN ${csn} no válido.`, estatus: false};
        }
      })};

    $scope.init();
  };

  ActualizarCSNController.$inject =
      ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ActualizarCSNFactory', 'ImportarPedidosAutodeskFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ActualizarCSNController', ActualizarCSNController);
}());
