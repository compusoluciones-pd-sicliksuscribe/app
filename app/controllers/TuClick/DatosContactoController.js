(function () {
  var DatosContactoController = function ($scope, $log, $cookies, $sce) {
    $scope.currentDistribuidor = $cookies.getObject('currentDistribuidor');
    let UrlContacto = $scope.currentDistribuidor.UrlContacto;
    let contact;

    if ($scope.currentDistribuidor.Subdominio !== 'cadgrafics') {
      if (getFileExtension(UrlContacto) === 'pdf') {
        contact = `<embed  style="width:100%; height:700px;" src="${UrlContacto}" type="application/pdf" />`;
      } else {
        contact = `<img style="width:100%; height:700px;" src="${UrlContacto}"  frameborder="0"> </img>`;
      }
      document.getElementById('contact').innerHTML = contact;
    }
  };

  function getFileExtension (filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  DatosContactoController.$inject = ['$scope', '$log', '$cookies', '$sce'];

  angular.module('marketplace').controller('DatosContactoController', DatosContactoController);
}());
