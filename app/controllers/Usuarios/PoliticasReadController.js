(function () {
  var PoliticasReadController = function ($scope, $routeParams, $window) {
    let rutaPDF;
    let containerPDF;
    let terminosMS = 'https://politicas-clicksuscribe.s3.amazonaws.com/PoliticasMS.pdf';
    let terminosAD = 'https://politicas-clicksuscribe.s3.amazonaws.com/PoliticasAD.pdf';
    let cancelaciones = 'https://politicas-clicksuscribe.s3.amazonaws.com/Cancelaciones.pdf';

    $scope.init = function () {
      $scope.title = true;
      $scope.container = false;
    };
    $scope.politics = function (maker) {
      $scope.title = false;
      $scope.container = true;
      switch (maker) {
        case 'tycMS':
          rutaPDF = terminosMS;
          break;
        case 'tycAD':
          rutaPDF = terminosAD;
          break;
        case 'cancel':
          rutaPDF = cancelaciones;
          break;
        default:
          rutaPDF = terminosMS;
          break;
      }
      containerPDF = `<embed style="width:100%; height:700px;" src="${rutaPDF}" type="application/pdf" />`;
      document.getElementById('pdf').innerHTML = containerPDF;
    };
    $scope.init();
  };

  PoliticasReadController.$inject = ['$scope', '$routeParams', '$window'];

  angular.module('marketplace').controller('PoliticasReadController', PoliticasReadController);
}());
