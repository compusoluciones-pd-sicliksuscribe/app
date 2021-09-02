(function () {
  var PoliticasReadController = function ($scope, $routeParams, $window) {
    let rutaPDF;
    let containerPDF;
    let terminosMS = 'https://politicas-clicksuscribe.s3.amazonaws.com/PoliticasMS.pdf';
    let terminosAD = 'https://politicas-clicksuscribe.s3.amazonaws.com/PoliticasAD.pdf';
    let cancelaciones = 'https://politicas-clicksuscribe.s3.amazonaws.com/Cancelaciones.pdf';
    let entrega = 'https://politicas-clicksuscribe.s3.amazonaws.com/Entregas.pdf';

    $scope.init = function () {
      let route = $routeParams.politic;
      if (route === 'TyC') {
        $scope.politics('tycMS');
      } 
      else if (route === 'Cancelaciones') {
        $scope.politics('cancel');
      } else {
        $scope.politics('entrega');
      }
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
        case 'entrega':
          rutaPDF = entrega;
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
