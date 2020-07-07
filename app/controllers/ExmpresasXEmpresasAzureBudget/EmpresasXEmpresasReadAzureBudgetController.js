(function () {
  var EmpresasXEmpresasReadAzureBudgetController = function ($scope, $log, $location, $cookies, EmpresasXEmpresasFactory, EmpresasFactory, PedidoDetallesFactory) {
    $scope.sortBy = 'NombreEmpresa';
    $scope.reverse = false;
    $scope.CreditoDisponible = 0;
    $scope.PorcentajeAzureBudget = 100;
    $scope.CreditoRepartidoPorcentajeTotal = 0;


    String.prototype.splice = function (idx, rem, s) {
      return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
    };

    $scope.actualizarCantidades = function (Empresa = undefined) {
      CreditoPorRepartirPorcentaje();
      CreditoRepartidoPorcentaje();
      $scope.CreditoRepartido();
      $scope.CreditoPorRepartir();
      if (Empresa !== undefined) {
        if ($scope.CreditoRepartidoPorcentajeTotal > 100) {
          $scope.ShowToast('No puedes repartir una cantidad mayor al 100 %', 'danger');
          Empresa.maxlength = true;
        } else {
          Empresa.maxlength = false;
        }
      }
    }

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasXEmpresasFactory.getEmpresasXEmpresas()
        .success(function (Empresas) {
          if (Empresas) {
            $scope.Empresas = Empresas;
            $scope.actualizarCantidades();
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar tus clientes, por favor intenta de nuevo más tarde', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EmpresasFactory.getBudgetAzure()
        .success(function (Empresa) {
          if (Empresa.data[0] !== undefined) {
            $scope.Validacion = 1;
            if (Empresa.data[0].Cantidad !== null) {
              $scope.CreditoDisponible = Empresa.data[0].Cantidad;
            } else {
              $scope.CreditoDisponible = 0;
            }
          } else {
            $scope.CreditoDisponible = 0;
            $scope.Validacion = 0;
            $scope.ShowToast('No cuentas con Azure Budget', 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };
    

    $scope.ActualizarCredito = function (Empresa) {
      var total = 0;
      if (Empresa.PorcentajeAzureBudget != undefined && Empresa.PorcentajeAzureBudget != null) {
        if (Empresa.PorcentajeAzureBudget < 0) {
          $scope.ShowToast('Cantidad no válida', 'danger');
          return;
        } else  if ($scope.CreditoRepartidoPorcentajeTotal > 100) {
          $scope.ShowToast('Sobrepasas el 100 por ciento', 'danger');
          return false;
        } else {
          total += Empresa.PorcentajeAzureBudget;
        }
      } else {
        Empresa.PorcentajeAzureBudget = 0;
      }

      EmpresasXEmpresasFactory.putEmpresasXEmpresa(Empresa)
        .success(function (data) {
          if (data[0].Success == true) {
            $scope.ShowToast(data[0].Message, 'success');

            var parametros = { IdEmpresaUsuarioFinal: Empresa.IdEmpresa };
          } else {
            $scope.ShowToast(data[0].Message, 'danger');

            $scope.init();
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos actualizar el crédito, por favor intenta de nuevo más tarde', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    const CreditoRepartidoPorcentaje = () => {
      let totalAsignadoPorcentaje = 0;
      
      if ($scope.Empresas !== undefined) {
        $scope.Empresas.map(empresa => {
          if (empresa.PorcentajeAzureBudget != undefined && empresa.PorcentajeAzureBudget != null) {
            totalAsignadoPorcentaje += empresa.PorcentajeAzureBudget;
          }
        })
      }
      $scope.CreditoRepartidoPorcentajeTotal = totalAsignadoPorcentaje;
    }

    const CreditoPorRepartirPorcentaje = () => {
      let totalPorRepartirPorcentaje = 100;
      if ($scope.Empresas !== undefined) {
        $scope.Empresas.map(empresa => {
          if(empresa.PorcentajeAzureBudget != undefined && empresa.PorcentajeAzureBudget != null) {
            totalPorRepartirPorcentaje -= empresa.PorcentajeAzureBudget;
          }
        })
      }
      $scope.PorcentajeAzureBudget = totalPorRepartirPorcentaje;
    }

    $scope.CreditoRepartido = function () {
      $scope.CreditoRepartidoTotal = (($scope.CreditoDisponible * $scope.CreditoRepartidoPorcentajeTotal) / 100).toFixed(4);
    };

    $scope.CreditoPorRepartir = function () {
      $scope.CreditoPorRepartirTotal = (($scope.CreditoDisponible * $scope.PorcentajeAzureBudget) / 100).toFixed(4);
    };

    $scope.IniciarTourClients = function () {
      $scope.Tour = new Tour({
        steps: [
          {
            element: ".newClient",
            placement: "bottom",
            title: "Agrega nuevos clientes",
            content: "Da de alta un nuevo cliente y asígnale crédito para Click suscribe.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: ".totalCredit",
            placement: "bottom",
            title: "Crédito total",
            content: "El crédito total que tienes en Click suscribe para hacer compras o renovar suscripciones.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: ".asignCredit",
            placement: "bottom",
            title: "Crédito total asignado",
            content: "Cantidad que ya se repartió entre tus clientes.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: ".giveCredit",
            placement: "bottom",
            title: "Crédito por repartir",
            content: "Cantidad disponible o pendiente por repartir entre tus clientes.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: ".pesosCredit",
            placement: "left",
            title: "Asigna crédito",
            content: "Asígnale crédito a cada cliente en base a tu monto total.",
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          }
        ],

        backdrop: true,
        storage: false
      });

      $scope.Tour.init();
      $scope.Tour.start();
    };
  };

  EmpresasXEmpresasReadAzureBudgetController.$inject = ['$scope', '$log', '$location', '$cookies', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'PedidoDetallesFactory'];

  angular.module('marketplace').controller('EmpresasXEmpresasReadAzureBudgetController', EmpresasXEmpresasReadAzureBudgetController);
}());
