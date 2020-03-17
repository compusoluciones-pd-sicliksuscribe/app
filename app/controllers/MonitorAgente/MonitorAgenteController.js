/* eslint-disable no-return-assign */
(function () {
  var MonitorAgenteController = function ($scope, $log, $location, $cookies, $routeParams, MonitorAgenteFactory, $anchorScroll, lodash) {

    const getFilteredByKey = function (key, value) {
      return $scope.listaAux.filter(function (e) {
        return e[key] === value;
      });
    };
    $scope.filtrar = (campo, valor) => {
      let filtro = {};
      let enArreglo = false;
      let posicion = -1;
      filtro.campo = campo;
      filtro.valor = valor;
      for (let i = 0; i < $scope.filtros.length; i++) {
        if ($scope.filtros[i].campo === campo) {
          enArreglo = true;
          if (valor !== null) {
            $scope.filtros[i].valor = valor;
          } else {
            posicion = i;
          }
          break;
        } else {
          enArreglo = false;
        }
      };
      if (posicion >= 0) {
        $scope.filtros.splice(posicion, 1);
      }
      if (!enArreglo) {
        $scope.filtros.push(filtro);
      }
      $scope.listaAux = $scope.lista;
      $scope.filtros.forEach(element => {
        $scope.listaAux = getFilteredByKey(element.campo, element.valor);
      });
      actualizarCamposFiltro();
      pagination();
    };

    const getMonitorData = function () {
      return MonitorAgenteFactory.getOrdersMonitor()
        .then(result => {
          $scope.lista = result.data.data;
          $scope.listaAux = $scope.lista;
          $scope.filtros = [];
          actualizarCamposFiltro();
          pagination();
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de detalles, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const actualizarCamposFiltro = () => {
      $scope.distribuidores = [];
      $scope.ufs = [];
      $scope.esquemas = [];
      $scope.agentes = [];
      $scope.listaAux.forEach(element => {
        if ($scope.distribuidores.indexOf(element.Distribuidor) === -1) {
          $scope.distribuidores.push(element.Distribuidor);
        }
        if ($scope.ufs.indexOf(element.UsuarioFinal) === -1) {
          $scope.ufs.push(element.UsuarioFinal);
        }
        if ($scope.agentes.indexOf(element.Agente) === -1) {
          $scope.agentes.push(element.Agente);
        }
        if ($scope.esquemas.indexOf(element.EsquemaRenovacion) === -1) {
          $scope.esquemas.push(element.EsquemaRenovacion);
        }
      });
    }

    const pagination = () => {
      $scope.filtered = [];
      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        let begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;
        $scope.filtered = $scope.listaAux.slice(begin, end);
        
      });
    };

    $scope.init = function () {
      getMonitorData();
    };

    $scope.init();
  };

  MonitorAgenteController.$inject =
    ['$scope', '$log', '$location', '$cookies', '$routeParams', 'MonitorAgenteFactory', '$anchorScroll'];

  angular.module('marketplace').controller('MonitorAgenteController', MonitorAgenteController);
}());
