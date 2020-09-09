(function () {
  var EmpresasXEmpresasReadAzureBudgetController = function ($scope, $log, $rootScope, $cookies, EmpresasXEmpresasFactory, EmpresasFactory, PedidosFactory) {
    $scope.sortBy = 'NombreEmpresa';
    $scope.reverse = false;
    $scope.CreditoDisponible = 0;
    $scope.PorcentajeAzureBudget = 100;
    $scope.CreditoRepartidoPorcentajeTotal = 0;
    $scope.payment = 0;
    $scope.paymentMethods = {
      CREDIT_CARD: 1,
      CS_CREDIT: 2,
      PAYPAL: 3,
      PREPAID: 4,
      STORE: 5
    };
    $scope.name = '';
    $scope.card = '';    
    $scope.errorDate = '';
    $scope.year = '';
    $scope.month = '';
    $scope.paymethod = 1;
    $scope.CREDIT_CARD_COM = 0.02;
    $scope.IVA = 1.16;
    String.prototype.splice = function (idx, rem, s) {
      return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
    };

    $scope.actualizarCantidades = function (Empresa = undefined) {
      CreditoPorRepartirPorcentaje();
      CreditoRepartidoPorcentaje();
      $scope.CreditoRepartido();
      $scope.CreditoPorRepartir();
      if (Empresa !== undefined) {
        if ($scope.CreditoRepartidoPorcentajeTotal > 100 || Empresa.PorcentajeAzureBudget === undefined) {
          $scope.ShowToast('No puedes repartir una cantidad mayor al 100 %', 'danger');
          Empresa.maxlength = true;
        } else {
          Empresa.maxlength = false;
        }
      }
    };

    $scope.showPaymentMethods = function (flag) {
      if (Number(flag)) {
        $scope.payment = 1;
      } else {
        $scope.payment = 0;
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
      const EmpresaActualizar = {
        PorcentajeAzureBudget: Empresa.PorcentajeAzureBudget,
        IdEmpresaDistribuidor: Empresa.IdEmpresaDistribuidor,
        IdEmpresaUsuarioFinal: Empresa.IdEmpresa,

      };

      if (EmpresaActualizar.PorcentajeAzureBudget === null) EmpresaActualizar.PorcentajeAzureBudget = 0;

      var total = 0;
      if (Empresa.PorcentajeAzureBudget != undefined && Empresa.PorcentajeAzureBudget != null) {
        if (Empresa.PorcentajeAzureBudget < 0) {
          $scope.ShowToast('Cantidad no válida', 'danger');
          return;
        } else if ($scope.CreditoRepartidoPorcentajeTotal > 100 ) {
          $scope.ShowToast('Sobrepasas el 100 por ciento', 'danger');
          return false;
        } else {
          total += Empresa.PorcentajeAzureBudget;
        }
      } else {
        Empresa.PorcentajeAzureBudget = 0;
      }

      EmpresasXEmpresasFactory.putEmpresasXEmpresaAzureBudget(EmpresaActualizar)
        .success(function (resultado) {
          if (resultado.success === true  || resultado.success === 1) {
            $scope.ShowToast(resultado.message, 'success');
          } else {
            $scope.ShowToast(resultado.message, 'danger');

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
        });
      }
      $scope.CreditoRepartidoPorcentajeTotal = totalAsignadoPorcentaje;
    };

    const CreditoPorRepartirPorcentaje = () => {
      let totalPorRepartirPorcentaje = 100;
      if ($scope.Empresas !== undefined) {
        $scope.Empresas.map(empresa => {
          if (empresa.PorcentajeAzureBudget != undefined && empresa.PorcentajeAzureBudget != null) {
            totalPorRepartirPorcentaje -= empresa.PorcentajeAzureBudget;
          }
        });
      }
      $scope.PorcentajeAzureBudget = totalPorRepartirPorcentaje;
    };

    $scope.CreditoRepartido = function () {
      $scope.CreditoRepartidoTotal = (($scope.CreditoDisponible * $scope.CreditoRepartidoPorcentajeTotal) / 100).toFixed(4);
    };

    $scope.CreditoPorRepartir = function () {
      $scope.CreditoPorRepartirTotal = (($scope.CreditoDisponible * $scope.PorcentajeAzureBudget) / 100).toFixed(4);
    };
    
    $scope.ActualizarFormaPago = function (metodoPago) {
      $scope.paymethod = metodoPago;
    };

    $scope.anios = [{nombre:'Año',valor:'default'},{nombre:'2020',valor:20},{nombre:'2021',valor:21},{nombre:'2022',valor:22},{nombre:'2023',valor:23},{nombre:'2024',valor:24},{nombre:'2025',valor:25}];
    $scope.meses = [{nombre:'Mes',valor:'default'},{nombre:'Enero',valor: '01'},{nombre:'Febrero',valor: '02'},{nombre:'Marzo',valor: '03'},{nombre:'Abril',valor: '04'},{nombre:'Mayo',valor: '05'},{nombre:'Junio',valor: '06'},{nombre:'Julio',valor: '07'},{nombre:'Agosto',valor: '08'},{nombre:'Septiembre',valor: '09'},{nombre:'Octubre',valor: '10'},{nombre:'Noviembre',valor: '11'},{nombre:'Diciembre',valor: '12'}]

    const keyAntifraude = () => {
      OpenPay.setId('mgp4crl0qu5nxy0ed2af');
      OpenPay.setApiKey('pk_9f2f5b3c557045298d7df2c67fe378fe');
      if ($rootScope.sandbox) OpenPay.setSandboxMode(true);
      $scope.deviceSessionId = OpenPay.deviceData.setup("payment-form", "device_session_id");
    };

    const fullFilOpenpayData = async () => {
      keyAntifraude();
      const siclikToken = await angular.element(document.getElementById('divComprar')).scope().getSiclikToken();
      const openpayCustomerId = await angular.element(document.getElementById('divComprar')).scope().getOpenPayCustomer(siclikToken);
      return ({
        openpayCustomerId,
        deviceSessionId: $scope.deviceSessionId,
        currency: 'MXN',
        amount: $scope.amount,
      });
    };

    async function success_callbak (response) {
      const openpayData = await fullFilOpenpayData();
      openpayData.sourceId = response.data.id;
      console.log(response, openpayData);
        PedidosFactory.payWithCardBudget(openpayData)
        .then(function (resultPayment) {
          if (resultPayment.data.success) {
            $cookies.remove('pedidosAgrupados');
            $scope.ShowToast(resultPayment.data.message, 'success');
            $('#modalPagoTC').modal('hide');
            angular.element(document.getElementById('divComprar')).scope().cerrarModal('modalPagoTC');
            $scope.payment = 0;
          } else {
            if (resultPayment.data.statusCode) {
              const cardError = angular.element(document.getElementById('divComprar')).scope().getCardPaymentError(resultPayment.data.error.code);
              $scope.ShowToast(cardError, 'danger');
            } else {
              $scope.ShowToast('Surgió un error, contactar a soporte o intentar más tarde.', 'danger');
            }
          }
        })
        .catch(function (error) { 
          $scope.ShowToast('Surgió un error, contactar a soporte o intentar más tarde.', 'danger');
        });
    }

    async function error_callbak (error) {
      const test = error.data.description;
      var arr = await test.split(",").map(function(item) {
        return item.trim();
      });
      return angular.element(document.getElementById('divComprar')).scope().checkErrors(arr);
    }

    const calculateTotal = () => {
      return (($scope.quantity * $scope.IVA) * $scope.CREDIT_CARD_COM) + $scope.quantity;
    }
    
    $scope.pagar = function () {
      if ($scope.quantity > 0) {
        keyAntifraude();
        $scope.amount = $scope.quantity;
        $scope.currency = 'Pesos';
      } else {
        $scope.ShowToast('Selecciona cantidad a pagar.', 'danger');
      }
    };

    $scope.checkPayment = function () {
      if ($scope.paymethod === $scope.paymentMethods.CREDIT_CARD) {
        $scope.pagar();
      } else if ($scope.paymethod === $scope.paymentMethods.PREPAID) {
        $scope.preparePrePaid();
      } else if ($scope.paymethod === $scope.paymentMethods.STORE) {
        $scope.payInStore();
      }
    };

    $scope.payInStore = async function () {
      if ($scope.quantity > 0) {
        if ($scope.quantity < 29999) {
          const openpayData = await fullFilOpenpayData();
          // Llamada a api
        } else {
          $scope.ShowToast('La compra en tienda no debe ser mayor a 29,999.', 'danger');
        }
      } else {
        $scope.ShowToast('Selecciona cantidad a pagar.', 'danger');
      }
    };

    $scope.preparePrePaid = async function () {
      if ($scope.quantity > 0) {
        const openpayData = await fullFilOpenpayData();
        // Llamada a api
      } else {
        $scope.ShowToast('Selecciona cantidad a pagar.', 'danger');
      }
    };
      
    $("#card").keyup(function(){              
      var ta      =   $("#card");
      letras      =   ta.val().replace(/ /g, "");
      ta.val(letras)
    }); 

    $.validator.addMethod("valueNotEquals", function(value, element, arg){
      return arg !== value;
     }, "Value must not equal arg.");


     $.validator.addMethod("dateValidation", function(value, element, params) {
       
      let minMonth = new Date().getMonth() + 1;
      let minYear = new Date().getFullYear();

      let month = parseInt(params.formMonth[0].value, 10);
      let year = parseInt(params.formYear[0].value, 10);
      year = year + 2000;

      if ((year > minYear) || ((year === minYear) && (month >= minMonth))) {
          return true;
      } else {
          return false;
      }
}, "La fecha de expiración de tu tarjeta es incorrecta.");

      $('#payment-form').validate({
          rules: {
            name: { 
              required: true,
            },
            cardNumber: {
                   required: true,
                   number: true,
                   maxlength: 19,
                   minlength: 16
               },
               ccexpmonth: { valueNotEquals: "default" },
            ccexpyear: { 
              valueNotEquals: "default" ,
              dateValidation: { 
                formMonth: $('#ccexpmonth'),
                formYear:  $('#ccexpyear'),
              }
          },
            cvv: {
              required: true,
              number: true,
              maxlength: 3,
              minlength: 3
            }
          },
          messages: {
              name: {
                  required: "Es requerido*",

              },          
              cardNumber: {
                   required: "Es requerido*",
                   number: "Solo se permiten números*",
                   maxlength: "Máximo 19 digitos",
                   minlength: "Mínimo 16 digitos"
               },
               ccexpmonth: { valueNotEquals: "Selecciona un mes" },
               ccexpyear: { 
                 valueNotEquals: "Selecciona un año",
               },
               cvv: {
                required: "Es requerido*",
                number: "Solo se permiten números*",
                maxlength: "Máximo 3 digitos",
                minlength: "Mínimo 3 digitos",
              }
           },
           submitHandler: function (form) {
              OpenPay.token.extractFormAndCreate('payment-form', success_callbak, error_callbak); 
         }
      });
  
    $scope.IniciarTourClients = function () {
      $scope.Tour = new Tour({
        steps: [
          {
            element: '.newClient',
            placement: 'bottom',
            title: 'Agrega nuevos clientes',
            content: 'Da de alta un nuevo cliente y asígnale crédito para Click suscribe.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: '.totalCredit',
            placement: 'bottom',
            title: 'Crédito total',
            content: 'El crédito total que tienes en Click suscribe para hacer compras o renovar suscripciones.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: '.asignCredit',
            placement: 'bottom',
            title: 'Crédito total asignado',
            content: 'Cantidad que ya se repartió entre tus clientes.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: '.giveCredit',
            placement: 'bottom',
            title: 'Crédito por repartir',
            content: 'Cantidad disponible o pendiente por repartir entre tus clientes.',
            template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Atrás</button><button class='btn btn-default' data-role='next'>Sig »</button><button class='btn btn-default' data-role='end'>Finalizar</button></nav></div></div>"
          },
          {
            element: '.pesosCredit',
            placement: 'left',
            title: 'Asigna crédito',
            content: 'Asígnale crédito a cada cliente en base a tu monto total.',
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

  EmpresasXEmpresasReadAzureBudgetController.$inject = ['$scope', '$log', '$rootScope', '$cookies', 'EmpresasXEmpresasFactory', 'EmpresasFactory', 'PedidosFactory'];

  angular.module('marketplace').controller('EmpresasXEmpresasReadAzureBudgetController', EmpresasXEmpresasReadAzureBudgetController);
}());
