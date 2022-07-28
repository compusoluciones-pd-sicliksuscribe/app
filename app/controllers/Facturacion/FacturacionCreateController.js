(function () {
  var FacturacionCreateController = function ($scope, $log, $cookies, $location, $uibModal, $filter, FacturacionFactory, EmpresasFactory, $routeParams) {
    $scope.InfoFactura = {};
    $scope.usuarioDisabled = false;
    $scope.passwordShow = false;
    $scope.regimenFisico = [
      {id: '605', name: 'Sueldos y Salarios e Ingresos Asimilados a Salarios'},
      {id: '606', name: 'Arrendamiento'},
      {id: '608', name: 'Demás ingresos'},
      {id: '610', name: 'Residentes en el Extranjero sin Establecimiento Permanente en México'},
      {id: '611', name: 'Ingresos por Dividendos (socios y accionistas)'},
      {id: '612', name: 'Personas Físicas con Actividades Empresariales y Profesionales'},
      {id: '614', name: 'Ingresos por intereses'},
      {id: '616', name: 'Sin obligaciones fiscales'},
      {id: '621', name: 'Incorporación Fiscal'},
      {id: '622', name: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras'},
      {id: '629', name: 'De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales'},
      {id: '630', name: 'Enajenación de acciones en bolsa de valores'},
      {id: '615', name: 'Régimen de los ingresos por obtención de premios'}
    ];
    $scope.regimenMoral = [
      {id: '601', name: 'General de Ley Personas Morales'},
      {id: '603', name: 'Personas Morales con Fines no Lucrativos'},
      {id: '609', name: 'Consolidación'},
      {id: '610', name: 'Residentes en el Extranjero sin Establecimiento Permanente en México'},
      {id: '620', name: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos'},
      {id: '622', name: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras'},
      {id: '623', name: 'Opcional para Grupos de Sociedades'},
      {id: '624', name: 'Coordinados'},
      {id: '628', name: 'Hidrocarburos'},
      {id: '607', name: 'Régimen de Enajenación o Adquisición de Bienes'}
    ];
    $scope.regimen = [];
    function init () {
      EmpresasFactory.getEmpresa($scope.SessionCookie.IdEmpresa)
        .then(resultado => {
          var empresa = resultado.data[0];
          if (resultado.data[0].IdEmpresa) {
            $scope.InfoFactura.rfc = empresa.RFC;
            $scope.InfoFactura.nombre = empresa.NombreEmpresa;
            $scope.InfoFactura.IdEmpresa = empresa.IdEmpresa;
            $scope.InfoFactura.nombre_contacto = empresa.NombreContacto;
            $scope.InfoFactura.telefono = empresa.TelefonoContacto;
            $scope.InfoFactura.calle = empresa.Direccion;
            $scope.InfoFactura.email = empresa.CorreoContactoFacturacion;
            $scope.InfoFactura.municipio = empresa.Ciudad;
            $scope.InfoFactura.estado = empresa.Estado;
            $scope.InfoFactura.codigo_postal = Number(empresa.CodigoPostal);
            $scope.InfoFactura.usuario = empresa.UsuarioFacturacion;
            $scope.InfoFactura.AltaFacturacion = empresa.AltaFacturacion;
            $scope.InfoFactura.password = empresa.PasswordFacturacion;
            $scope.InfoFactura.regimen = empresa.RegimenFacturacion;
            $scope.usuarioDisabled = !!empresa.UsuarioFacturacion;
            $scope.passwordShow = !!empresa.UsuarioFacturacion;
            if (/^\w{4}\d{6}[\w\d]{3}$/.test(empresa.RFC)) {
              $scope.regimen = $scope.regimenFisico;
            } else {
              $scope.regimen = $scope.regimenMoral;
            }
          } else {
            if (resultado.data.message) {
              $scope.Mensaje = resultado.data.message;
              $scope.ShowToast(resultado.data.message, 'danger');
            } else {
              $scope.Mensaje = 'Error de conexion con los servidores de datos, intenta refrescar la pagina o esperar unos minutos';
              $scope.ShowToast('Error de conexion con los servidores de datos, intenta refrescar la pagina o esperar unos minutos', 'danger');
            }
          }
        })
        .catch(error => {
          $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
        });
    };

    init();

    function isItReadyYet () {
      if (!$scope.InfoFactura.CSD_B64 || !$scope.InfoFactura.key_B64) {
        setTimeout(isItReadyYet, 100);
      }
    }

    $scope.DarDeAlta = function () {
      if (!$scope.frm.$invalid) {
        var CSD_B64 = document.getElementById('CSD_B64').files[0];
        var KEY_B64 = document.getElementById('key_B64').files[0];
        var InfoFactura = $scope.InfoFactura;
        var formData = new window.FormData();
        formData.append('CSD_B64', CSD_B64);
        formData.append('key_B64', KEY_B64);
        formData.append('contrasenaCSD', InfoFactura.contrasenaCSD);
        formData.append('regimen', InfoFactura.regimen);
        formData.append('nombre_contacto', InfoFactura.nombre_contacto);
        formData.append('usuario', InfoFactura.usuario);
        formData.append('password', InfoFactura.password);
        formData.append('telefono', InfoFactura.telefono);
        formData.append('email', InfoFactura.email);
        setTimeout(isItReadyYet, 100);
        FacturacionFactory.postDarDeAlta(formData)
          .then(resultado => {
            if (resultado.data.success === 1) {
              $scope.ShowToast('Datos confirmados.', 'success');
              $location.path('/facturas-pendientes/');
            } else {
              if (resultado.data.message) {
                $scope.Mensaje = resultado.data.message;
                $scope.ShowToast(resultado.data.message, 'danger');
              } else {
                $scope.Mensaje = 'No pudimos enviar tu solicitud, por favor verifica tus datos o intenta de nuevo más tarde.';
                $scope.ShowToast('No pudimos enviar tu solicitud, por favor verifica tus datos o intenta de nuevo más tarde.', 'danger');
              }
            }
          })
          .catch(error => {
            $log.log('data error: ' + error + ' status: ' + error.status + ' headers: ' + error.headers + ' config: ' + error.config);
          });
      }
    };
  };
  FacturacionCreateController.$inject = ['$scope', '$log', '$cookies', '$location', '$uibModal', '$filter', 'FacturacionFactory', 'EmpresasFactory', '$routeParams'];

  angular.module('marketplace').controller('FacturacionCreateController', FacturacionCreateController);
}());
