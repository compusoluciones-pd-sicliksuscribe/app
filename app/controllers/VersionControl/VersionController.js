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
        .success(function (versiones) {
          $scope.versiones = versiones.data;
          obtenerDetalle();
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos traer las versiones.', 'danger');
          $location.path('/');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };
  
    var obtenerDetalle = function (Id) {
      var IdVersion = Id || 1;
      VersionFactory.getVersionDetalle(IdVersion)
        .success(function (versiones) {
          $scope.detalleVersion = versiones.data;
        })
        .error(function (data, status, headers, config) {
          $scope.ShowToast('No pudimos traer el detalle de la versión.', 'danger');
          $location.path('/');
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
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
    }

  };

  VersionController.$inject = ['$scope', '$log', '$location', '$cookies', '$route', 'VersionFactory', '$anchorScroll', '$routeParams'];
  angular.module('marketplace').controller('VersionController', VersionController);
}());
