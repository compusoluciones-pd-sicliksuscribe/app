(function () {
  var ProductosReadController = function ($scope, $log, $location, $cookies, $routeParams, ProductosFactory, AmazonDataFactory, FabricantesFactory, TiposProductosFactory, PedidoDetallesFactory, TipoCambioFactory, ProductoGuardadosFactory, EmpresasXEmpresasFactory, UsuariosFactory, ActualizarCSNFactory, $anchorScroll, EmpresasFactory) {
    var BusquedaURL = $routeParams.Busqueda;
    const HRWAWRE_EXTRA_EMPOLYEES_GROUPING = 1000;
    $scope.BuscarProductos = {};
    $scope.Pagina = 0;
    $scope.sortBy = 'Nombre';
    $scope.reverse = false;
    $scope.TipoCambio = 0;
    $scope.TipoCambioMs = 0;
    $scope.Mensaje = '...';
    $scope.selectProductos = {};
    $scope.TieneContrato = true;
    $scope.IdPedidoContrato = 0;
    $scope.DominioMicrosoft = true;
    $scope.usuariosSinDominio = {};
    $scope.terminos = false;
    $scope.usuariosSinDominio = {id:''};
    $scope.finalUser = {};
    const NOT_FOUND = 404;
    $scope.datosCompletosCustomer = true;
    $scope.microsoftURI = false;

    $scope.esquemaRenovacionModelo={};
    $scope.EsquemaRenovacion=[
      {id: 1, esquema: 'Mensual' },
      {id: 2, esquema: 'Anual' }
    ];
    $scope.MENSUAL = 1;
    $scope.ANUAL = 2;
    $scope.esquemaRenovacionModel = {};
    
    
    const formatTiers = function (tiers) {
      if (tiers) {
        const lastTierIndex = tiers.length - 1;
        return tiers.map(function (tier, index) {
          const previousTier = tiers[index - 1];
          const isFirstTier = index === 0;
          const isLastTier = index === lastTierIndex;
          const quantityToAdd = isLastTier ? 0 : 1;
          const lowerLimit = isFirstTier ? 1 : previousTier.employee_limit + quantityToAdd;
          const upperLimit = isLastTier ? 0 : tier.employee_limit;
          const previousTierPrice = isFirstTier ? 0 : previousTier.price;
          return { lowerLimit, upperLimit, propertyName: 'empleados', price: tier.price, previousTierPrice };
        });
      }
      return null;
    };
    $scope.BuscarProducto = function (ResetPaginado) {
      $scope.Mensaje = 'Buscando...';
      if (ResetPaginado) {
        $scope.Pagina = 0;
        $scope.BuscarProductos.Offset = $scope.Pagina * 6;
      }
      let IdTipoProducto = ($scope.BuscarProductos.IdTipoProducto === '' || $scope.BuscarProductos.IdTipoProducto == null) ? undefined : $scope.BuscarProductos.IdTipoProducto;
      if ($scope.BuscarProductos.IdTipoProducto === 'Renovable' &&  $scope.BuscarProductos.IdFabricante !== 2 ) {
        IdTipoProducto = undefined;
      }
      $scope.BuscarProductos.IdTipoProducto = IdTipoProducto;
      ProductosFactory.getBuscarProductos($scope.BuscarProductos)
        .success(function (Productos) {
          if (Productos.success === 1) {
            $scope.Productos = Productos.data.map(function (item) {
              item.IdPedidoContrato = 0;
              item.TieneContrato = true;
              item.tiers = formatTiers(item.tiers);
              return item;
            });
          }
        })
        .error(function (data, status, headers, config) {
          if (status === NOT_FOUND && $scope.Pagina > 0) {
            $scope.ShowToast('No se encontraron más resultados para la búsqueda.', 'danger');
            $scope.PaginadoAtras();
          } else {
            $scope.Productos = [];
            $scope.Mensaje = 'Sin resultados para mostrar.';
            $scope.ShowToast('No se encontraron resultados para la búsqueda.', 'danger');
          }
        });

      TipoCambioFactory.getTipoCambio()
        .success(function (TipoCambio) {
          $scope.TipoCambio = TipoCambio.Dolar;
          $scope.TipoCambioMs = TipoCambio.DolarMS;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
          $scope.ShowToast('No pudimos obtener el tipo de cambio, por favor intenta una vez más.', 'danger');
        });
    };


   $scope.CambiarFechaRenovacion = function (Producto) {
    if (Producto.Esquema === $scope.MENSUAL){
      var fecha = new Date();
      fecha.setMonth(fecha.getMonth() + 1);
      fecha.setDate(fecha.getDate() - 1);
      Producto.FechaFinSuscripcion = fecha.getDate() + "/" + (fecha.getMonth() +1)+ "/" + (fecha.getFullYear());
      Producto.EsquemaRenovacion = 'Mensual';
      Producto.IdEsquemaRenovacion= $scope.MENSUAL;
     } 
    
    if (Producto.Esquema === $scope.ANUAL){
      var fecha = new Date();
      fecha.setDate(fecha.getDate() - 1);
      Producto.FechaFinSuscripcion = fecha.getDate() + "/" + (fecha.getMonth() +1) + "/" + (fecha.getFullYear()+1);
      Producto.EsquemaRenovacion = 'Anual';
      Producto.IdEsquemaRenovacion= $scope.ANUAL;
      Producto.PrecioNormalAnual = Producto.PrecioNormal * 12;
    }
     
     return Producto.EsquemaRenovacion; 
    };

    $scope.init = function () {
      $scope.hayCSNUF = false;
      $scope.CheckCookie();
      FabricantesFactory.getFabricantes()
        .success(function (Fabricantes) {
          $scope.selectFabricantes = Fabricantes;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la lista de fabricantes, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      $scope.validateMPA();

      TiposProductosFactory.getTiposProductos()
        .success(function (TiposProductos) {
          $scope.selectTiposProductos = TiposProductos;
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos cargar la lista de tipos de productos, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EmpresasXEmpresasFactory.getClients()
        .success(function (Empresas) {
          $scope.selectEmpresas = Empresas.data;
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar la información de tus clientes, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      $scope.BuscarProductos.IdProducto = undefined;
      $scope.BuscarProductos.IdFabricante = $scope.BuscarProductos.IdFabricante;
      $scope.BuscarProductos.IdTipoProducto = $scope.BuscarProductos.IdTipoProducto;
      $scope.BuscarProductos.Offset = $scope.Pagina * 6;
      if (BusquedaURL != 'undefined') {
        $scope.BuscarProductos.keyword = BusquedaURL;
        $scope.BuscarProducto(false);
      } else {
        $scope.BuscarProductos.keyword = undefined;
        $scope.BuscarProducto(false);
      }
    };

    $scope.validateMPA = function () {
      $scope.IdEmpresa = $cookies.getObject('Session').IdEmpresa;
      EmpresasFactory.verifySignedReseller($scope.IdEmpresa)
        .then(status => {
          if(!status.data.partnerAgreement){
            $scope.abrirModal();
          }
        })

    };

    $scope.abrirModal = function () {
      document.getElementById('avisoModal').style.display = 'block';
      };
      $scope.cerrarModal = function () {
        document.getElementById('avisoModal').style.display = 'none';
      };

    $scope.init();

    $scope.contractSetted = function (producto) {
      if (producto.IdPedidoContrato) {
        producto.IdUsuarioContacto = undefined;
      }
    };

    function findEndUser (selectedId) {
      var enterprises = $scope.selectEmpresas;
      var index = 0;
      while (index < enterprises.length) {
        var enterprise = enterprises[index];
        if (enterprise.IdEmpresa === selectedId) return enterprise;
        index++;
      }
      return null;
    }


    function setProtectedRebatePrice (selectedId) {
      var endUser = findEndUser(selectedId);
      var protectedRP = !endUser ? null : endUser.TipoCambioRP;
      $scope.ProtectedRP = protectedRP;
    }

    const validateAutodeskData = function (Producto) {
      ActualizarCSNFactory.getUfCSN(Producto.IdEmpresaUsuarioFinal)
      .then(result => {
        if (result.data.success) {
          Producto.mensajeCSN = undefined;
          Producto.csnUF = Producto.IdAutodeskUF = result.data.data.CSN ? result.data.data.CSN : '';
        } else $scope.ShowToast('No pudimos cargar el csn de este cliente.', 'danger')
      })
      .catch(() => $scope.ShowToast('No pudimos cargar el csn de este cliente, por favor intenta de nuevo más tarde.', 'danger'))
      .then(() => {
      ProductosFactory.getProductContracts(Producto.IdEmpresaUsuarioFinal, Producto.IdProducto)
        .success(function (respuesta) {
          if (respuesta.success === 1) {
            Producto.IdAccionAutodesk = 1;
            Producto.contratos = respuesta.data;
            if (Producto.contratos.length >= 1) {
              Producto.TieneContrato = true;
              Producto.IdPedidoContrato = respuesta.data[0].IdPedido;
            }
            if (Producto.contratos.length === 0) {
              Producto.TieneContrato = false;
              Producto.IdPedidoContrato = 0;
            }
            Producto.contratos.unshift({ IdPedido: 0, NumeroContrato: 'Nuevo contrato...' });
            setProtectedRebatePrice(Producto.IdEmpresaUsuarioFinal);
          } else {
            $scope.ShowToast('No pudimos cargar la información de tus contratos, por favor intenta de nuevo más tarde.', 'danger');
          }
        })
        .error(function () {
          $scope.ShowToast('No pudimos cargar la información de tus contratos, por favor intenta de nuevo más tarde.', 'danger');
        })
      })
      .then(() => {
      UsuariosFactory.getUsuariosContacto(Producto.IdEmpresaUsuarioFinal)
        .success(function (respuesta) {
          if (respuesta.success === 1) {
            Producto.usuariosContacto = respuesta.data;
          } else {
            $scope.ShowToast('No pudimos cargar la información de tus contactos, por favor intenta de nuevo más tarde.', 'danger');
          }
        })
        .error(function () {
          $scope.ShowToast('No pudimos cargar la información de tus contactos, por favor intenta de nuevo más tarde.', 'danger');
        });
      })
    };

    $scope.updateUfCSN = (IdEmpresaUf, csn, Producto) => {
      csn = !csn ? null : csn;
      validateCSN(csn, Producto)
      .then((r) => {
        if (r.estatus) {
        ActualizarCSNFactory.updateUfCSN(IdEmpresaUf, csn)
          .then(result => {
            result.data.success ? $scope.ShowToast('Información actualizada.', 'success') : $scope.ShowToast('No fue posible actualizar la información', 'danger');
            Producto.csnUF = Producto.IdAutodeskUF = csn;
            Producto.mensajeCSN = r.mensaje;
            Producto.color = 'rgb(25,185,50)';
          })
          .catch(() => {
            $scope.ShowToast('No fue posible actualizar la información, por favor intenta más tarde.', 'danger');
          });
        } else {
          Producto.mensajeCSN = r.mensaje;
          Producto.csnUF = Producto.IdAutodeskUF;
          Producto.color = 'rgb(230,8,8)';
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
              const data = result.data.data;
              return !data.victimCsn ? { mensaje: `CSN: ${csn} válido. Pertenece a ${data.name}`, estatus: true}
              : { mensaje: `CSN: ${csn} inactivo. El CSN correcto es ${data.csn}. Pertenece a ${data.name}`, estatus: false};
          } else {
            return { mensaje: `CSN ${csn} no válido.`, estatus: false};
          }
        })};

    const validateISVsData = function (Producto) {
      UsuariosFactory.getUsuariosContacto(Producto.IdEmpresaUsuarioFinal)
        .success(function (respuesta) {
          if (respuesta.success === 1) {
            Producto.usuariosContacto = respuesta.data;
          } else {
            $scope.ShowToast('No pudimos cargar la información de tus contactos, por favor intenta de nuevo más tarde.', 'danger');
          }
        })
        .error(function () {
          $scope.ShowToast('No pudimos cargar la información de tus contactos, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    const validateMicrosoftData = function (Producto) {
      if (Producto.IdTipoProducto === 4 && Producto.IdFabricante === 1) {
        ProductosFactory.postComplementos(Producto)
          .then(function (data) {
            var IdProductoFabricanteExtra = '';
            for (var x = 0; x < data.data.length; x++) {
              IdProductoFabricanteExtra += data.data[x].IdProductoFabricante + '|';
              if (x === data.data.length - 1) {
                IdProductoFabricanteExtra += data.data[x].IdProductoFabricante;
              }
            }
            Producto.IdProductoFabricanteExtra = IdProductoFabricanteExtra;
            PedidoDetallesFactory.postPedidoDetallesAddOns(Producto)
              .success(function (result) {
                $scope.selectProductos = result.data;
                $scope.Productos.forEach(function (producto) {
                  if (producto.IdProducto === Producto.IdProducto) {
                    if ($scope.selectProductos.length === 0) {
                      producto.Mostrar = false;
                      producto.MostrarMensajeP = true;
                      producto.Required = true;
                    } else {
                      producto.Mostrar = true;
                      producto.Required = true;
                      producto.MostrarMensajeP = false;
                    }
                  }
                }, this);
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
          });
      }
    };

    $scope.revisarProducto = function (Producto) {
      $scope.DominioMicrosoft = $scope.selectEmpresas.filter(function (item) {
        if (Producto.IdEmpresaUsuarioFinal === item.IdEmpresa) return item;
        return false;
      })[0].IdMicrosoftUF;
      $scope.usuariosSinDominio[Producto.IdEmpresaUsuarioFinal] = $scope.DominioMicrosoft !== null;
      $scope.productoSeleccionado = Producto.IdProducto;
      if (Producto.IdFabricante === 2) validateAutodeskData(Producto);
      if (Producto.IdFabricante === 1 && $scope.DominioMicrosoft) validateMicrosoftData(Producto);
      if (Producto.IdFabricante === 6 || Producto.IdFabricante === 11 || (Producto.IdFabricante === 5  && Producto.IdProductoFabricanteExtra !== 'Aperio')) validateISVsData(Producto);
    };

    const estimateLastTier = function (previousTier, currentTier, quantity) {
      const extraEmployees = quantity - previousTier.upperLimit;
      const extraEmployessFactor = Math.round(extraEmployees / HRWAWRE_EXTRA_EMPOLYEES_GROUPING);
      const extraEmployeePrice = currentTier.price * extraEmployessFactor;
      return previousTier.price + extraEmployeePrice;
    };

    const estimateTieredTotal = function (tiers, quantity) {
      const indexOfLastTier = tiers.length - 1;
      return tiers.reduce(function (total, currentTier, index, readOnlyTiers) {
        if (quantity >= currentTier.lowerLimit) {
          if (index === indexOfLastTier) {
            const previousTier = readOnlyTiers[index - 1];
            return estimateLastTier(previousTier, currentTier, quantity);
          }
          return currentTier.price;
        }
        return total;
      }, 0);
    };



    $scope.estimateTotalAnnual = function (product, quantity) {

      const price = product.PorcentajeDescuento > 0 ? product.PrecioDescuento : product.PrecioNormal;
      const estimatedTotal = ((price * quantity)*12) || 0.00;

      return estimatedTotal;
    };

    $scope.estimateTotal = function (product, quantity) {
      if (product.tiers) {
        return estimateTieredTotal(product.tiers, quantity);
      }

      if (product.IdEsquemaRenovacion === $scope.ANUAL) {
        return $scope.estimateTotalAnnual(product,quantity);
      }
      const price = product.PorcentajeDescuento > 0 ? product.PrecioDescuento : product.PrecioProrrateo;
      const estimatedTotal = price * quantity || 0.00;
      return estimatedTotal;
    };

    $scope.AceptarTerminos = function () {
        PedidoDetallesFactory.acceptAgreement($scope.IdEmpresaUsuarioFinalTerminos)
        .success(function (result) {
          if (!result.success) {
            $scope.ShowToast('Ocurrió un error, favor de contactar a Soporte', 'danger');
          } else {
            $scope.ShowToast('Terminos y condiciones aceptados.', 'success');
            $scope.terminos = false;
          }
        })
        .catch(function (error) {
          $scope.ShowToast(error.data.message, 'danger');
          $log.log('data error: ' + error.data.message + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          $scope.form.habilitar = true;
          $scope.ActualizarMonitor();
          $scope.form.habilitar = false;
        });
    };

    const validateCustomerData = ({ ApellidosContacto, CorreoContacto, NombreContacto, TelefonoContacto }) => {
      if (!ApellidosContacto || !CorreoContacto || !NombreContacto || !TelefonoContacto) {
        $scope.finalUser.Nombre = NombreContacto;
        $scope.finalUser.Apellidos = ApellidosContacto;
        $scope.finalUser.Telefono = TelefonoContacto;
        $scope.finalUser.CorreoElectronico = CorreoContacto;
        return false;
      }
      return true;
    }
    $scope.updateFinalUserData = function () {
      if($scope.finalUser.Nombre == "" || $scope.finalUser.Nombre == null ||
      $scope.finalUser.CorreoElectronico == "" ||$scope.finalUser.CorreoElectronico == null ||
      $scope.finalUser.Telefono == "" ||$scope.finalUser.Telefono == null ||
      $scope.finalUser.Apellidos == "" ||$scope.finalUser.Apellidos == null
      ){
        $scope.ShowToast('Ingresa la información completa ó valida por favor  .', 'danger');
      } else {
     var IdFinalUser = $scope.IdEmpresaUsuarioFinalTerminos;
     $scope.finalUser.IdFinalUser= IdFinalUser;
      UsuariosFactory.putUpdateFinalUserData( $scope.finalUser )
        .success(function (respuesta) {
          if (respuesta.Success === 1) {
            $scope.ShowToast('Información Actualizada ','success');
            $scope.datosCompletosCustomer = true;
            document.getElementById('formModal').style.display = 'none';

          } else {
            $scope.ShowToast('No pudimos cargar la información de tu datos ,porfavor intenta más tarde.', 'danger');
            document.getElementById('formModal').style.display = 'none';
          }
        })
        .error(function () {
          $scope.ShowToast('No pudimos cargar la información de tus contactos, por favor intenta de nuevo más tarde.', 'danger');
        });
      }
    };

    $scope.getCustomerAgreement = function () {
      $scope.loading = true;
      return EmpresasXEmpresasFactory.getCustomerAgreements()
      .success(function (result) {
        $scope.loading = false;
        if (result.downloadUri) {
          $scope.downloadURI = result.downloadUri;
          $scope.displayUri = result.displayUri;
          $scope.microsoftURI = true;
        }
      })
      .catch(function (error) {
        $scope.ShowToast(error.data.message, 'danger');
        $log.log('data error: ' + error.data.message + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
      });
    };

    $scope.validateAgreementCSP = function (producto) {
      return EmpresasXEmpresasFactory.getAcceptanceAgreementByClient(producto.IdEmpresaUsuarioFinal)
      .success(function (result) {
        if (!result.AceptoTerminosMicrosoft) {
          if (!validateCustomerData(result.data[0])) {
            $scope.ShowToast('Completa la información para poder aceptar los términos y condiciones', 'danger');
            document.getElementById('formModal').style.display = 'block';
            $scope.datosCompletosCustomer = false;
          }
          $scope.ShowToast('No has aceptado los términos y condiciones que necesita Microsoft.', 'danger');
          $scope.IdEmpresaUsuarioFinalTerminos = producto.IdEmpresaUsuarioFinal;
          $scope.terminos = true;
        } else {
          return $scope.AgregarCarrito(producto, producto.Cantidad, producto.IdPedidocontrato);
        }
      })
      .catch(function (error) {
        $scope.ShowToast(error.data.message, 'danger');
        $log.log('data error: ' + error.data.message + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        $scope.form.habilitar = true;
        $scope.ActualizarMonitor();
        $scope.form.habilitar = false;
      });
    };

    $scope.previousISVValidate = function (producto) {
      if (producto.IdFabricante !== 6) {
        if (producto.IdFabricante === 1) {
          return $scope.validateAgreementCSP(producto);
        } 
        else if (producto.IdFabricante === 7) {
          return validateQuantity(producto);
        } 
        else {
          return $scope.AgregarCarrito(producto, producto.Cantidad, producto.IdPedidocontrato);
        }
      }
      $scope.validateExistsEmail(producto)
      .then(function (result) {
        const { exists } = result.data;
        if (!exists) {
          $scope.AgregarCarrito(producto, producto.Cantidad, producto.IdPedidocontrato);
          return ProductosFactory.postIdERP(producto.IdEmpresaUsuarioFinal);
        } else {
          $scope.ShowToast('Este usuario ya cuenta con un registro de este producto, contacta a tu administrador.', 'danger');
        }
      });
    };

    const validateQuantity = function (producto) {
      ProductosFactory.getQuantity(producto.IdEmpresaUsuarioFinal, producto.IdProducto)
      .then(function (result) {
        if (result.data.Licencias === 0 ) {
          $scope.AgregarCarrito(producto, producto.Cantidad, producto.IdPedidocontrato);
        } else if ( (result.data.Licencias+producto.Cantidad) > producto.CantidadMaxima) {
          $scope.ShowToast('Ha excedido la cantidad máxima de licencias disponibles para este producto', 'danger');
        } else $scope.AgregarCarrito(producto, producto.Cantidad, producto.IdPedidocontrato);
      });
      };

    $scope.validateExistsEmail = function (producto) {
      const usuario = producto.usuariosContacto.filter(function (user) {
        return user.IdUsuario === producto.IdUsuarioContacto;
      })[0];
      return ProductosFactory.getValidateEmail(usuario.CorreoElectronico);
    };

    $scope.AgregarCarrito = function (Producto, Cantidad = 1, IdPedidocontrato) {
      var NuevoProducto = {
        IdProducto: Producto.IdProducto,
        Cantidad: !Producto.Cantidad ? 1 : Producto.Cantidad,
        IdEmpresaUsuarioFinal: Producto.IdEmpresaUsuarioFinal,
        MonedaPago: 'Pesos',
        IdEsquemaRenovacion:Producto.IdEsquemaRenovacion,
        IdFabricante: Producto.IdFabricante,
        CodigoPromocion: Producto.CodigoPromocion,
        ResultadoFabricante2: Producto.IdProductoPadre,
        Especializacion: Producto.Especializacion,
        IdUsuarioContacto: Producto.IdUsuarioContacto,
        IdAccionAutodesk: Producto.IdFabricante === 2 ? 1 : null,
        IdERP: Producto.IdERP,
        Plazo: Producto.Plazo
      };
      if (NuevoProducto.IdAccionAutodesk === 1 && !Producto.TieneContrato) {
        return postPedidoAutodesk(NuevoProducto, Producto);
      }
      if (!Producto.IdUsuarioContacto && Producto.IdFabricante === 2 && Producto.TieneContrato) {
        const contrato = Producto.contratos
          .filter(function (p) {
            return Producto.IdPedidoContrato === p.IdPedido;
          })[0].NumeroContrato;
        NuevoProducto.ContratoBaseAutodesk = contrato.trim();
      }
      if (NuevoProducto.IdAccionAutodesk === 1 && Producto.TieneContrato) {
        ProductosFactory.getProductExists(Producto.IdEmpresaUsuarioFinal, Producto.IdProducto, NuevoProducto.ContratoBaseAutodesk)
        .then(function (result) {
          if (result.data.data.length >= 1) {
            NuevoProducto.IdAccionAutodesk = 2;
          } else {
            NuevoProducto.IdAccionAutodesk = 3;
          }
          if (Producto.IdPedidoContrato === 0) { // Cuando se elige la acción de nuevo contrato y existen contratos adicionales disponibles
            NuevoProducto.IdAccionAutodesk = 1;
            delete NuevoProducto.ContratoBaseAutodesk;
          }
          return postPedidoAutodesk(NuevoProducto);
        });
      }
      if (Producto.IdFabricante !== 2) {
        if (!NuevoProducto.IdAccionAutodesk) delete NuevoProducto.IdAccionAutodesk;
        PedidoDetallesFactory.postPedidoDetalle(NuevoProducto)
        .success(function (PedidoDetalleResult) {
          if (PedidoDetalleResult.success === 1) {
            angular.element(document.getElementById('auxScope')).scope().gaAgregarCarrito(Producto);
            $scope.ShowToast(PedidoDetalleResult.message, 'success');
            $scope.ActualizarMenu();
            $scope.addPulseCart();
            setTimeout($scope.removePulseCart, 9000);
          } else {
            $scope.ShowToast(PedidoDetalleResult.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No pudimos agregar este producto a tu carrito de compras, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
      }
    };

    const postPedidoAutodesk = function (NuevoProducto) {
      PedidoDetallesFactory.postPedidoDetalle(NuevoProducto)
      .success(function (PedidoDetalleResult) {
        if (PedidoDetalleResult.success === 1) {
          $scope.ShowToast(PedidoDetalleResult.message, 'success');
          $scope.ActualizarMenu();
          $scope.addPulseCart();
          setTimeout($scope.removePulseCart, 1000);
        } else {
          $scope.ShowToast(PedidoDetalleResult.message, 'danger');
        }
      })
      .error(function (data, status, headers, config) {
        $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';
        $scope.ShowToast('No pudimos agregar este producto a tu carrito de compras, por favor intenta de nuevo más tarde.', 'danger');
        $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
      });
    };

    $scope.AgregarGuardados = function (IdProductoSeleccionado) {
      var ProductoGuardado = { IdProducto: IdProductoSeleccionado };
      ProductoGuardadosFactory.postProductoGuardado(ProductoGuardado)
        .success(function (PedidoDetalleResult) {
          if (PedidoDetalleResult[0].Success == true) {
            $scope.ShowToast(PedidoDetalleResult[0].Message, 'success');
          } else {
            $scope.ShowToast(PedidoDetalleResult[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.Mensaje = 'No pudimos conectarnos a la base de datos, por favor intenta de nuevo más tarde.';

          $scope.ShowToast('No se pudo agregar este producto en la lista, por favor intenta de nuevo más tarde.', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.scrollTo = function (eID) {
      var startY = currentYPosition();
      var stopY = elmYPosition(eID);
      var distance = stopY > startY ? stopY - startY : startY - stopY;

      if (distance < 100) {
        scrollTo(0, stopY); return;
      }

      var speed = Math.round(distance / 100);
      if (speed >= 20) speed = 20;
      var step = Math.round(distance / 25);
      var leapY = stopY > startY ? startY + step : startY - step;
      var timer = 0;

      if (stopY > startY) {
        for (var i = startY; i < stopY; i += step) {
          setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
          leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
      }

      for (var i = startY; i > stopY; i -= step) {
        setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
      }

      function currentYPosition () {
        if (self.pageYOffset) return self.pageYOffset;

        if (document.documentElement && document.documentElement.scrollTop) { return document.documentElement.scrollTop; }

        if (document.body.scrollTop) return document.body.scrollTop;
        return 0;
      }

      function elmYPosition (eID) {
        var elm = document.getElementById(eID);
        var y = elm.offsetTop;
        var node = elm;
        while (node.offsetParent && node.offsetParent != document.body) {
          node = node.offsetParent;
          y += node.offsetTop;
        } return y;
      }
    };

    $scope.PaginadoInicio = function () {
      $scope.BuscarProducto(true);

      $scope.scrollTo('TopPage');
    };

    $scope.PaginadoAtras = function () {
      $scope.Pagina = $scope.Pagina - 1;
      $scope.BuscarProductos.Offset = $scope.Pagina * 6;
      $scope.BuscarProducto(false);

      $scope.scrollTo('TopPage');
    };

    $scope.PaginadoSiguiente = function () {
      $scope.Pagina = $scope.Pagina + 1;
      $scope.BuscarProductos.Offset = $scope.Pagina * 6;
      $scope.BuscarProducto(false);

      $scope.scrollTo('TopPage');
    };

    $scope.IniciarTourProducts = function () {
      $scope.Tour = new Tour({

        steps: [
          {
            element: '.filterOption',
            placement: 'bottom',
            title: 'Filtra por fabricante',
            content: 'Puedes filtrar tu búsqueda por fabricante o marca para ser más preciso.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: '.typeOptions',
            placement: 'bottom',
            title: 'Filtra por un tipo de producto',
            content: 'Puedes hacer un filtrado por los tipos de producto que requieras; suscripción o complementos.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: '.favoriteOption',
            placement: 'left',
            title: 'Agregar a favoritos',
            content: 'Al agregar un producto a favoritos se guardará en tu lista de favoritos que podrás consultar en la parte superior derecha de la pagina, en el menú del carrito de compras.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: '.ufs',
            placement: 'bottom',
            title: 'Selecciona el cliente',
            content: 'Una vez establecida la cantidad, selecciona a que usuario final va destinado este producto.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: '.addOption',
            placement: 'bottom',
            title: 'Agregar al carrito',
            content: 'Una vez configurado tu producto, agregalo al carrito de compras.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          }

        ],

        backdrop: true,
        storage: false
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };

    $scope.updateEnterprise = function (Producto) {
      $location.path('/Empresa/ActualizarDominio/' + Producto.IdEmpresaUsuarioFinal);
    };

    $scope.RequestDataVmwareProduct= (Producto) => {
      const Product = {
        userName : $scope.SessionCookie.Nombre,
        userSecondName : $scope.SessionCookie.ApellidoPaterno,
        userMothersSecond : $scope.SessionCookie.ApellidoMaterno,
        userEmail : $scope.SessionCookie.CorreoElectronico,
        userCompanyName : $scope.SessionCookie.NombreEmpresa,
        productName : Producto.Nombre,
        productDesciption : Producto.Descripcion,
        productIdErp : Producto.IdERP,
      };
      ProductosFactory.postRequestDataVwareProduct(Product)
      .success(function (result) {
        if (!result.success) {
          $scope.ShowToast('No se pudo mandar la notificación intente más tarde', 'danger');
        } else {
          $scope.ShowToast('Se envió tu información al distribuidor, pronto se pondrán en contacto para brindar información.', 'success');
          
        }
      })

      };
    $scope.RequestDataAwsProduct = (Producto) => {
      const Product = {
        userName : $scope.SessionCookie.Nombre,
        userSecondName : $scope.SessionCookie.ApellidoPaterno,
        userMothersSecond : $scope.SessionCookie.ApellidoMaterno,
        userEmail : $scope.SessionCookie.CorreoElectronico,
        userCompanyName : $scope.SessionCookie.NombreEmpresa,
        productName : Producto.Nombre,
        productDesciption : Producto.Descripcion,
        productIdErp : Producto.IdERP,
      };

      AmazonDataFactory.postRequestDataAWSProduct(Product)
      .success(function (result) {
        if (!result.success) {
          $scope.ShowToast('No se pudo mandar la notificación intente más tarde', 'danger');
        } else {
          $scope.ShowToast('Se envió tu información al distribuidor, pronto se pondrán en contacto para brindar información.', 'success');
          
        }
      })
    };
  };

  ProductosReadController.$inject = ['$scope', '$log', '$location', '$cookies', '$routeParams', 'ProductosFactory','AmazonDataFactory', 'FabricantesFactory', 'TiposProductosFactory', 'PedidoDetallesFactory', 'TipoCambioFactory', 'ProductoGuardadosFactory', 'EmpresasXEmpresasFactory', 'UsuariosFactory', 'ActualizarCSNFactory', '$anchorScroll', 'EmpresasFactory'];

  angular.module('marketplace').controller('ProductosReadController', ProductosReadController);
}());
