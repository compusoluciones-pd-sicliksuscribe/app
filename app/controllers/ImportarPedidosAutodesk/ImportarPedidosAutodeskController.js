(function () {
  var ImportarPedidosAutodeskController = function ($scope, $log, $location, $cookies, $routeParams, ImportarPedidosAutodeskFactory, UsuariosFactory, $anchorScroll, lodash) {
    const getSuppliers = function () {
      return ImportarPedidosAutodeskFactory.getAutodeskSuppliers()
        .then(result => {
          $scope.distribuidoresLista = result.data;
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de distribuidores, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const getFinalUsers = function () {
      return ImportarPedidosAutodeskFactory.getAutodeskUF()
        .then(result => {
          $scope.ufsLista = result.data;
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de usuarios finales, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const getEsquemas = function () {
      return ImportarPedidosAutodeskFactory.getRenovationScheme()
        .then(result => {
          $scope.esquemasLista = result.data;
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de esquema de renovación, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const conjuntarDetalles = function () {
      let detalles = [];
      $scope.visible.forEach(function (elemento, index) {
        let detalle = {};
        if (elemento) {
          detalle.SKU = $scope.sku[index];
          detalle.Cantidad = $scope.cantidad[index];
          detalle.CantidadProx = $scope.cantidadProx[index];
          detalles.push(detalle);
        }
      });
      return detalles;
    };

    $scope.init = function () {
      $scope.visible = [true, false, false, false, false];
      $scope.sku = ['', '', '', '', ''];
      $scope.cantidad = ['', '', '', '', ''];
      $scope.cantidadProx = ['', '', '', '', ''];
      $scope.contadorDetalles = 1;
      $scope.detalles = [];
      getSuppliers();
      getFinalUsers();
      getEsquemas();
    };

    $scope.init();

    $scope.completarDist = function (cadenaDist = '') {
      let resultado = [];
      $scope.resultadoDistribuidor = [];

      $scope.ocultarOpcionesDist = false;
      $scope.distribuidoresLista.forEach(distribuidor => {
        if (distribuidor.NombreEmpresa.toLowerCase().indexOf(cadenaDist.toLowerCase()) >= 0) {
          resultado.push(distribuidor.NombreEmpresa);
          $scope.resultadoDistribuidor.push(distribuidor);
        }
        if (cadenaDist === '') {
          $scope.ocultarOpcionesDist = true;
        }
      });
      $scope.filtroDistribuidor = resultado;
    };

    $scope.llenarTextBoxDist = function (infoDist) {
      $scope.distribuidor = infoDist;
      $scope.distribuidorSeleccionado = $scope.resultadoDistribuidor.find(elemento => elemento.NombreEmpresa === infoDist);
      $scope.ocultarOpcionesDist = true;
      $scope.ufsListaAux = $scope.ufsLista.filter(uf => uf.IdEmpresaDistribuidor === $scope.distribuidorSeleccionado.IdEmpresa);
      $scope.usuarioF = '';
    };

    $scope.completarUF = function (cadenaUF = '') {
      let resultado = [];
      $scope.resultadoUF = [];
      if ($scope.ufsListaAux) {
        $scope.ocultarOpcionesUF = false;
        $scope.ufsListaAux.forEach(uf => {
          if (uf.NombreEmpresa.toLowerCase().indexOf(cadenaUF.toLowerCase()) >= 0) {
            resultado.push(uf.NombreEmpresa);
            $scope.resultadoUF.push(uf);
          }
          if (cadenaUF === '') {
            $scope.ocultarOpcionesUF = true;
          }
        });
        $scope.filtroUsuarioFinal = resultado;
      };
    };

    $scope.llenarTextBoxUF = function (infoUF) {
      $scope.usuarioF = infoUF;
      $scope.ufSeleccionado = $scope.resultadoUF.find(elemento => elemento.NombreEmpresa === infoUF);
      $scope.ocultarOpcionesUF = true;
      UsuariosFactory.getUsuariosContactoTuClick($scope.ufSeleccionado.IdEmpresa, $scope.distribuidorSeleccionado.IdEmpresa)
        .then(result => {
          $scope.contactosLista = result.data.data;
          $scope.contactos = $scope.contactosLista;
        });
    };

    $scope.definirPeriodo = function () {
      if ($scope.fechaInicio && $scope.esquema) {
        const MENSUAL = 1;
        const ANUAL = 2;
        const CADA2ANIOS = 4;
        const CADA3ANIOS = 5;
        $scope.fechaFin = new Date();
        switch ($scope.esquema.IdEsquemaRenovacion) {
          case MENSUAL:
            $scope.fechaFin.setMonth($scope.fechaInicio.getMonth() + 1);
            break;
          case ANUAL:
            $scope.fechaFin.setFullYear($scope.fechaInicio.getFullYear() + 1);
            break;
          case CADA2ANIOS:
            $scope.fechaFin.setFullYear($scope.fechaInicio.getFullYear() + 2);
            break;
          case CADA3ANIOS:
            $scope.fechaFin.setFullYear($scope.fechaInicio.getFullYear() + 3);
            break;
          default:
            $scope.fechaFin = new Date();
        }
        $scope.fechaFin.setDate($scope.fechaInicio.getDate() - 1);
      }
    };

    $scope.agregarProducto = function () {
      for (let contador = 0; contador < $scope.visible.length; contador++) {
        if (!$scope.visible[contador]) {
          $scope.visible[contador] = true;
          break;
        }
      }
    };

    $scope.quitarProducto = function () {
      for (let contador = $scope.visible.length - 1; contador > 0; contador--) {
        if ($scope.visible[contador]) {
          $scope.visible[contador] = false;
          break;
        }
      }
    };

    $scope.conjuntarInformacion = function () {
      const infoPedido = {
        IdEmpresaDistribuidor: $scope.distribuidorSeleccionado.IdEmpresa,
        IdEmpresaUsuarioFinal: $scope.ufSeleccionado.IdEmpresa,
        NumeroContrato: $scope.contrato,
        IdUsuarioContacto: $scope.contacto.IdUsuario,
        CorreoContacto: $scope.contacto.CorreoElectronico,
        FechaInicio: $scope.fechaInicio,
        FechaFin: $scope.fechaFin,
        IdFormaPago: $scope.formaPago,
        MonedaPago: $scope.monedaPago,
        IdEsquemaRenovacion: $scope.esquema.IdEsquemaRenovacion,
        TipoCambio: $scope.tipoCambio,
        Detalles: conjuntarDetalles()
      };
    };
  };

  ImportarPedidosAutodeskController.$inject =
      ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ImportarPedidosAutodeskFactory', 'UsuariosFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ImportarPedidosAutodeskController', ImportarPedidosAutodeskController);
}());
