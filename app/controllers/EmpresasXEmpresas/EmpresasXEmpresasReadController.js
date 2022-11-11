(function () {
  var EmpresasXEmpresasReadController = function ($scope, $log, $location, $cookies, EmpresasXEmpresasFactory, EmpresasFactory, PedidoDetallesFactory, $window, $rootScope) {
    $scope.sortBy = 'NombreEmpresa';
    $scope.reverse = false;
    $scope.CreditoDisponible = 0;
    $scope.Cont = 0;
    $scope.form = {};
    $scope.form.habilitar = false;

    String.prototype.splice = function (idx, rem, s) {
      return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
    };

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasXEmpresasFactory.getEmpresasXEmpresas()
        .success(function (Empresas) {
          if (Empresas) {
            for (var i = 0; i < Empresas.length; i++) {
              Empresas[i].WarningCredito = false;
            }

            $scope.Empresas = Empresas;

            for (var w = 0; w < $scope.Empresas.length; w++) {
              (function (index) {

                var parametros = { IdEmpresaUsuarioFinal: $scope.Empresas[index].IdEmpresa };

                PedidoDetallesFactory.postWarningCredito(parametros)
                  .success(function (result) {
                    if (result) {
                      if (result.success === 0) {
                        $scope.Empresas[index].WarningCredito = true;

                        $scope.ShowToast(result.message, 'danger');
                      }
                      else {
                        $scope.Empresas[index].WarningCredito = false;
                      }
                    }
                  })
                  .error(function (data, status, headers, config) {
                    $scope.ShowToast('No pudimos cargar tu información, por favor intenta de nuevo más tarde.', 'danger');
                    $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
                  });
              }(w));
            }
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar tus clientes, por favor intenta de nuevo más tarde', 'danger');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });

      EmpresasFactory.getEmpresas()
        .success(function (data) {
          $scope.CreditoDisponible = data[0].Credito;
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos cargar los datos de tu empresa, por favor intenta de nuevo más tarde', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();


    $scope.BajaEmpresa = function (Empresa) {
      var EmpresaUpdate = {};
      EmpresaUpdate = Empresa;
      EmpresaUpdate.IdEmpresaUsuarioFinal = Empresa.IdEmpresa;
      EmpresaUpdate.Activo = 0;

      EmpresasXEmpresasFactory.putEmpresasXEmpresa(EmpresaUpdate)
        .success(function (data) {
          if (data[0].Success == true) {
            $scope.ShowToast(data[0].Message, 'success');

            $scope.init();
          } else {
            $scope.Confirmar(Empresa.IdEmpresa);
            $scope.ShowToast(data[0].Message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos dar de baja a tu cliente, por favor intenta de nuevo más tarde', 'danger');

          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.Confirmar = function (IdEmpresa) {
      $scope.Empresas.forEach(function (Empresa) {
        if (Empresa.IdEmpresa == IdEmpresa) {
          Empresa.Mostrar = !Empresa.Mostrar;
        }
      }, this);
    };

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.ActualizarCredito = function (Empresa) {
      var total = 0;

      if ($scope.Empresas !== undefined) {
        for (var i = 0; i < $scope.Empresas.length; i++) {
          var Empresas = $scope.Empresas[i];

          if (Empresas.PorcentajeCredito != undefined && Empresas.PorcentajeCredito != null) {
            if (Empresas.PorcentajeCredito < 0) {
              $scope.ShowToast('Cantidad no válida', 'danger');
              return;
            } else {
              total += Empresas.PorcentajeCredito;
            }
          } else {
            Empresas.PorcentajeCredito = 0;
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

    $scope.NuevaEmpresa = function () {
      $scope.ShowToast('Alta de Nuevo Cliente', 'danger');
      $scope.SessionCookies = $cookies.getObject('Session');
      $window.location.href = `${$rootScope.SICLIK_REACT_FRONT}?id=${$window.btoa($scope.CaracteresAleatorios(8)+ $window.btoa($window.btoa($scope.SessionCookies.Token))+ $scope.CaracteresAleatorios(5)).replace(/X/g,"Ys")}`;
    };

    $scope.CaracteresAleatorios = function (length) {
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      var result = '';
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    };

    $scope.PosibilidadCredito = function () {
      var totalAsignado = 0;
      if ($scope.Empresas !== undefined) {
        for (var i = 0; i < $scope.Empresas.length; i++) {
          var Empresa = $scope.Empresas[i];
          if (Empresa.PorcentajeCredito != undefined && Empresa.PorcentajeCredito != null) {
            totalAsignado += Empresa.PorcentajeCredito;
          }
        }
      }

      return $scope.CreditoDisponible - totalAsignado;
    };

    $scope.CreditoRepartido = function () {
      var totalAsignado = 0;

      if ($scope.Empresas !== undefined) {
        for (var i = 0; i < $scope.Empresas.length; i++) {
          var Empresa = $scope.Empresas[i];

          if (Empresa.PorcentajeCredito != undefined && Empresa.PorcentajeCredito != null) {
            totalAsignado += Empresa.PorcentajeCredito;
          }
        }
      }

      return totalAsignado;
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

  EmpresasXEmpresasReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'PedidoDetallesFactory', '$window', '$rootScope'];

  angular.module('marketplace').controller('EmpresasXEmpresasReadController', EmpresasXEmpresasReadController);
}());
