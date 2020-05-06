(function () {
  var UsoAzureController = function ($scope, $sce, $cookies, $location, UsoAzureFactory, $uibModal, $filter, FabricantesFactory, PedidosFactory, EmpresasFactory, UsuariosFactory) {
    $scope.datoActual = '';
    $scope.dataByMonth = '';
    $scope.Distribuidor = 0;
    $scope.Cliente = 0;
    $scope.selectClientes = [];
    $scope.Suscripcion = 0;
    $scope.MostrarMensaje = true;

    function graphClickEvent (evt) {
      var activePoints = $scope.myLineChart.getElementsAtEvent(evt);
      if (activePoints.length > 0) {
    // get the internal index of slice in pie chart
        var clickedElementindex = activePoints[0]['_index'];

    // get specific label by index
        var label = $scope.myLineChart.data.labels[clickedElementindex];

    // get value by index
        var value = $scope.myLineChart.data.datasets[0].data[clickedElementindex];
        $scope.datoActual = $scope.dataByMonth[label];
      }
      if ($scope.Cliente) $scope.getAzureDetails(label);
    };
    $scope.AreaChart = function (resultData) {
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
          labels: resultData.monthList,
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
            data: resultData.totalList
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
          'onClick': graphClickEvent // al dar click en cualquier punto de la gráfica llama a esta función
        }
      });
    };
    $scope.budgetCharts = function () {
      var options1 = {
        type: 'doughnut',
        data: {
          labels: ["Budget"],
          datasets: [
          {
                      label: '# of Votes',
                      data: [100],
                      backgroundColor: [
                          'rgba(255, 164, 46, 1)',
                      ],
                      borderColor: [
                          'rgba(255, 255, 255 ,1)',
                      ],
                      borderWidth: 5
                  }
          ]
        },
        options: {
        rotation: 1 * Math.PI,
                  circumference: 1 * Math.PI,
                  legend: {
                      display: false
                  },
                  tooltip: {
                      enabled: false
                  },
                  cutoutPercentage: 95
        }
      }
      
      var ctx1 = document.getElementById('chartJSContainer').getContext('2d');
      new Chart(ctx1, options1);
      
      var options2 = {
        type: 'doughnut',
        data: {
        labels: ["", "Orange", ""],
                  datasets: [
                    {
                          data: [85, 1, 15],
                          backgroundColor: [
                              "rgba(46, 204, 113, 1)",
                              "rgba(255,255,255,1)",
                                "rgba(0,0,0,0)",
                          ],
                          borderColor: [
                          'rgba(0, 0, 0 ,0)',
                          'rgba(46, 204, 113, 1)',
                          'rgba(0, 0, 0 ,0)'
                      ],
                      borderWidth: 3
                        
                      }]
        },
        options: {
          cutoutPercentage: 95,
          rotation: 1 * Math.PI,
            circumference: 1 * Math.PI,
                  legend: {
                      display: false
                  },
                  tooltips: {
                      enabled: false
                  }
        }
      }
      
      var ctx2 = document.getElementById('secondContainer').getContext('2d');
      new Chart(ctx2, options2);
    }

    $scope.actualizeTable = function () {
      $scope.enterpriseData = $scope.datoActual;
    };

    $scope.filterClients = function () {
      console.log($scope.Distribuidor);
      $scope.selectDistribuidor.map(enterprise => {
        if (Number(enterprise.IdEmpresa) === Number($scope.Distribuidor)) {
          $scope.selectClientes = enterprise.UF;
        }
      });
      if(!$scope.Distribuidor) $scope.selectClientes = [];
      $scope.clearTable();
    };

    $scope.getEnterprises = function () {
      const data = {
        "distId": $scope.Distribuidor,
        "customerId": $scope.Cliente,
        "subsId": 0, // se simula próximo a desarrollarse
        "year": 2020
      };
      UsoAzureFactory.getEnterprises(data)
          .success(function (result) {
            $scope.selectDistribuidor = result;
          })
          .error(function (data) {
            $scope.ShowToast(data.message, 'danger');
          });
    };

    $scope.clearTable = function () {
      document.getElementById("chartContainer").innerHTML = '&nbsp;';
      document.getElementById("chartContainer").innerHTML = '<canvas id="myAreaChart"  ng-click="actualizeTable()"/>';
      if ($scope.Cliente) $scope.budgetCharts();
      $scope.getDataToChart();
    };

    $scope.getDataToChart = function () {
      const data = {
        "distId": $scope.Distribuidor || 0,
        "customerId": $scope.Cliente || 0,
        "subsId": 0, // se simula, proximo a desarrollarse
        "year": 2020
      };
      UsoAzureFactory.getDataChart(data)
          .success(function (result) {
            $scope.AreaChart(result);
            $scope.enterpriseData = result.generalData; // esto es la simulación de lo que debería de recibir del back
            $scope.dataByMonth = result.dataByMonth;
          })
          .error(function (data) {
            $scope.ShowToast(data.message, 'danger');
          });
    };

    $scope.getAzureDetails = function (month) {
      const months = {
        'Ene': 1,
        'Feb': 2,
        'Mar': 3,
        'Abr': 4,
        'May': 5,
        'Jun': 6,
        'Jul': 7,
        'Ago': 8,
        'Sep': 9,
        'Oct': 10,
        'Nov': 11,
        'Dic': 12
      };
      const data = {
        "distId": $scope.Distribuidor || 0,
        "customerId": $scope.Cliente || 0,
        "subsId": 0, // se simula, proximo a desarrollarse
        "year": 2020,
        "month": months[month],
      };
      UsoAzureFactory.getDetails(data)
          .success(function (result) {
            if (result.errorCode) {
              $scope.UsageDetails = [];
              $scope.MostrarMensaje = true;
            } else {
              $scope.UsageDetails = result;
              $scope.MostrarMensaje = false;
            }
          })
          .error(function (data) {
            $scope.ShowToast(data.message, 'danger');
          });
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.getEnterprises();
      $scope.getDataToChart();
    };
    $scope.init();
  };

  UsoAzureController.$inject = ['$scope', '$sce', '$cookies', '$location', 'UsoAzureFactory', '$uibModal', '$filter', 'FabricantesFactory', 'PedidosFactory', 'EmpresasFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('UsoAzureController', UsoAzureController);
}());
