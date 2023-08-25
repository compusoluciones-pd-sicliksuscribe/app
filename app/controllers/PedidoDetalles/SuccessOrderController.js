(function () {
  var SuccessOrderController = function ($scope, $log, $rootScope, $location, $cookies, $route, PedidoDetallesFactory) {
    $scope.currentPath = $location.path();
    $scope.orderIdsCookie = $cookies.getObject('orderIdsCookie').data || $cookies.getObject('orderIdsCookie');
    $scope.Session = $cookies.getObject('Session');

    const stars = [
      document.querySelector('#star1'),
      document.querySelector('#star2'),
      document.querySelector('#star3'),
      document.querySelector('#star4'),
      document.querySelector('#star5'),
    ];
    
    let calificacion = null;
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const añoActual = fechaActual.getFullYear();
    const finDeAño = mesActual === 12;

    $scope.ratingClick = event => {
      const starIndex = stars.indexOf(event.target);
      calificacion = starIndex + 1;
      stars.forEach(() => { 
        for (let i = 0; i <= starIndex; i++) {
          stars[i].classList.add('checked');
        }
        for (let i = starIndex + 1; i < stars.length; i++) {
          stars[i].classList.remove('checked');
        }
      })
    }
      
    $scope.AceptaPedido = function () {
      angular.element(document.getElementById('auxScope')).scope().gaAceptarCompra();
      deleteCookie('orderIdsCookie');
      deleteCookie('compararPedidosAnteriores');
      $location.path('/');
    };

    $scope.numeroConfirmacion = function (data) {
      if (!data) return false;
      else return true;
    };

    $scope.abrirModal = async modal => {
      if (modal !== 'modalCalificacion') document.getElementById(modal).style.display = 'block';
      else {
        PedidoDetallesFactory.verificarEstatusDeRespuesta(parseInt($scope.Session.IdUsuario))
        .then(response => {
          const fecha = response.data.content;
          if (fecha.length === 0 || fecha[0]?.Año < añoActual || fecha[0]?.Año >= añoActual && fecha[0]?.MesPendiente <= mesActual) {
            document.getElementById(modal).style.display = 'block';
          }
        })
      }
    };

    $scope.guardarCalificacion = () => (
        PedidoDetallesFactory.guardarCalificacion($scope.Session.IdUsuario, calificacion, $scope.ratingComentary),
        PedidoDetallesFactory.ActualizarEstatusDeRespuesta($scope.Session.IdUsuario, finDeAño ? 1 : mesActual + 1, finDeAño ? añoActual + 1 : añoActual)
      .then(result => {
        if (result.data.success) {
          $scope.ShowToast('Hemos recibido su comentario, muchas gracias.', 'success');
        } else {
          $scope.ShowToast(result.data.message, 'No se ha podido guardar la información')
        }
      })
    )

    $scope.cerrarModal = modal => {
      if (modal === 'modalCalificacion' && calificacion === null) {
        $scope.ShowToast('Por favor ingrese una calificación', 'warning');
      }
      else {
        if (modal === 'modalCalificacion') $scope.guardarCalificacion();
        document.getElementById(modal).style.display = 'none';
        $scope.ClearToast();
      }
    };

    $scope.modalOpenpayConfirma = function () {
      let modalPagoMonitor = document.getElementById('modalOpenpayConfirma');
      modalPagoMonitor.style.display = 'block';
    };

    $scope.init = function () {
      const MICROSOFT = 1;
      $scope.modalOpenpayConfirma();
      if ($scope.currentPath === '/SuccessOrder') {
        $scope.CheckCookie();
        $scope.orderIdsCookie.forEach(elemento => {
          if (elemento.IdFabricante === MICROSOFT) {
            $scope.MPNID = elemento.IdMicrosoftDist;
            PedidoDetallesFactory.getMPIDInformation(parseInt($scope.MPNID))
            .success(function (response) {
              response.data.status === 'active' ? $scope.isMPNIDActive = true : $scope.isMPNIDActive = false;
              if (!$scope.isMPNIDActive) $scope.abrirModal('isValidMPNIDModal');
            })
            .error(function (data, status, headers, config) {
              $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
            });
          }
        });
      }
    };

    $scope.init();

    function deleteCookie (CookieName) {
      document.cookie = CookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };
  SuccessOrderController.$inject = ['$scope', '$log', '$rootScope', '$location', '$cookies', '$route', 'PedidoDetallesFactory'];
  angular.module('marketplace').controller('SuccessOrderController', SuccessOrderController);
})();
