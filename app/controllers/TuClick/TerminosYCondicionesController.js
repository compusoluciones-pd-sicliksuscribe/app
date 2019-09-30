(function () {
    var TerminosYCondicionesController = function ($scope, $log, $cookies,  $sce) {
       $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
       let terminosPDF = $scope.currentDistribuidor.TerminosYCondiciones;
       let terminos;

       if (getFileExtension(terminosPDF) === 'pdf') {
         terminos  = `<embed style="width:100%; height:700px;" src="${terminosPDF}" type="application/pdf" />`;
       } else {
         terminos  = `<img style="width:100%; height:700px;" src="${terminosPDF}"  frameborder="0"> </img>`;
       }    
    document.getElementById('terminos').innerHTML = terminos;
    
    };

    function getFileExtension(filename) {
      return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    TerminosYCondicionesController.$inject = ['$scope', '$log', '$cookies', '$sce'];
  
    angular.module('marketplace').controller('TerminosYCondicionesController', TerminosYCondicionesController);
  }());
  