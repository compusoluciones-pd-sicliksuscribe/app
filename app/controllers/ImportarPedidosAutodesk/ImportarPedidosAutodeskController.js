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
      else $scope.formularioCompleto = false;
      return detalles;
    };

    const reiniciarCamposSKU = function () {
      $scope.visible = [true, false, false, false, false];
      $scope.sku = ['', '', '', '', ''];
      $scope.cantidad = ['', '', '', '', ''];
      $scope.cantidadProx = ['', '', '', '', ''];
      $scope.estadoSKU = [{color: 'rgb(0, 0, 0)'}, {color: 'rgb(0, 0, 0)'}, {color: 'rgb(0, 0, 0)'}, {color: 'rgb(0, 0, 0)'}, {color: 'rgb(0, 0, 0)'}];
    };

    const vaciarFormulario = function () {
      reiniciarCamposSKU();
      $scope.distribuidor = '';
      $scope.usuarioF = '';
      $scope.contrato = '';
      $scope.contacto = '';
      $scope.esquema = '';
      $scope.fechaInicio = '';
      $scope.fechaFin = '';
      $scope.formaPago = '';
      $scope.monedaPago = '';
    };

    const esFechaInicioValida = function () {
      const hoy = new Date();
      return $scope.fechaInicio <= hoy;
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

    $scope.definirPeriodo = function (reiniciar = false) {
      const campoFechaInicio = reiniciar;
      if (campoFechaInicio) {
        $scope.fechaFin = '';
        $scope.fechaInicio = '';
      }
      if ($scope.fechaInicio && $scope.esquema) {
        const auxFechaInicio = new Date($scope.fechaInicio);
        if (esFechaInicioValida()) {
          const ANUAL = 2;
          const CADA2ANIOS = 4;
          const CADA3ANIOS = 5;
          switch ($scope.esquema.IdEsquemaRenovacion) {
            case ANUAL:
              $scope.fechaFin = $scope.fechaInicio;
              $scope.fechaFin.setFullYear($scope.fechaInicio.getFullYear() + 1);
              $scope.fechaInicio = auxFechaInicio;
              break;
            case CADA2ANIOS:
              $scope.fechaFin = $scope.fechaInicio;
              $scope.fechaFin.setFullYear($scope.fechaInicio.getFullYear() + 2);
              $scope.fechaInicio = auxFechaInicio;
              break;
            case CADA3ANIOS:
              $scope.fechaFin = $scope.fechaInicio;
              $scope.fechaFin.setFullYear($scope.fechaInicio.getFullYear() + 3);
              $scope.fechaInicio = auxFechaInicio;
              break;
            default:
              $scope.fechaFin = $scope.fechaInicio;
              $scope.fechaInicio = auxFechaInicio;
          }
          $scope.fechaFin.setDate($scope.fechaInicio.getDate() - 1);
        } else {
          $scope.ShowToast('La fecha inicio no puede ser mayor al día de hoy.', 'danger');
          $scope.fechaFin = '';
          $scope.fechaInicio = '';
        }
      }
    };

    $scope.obtenerSKUs = function (NumeroContrato) {
      ImportarPedidosAutodeskFactory.getSKUData(NumeroContrato)
        .then(result => {
          if (result.data.data) {
            $scope.ShowToast(result.data.data.message, 'danger');
            reiniciarCamposSKU();
          } else {
            reiniciarCamposSKU();
            result.data.forEach((element, index) => {
              $scope.visible[index] = true;
              $scope.sku[index] = element.sku;
              $scope.cantidad[index] = element.quantity;
              $scope.validarSKU(element.sku, index);
            });
          }
        });
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
        $scope.ShowToast('SKU no válido. Es posible que no esté registrado en ClickSuscribe.', 'danger');
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
        Detalles: conjuntarDetalles()
      };
      if ($scope.formularioCompleto) {
        ImportarPedidosAutodeskFactory.importarPedido(infoPedido)
          .then(result => {
            if (result.data.data.error === 1) {
              $scope.ShowToast(result.data.data.message, 'danger');
            } else {
              $scope.ShowToast(`La información se ha importado en el pedido ${result.data.data.IdPedido}.`, 'success');
              vaciarFormulario();
            }
          })
          .catch(result => {
            $scope.ShowToast('Hubo un error durante la importación del pedido.', 'danger');
          });
      }
    };
  };

  ImportarPedidosAutodeskController.$inject =
      ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ImportarPedidosAutodeskFactory', 'UsuariosFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ImportarPedidosAutodeskController', ImportarPedidosAutodeskController);
}());
