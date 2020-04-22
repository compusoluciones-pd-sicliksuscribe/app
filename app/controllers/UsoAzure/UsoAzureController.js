(function () {
  var UsoAzureController = function ($scope, $sce, $cookies, $location, EmpresasXEmpresasFactory, $uibModal, $filter, FabricantesFactory, PedidosFactory, EmpresasFactory, UsuariosFactory) {
    function graphClickEvent (evt) {
      var activePoints = $scope.myLineChart.getElementsAtEvent(evt);
      if (activePoints.length > 0) {
    // get the internal index of slice in pie chart
        var clickedElementindex = activePoints[0]['_index'];

    // get specific label by index
        var label = $scope.myLineChart.data.labels[clickedElementindex];

    // get value by index
        var value = $scope.myLineChart.data.datasets[0].data[clickedElementindex];
        $scope.enterpriseDatas = [{ // le estoy pasando de forma forzada el cambio, para que se muestre en la tabla pero no lo hace
          name: 'Prueba 1',
          percent: '33'
        },
        {
          name: 'Prueba 2',
          percent: '47'
        },
        {
          name: 'Prueba 3',
          percent: '20'
        }];
      }
    };
    $scope.AreaChart = function () {
      console.log('')
        // Set new default font family and font color to mimic Bootstrap's default styling

      function numberFormat (number, decimals, decPoint, thousandsSep) {
        // *     example: numberFormat(1234.56, 2, ',', ' ');
        // *     return: '1 234,56'
        number = (number + '').replace(',', '').replace(' ', '');
        var n = !isFinite(+number) ? 0 : +number,
          prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
          sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
          dec = (typeof decPoint === 'undefined') ? '.' : decPoint,
          s = '',
          toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
          };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
          s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
          s[1] = s[1] || '';
          s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
      }

    // Area Chart Example
      var ctx = document.getElementById('myAreaChart');
      $scope.myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Earnings',
            lineTension: 0.3,
            backgroundColor: 'rgba(78, 115, 223, 0.05)',
            borderColor: 'rgba(78, 115, 223, 1)',
            pointRadius: 3,
            pointBackgroundColor: 'rgba(78, 115, 223, 1)',
            pointBorderColor: 'rgba(78, 115, 223, 1)',
            pointHoverRadius: 3,
            pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
            pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000]
          }]
        },
        options: {
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 0
            }
          },
          scales: {
            xAxes: [{
              time: {
                unit: 'date'
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                maxTicksLimit: 7
              }
            }],
            yAxes: [{
              ticks: {
                maxTicksLimit: 5,
                padding: 10,
          // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return '$' + numberFormat(value);
                }
              },
              gridLines: {
                color: 'rgb(234, 236, 244)',
                zeroLineColor: 'rgb(234, 236, 244)',
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2]
              }
            }]
          },
          legend: {
            display: false
          },
          tooltips: {
            backgroundColor: 'rgb(255,255,255)',
            bodyFontColor: '#858796',
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10,
            callbacks: {
              label: function (tooltipItem, chart) {
                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                return datasetLabel + ': $' + numberFormat(tooltipItem.yLabel);
              }
            }
          },
          onClick: graphClickEvent // al dar click en cualquier punto de la gráfica llama a esta función
        }
      });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.AreaChart();
      $scope.enterpriseDatas = $scope.enterpriseData['Ene']; // esto es la simulación de lo que debería de recibir del back
    };
    $scope.init();
  };

  UsoAzureController.$inject = ['$scope', '$sce', '$cookies', '$location', 'EmpresasXEmpresasFactory', '$uibModal', '$filter', 'FabricantesFactory', 'PedidosFactory', 'EmpresasFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('UsoAzureController', UsoAzureController);
}());
