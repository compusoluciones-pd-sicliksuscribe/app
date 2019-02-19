(function () {
  var ReportesController = function ($scope, $log, $location, $cookies, ReportesFactory) {

    $scope.perfil = $cookies.getObject('Session');

    $scope.reportesSel = '';

    $scope.init = function () {
      $scope.navCollapsed = true;
      $scope.CheckCookie();
      ReportesFactory.getReportes()
        .success(function (result) {
          if (result) {
            $scope.reportesSel = result.data[0];
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.init();

    var maxSize = 5000;

    $scope.GenerarReporte = function (params) {
      ReportesFactory.getGenerarReporte($scope.reporteSel)
        .success(function (result) {
          if (result) {
            if ($scope.reporteSel === 29 ){
            
              for (var i = 0; i < $scope.reportesSel.length; i++) {
                if ($scope.reportesSel[i].IdReporte === $scope.reporteSel) {
                  var d = new Date();
                  var sDate = ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
                  var NombreReporte = $scope.reportesSel[i].NombreReporte + '_' + sDate;
  
                  var repeat = Math.ceil(result.data[0].length / maxSize);
                  var k=1;
                  var entro=0;
                  for(let ind=0; ind<repeat; ind++ )
                  {
                    
                  }




                  for (var j = 0; j < repeat; j++) {
                    var start = j * maxSize;
                    var end = start + maxSize;
                    var parte = result.data[0].slice(start, end);

                    var number = j + 1;
                    var contenido = result.data[0].slice(start, end);
                    var resultado = result.data[0].slice(start, end);
                    NombreReporte = NombreReporte + '_' + number;
                    var resultado=JSON.stringify($scope.generarReporte(contenido));
                    // console.log("resultado 1:"+JSON.stringify(resultado));

                    //   if(parte[j].FechaInicio ===  contenido[k].FechaInicio && parte[k].FechaFin === "" && parte[j].Periodo ===contenido[k].Periodo ){
                        
                    //     if(parte[j].SubMayorista=== contenido[k].SubMayorista && parte[j].Cantidad === contenido[k].Cantidad){
                    //       //entro+=resultado[j].CostoTotal;
                    //       resultado[j].DiasTotalActivo+=parte[j].DiasTotalActivo;
                    //     }else{
                    //       console.log(JSON.stringify(resultado[j].CostoTotal)+"COSTO"+JSON.stringify(entro)+"ENTRO");
                      
                    //       // resultado[j].CostoTotal=resultado[j].CostoPorDia*resultado[j].CostoPorDia;
                    //       console.log(JSON.stringify(resultado[j].CostoTotal)+"="+JSON.stringify(entro)+"=");
                    //     }
  
                    //   }
                    //   k++;
                    //   console.log("resultado :"+JSON.stringify(resultado));
                       $scope.JSONToCSVConvertor(resultado, NombreReporte, true);
                  }
                }
              }
          }else{


            for (var i = 0; i < $scope.reportesSel.length; i++) {
              if ($scope.reportesSel[i].IdReporte === $scope.reporteSel) {
                var d = new Date();
                var sDate = ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
                var NombreReporte = $scope.reportesSel[i].NombreReporte + '_' + sDate;

                var repeat = Math.ceil(result.data[0].length / maxSize);
                for (var j = 0; j < repeat; j++) {
                  var start = j * maxSize;
                  var end = start + maxSize;
                  var parte = result.data[0].slice(start, end);
                  var number = j + 1;
                  NombreReporte = NombreReporte + '_' + number;
                  $scope.JSONToCSVConvertor(parte, NombreReporte, true);
                }
                return;
              }
            }



          }
          }
        })
        .error(function (data, status, headers, config) {
          $log.log('data error: ' + data.error + ' status: ' + status + ' headers: ' + headers + ' config: ' + config);
        });
    };

    $scope.generarReporte = function ( contenido ) {
      var k=0;
      var copia=contenido.length;

      var total =new Array(2);
      for(var fila=0; fila<contenido.length; fila++)
      total[fila]= new Array(2);
      
      var aux={};
      for (var m = 0; m<contenido.length; m++){
        for(var n = 0; n<contenido.length-1; n++){
          if(contenido[m].IdSuscripcion<contenido[n].IdSuscripcion){
            aux=contenido[n+1];
            contenido[n]=contenido[m];
            contenido[m]=aux;
          }
        }
      }
      console.log(contenido[0]);
      console.log(JSON.stringify(contenido[0]));

      var fila=0;
      columna=0;
      var pivote={};
     // pivote=contenido[0];
      //console.log("este es el pivote wey "+JSON.stringify(pivote));
      //for(var j = 0; j<contenido.length; j++){
      for (var i = 0; i<contenido.length; i++){
        pivote=contenido[i];
        console.log("pivote"+JSON.stringify(pivote.IdOrden)+"contenido"+JSON.stringify(contenido[i].IdSuscripcion));  
              if(pivote.Periodo ===contenido[i].Periodo && pivote.IdSuscripcion=== contenido[i].IdSuscripcion ){
              if(pivote.IdOrden=== contenido[i].IdOrden && pivote.Cantidad === contenido[i].Cantidad){
                //console.log("lo que meti en el array"+JSON.stringify(contenido[i]));
                total[fila][columna]=contenido[i];
                columna++;
                            }else{
                              fila++;
                              columna=0;
                             
                            }
            }
       // }
       
      }


        for (var m = 0; m<contenido.length; m++){
          for(var n = 0; n<contenido.length-1; n++){
            console.log("Matriz result :"+JSON.stringify(total[m][n])  );
          }
        }
      
                    
      console.log("ordenado array :"+JSON.stringify(total));

      return total;
    }

    $scope.JSONToCSVConvertor = function (JSONData, ReportTitle, ShowLabel) {
      /* If JSONData is not an object then JSON.parse will parse the JSON string in an Object*/
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
      var CSV = '';
      /* Set Report title in first row or line*/
      CSV += ReportTitle + '\r\n\n';
      /* This condition will generate the Label/Header*/
      if (ShowLabel) {
        var row = '';

        /* This loop will extract the label from 1st index of on array*/
        for (var index in arrData[0]) {
          /* Now convert each value to string and comma-seprated*/
          row += index + ',';
        }

        row = row.slice(0, -1);

        /* append Label row with line break*/
        CSV += row + '\r\n';
      }

      /* 1st loop is to extract each row*/
      for (var i = 0; i < arrData.length; i++) {
        var row = '';

        /* 2nd loop will extract each column and convert it in string comma-seprated*/
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        /* add a line break after each row*/
        CSV += row + '\r\n';
      }

      if (CSV == '') {
        alert('Información inválida');
        return;
      }

      /* Generate a file name*/
      var fileName = 'Clicksuscribe_';
      /* this will remove the blank-spaces from the title and replace it with an underscore*/
      fileName += ReportTitle.replace(/ /g, '_');

      /* Initialize file format you want csv or xls*/
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

      /* Now the little tricky part.*/
      /* you can use either>> window.open(uri);*/
      /* but this will not work in some browsers*/
      /* or you will not get the correct file extension*/

      /* this trick will generate a temp <a /> tag*/
      var link = document.createElement('a');
      link.href = uri;

      /* set the visibility hidden so it will not effect on your web-layout*/
      link.style = 'visibility:hidden';
      link.download = fileName + '.csv';

      /* this part will append the anchor tag and remove it after automatic click*/
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  ReportesController.$inject = ['$scope', '$log', '$location', '$cookies', 'ReportesFactory'];

  angular.module('marketplace').controller('ReportesController', ReportesController);
}());
