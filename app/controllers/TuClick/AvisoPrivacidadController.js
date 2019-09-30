(function () {
    var AvisoPrivacidadController = function ($scope, $log, $cookies,  $sce) {
       $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
       let UrlAvisoPrivacidad = $scope.currentDistribuidor.UrlAvisoPrivacidad;
       let privacidad;

       if (getFileExtension(UrlAvisoPrivacidad) === 'pdf') {
         privacidad  = `<embed style="width:100%; height:700px;" src="${UrlAvisoPrivacidad}" type="application/pdf" />`;
       } else {
         privacidad  = `<img style="width:100%; height:700px;" src="${UrlAvisoPrivacidad}"  frameborder="0"> </img>`;
       }    
    document.getElementById('privacidad').innerHTML = privacidad;
    
    };

    function getFileExtension(filename) {
      return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }  

    AvisoPrivacidadController.$inject = ['$scope', '$log', '$cookies', '$sce'];
  
    angular.module('marketplace').controller('AvisoPrivacidadController', AvisoPrivacidadController);
  }());
  