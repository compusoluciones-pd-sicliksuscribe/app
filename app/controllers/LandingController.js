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

        EmpresasFactory.getSitio(subdomain).success(function (empresa) {
            if ($scope.currentDistribuidor) {
              PromocionsFactory.getPromocions(empresa.data[0].IdEmpresa)
              .success(function (Promociones) {
                $scope.Promociones = Promociones;
              })
              .error(function (data, status, headers, config) {
                $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
              });
            }
        });
    };

    $scope.init();
  };

  LandingController.$inject = ['$scope', '$log', '$location', '$cookies', 'PromocionsFactory', 'deviceDetector', '$rootScope', 'EmpresasFactory'];
  angular.module('marketplace').controller('LandingController', LandingController);
}());
