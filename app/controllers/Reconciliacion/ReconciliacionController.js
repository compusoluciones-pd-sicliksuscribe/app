(function () {
  const ReconciliacionController = function ($scope, ReconciliacionFactory) {
    $scope.HistogramChart = () => {
      return ReconciliacionFactory
      .getHistogramInfo()
      .then(res => {
        $scope.histograma = res.data.data;
        const totalCSP = [];
        const totalMonths = [];
        for (const item in $scope.histograma) {
          let total = $scope.histograma[item].Total / 1000;
          total = total.toFixed(2);
          totalCSP.push(total);

          let currentMonth = new Date($scope.histograma[item].FechaFactura);
          let currentYear = currentMonth.getFullYear().toString().substr(-2);
          currentMonth = currentMonth.getMonth();
          const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          totalMonths.push(monthNames[currentMonth] + currentYear);
        }

        const options = {
          series: [
            {
              name: 'Microsoft CSP',
              data: totalCSP.reverse()
            }, {
              name: 'Click Suscribe',
              data: [
                '500.00',
                '500.00',
                '500.00',
                '500.00',
                '500.00',
                '500.00',
                '500.00',
                '500.00',
                '500.00',
                '500.00',
                '500.00',
                '500.00'
              ]
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
            },
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
            }]
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
      document.getElementById('chart_' + IdReconciliacion).innerHTML = '';
      return ReconciliacionFactory
                .getTimeLine(body)
                .then(res => {
                  $scope.timeLine = res.data.data;
                  let arrayTimeLine = [];
                  let actual = '';
                  for (const item in $scope.timeLine) {
                    actual = {
                      x: $scope.timeLine[item].Descripcion,
                      y: [new Date($scope.timeLine[item].FechaInicioCargo).getTime(), new Date($scope.timeLine[item].FechaFinCargo).getTime()],
                      fillColor: '#db9635'
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
                  const chart = new ApexCharts(document.querySelector('#chart_' + IdReconciliacion), options);
                  chart.render();
                })
                .catch(function () {
                  $scope.ShowToast('No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más tarde.', 'danger');
                });
    };

    $scope.getReconciliationData = (onLoad) => {
      let dateFilter = '';
      let today = new Date();
      (onLoad) ? dateFilter = today.getFullYear() + '-' + (today.getMonth() + 1) : dateFilter = document.getElementById('dateFilter').value;

      return ReconciliacionFactory
                .getReconciliacion(dateFilter)
                .then(res => {
                  $scope.lista = res.data.data;
                  $scope.listaAux = $scope.lista;
                  pagination();
                })
                .catch(function () {
                  $scope.ShowToast('No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más tarde.', 'danger');
                });
    };

    const pagination = () => {
      $scope.filtered = [];
      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        let begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.filtered = $scope.lista.slice(begin, end);
        let monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        let filterDate = document.getElementById('dateFilter').value;
        const dateArray = filterDate.split('-');
        let monthArray = dateArray[1];
        monthArray = +monthArray - 1;
        document.getElementById('ventasCspDate').innerHTML = monthNames[monthArray] + ' del ' + dateArray[0];
        if ($scope.lista[0] !== undefined) {
          document.getElementById('ventasCspTotal').innerHTML = '$ ' + $scope.lista[0].Total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          document.getElementById('ventasCspTotal').innerHTML = '$0';
        }
      });
    };

    $scope.init = function () {
      $scope.HistogramChart();
      $scope.getReconciliationData(true);
    };

    $scope.init();
  };

  ReconciliacionController.$inject = ['$scope', 'ReconciliacionFactory'];
  angular
        .module('marketplace')
        .controller('ReconciliacionController', ReconciliacionController);
}());
