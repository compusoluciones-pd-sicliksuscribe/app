(function () {
  var EmpresasCreditoUpdateController = function ($scope, $log, $location, $cookies, $routeParams, EmpresasFactory) {
    var IdEmpresa = $routeParams.IdEmpresa;

    var Session = {};

    Session = $cookies.getObject('Session');

    $scope.Empresa = {};

    $scope.init = function () {
      $scope.CheckCookie();

      EmpresasFactory.getEmpresa(IdEmpresa)
        .success(function (Empresa) {
          $scope.Empresa = Empresa[0];
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    $scope.EmpresaUpdate = function () {
      var Empresa =
        {
          IdEmpresa: $scope.Empresa.IdEmpresa,
          Cliente: $scope.Empresa.IdERP,
          Credito: $scope.Empresa.Credito
        };

      EmpresasFactory.putEmpresa(Empresa)
        .success(function (result) {
          console.log("RESULT putEmpresa")
          console.log(result)
          if (result.success === 1) {
            $scope.ShowToast(result.message, 'success');
            $location.path("/Empresas");
          } else {
            $scope.ShowToast(result.message, 'danger');
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.EmpresaCancel = function () {
      $location.path("/Empresas");
    };

    // BUDGET
    function ValidarObjetoFormulario (EmpresaBudgetAzure) {
      var banderaValidacion = 0;
      var errorValidacion = {
        Correcto: 0,
        Mensaje: ''
      };
      if (isNaN(EmpresaBudgetAzure.MetodoPago)) {
        errorValidacion.Correcto = 0;
        errorValidacion.Mensaje = 'Debes seleccionar un tipo de anticipo';
        banderaValidacion = 0;
      } else {
        banderaValidacion = 1;
      }
      if (banderaValidacion === 1) {
        if (EmpresaBudgetAzure.Cantidad === null || EmpresaBudgetAzure.Cantidad === undefined){
          errorValidacion.Correcto = 0;
          errorValidacion.Mensaje = 'Debes seleccionar una cantidad válida';
        } else {
          errorValidacion.Correcto = 1;
        }
    } else {
        errorValidacion.Correcto = 0;
        errorValidacion.Mensaje = 'Debes seleccionar un tipo de anticipo';
    }
      return errorValidacion;
    }
    
    $scope.EmpresaUpdateBudget = function () {
      var EmpresaBudgetAzure =
        {
          Cliente: $scope.Empresa.IdERP,
          // Cliente: 'MF24687',
          Cantidad: $scope.Empresa.Anticipo,
          MetodoPago: Number($scope.Empresa.TipoAnticipo)
        };

        console.log("EmpresaBudgetAzure")
        console.log(EmpresaBudgetAzure)
      var validacion = ValidarObjetoFormulario(EmpresaBudgetAzure);
      if (validacion.Correcto) {
        EmpresasFactory.putBudgetAzure(EmpresaBudgetAzure)
         .success(function (result) {
           console.log("RESULT");
           console.log(result);
           if (result[0].Success === true) {
             $scope.ShowToast(result[0].Message, 'success');
             $location.path("/Empresas");
           } else {
             $scope.ShowToast(result[0].Message, 'danger');
           }
         })
         .error(function (data, status, headers, config) {
           $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
         });
      } else {
        $scope.ShowToast(validacion.Mensaje, 'danger');
      }
    };
  };

  EmpresasCreditoUpdateController.$inject = ['$scope', '$log', '$location', '$cookies', '$routeParams', 'EmpresasFactory'];

  angular.module('marketplace').controller('EmpresasCreditoUpdateController', EmpresasCreditoUpdateController);
}());
