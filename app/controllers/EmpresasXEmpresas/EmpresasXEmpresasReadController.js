(function () {
  var EmpresasXEmpresasReadController = function ($scope, $log, $location, $cookies, EmpresasXEmpresasFactory, EmpresasFactory, PedidoDetallesFactory, $window, $rootScope) {
    $scope.sortBy = 'NombreEmpresa';
    $scope.reverse = false;
    $scope.CreditoDisponible = 0;
    $scope.Cont = 0;
    $scope.form = {};
    $scope.form.habilitar = false;
    $scope.Saldo = 0;

    String.prototype.splice = function (idx, rem, s) {
      return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
    };

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasXEmpresasFactory.getEmpresasXEmpresas()
        .then(Empresas => {
          if (Empresas) {
            $scope.Empresas = Empresas.data;
            $scope.listaAux = $scope.Empresas;
            pagination();
          }
        })
        .catch(() => $scope.ShowToast('No pudimos cargar tus clientes, por favor intenta de nuevo más tarde', 'danger'));

      EmpresasFactory.getEmpresas()
        .then(result => {
          $scope.CreditoDisponible = result.data[0].Credito;
          $scope.Saldo = Number(result.data[0].Saldo) + Number(result.data[0].VentaPendiente);
        })
        .catch(() => $scope.ShowToast('No pudimos cargar los datos de tu empresa, por favor intenta de nuevo más tarde', 'danger'));
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
        .then(result => {
          if (result.data[0].Success == true) $scope.ShowToast(result.data[0].Message, 'success');
          else {
            $scope.ShowToast(result.data[0].Message, 'danger');

            $scope.init();
          }
        })
        .catch(() => $scope.ShowToast('No pudimos actualizar el crédito, por favor intenta de nuevo más tarde', 'danger'));
    };

    $scope.NuevaEmpresa = function () {
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

    $scope.totalDebt = () => {
      let totalAsignado = 0;
      if ($scope.Empresas) $scope.Empresas.forEach(uf => { if (uf.debt) totalAsignado += uf.debt });
      return (totalAsignado += Number($scope.Saldo));
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

    $scope.filter = () => {
      $scope.listaAux = $scope.Empresas.filter(function (str) {
        return str.NombreEmpresa.toLowerCase().indexOf($scope.EmpresaFilter.toLowerCase()) !== -1;
      });
      pagination();
    };

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

    $scope.goToMonitor = () => $location.path('/Monitor');
  };

  EmpresasXEmpresasReadController.$inject = ['$scope', '$log', '$location', '$cookies', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'PedidoDetallesFactory', '$window', '$rootScope'];

  angular.module('marketplace').controller('EmpresasXEmpresasReadController', EmpresasXEmpresasReadController);
}());
