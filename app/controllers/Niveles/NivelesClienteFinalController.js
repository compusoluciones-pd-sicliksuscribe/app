(function () {
  var NivelesClienteFinalController = function ($scope, $location, $cookies, NivelesClienteFinalFactory) {
    $scope.sortBy = 'Nivel';
    $scope.reverse = false;
    $scope.Nivel = {};
    $scope.levels = [];
    $scope.newLevel = '';
    $scope.session = $cookies.getObject('Session');

    const getLevels = function () {
      NivelesClienteFinalFactory.getLevels()
        .then(function (result) {
          $scope.levels = result.data.data;
        })
        .catch(function (result) {
          $scope.ShowToast(!result.data ? 'Ha ocurrido un error, inténtelo más tarde.' : result.data.message, 'danger');
        });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      getLevels();
    };

    $scope.init();

    $scope.OrdenarPor = function (Atributo) {
      $scope.sortBy = Atributo;
      $scope.reverse = !$scope.reverse;
    };

    $scope.deleteLevel = function (level) {
      NivelesClienteFinalFactory.deleteLevel(level.IdNivelEmpresaUsuarioFinal)
        .then(function (result) {
          $scope.levels.forEach(function (property, index) {
            if (property.IdNivelEmpresaUsuarioFinal === level.IdNivelEmpresaUsuarioFinal) {
              $scope.levels.splice(index, 1);
            }
          });
          return result;
        })
        .then(function (result) { $scope.ShowToast(result.data.message, 'success'); })
        .catch(function (result) {
          $scope.ShowToast(!result.data ? 'Ha ocurrido un error, inténtelo más tarde.' : result.data.message, 'danger');
        });
    };

    $scope.addLevel = function (level) {
      const enterpriseId = $scope.session.IdEmpresa;
      const newLevel = { IdEmpresaDistribuidor: enterpriseId, Nivel: level };
      NivelesClienteFinalFactory.addLevel(newLevel)
        .then(function (result) {
          $scope.ShowToast(result.data.message, 'success');
          $scope.newLevel = '';
          $scope.init();
        })
        .catch(function (result) {
          $scope.ShowToast(!result.data ? 'Ha ocurrido un error, inténtelo más tarde.' : result.data.message, 'danger');
        });
    };

    $scope.addDiscount = function (level) {
      // console.log('level', typeof level);
      // console.log(level);
      $cookies.putObject('nivel', level.Nivel);
      $location.path('/Niveles/Distribuidor/' + level.IdNivelEmpresaUsuarioFinal + '/Descuentos');
    };
  };

  NivelesClienteFinalController.$inject = ['$scope', '$location', '$cookies', 'NivelesClienteFinalFactory'];

  angular.module('marketplace').controller('NivelesClienteFinalController', NivelesClienteFinalController);
}());
