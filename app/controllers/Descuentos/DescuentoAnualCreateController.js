(function () {
  var DescuentoAnualCreateController = function ($scope, $log, $cookies, $location, DescuentosFactory, $routeParams) {
    var Session = {};
    Session = $cookies.getObject('Session');
    $scope.Session = Session;
    $scope.descuentoAnual = {};
    $scope.FechaExpiracion = {};

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.obtenerDescuentoAnual();

    };

    $scope.obtenerDescuentoAnual = function () {
      DescuentosFactory.getDescuentoAnual()
        .success(function (result) {
          console.log(result,'ccccc');
          if (result.success) {
            console.log();
            $scope.DescuentoAnual.PorcentajeDescuento = result.data.DescuentoAnual;
            $scope.FechaExpiracion = result.data.FechaExpiracion;
            var fecha= result.data.FechaExpiracion;
            var res = fecha.replace(" 00:00:00", "");
            console.log("valor fecha",res);
            document.getElementById("FechaExpiracion").innerHTML = res;
            $scope.FechaExpiracion = res;
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (result) {
          $scope.ShowToast(result.message, 'danger');
        });
    };

    $scope.init();

    $scope.descuentoCancelar = function () {
      $location.path('/Descuento-Anual');
    };

    $scope.DescuentoAnual = function () {
      var dateExpiration = document.getElementById("FechaExpiracion").value;
      var fullDateExpiration = dateExpiration + " 00:00:00"
      
      $scope.FechaExpiracion=fullDateExpiration;
      DescuentosFactory.postDescuentoAnual($scope.DescuentoAnual.PorcentajeDescuento, $scope.FechaExpiracion)
          .success(function (result) {
            if (result.success) {
              $location.path('/Descuento-Anual');
              $scope.ShowToast(result.message, 'success');
            } else {
              $scope.ShowToast("Por favor ingresa Una fecha valida", 'danger');
            }
          })
          .error(function (result) {
            $scope.ShowToast("Por favor ingresa Una fecha valida",'danger');
          });
    };
  };
  DescuentoAnualCreateController.$inject = ['$scope', '$log', '$cookies', '$location', 'DescuentosFactory', '$routeParams'];
  angular.module('marketplace').controller('DescuentoAnualCreateController', DescuentoAnualCreateController);
}());

