(function () {
  var LandingController = function ($scope, $log, $location, $cookies, PromocionsFactory, deviceDetector, $rootScope, EmpresasFactory) {
    $scope.Promociones = {};

    $scope.init = function () {
      $scope.esNavegadorSoportado();
      $scope.navCollapsed = true;

      var url = window.location.href;
      var subdomain = '';
      subdomain = url.replace('http://', '');
      subdomain = subdomain.replace('https://', '');
      subdomain = subdomain.substring(0, subdomain.indexOf($rootScope.dominio));
      subdomain = subdomain.replace(new RegExp('[.]', 'g'), '');
      subdomain = subdomain.replace('www', '');

      if (subdomain) {
        EmpresasFactory.getSitio(subdomain)
        .then(empresa => {
          if ($scope.currentDistribuidor) {
            PromocionsFactory.getPromocions(empresa.data.data[0].IdEmpresa)
            .then(Promociones => {
              $scope.Promociones = Promociones.data;
            })
            .catch(error => {
              $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
            });
          }
        });
      } else {
        PromocionsFactory.getPromocions(0)
          .then(function OnSuccess (response) {
            $scope.Promociones = response.data;
            // console.log($scope.Promociones);
          }).catch(function onError (response) {
            console.log(`data error: ${response.error}, status: ${response.status}`);
          });
      }
    };

    $scope.init();
  };

  LandingController.$inject = ['$scope', '$log', '$location', '$cookies', 'PromocionsFactory', 'deviceDetector', '$rootScope', 'EmpresasFactory'];
  angular.module('marketplace').controller('LandingController', LandingController);
}());
