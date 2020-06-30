(function () {
  var EmpresasXEmpresasReadAzureBudgetController = function ($scope, $log, $location, $cookies, EmpresasXEmpresasFactory, EmpresasFactory, PedidoDetallesFactory) {
    $scope.sortBy = 'NombreEmpresa';
    $scope.reverse = false;
    $scope.CreditoDisponible = 0;
    $scope.Cont = 0;
    $scope.form = {};
    $scope.form.habilitar = false;
    $scope.clientInfo = false;
    // $scope.algo = 0;
    // $scope.CreditoRepartidoPorcentaje = 100;
    // $scope.porcentajeRepartido = 0;


    String.prototype.splice = function (idx, rem, s) {
      return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
    };

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasXEmpresasFactory.getEmpresasXEmpresas()
        .success(function (Empresas) {
          console.log("Empresas  ", Empresas)
          if (Empresas) {
            $scope.Empresas = Empresas;
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar tus clientes, por favor intenta de nuevo más tarde', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EmpresasFactory.getEmpresas()
        .success(function (data) {
          console.log("DATAAAAAAAA", data);
          // $scope.CreditoDisponible = data[0].Credito;
          var IdEmpresa = data[0].IdEmpresa;

          EmpresasFactory.getBudgetAzure(IdEmpresa)
          .success(function (Empresa) {
            console.log("EMPRESAA", Empresa);
            if (Empresa.data[0] !== undefined) {
              if (Empresa.data[0].Cantidad !== null) {
                $scope.CreditoDisponible = Empresa.data[0].Cantidad;
              } else {
                $scope.CreditoDisponible = 0;
              }
            } else {
              $scope.EmpresaBudget = 0;
            }
          })
          .error(function (data, status, headers, config) {
            $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
          });
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar los datos de tu empresa, por favor intenta de nuevo más tarde', 'danger');

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

      if ($scope.Empresas !== undefined) {
        for (var i = 0; i < $scope.Empresas.length; i++) {
          var Empresas = $scope.Empresas[i];

          if (Empresas.PorcentajeAzureBudget != undefined && Empresas.PorcentajeAzureBudget != null) {
            if (Empresas.PorcentajeAzureBudget < 0) {
              $scope.ShowToast('Cantidad no válida', 'danger');
              return;
            } else {
              total += Empresas.PorcentajeAzureBudget;
            }
          } else {
            Empresas.PorcentajeAzureBudget = 0;
          }
        }
      }

      if (total > $scope.CreditoDisponible) {
        $scope.ShowToast('No puedes exceder tu límite de crédito.', 'danger');
        $scope.init();
        return;
      }

      EmpresasXEmpresasFactory.putEmpresasXEmpresa(Empresa)
        .success(function (data) {
          if (data[0].Success == true) {
            $scope.ShowToast(data[0].Message, 'success');

            var parametros = { IdEmpresaUsuarioFinal: Empresa.IdEmpresa };

            PedidoDetallesFactory.postWarningCredito(parametros)
              .success(function (result) {
                if (result) {
                  var WarningCredito = false;

                  if (result.success === 0) {
                    WarningCredito = true;
                    $scope.ShowToast(result.message, 'danger');
                  } else {
                    WarningCredito = false;
                  }

                  for (var e = 0; e < $scope.Empresas.length; e++) {
                    if ($scope.Empresas[e].IdEmpresa === Empresa.IdEmpresa) {
                      $scope.Empresas[e].WarningCredito = WarningCredito;
                      break;
                    }
                  }
                }
              })
              .error(function (data, status, headers, config) {
                $scope.ShowToast('No pudimos cargar tu información, por favor intenta de nuevo más tarde.', 'danger');
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
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


    $scope.PosibilidadCredito = function () {
      var totalAsignado = 0;
      if ($scope.Empresas !== undefined) {
        for (var i = 0; i < $scope.Empresas.length; i++) {
          var Empresa = $scope.Empresas[i];
          if (Empresa.PorcentajeAzureBudget != undefined && Empresa.PorcentajeAzureBudget != null) {
            totalAsignado += Empresa.PorcentajeAzureBudget;
          }
        }
      }

      return $scope.CreditoDisponible - $scope.CreditoRepartidoTotal;
    };

    $scope.CreditoRepartidoPorcentaje = function () {
      var totalAsignadoPorcentaje = 0;

      if ($scope.Empresas !== undefined) {
        for (var i = 0; i < $scope.Empresas.length; i++) {
          var Empresa = $scope.Empresas[i];

          if (Empresa.PorcentajeAzureBudget != undefined && Empresa.PorcentajeAzureBudget != null) {
            totalAsignadoPorcentaje += Empresa.PorcentajeAzureBudget;
          }
          
        }
      }
      console.log("HOLA")
      $scope.porcentajeRepartido = (100 - totalAsignadoPorcentaje)
      $scope.CreditoRepartidoPorcentajeTotal = totalAsignadoPorcentaje;
      return totalAsignadoPorcentaje;
    };

    $scope.CreditoPorRepartirPorcentaje = function () {
      var totalPorRepartirPorcentaje = 100;

      if ($scope.Empresas !== undefined) {
        for (var i = 0; i < $scope.Empresas.length; i++) {
          var Empresa = $scope.Empresas[i];

          if (Empresa.PorcentajeAzureBudget != undefined && Empresa.PorcentajeAzureBudget != null) {
            totalPorRepartirPorcentaje -= Empresa.PorcentajeAzureBudget;
          }
          
        }
      }

      return totalPorRepartirPorcentaje;
    };

    $scope.CreditoRepartido = function () {
      var creditoRepartidoPesos = 0;
      var porcentajeRepartido = $scope.CreditoRepartidoPorcentajeTotal;
      var creditoDisponible = $scope.CreditoDisponible;
      creditoRepartidoPesos = ((creditoDisponible * porcentajeRepartido) / 100).toFixed(4);

      $scope.CreditoRepartidoTotal = creditoRepartidoPesos;
      return creditoRepartidoPesos;
    };

    $scope.disponible = function () {
      var creditoRepartidoPesos = 0;
      $scope.porcentajeRepartido = ( 100 - $scope.CreditoRepartidoPorcentajeTotal);

      return $scope.porcentajeRepartido;
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
