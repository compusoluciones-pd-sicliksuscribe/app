(function () {
  var VersionController = function ($scope, $log, $location, $cookies, $route, VersionFactory, $anchorScroll) {
    $scope.versiones = [];
    $scope.currentPath = $location.path();
    $anchorScroll.yOffset = 130;
    $scope.selected = {};

    $scope.init = function () {
      if ($scope.currentPath === '/Version') {
        $scope.CheckCookie();
        $scope.obtenerVersiones();
      }
    };

    $scope.obtenerVersiones = function () {
      VersionFactory.getVersiones()
        .then(versiones => {
          $scope.versiones = versiones.data.data;
          obtenerDetalle();
        })
        .catch(error => {
          $scope.ShowToast('No pudimos traer las versiones.', 'danger');
          $location.path('/');
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    var obtenerDetalle = function (Id) {
      var IdVersion = Id || 1;
      VersionFactory.getVersionDetalle(IdVersion)
        .then(versiones => {
          $scope.detalleVersion = versiones.data.data;
        })
        .catch(error => {
          $scope.ShowToast('No pudimos traer el detalle de la versión.', 'danger');
          $location.path('/');
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    $scope.init();

    $scope.GetDetalle = function (IdVersion, text) {
      if (!IdVersion) {
        IdVersion = 1;
      }
      obtenerDetalle(IdVersion);
    };

    $scope.scrollTo = function (id) {
      $anchorScroll(id);
    };
  };

  VersionController.$inject = ['$scope', '$log', '$location', '$cookies', '$route', 'VersionFactory', '$anchorScroll', '$routeParams'];
  angular.module('marketplace').controller('VersionController', VersionController);
}());
