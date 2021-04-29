(function () {
  const ReconciliacionController = function ($scope, ReconciliacionFactory) {

    let histogramaCsp = '';
    let histogramaClick = '';
    let ThousandsDollars = 1000;
    let lastDate = '';
    let lastYear = '';
    let lastMonth = '';
    const ShortmonthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const LargemonthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


    getCspHistogram = () => {
      return ReconciliacionFactory
        .getHistogramCsp()
        .then(res => {
          histogramaCsp = res.data.data;
          lastDate = new Date(histogramaCsp[0].FechaFactura);
          lastYear = lastDate.getFullYear();
          lastMonth = lastDate.getMonth() + 1;
          (lastMonth < 10) ? lastMonth = "0" + lastMonth : '';
          getHistogramClick(lastYear + '-' + lastMonth);
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    getHistogramClick = (date) => {
      return ReconciliacionFactory
        .getTotalCS(date)
        .then(res => {
          histogramaClick = res.data.data;
          $scope.ventaClick = '$' + histogramaClick[0].total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          const dateArray = date.split('-');
          let monthArray = dateArray[1];
          monthArray = +monthArray - 1;
          $scope.ventasClickDate = LargemonthNames[monthArray] + ' del ' + dateArray[0];
          loadHistogram();
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    loadHistogram = () => {
      const totalCSP = [];
      const totalClick = [];
      const totalMonths = [];
      for (const item in histogramaCsp) {
        let totalCsp = histogramaCsp[item].Total / ThousandsDollars;
        totalCsp = totalCsp.toFixed(2);
        totalCSP.push(totalCsp);
        let currentMonth = new Date(histogramaCsp[item].FechaFactura);
        let currentYear = currentMonth.getFullYear().toString().substr(-2);
        currentMonth = currentMonth.getMonth();
        totalMonths.push(ShortmonthNames[currentMonth] + currentYear);
      }

      for (const item in histogramaClick) {
        let totalCs = histogramaClick[item].total / ThousandsDollars;
        totalCs = totalCs.toFixed(2);
        totalClick.push(totalCs);
      }

      lastDate = new Date(histogramaCsp[0].FechaFactura);
      lastYear = lastDate.getFullYear();
      lastMonth = lastDate.getMonth() + 1;
      (lastMonth < 10) ? lastMonth = "0" + lastMonth : '';
      $scope.getReconciliationData(lastYear + '-' + lastMonth);
      document.getElementById('dateFilter').value = lastYear + '-' + lastMonth;

      const options = {
        series: [
          {
            name: 'Microsoft CSP',
            data: totalCSP.reverse()
          }, {
            name: 'Click Suscribe',
            // data: $scope.histogramaClick.reverse()
            data: totalClick.reverse()
          }
        ],
        chart: {
          height: 350,
          type: 'line',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false
          }
        },
        colors: [
          '#db9635', '#68953b'
        ],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Ventas Microsoft CSP y Click Suscribe',
          align: 'left'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: [
              '#f3f3f3', 'transparent'
            ],
            opacity: 0.5
          }
        },
        markers: {
          size: 1
        },
        xaxis: {
          categories: totalMonths.reverse(),
          title: {
            text: 'Fecha'
          },
          labels: {
            formatter: function (value) {
              return value;
            }
          }
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              if (value <= 999) {
                return '$' + value + ' K';
              } else {
                value = value / 1000;
                value = value.toFixed(2);
                return '$' + value + ' M';
              }
            }
          },
          title: {
            text: 'Cantidad (dólares)'
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      };
      const chart = new ApexCharts(document.querySelector('#chart'), options);
      chart.render();
    }

    $scope.getReconciliationData = (lastDate) => {
      let dateFilter = '';
      (lastDate) ? dateFilter = lastDate : dateFilter = document.getElementById('dateFilter').value;
      return ReconciliacionFactory
        .getReconciliacion(dateFilter)
        .then(res => {
          $scope.lista = res.data.data;
          $scope.listaAux = $scope.lista;
          const dateArray = dateFilter.split('-');
          let monthArray = dateArray[1];
          monthArray = +monthArray - 1;
          $scope.ventasCspDate = LargemonthNames[monthArray] + ' del ' + dateArray[0];
          if ($scope.lista[0] !== undefined) {
            $scope.ventaCsp = '$' + $scope.lista[0].Total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          } else {
            $scope.ventaCsp = '$0.00';
          }
          pagination();
          getTotalClick(dateFilter);
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    $scope.filter = () => {
      $scope.listaAux = $scope.lista.filter(function (str) {
        return str.NombreEmpresa.toLowerCase().indexOf($scope.subFilter.toLowerCase()) !== -1;
      })
      pagination();
    }

    const pagination = () => {
      $scope.filtered = [];
      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        let begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.filtered = $scope.listaAux.slice(begin, end);
      });
    };

    getTotalClick = (date) => {
      return ReconciliacionFactory
        .getTotalCS(date)
        .then(res => {
          histogramaClick = res.data.data;
          $scope.ventaClick = '$' + histogramaClick[0].total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          const dateArray = date.split('-');
          let monthArray = dateArray[1];
          monthArray = +monthArray - 1;
          $scope.ventasClickDate = LargemonthNames[monthArray] + ' del ' + dateArray[0];
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    $scope.timeChart = (IdReconciliacion, IdLicencia, IdFactura) => {
      const body = {
        IdFactura: IdFactura,
        IdLicencia: IdLicencia
      };
      document.getElementById('time1_' + IdReconciliacion).innerHTML = '';
      return ReconciliacionFactory
        .getTimeLine(body)
        .then(res => {
          $scope.timeLine = res.data.data;
          let arrayTimeLine = [];
          let actual = '';
          const colors = ['#bc112e', '#db9635', '#68953b', '#00549f'];
          for (const item in $scope.timeLine) {
            actual = {
              x: $scope.timeLine[item].Descripcion + ' - Cantidad: ' + $scope.timeLine[item].Cantidad,
              y: [new Date($scope.timeLine[item].FechaInicioCargo).getTime(), new Date($scope.timeLine[item].FechaFinCargo).getTime()],
              fillColor: colors[Math.floor(Math.random() * colors.length)]
            };
            arrayTimeLine.push(actual);
          }

          var options = {
            series: [
              {
                data: arrayTimeLine
              }
            ],
            chart: {
              defaultLocale: 'es',
              locales: [{
                name: 'es',
                options: {
                  months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                  shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                  days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                  shortDays: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'],
                  toolbar: {
                    download: 'Descargar SVG',
                    selection: 'Selección',
                    selectionZoom: 'Seleccionar zoom',
                    zoomIn: 'Acercar',
                    zoomOut: 'Alejar',
                    pan: 'Panorámica',
                    reset: 'Restablecer zoom'
                  }
                }
              }],
              height: 450,
              type: 'rangeBar'
            },
            title: {
              text: 'Linea del tiempo de cargos aplicados',
              align: 'left'
            },
            grid: {
              borderColor: '#cecece',
              row: {
                colors: [
                  'transparent'
                ],
                opacity: 0.1
              }
            },
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: '80%'
              }
            },
            xaxis: {
              type: 'datetime'
            },
            stroke: {
              width: 1,
              colors: '#F44336'
            },
            fill: {
              colors: ['#F44336', '#E91E63', '#9C27B0', '#db9635']
            },
            legend: {
              position: 'top',
              horizontalAlign: 'left'
            }
          };
          const chart = new ApexCharts(document.querySelector('#time1_' + IdReconciliacion), options);
          chart.render();
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    $scope.init = function () {
      getCspHistogram();
    };

    $scope.init();
  };

  ReconciliacionController.$inject = ['$scope', 'ReconciliacionFactory'];
  angular
    .module('marketplace')
    .controller('ReconciliacionController', ReconciliacionController);
}());
