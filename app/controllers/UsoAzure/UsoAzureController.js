(function () {
  var UsoAzureController = function ($scope, $sce, $cookies, $location, UsoAzureFactory, $uibModal, $filter, FabricantesFactory, PedidosFactory, EmpresasFactory, UsuariosFactory) {
    $scope.datoActual = '';
    $scope.dataByMonth = '';
    $scope.Distribuidor = 0;
    $scope.Console = 0;
    $scope.Cliente = 0;
    $scope.selectClientes = [];
    $scope.Suscripcion = 0;
    $scope.MostrarMensaje = false;
    $scope.esDist = 0;
    $scope.totalConsoles = [];
    $scope.consoles = false;
    $scope.UnicoCliente = 0;
    $scope.azureActual = 'global';

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

    $scope.budgetCharts = function (budget) {
      let budgetRestante = 0;
      if (!budget.length) 
        return $scope.ShowToast('Sin budget asignado', 'danger');
      const { percentUsed } = budget[0];
      if (percentUsed > 100) {
        budgetRestante = 0;
      } else {
        budgetRestante = 100 - percentUsed;
      }
      var options1 = {
        type: 'doughnut',
        data: {
          labels: ["Utilizado","Disponible"],
          datasets: [
          {
                      label: '# of Votes',
                      data: [percentUsed, budgetRestante],
                      backgroundColor: [
                          'rgba(255, 161, 0, 1)',
                          'rgba(63, 156, 53, 1)'
                      ],
                      borderColor: [
                          'rgba(217, 215, 213, 1)',
                      ],
                      borderWidth: 5
                  }
          ]
        },
        options: {
          rotation: 1 * Math.PI,
          circumference: 1 * Math.PI, 
          cutoutPercentage: 85
        }
      }
      
      var ctx1 = document.getElementById('budgetChart').getContext('2d');
      new Chart(ctx1, options1);
    }

    $scope.actualizeTable = function () {
      $scope.enterpriseData = $scope.datoActual;
    };

    $scope.filterClients = function () {
      $scope.selectClientes = [];
      $scope.Cliente = 0;
      $scope.UsageDetails = [];
      $scope.selectDistribuidor.map(enterprise => {
        if (Number(enterprise.IdEmpresa) === Number($scope.Distribuidor)) {
          if (enterprise.UF.length === 1) {
            $scope.UnicoCliente = 1;
          }
          $scope.selectClientes = enterprise.UF;
          if ($scope.UnicoCliente) 
            $scope.Cliente = enterprise.UF[0].IdEmpresa;
        }
      });
      $scope.clearTable();
    };

    const getParams = () => ({
      "distId": $scope.Distribuidor,
      "customerId": $scope.Cliente,
      "subsId": $scope.Console || 0,
      "year": 2020
    });

    const enterprisesResult = result => {
      $scope.selectDistribuidor = result;
      if ($scope.esDist) {
        $scope.filterClients();
      } else {
        $scope.clearTable();
      }
    }

    $scope.getEnterprises = function () {
      const data = getParams();
      if ($scope.azureActual === 'global') {
        UsoAzureFactory.getEnterprises(data)
            .success(function (result) {
              enterprisesResult(result);
            })
            .error(function (data) {
              $scope.ShowToast(data.message, 'danger');
            });
      } else {
        UsoAzureFactory.getEnterprisesPlan(data)
            .success(function (result) {
              enterprisesResult(result);
            })
            .error(function (data) {
              $scope.ShowToast(data.message, 'danger');
            });
      }
    };

    $scope.clearTable = function () {
      document.getElementById("chartContainer").innerHTML = '&nbsp;';
      document.getElementById("chartContainer").innerHTML = '<canvas id="myAreaChart"  ng-click="actualizeTable()"/>';
      
      document.getElementById("budgetContainer").innerHTML = '&nbsp;';
      document.getElementById("budgetContainer").innerHTML = '<canvas id="budgetChart" style="margin-top: 20px;"></canvas>';

      $scope.getDataToChart();
    };

    const dataChartResult = result => {
      $scope.AreaChart(result);
      $scope.enterpriseData = result.generalData;
      $scope.dataByMonth = result.dataByMonth;
      if ($scope.Cliente) {
        const monthsName = {
          1 : 'Enero', 2 : 'Febrero', 3 : 'Marzo', 4 : 'Abril', 5 : 'Mayo', 6 : 'Junio',
          7 : 'Julio', 8 : 'Agosto', 9 : 'Septiembre', 10 : 'Octubre', 11 : 'Noviembre', 12 : 'Diciembre'
        };
        $scope.MostrarMensaje = result.azureDetails.length ? true : false;
        $scope.UsageDetails = result.azureDetails;
        $scope.MostrarMensaje = false;
        var date = new Date();
        var month = date.getMonth() + 1;
        $scope.mes = monthsName[month];
        if (result.consoles.length > 1) {
          $scope.consoles = true;
          $scope.totalConsoles = result.consoles;
        } else {
          $scope.consoles = false;
          $scope.totalConsoles = [];
        }
        $scope.budgetCharts(result.budget);
      }
    }

    $scope.getDataToChart = function () {
      const data = getParams();
      if ($scope.azureActual === 'global') {
        UsoAzureFactory.getDataChart(data)
            .success(function (result) {
              dataChartResult(result);
            })
            .error(function (data) {
              $scope.ShowToast(data.message, 'danger');
            });
      } else {
        UsoAzureFactory.getDataChartPlan(data)
            .success(function (result) {
              dataChartResult(result);
            })
            .error(function (data) {
              $scope.ShowToast(data.message, 'danger');
            });
      }
    };
  
    $scope.pdf = function () {
      html2canvas(document.getElementById('MarketPlaceBody'), {
          logging: true, letterRendering: 1, allowTaint: false, useCORS: false,
          onrendered: function (canvas) {
              var data = canvas.toDataURL();
              var docDefinition = {
                  content: [{
                      image: data,
                      width: 500,
                  }]
              };
              pdfMake.createPdf(docDefinition).download("test.pdf");
          }
      });
    };

    $scope.getAzureDetails = function (month) {
      const monthsName = {
        'Ene': 'Enero', 'Feb': 'Febrero', 'Mar': 'Marzo', 'Abr': 'Abril', 'May': 'Mayo', 'Jun': 'Junio',
        'Jul': 'Julio', 'Ago': 'Agosto', 'Sep': 'Septiembre', 'Oct': 'Octubre', 'Nov': 'Noviembre',
        'Dic': 'Diciembre'
      };
      const months = {
        'Ene': 1, 'Feb': 2, 'Mar': 3, 'Abr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Ago': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dic': 12
      };
      const data = {
        "distId": $scope.Distribuidor || 0,
        "customerId": $scope.Cliente || 0,
        "subsId": $scope.Console || 0, // se simula, proximo a desarrollarse
        "year": 2020,
        "month": months[month],
      };
      if ($scope.azureActual === 'global') {
        UsoAzureFactory.getDetails(data)
          .success(function (result) {
            if (result.errorCode) {
              $scope.UsageDetails = [];
              $scope.MostrarMensaje = true;
            } else {
              $scope.UsageDetails = result;
              $scope.MostrarMensaje = false;
              $scope.mes = monthsName[month];
            }
          })
          .error(function (data) {
            $scope.ShowToast(data.message, 'danger');
          });
        } else {
          UsoAzureFactory.getDetailsPlan(data)
          .success(function (result) {
            if (result.errorCode) {
              $scope.UsageDetails = [];
              $scope.MostrarMensaje = true;
            } else {
              $scope.UsageDetails = result;
              $scope.MostrarMensaje = false;
              $scope.mes = monthsName[month];
            }
          })
          .error(function (data) {
            $scope.ShowToast(data.message, 'danger');
          });
        }
    };

    $scope.changeAzure = function (azure) {
      $scope.azureActual = azure;
      $scope.Cliente = 0;
      $scope.Distribuidor = 0;
      $scope.Console = 0;
      $scope.UsageDetails = [];
      $scope.consoles = false;
      $scope.getEnterprises();
    };

    $scope.init = function () {
      $scope.CheckCookie();
      $scope.currentDistribuidor = $cookies.getObject('Session');
      $scope.esDist = $scope.currentDistribuidor.IdEmpresa;
      if ($scope.currentDistribuidor.IdEmpresa) {
        $scope.Distribuidor = $scope.currentDistribuidor.IdEmpresa;
      }
      $scope.getEnterprises();
    };
    $scope.init();
  };

  UsoAzureController.$inject = ['$scope', '$sce', '$cookies', '$location', 'UsoAzureFactory', '$uibModal', '$filter', 'FabricantesFactory', 'PedidosFactory', 'EmpresasFactory', 'UsuariosFactory'];

  angular.module('marketplace').controller('UsoAzureController', UsoAzureController);
}());
