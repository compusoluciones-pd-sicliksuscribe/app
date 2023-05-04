(function () {
  var ImportarPedidosAutodeskController = function ($scope, $log, $location, $cookies, $routeParams, ImportarPedidosAutodeskFactory, UsuariosFactory, EstadosFactory, EmpresasFactory, $anchorScroll, lodash) {

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
      $scope.Contrato.IdEsquemaRenovacion = '';
      $scope.Contrato.FechaFin = undefined;
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

    $scope.ToUpperCase = (stringCase) => {
      if(stringCase !== undefined) {
        $scope.Empresa.RFC = stringCase.toUpperCase();  
      }
    } 

    $scope.conjuntarInformacionModalEmpresa = function () {
      $scope.deshabilitado = true;
      if ($scope.distribuidorSeleccionadoModalEmpresa || $scope.esDistribuidor) {
        if($scope.Empresa.RFC === undefined) {
          $scope.ShowToast(`Es necesario agregar el RFC`, 'danger');
          $scope.deshabilitado = false;
        }
        if($scope.Empresa.RFC.length >= 12 && $scope.Empresa.RFC.length <= 13){
          const validateRFC = $scope.Empresa.RFC.split('');
          if( isNaN(Number(validateRFC[0])) && isNaN(Number(validateRFC[1])) && isNaN(Number(validateRFC[2]))
            && !isNaN(Number(validateRFC[3])) && !isNaN(Number(validateRFC[4])) && !isNaN(Number(validateRFC[5]))
            && !isNaN(Number(validateRFC[6])) && !isNaN(Number(validateRFC[7])) && !isNaN(Number(validateRFC[8]))){
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
                RFC: $scope.Empresa.RFC,
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
          }else{
            $scope.ShowToast(`El campo 'RFC' debe ser un formato valido Ejemplo: DEV810211CB2.`, 'warning');
            $scope.deshabilitado = false;
          }
        }else{
          $scope.ShowToast('En el campo RFC solo se admiten letras mayúsculas y un mínimo de 12 y máximo 13 dígitos.', 'warning');
          $scope.deshabilitado = false;
        }
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

    $scope.importacionDistribuidor = () => {
      if ($scope.SessionCookie.IdTipoAcceso === 2) $scope.ufsListaAuxModalImportacion = $scope.ufsLista.filter(uf => uf.IdEmpresaDistribuidor === $scope.SessionCookie.IdEmpresa);
    };

    $scope.llenarTextBoxDistModalImportacion = infoDist => {
      $scope.Contrato.Distribuidor = infoDist;
      $scope.distribuidorSeleccionadoModalImportacion = $scope.resultadoDistribuidorModalImportacion.find(elemento => elemento.NombreEmpresa === infoDist);
      $scope.ufsListaAuxModalImportacion = $scope.ufsLista.filter(uf => uf.IdEmpresaDistribuidor === $scope.distribuidorSeleccionadoModalImportacion.IdEmpresa);
      $scope.Contrato.Empresauf = '';
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
    };

    $scope.numerosSerie = [];

    $scope.agregarSerie = (numeroSerie, cantidad) => {
      if (numeroSerie && cantidad) {
        if (/[0-9]{3}-[0-9]{8}/g.test(numeroSerie)) {
          $scope.numerosSerie.push({NumeroSerie: numeroSerie, Cantidad: cantidad});
          $scope.numeroSerie = '';
          $scope.cantidad = '';
        } else $scope.ShowToast('El formato del número del serie es incorrecto. Ejemplo correcto: 721-24135768', 'info');
      } else $scope.ShowToast('Ingresa número de serie y cantidad', 'info');
    };

    $scope.quitarSerie = index => {
      $scope.numerosSerie.splice(index, 1);
    };

    $scope.conjuntarInformacionModalImportacion = () => {
      $scope.deshabilitado = true;
      if ($scope.distribuidorSeleccionadoModalImportacion || $scope.esDistribuidor) {
        const infoContrato = {
          IdEmpresaDistribuidor: $scope.esDistribuidor ? $scope.SessionCookie.IdEmpresa : $scope.distribuidorSeleccionadoModalImportacion.IdEmpresa,
          IdEmpresaUsuarioFinal: $scope.ufSeleccionadoModalImportacion ? $scope.ufSeleccionadoModalImportacion.IdEmpresa : null,
          IdEsquemaRenovacion: $scope.Contrato.IdEsquemaRenovacion,
          FechaFin: $scope.Contrato.FechaFin,
          NumeroContrato: $scope.Contrato.NumeroContrato,
          Series: $scope.numerosSerie
        };
        if (!infoContrato.IdEmpresaDistribuidor || !infoContrato.IdEmpresaUsuarioFinal || !infoContrato.IdEsquemaRenovacion ||
          !infoContrato.NumeroContrato || !infoContrato.FechaFin || infoContrato.Series.length === 0) {
          $scope.ShowToast('Llena todos los campos del formulario', 'info');
          $scope.deshabilitado = false;
        } else {
          ImportarPedidosAutodeskFactory.postContratoOtroMayorista(infoContrato)
          .success(result => {
            if (result.success === 1) {
              $scope.ShowToast('Contrato importado con éxito.', 'success');
              limipiarModalImportacion();
              $scope.deshabilitado = false;
            } else {
              $scope.ShowToast(`${result.data.message}`, 'danger');
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

    $scope.estaSeleccionadoDist = () => {
      if ($scope.distribuidorSeleccionadoModalImportacion) {
        $scope.distribuidorSeleccionadoModalImportacion = null;
        $scope.Contrato.Distribuidor = '';
      }
    };

    $scope.estaSeleccionadoUF = () => {
      if ($scope.ufSeleccionadoModalImportacion) {
        $scope.ufSeleccionadoModalImportacion = null;
        $scope.Contrato.Empresauf = '';
      }
    };
  };

  ImportarPedidosAutodeskController.$inject =
      ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ImportarPedidosAutodeskFactory', 'UsuariosFactory', 'EstadosFactory', 'EmpresasFactory', '$anchorScroll'];

  angular.module('marketplace').controller('ImportarPedidosAutodeskController', ImportarPedidosAutodeskController);
}());
