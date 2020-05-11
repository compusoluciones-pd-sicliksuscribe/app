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
          $scope.ShowToast('No pudimos cargar la lista de esquemas de renovación, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const getProducts = function () {
      return ImportarPedidosAutodeskFactory.getProducts()
        .then(result => {
          $scope.productosLista = result.data;
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de productos, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const conjuntarDetalles = function () {
      let detalles = [];
      let camposCompletos = true;
      $scope.visible.forEach(function (elemento, index) {
        let detalle = {};
        if (elemento) {
          if ($scope.sku[index] !== '') detalle.SKU = $scope.sku[index];
          else {
            camposCompletos = false;
            $scope.ShowToast('Campo SKU, vacío.', 'danger');
          }
          if ($scope.cantidad[index]) detalle.Cantidad = $scope.cantidad[index];
          else {
            camposCompletos = false;
            $scope.ShowToast('Campo cantidad, vacío.', 'danger');
          }
          if ($scope.cantidadProx[index]) detalle.CantidadProx = $scope.cantidadProx[index];
          else {
            camposCompletos = false;
            $scope.ShowToast('Campo cantidad próxima, vacío.', 'danger');
          }
          detalles.push(detalle);
        }
      });
      if (camposCompletos) $scope.formularioCompleto = true;
      return detalles;
    };

    $scope.init = function () {
      $scope.formularioCompleto = false;
      $scope.visible = [true, false, false, false, false];
      $scope.sku = ['', '', '', '', ''];
      $scope.cantidad = ['', '', '', '', ''];
      $scope.cantidadProx = ['', '', '', '', ''];
      $scope.estadoSKU = [{color: 'rgb(0, 0, 0)'}, {color: 'rgb(0, 0, 0)'}, {color: 'rgb(0, 0, 0)'}, {color: 'rgb(0, 0, 0)'}, {color: 'rgb(0, 0, 0)'}];
      $scope.contadorDetalles = 1;
      $scope.detalles = [];
      getSuppliers();
      getFinalUsers();
      getEsquemas();
      getProducts();
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

    $scope.editar = function (textbox) {
      $scope.estadoSKU[textbox] = {color: 'rgb(0, 0, 0)'};
    };

    $scope.validarSKU = function (sku, textbox) {
      let contador = 0;
      let esUtilizado = false;
      let skuValido = $scope.productosLista.find(function (elemento) {
        return elemento.IdERP === sku;
      });
      $scope.sku.forEach(function (elemento) {
        if (elemento === sku) contador++;
      });
      if (contador > 1) esUtilizado = true;
      if (!skuValido) {
        $scope.estadoSKU[textbox] = {color: 'rgb(230, 6, 6)'};
        $scope.ShowToast('SKU no válido. Revísalo e intenta de nuevo.', 'danger');
      } else if (esUtilizado) {
        $scope.estadoSKU[textbox] = {color: 'rgb(230, 6, 6)'};
        $scope.ShowToast('El SKU ya está siendo utilizado, no puede ser registrado más de una vez.', 'danger');
      } else {
        $scope.estadoSKU[textbox] = {color: 'rgb(5, 192, 86)'};
      }
    };

    $scope.validarEntrada = function (campo, valor) {
      const teclaPresionada = String.fromCharCode(event.keyCode);
      const teclaPresionadaEsUnNumero = Number.isInteger(parseInt(teclaPresionada));
      let cadena = '';
      let esTeclaNoAdmitida;
      if (campo === 'contrato') esTeclaNoAdmitida = !teclaPresionadaEsUnNumero;
      else {
        if (!valor) valor = '';
        teclaPresionada !== '.' ? cadena = valor.concat(teclaPresionada) : cadena = valor;
        esTeclaNoAdmitida = teclaPresionada !== '.' && !teclaPresionadaEsUnNumero;
        if (cadena.indexOf('.') >= 0 && teclaPresionada === '.') esTeclaNoAdmitida = true;
      }
      if (esTeclaNoAdmitida) event.preventDefault();
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
        TipoCambio: parseFloat($scope.tipoCambio),
        Detalles: conjuntarDetalles()
      };
      if ($scope.formularioCompleto) {
        ImportarPedidosAutodeskFactory.importarPedido(infoPedido);
      }
    };

  };

  ImportarPedidosAutodeskController.$inject =
      ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ImportarPedidosAutodeskFactory', 'UsuariosFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ImportarPedidosAutodeskController', ImportarPedidosAutodeskController);
}());
