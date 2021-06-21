(function () {
  var ImportarPedidosAutodeskController = function ($scope, $log, $location, $cookies, $routeParams, ImportarPedidosAutodeskFactory, UsuariosFactory, EstadosFactory, EmpresasFactory, $anchorScroll, lodash) {

    $scope.getSubscriptionData = function (resellerCsn, contractEndDate) {
      if (resellerCsn && contractEndDate) {
        return ImportarPedidosAutodeskFactory.getSubscriptionData(resellerCsn, contractEndDate)
        .then(result => {
          if (result.data.data.length > 0) {
            $scope.subscriptionData = result.data.data;
          } else {
            $scope.subscriptionData = [];
            $scope.ShowToast('No obtuvimos resultados para la fecha especificada.', 'warning');
          }
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de suscripciones, por favor intenta de nuevo más tarde.', 'danger');
        });
      } else {
        $scope.ShowToast('Completa los parametros de busqueda.', 'info');
      }
    };

    const getCSN = () => {
      return ImportarPedidosAutodeskFactory.getCSN($scope.SessionCookie.IdEmpresa)
        .then(result => {
          if (result.data.success) {
            $scope.CSNdist = result.data.data.CSN;
          } else {
            $scope.ShowToast('No pudimos cargar el CSN de distribuidor.', 'danger');
          }
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar el CSN de distribuidor, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

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

    const getEstados = function () {
      EstadosFactory.getEstados()
      .success(function (result) {
        $scope.EstadoOptions = result;
      })
      .error(function (data, status, headers, config) {
        $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      });
    };

    const getIndustrias = function () {
      EmpresasFactory.getIndustrias()
      .success(function (result) {
        $scope.selectIndustrias = result.data;
      })
      .error(function (data, status, headers, config) {
        $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      });
    };

    const getContactos = IdEmpresaUsuarioFinal => {
      ImportarPedidosAutodeskFactory.getContactos(IdEmpresaUsuarioFinal)
        .success(result => {
          $scope.Contactos = result.data;
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    const vaciarFormulario = function () {
      $scope.distribuidorSeleccionado = undefined;
      $scope.ufSeleccionado = undefined;
      $scope.contrato = undefined;
      $scope.FechaInicio = undefined;
      $scope.FechaFin = undefined;
      $scope.esquema = undefined;
      $scope.SKUsDetails = undefined;
      $scope.distribuidor = undefined;
      $scope.usuarioF = undefined;
    };

    const esFechaInicioValida = function () {
      const hoy = new Date();
      return $scope.fechaInicio <= hoy;
    };

    const limipiarModalContacto = function () {
      $scope.Usuario.Empresauf = undefined;
      $scope.Usuario.Distribuidor = undefined;
      $scope.Usuario.Nombre = undefined;
      $scope.Usuario.ApellidoPaterno = undefined;
      $scope.Usuario.ApellidoMaterno = undefined;
      $scope.Usuario.CorreoElectronico = undefined;
      $scope.Usuario.Lada = undefined;
      $scope.Usuario.Telefono = undefined;
    };

    const limipiarModalEmpresa = function () {
      $scope.Empresa.Distribuidor = undefined;
      $scope.Empresa.NombreEmpresa = undefined;
      $scope.Empresa.Direccion = undefined;
      $scope.Empresa.Ciudad = undefined;
      $scope.Empresa.Estado = undefined;
      $scope.Empresa.CodigoPostal = undefined;
      $scope.Empresa.IdIndustria = undefined;
      $scope.Empresa.Nombre = undefined;
      $scope.Empresa.ApellidoPaterno = undefined;
      $scope.Empresa.RFC = undefined;
      $scope.Empresa.CorreoElectronico = undefined;
      $scope.Empresa.Lada = undefined;
      $scope.Empresa.Telefono = undefined;
      $scope.Empresa.IdAutodeskUF = undefined;
    };

    const limipiarModalImportacion = function () {
      $scope.Contrato.Distribuidor = undefined;
      $scope.Contrato.Empresauf = undefined;
      $scope.Contrato.NumeroContrato = undefined;
      $scope.Contrato.IdUsuarioContacto = undefined;
      $scope.numerosSerie = [];
    };

    $scope.init = function () {
      $scope.formularioCompleto = false;
      $scope.contadorDetalles = 1;
      $scope.detalles = [];
      $scope.btnImportar = 'Importar';
      $scope.esDistribuidor = false;
      if ($scope.SessionCookie.IdTipoAcceso === 2) {
        getCSN();
        $scope.esDistribuidor = true;
      } else {
        getSuppliers();
      }
      getFinalUsers();
      getEsquemas();
      getIndustrias();
      getEstados();
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
      let auxDistribuidor = {};
      if ($scope.SessionCookie.IdTipoAcceso === 2) {
        auxDistribuidor = {
          IdAutodeskDist: $scope.CSNdist,
          IdEmpresa: $scope.SessionCookie.IdEmpresa,
          NombreEmpresa: $scope.SessionCookie.NombreEmpresa
        };
      } else {
        $scope.distribuidor = infoDist;
      }
      $scope.distribuidorSeleccionado = $scope.SessionCookie.IdTipoAcceso === 2 ? auxDistribuidor : $scope.resultadoDistribuidor.find(elemento => elemento.NombreEmpresa === infoDist);
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

    $scope.conjuntarInformacion = function () {
      $scope.procesandoImportacion = false;
      if ($scope.distribuidorSeleccionado && $scope.ufSeleccionado && $scope.esquema) {
        $scope.procesandoImportacion = true;
        $scope.btnImportar = 'Procesando...';
        const infoPedido = {
          IdEmpresaDistribuidor: $scope.distribuidorSeleccionado.IdEmpresa,
          IdEmpresaUsuarioFinal: $scope.ufSeleccionado.IdEmpresa,
          NumeroContrato: $scope.contrato,
          FechaInicio: $scope.FechaInicio,
          FechaFin: $scope.FechaFin,
          IdEsquemaRenovacion: $scope.esquema.IdEsquemaRenovacion,
          Detalles: $scope.SKUsDetails
        };
        ImportarPedidosAutodeskFactory.importarPedido(infoPedido)
            .then(result => {
              $scope.procesandoImportacion = false;
              $scope.btnImportar = 'Importar';
              if (result.data.data.error === 1) {
                $scope.ShowToast(result.data.data.message, 'danger');
              } else {
                $scope.ShowToast(`La información se ha importado en el pedido ${result.data.data.IdPedido}.`, 'success');
                vaciarFormulario();
                $scope.cerrarModal('importarContrato');
              }
            })
            .catch(result => {
              $scope.procesandoImportacion = false;
              $scope.btnImportar = 'Importar';
              $scope.ShowToast('Hubo un error durante la importación del pedido.', 'danger');
            });
      } else {
        $scope.ShowToast('Llena todos los campos del formulario para completar la importación.', 'info');
      }
    };

    $scope.abrirModal = function (modal, subs) {
      if ($scope.SessionCookie.IdTipoAcceso === 2) $scope.llenarTextBoxDist($scope.SessionCookie.NombreEmpresa);
      $scope.contrato = subs.contractNumber;
      $scope.FechaInicio = subs.startDate;
      $scope.FechaFin = subs.endDate;
      $scope.SKUsDetails = subs.details;
      document.getElementById(modal).style.display = 'block';
    };

    $scope.cerrarModal = function (modal) {
      document.getElementById(modal).style.display = 'none';
      getFinalUsers();
      vaciarFormulario();
    };

    $scope.completarDistModal = function (cadenaDist = '') {
      let resultado = [];
      $scope.resultadoDistribuidorModal = [];
      $scope.ocultarOpcionesDistModal = false;
      $scope.distribuidoresLista.forEach(distribuidor => {
        if (distribuidor.NombreEmpresa.toLowerCase().indexOf(cadenaDist.toLowerCase()) >= 0) {
          resultado.push(distribuidor.NombreEmpresa);
          $scope.resultadoDistribuidorModal.push(distribuidor);
        }
        if (cadenaDist === '') $scope.ocultarOpcionesDistModal = true;
      });
      $scope.filtroDistribuidorModal = resultado;
    };

    $scope.llenarTextBoxDistModal = function (infoDist) {
      $scope.Usuario.Distribuidor = infoDist;
      $scope.distribuidorSeleccionadoModal = $scope.resultadoDistribuidorModal.find(elemento => elemento.NombreEmpresa === infoDist);
      $scope.ocultarOpcionesDistModal = true;
      $scope.ufsListaAuxModal = $scope.ufsLista.filter(uf => uf.IdEmpresaDistribuidor === $scope.distribuidorSeleccionadoModal.IdEmpresa);
      $scope.Usuario.Empresauf = '';
    };

    $scope.completarUFModal = function (cadenaUF = '') {
      let resultado = [];
      $scope.resultadoUFModal = [];
      if ($scope.ufsListaAuxModal) {
        $scope.ocultarOpcionesUFModal = false;
        $scope.ufsListaAuxModal.forEach(uf => {
          if (uf.NombreEmpresa.toLowerCase().indexOf(cadenaUF.toLowerCase()) >= 0) {
            resultado.push(uf.NombreEmpresa);
            $scope.resultadoUFModal.push(uf);
          }
          if (cadenaUF === '') {
            $scope.ocultarOpcionesUFModal = true;
          }
        });
        $scope.filtroUsuarioFinalModal = resultado;
      };
    };

    $scope.llenarTextBoxUFModal = function (infoUF) {
      $scope.Usuario.Empresauf = infoUF;
      $scope.ufSeleccionadoModal = $scope.resultadoUFModal.find(elemento => elemento.NombreEmpresa === infoUF);
      $scope.ocultarOpcionesUFModal = true;
    };

    $scope.conjuntarInformacionModal = function () {
      const ADMIN_END_USER = 4;
      if ($scope.distribuidorSeleccionadoModal && $scope.ufSeleccionadoModal) {
        const infoContacto = {
          IdEmpresaDistribuidor: $scope.distribuidorSeleccionadoModal.IdEmpresa,
          IdEmpresaUsuarioFinal: $scope.ufSeleccionadoModal.IdEmpresa,
          Nombre: $scope.Usuario.Nombre,
          ApellidoPaterno: $scope.Usuario.ApellidoPaterno,
          ApellidoMaterno: $scope.Usuario.ApellidoMaterno,
          CorreoElectronico: $scope.Usuario.CorreoElectronico,
          Lada: $scope.Usuario.Lada,
          Telefono: $scope.Usuario.Telefono,
          IdTipoAcceso: ADMIN_END_USER
        };
        UsuariosFactory.postContact(infoContacto)
          .success(function (result) {
            if (result.data.error === 0) {
              $scope.ShowToast(` ${result.message}.`, 'success');
              limipiarModalContacto();
            } else {
              $scope.ShowToast(`Hubo un error al tratar de registrar el contacto: ${result.data.message}.`, 'danger');
            }
          })
          .catch(result => {
            $scope.ShowToast(`Hubo un error al tratar de registrar el contacto: ${result.data.message}.`, 'danger');
          });
      } else {
        $scope.ShowToast('Asegurese de registrar distribuidor y usuario final', 'warning');
      }
    };

    $scope.completarDistModalEmpresa = function (cadenaDist = '') {
      let resultado = [];
      $scope.resultadoDistribuidorModalEmpresa = [];
      $scope.ocultarOpcionesDistModalEmpresa = false;
      $scope.distribuidoresLista.forEach(distribuidor => {
        if (distribuidor.NombreEmpresa.toLowerCase().indexOf(cadenaDist.toLowerCase()) >= 0) {
          resultado.push(distribuidor.NombreEmpresa);
          $scope.resultadoDistribuidorModalEmpresa.push(distribuidor);
        }
        if (cadenaDist === '') $scope.ocultarOpcionesDistModalEmpresa = true;
      });
      $scope.filtroDistribuidorModalEmpresa = resultado;
    };

    $scope.llenarTextBoxDistModalEmpresa = function (infoDist) {
      $scope.Empresa.Distribuidor = infoDist;
      $scope.distribuidorSeleccionadoModalEmpresa = $scope.resultadoDistribuidorModalEmpresa.find(elemento => elemento.NombreEmpresa === infoDist);
      $scope.ocultarOpcionesDistModalEmpresa = true;
    };

    $scope.conjuntarInformacionModalEmpresa = function () {
      $scope.deshabilitado = true;
      if ($scope.distribuidorSeleccionadoModalEmpresa || $scope.esDistribuidor) {
        const infoEmpresa = {
          IdEmpresaDistribuidor: $scope.esDistribuidor ? $scope.SessionCookie.IdEmpresa : $scope.distribuidorSeleccionadoModalEmpresa.IdEmpresa,
          NombreEmpresa: $scope.Empresa.NombreEmpresa,
          Direccion: $scope.Empresa.Direccion,
          Ciudad: $scope.Empresa.Ciudad,
          Estado: $scope.Empresa.Estado,
          CodigoPostal: $scope.Empresa.CodigoPostal,
          IdIndustria: $scope.Empresa.IdIndustria,
          Nombre: $scope.Empresa.Nombre,
          ApellidoPaterno: $scope.Empresa.ApellidoPaterno,
          RFC: $scope.Empresa.RFC ? $scope.Empresa.RFC : 'XXXX0000XXXX',
          CorreoElectronico: $scope.Empresa.CorreoElectronico,
          Lada: $scope.Empresa.Lada,
          Telefono: $scope.Empresa.Telefono,
          IdAutodeskUF: $scope.Empresa.IdAutodeskUF,
          ZonaImpuesto: 'Normal',
          PorcentajeCredito: '00.00',
          PorcentajeSaldoFavor: '00.00'
        };
        ImportarPedidosAutodeskFactory.postEmpresa(infoEmpresa)
          .success(function (result) {
            if (result.data.error === 0) {
              $scope.ShowToast(` ${result.message}.`, 'success');
              limipiarModalEmpresa();
              $scope.deshabilitado = false;
            } else {
              $scope.ShowToast(`Hubo un error al tratar de registrar la empresa: ${result.data.message}.`, 'danger');
              $scope.deshabilitado = false;
            }
          })
          .catch(result => {
            $scope.ShowToast(`Hubo un error al tratar de registrar la empresa: ${result.data.message}.`, 'danger');
            $scope.deshabilitado = false;
          });
      } else {
        $scope.ShowToast('Asegurese de registrar un distribuidor', 'warning');
        $scope.deshabilitado = false;
      }
    };

    $scope.completarDistModalImportacion = (cadenaDist = '') => {
      let resultado = [];
      $scope.resultadoDistribuidorModalImportacion = [];
      $scope.ocultarOpcionesDistModalImportacion = false;
      $scope.distribuidoresLista.forEach(distribuidor => {
        if (distribuidor.NombreEmpresa.toLowerCase().indexOf(cadenaDist.toLowerCase()) >= 0) {
          resultado.push(distribuidor.NombreEmpresa);
          $scope.resultadoDistribuidorModalImportacion.push(distribuidor);
        }
        if (cadenaDist === '') $scope.ocultarOpcionesDistModalImportacion = true;
      });
      $scope.filtroDistribuidorModalImportacion = resultado;
    };

    $scope.llenarTextBoxDistModalImportacion = infoDist => {
      $scope.Contrato.Distribuidor = infoDist;
      $scope.distribuidorSeleccionadoModalImportacion = $scope.resultadoDistribuidorModalImportacion.find(elemento => elemento.NombreEmpresa === infoDist);
      $scope.ufsListaAuxModalImportacion = $scope.ufsLista.filter(uf => uf.IdEmpresaDistribuidor === $scope.distribuidorSeleccionadoModalImportacion.IdEmpresa);
      $scope.Contrato.Empresauf = '';
      $scope.Contrato.IdUsuarioContacto = '';
      $scope.Contactos = {};
      $scope.ocultarOpcionesDistModalImportacion = true;
    };

    $scope.completarUFModalImportacion = (cadenaUF = '') => {
      let resultado = [];
      $scope.resultadoUFModalImportacion = [];
      if ($scope.ufsListaAuxModalImportacion) {
        $scope.ocultarOpcionesUFModalImportacion = false;
        $scope.ufsListaAuxModalImportacion.forEach(uf => {
          if (uf.NombreEmpresa.toLowerCase().indexOf(cadenaUF.toLowerCase()) >= 0) {
            resultado.push(uf.NombreEmpresa);
            $scope.resultadoUFModalImportacion.push(uf);
          }
          if (cadenaUF === '') $scope.ocultarOpcionesUFModalImportacion = true;
        });
        $scope.filtroUsuarioFinalModalImportacion = resultado;
      };
    };

    $scope.llenarTextBoxUFModalImportacion = infoUF => {
      $scope.Contrato.Empresauf = infoUF;
      $scope.ufSeleccionadoModalImportacion = $scope.resultadoUFModalImportacion.find(elemento => elemento.NombreEmpresa === infoUF);
      $scope.ocultarOpcionesUFModalImportacion = true;
      $scope.Contrato.IdUsuarioContacto = '';
      getContactos($scope.ufSeleccionadoModalImportacion.IdEmpresa);
    };

    $scope.numerosSerie = [];

    $scope.agregarSerie = (numeroSerie, cantidad) => {
      if (numeroSerie && cantidad) {
        $scope.numerosSerie.push({NumeroSerie: numeroSerie, Cantidad: cantidad});
        $scope.numeroSerie = '';
        $scope.cantidad = '';
      }
    };

    $scope.quitarSerie = index => {
      $scope.numerosSerie.splice(index, 1);
    };

    $scope.conjuntarInformacionModalImportacion = () => {
      $scope.deshabilitado = true;
      if ($scope.distribuidorSeleccionadoModalImportacion || $scope.esDistribuidor) {
        const infoContrato = {
          IdEmpresaDistribuidor: $scope.esDistribuidor ? $scope.SessionCookie.IdEmpresa : $scope.distribuidorSeleccionadoModalImportacion.IdEmpresa,
          IdEmpresaUsuarioFinal: $scope.ufSeleccionadoModalImportacion.IdEmpresa,
          IdUsuarioContacto: $scope.Contrato.IdUsuarioContacto,
          NumeroContrato: $scope.Contrato.NumeroContrato,
          Series: $scope.numerosSerie
        };
        if (!infoContrato.IdEmpresaDistribuidor || !infoContrato.IdEmpresaUsuarioFinal || !infoContrato.IdUsuarioContacto ||
          !infoContrato.NumeroContrato || infoContrato.Series.length === 0) {
          $scope.ShowToast('Llena todos los campos del formulario', 'info');
          $scope.deshabilitado = false;
        } else {
          ImportarPedidosAutodeskFactory.postContratoOtroMayorista(infoContrato)
          .success(result => {
            if (result.data.error === 0) {
              $scope.ShowToast(` ${result.message}.`, 'success');
              limipiarModalImportacion();
              $scope.deshabilitado = false;
            } else {
              $scope.ShowToast(`Hubo un error al tratar de importar el contrato: ${result.data.message}.`, 'danger');
              $scope.deshabilitado = false;
            }
          })
          .catch(result => {
            $scope.ShowToast(`Hubo un error al tratar de importar el contrato: ${result.data.message}.`, 'danger');
            $scope.deshabilitado = false;
          });
        }
      } else {
        $scope.ShowToast('Asegurese de registrar un distribuidor', 'warning');
        $scope.deshabilitado = false;
      }
    };
  };

  ImportarPedidosAutodeskController.$inject =
      ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ImportarPedidosAutodeskFactory', 'UsuariosFactory', 'EstadosFactory', 'EmpresasFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ImportarPedidosAutodeskController', ImportarPedidosAutodeskController);
}());
