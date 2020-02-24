(function () {
  var MonitorDetalleAwsController = function ($scope, AmazonDataFactory) {
    $scope.DeshabilitarPagar = false;
    $scope.init = function () {
      $scope.CheckCookie();
      AmazonDataFactory.getDataServiceAWS()
        .success(function (Services) {
          $scope.selectServices = Services;
          $scope.selectServicesBase = Services;
          $scope.SessionCookie.IdTipoAcceso === 1 ? (
            pagination()
          ) : (
            $scope.getServicesAws($scope.SessionCookie.IdEmpresa)
          );
        })
        .error(() => {
          $scope.ShowToast('No pudimos cargar la lista de consumos, por favor intenta de nuevo más tarde.', 'danger');
        });

      AmazonDataFactory.getCustomersAWS()
        .success(function (CustomersAWS) {
          $scope.selectCustomersAws = CustomersAWS;
        })
        .error(() => {
          if ($scope.SessionCookie.IdTipoAcceso === 2 ||$scope.SessionCookie.IdTipoAcceso === 3){
            $scope.selectCustomersAws = CustomersAWS;
          }
          $scope.ShowToast('No pudimos cargar la lista de clientes de Amazon, por favor intenta de nuevo más tarde.', 'danger');
        });
    };
    const getFilteredByKey = (key, value) => {
      return $scope.selectServicesBase.filter(function (e) {
        return e[key] == value;
      });
    }

    $scope.getServicesAws = IdCustomer => {
      IdCustomer ? (
        $scope.selectServices = getFilteredByKey("IdDistribuidor", IdCustomer),
        $scope.selectConsoles = [...new Set($scope.selectServices.map(x => x.NombreConsola))],
        $scope.IdCustomer = IdCustomer
      ) : (
        $scope.ShowToast('Seleccione un cliente.', 'danger')
      );
      pagination();
    };

    $scope.getConsoles = IdConsole => {
      IdConsole ? (
        $scope.selectServices = getFilteredByKey("NombreConsola", IdConsole)
      ) : (
        $scope.selectServices = getFilteredByKey("IdDistribuidor", $scope.IdCustomer)
      );
      pagination();
    };

    const pagination = () => {
      $scope.filtered = [], $scope.currentPage = 1, $scope.numPerPage = 10, $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;

        $scope.filtered = $scope.selectServices.slice(begin, end);
      });
    }
    $scope.init();
  };

  MonitorDetalleAwsController.$inject = ['$scope', 'AmazonDataFactory'];

  angular.module('marketplace').controller('MonitorDetalleAwsController', MonitorDetalleAwsController);
}());