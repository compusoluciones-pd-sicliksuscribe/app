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
    const colors = ['#bc112e', '#db9635', '#68953b', '#00549f'];

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
      if (lastDate) {
        dateFilter = lastDate;
      } else {
        dateFilter = document.getElementById('dateFilter').value;
        getTotalClick(dateFilter);
      }
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
          getReconciliationDif(dateFilter);
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    $scope.timeChart = (IdLicencia, IdFactura) => {
      $('.collapse').collapse('hide');
      $('#collapse1_' + IdLicencia).collapse('show');
      const body = {
        IdFactura: IdFactura,
        IdLicencia: IdLicencia
      };
      document.getElementById('time_' + IdLicencia).innerHTML = '';
      return ReconciliacionFactory
        .getTimeLine(body)
        .then(res => {
          $scope.timeLine = res.data.data;
          let arrayTimeLine = [];
          let actual = '';
          for (const item in $scope.timeLine) {
            actual = {
              x: $scope.timeLine[item].Descripcion + '<br> -Cantidad: ' + $scope.timeLine[item].Cantidad,
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
                  months: LargemonthNames,
                  shortMonths: ShortmonthNames,
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
          const chart = new ApexCharts(document.querySelector('#time_' + IdLicencia), options);
          chart.render();
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    getReconciliationDif = (dateFilter) => {
      return ReconciliacionFactory
        .getReconciliacionDif(dateFilter)
        .then(res => {
          $scope.listaDif = res.data.data;
          $scope.arrayDif = [];
          let BodyTimeLine = [];
          let BodyClick = [];

          for (const item in $scope.listaDif) {
            if ($scope.listaDif[item].existClick === 1 && $scope.listaDif[item].totalCSP > $scope.listaDif[item].totalClick) {
              BodyTimeLine = [];
              BodyClick = [];
              for (const charge in $scope.listaDif[item].detailsCSP) {
                BodyTimeLine.push({
                  x: $scope.listaDif[item].detailsCSP[charge].Descripcion + '<br>Cantidad: ' + $scope.listaDif[item].detailsCSP[charge].Cantidad,
                  y: [new Date($scope.listaDif[item].detailsCSP[charge].FechaInicioCargo).getTime(), new Date($scope.listaDif[item].detailsCSP[charge].FechaFinCargo).getTime()],
                  fillColor: colors[Math.floor(Math.random() * colors.length)]
                });
              }
              for (const itemClick in $scope.listaDif[item].detailsClick) {
                BodyClick.push({
                  IdPedido: $scope.listaDif[item].detailsClick[itemClick].IdPedido,
                  FechaInicio: $scope.listaDif[item].detailsClick[itemClick].FechaInicio,
                  FechaFin: $scope.listaDif[item].detailsClick[itemClick].FechaFin,
                  Cantidad: $scope.listaDif[item].detailsClick[itemClick].Cantidad,
                  PrecioUnitario: `$${$scope.listaDif[item].detailsClick[itemClick].PrecioUnitario.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
                  Total: `$${$scope.listaDif[item].detailsClick[itemClick].Total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
                });
              }
              $scope.arrayDif.push({
                'IdLicencia': $scope.listaDif[item].idSubscription,
                'Distribuidor': $scope.listaDif[item].detailsCSP[0].Distribuidor,
                'NombreEmpresa': $scope.listaDif[item].detailsCSP[0].NombreEmpresa,
                'NombreProducto': $scope.listaDif[item].detailsCSP[0].NombreProducto,
                'Renovacion': $scope.listaDif[item].detailsCSP[0].Nombre,
                'IdFactura': $scope.listaDif[item].detailsCSP[0].IdFactura,
                'totalCSP': $scope.listaDif[item].totalCSP,
                'totalClick': $scope.listaDif[item].totalClick,
                'Estatus': 'Diferencia de precios',
                'TimeLine': BodyTimeLine,
                'detailsClick': BodyClick
              });
            } else if ($scope.listaDif[item].existClick === 0) {
              BodyTimeLine = [];
              for (const itemCsp in $scope.listaDif[item].detailsCSP) {
                BodyTimeLine.push({
                  x: $scope.listaDif[item].detailsCSP[itemCsp].Descripcion + ' <br>Cantidad: ' + $scope.listaDif[item].detailsCSP[itemCsp].Cantidad,
                  y: [new Date($scope.listaDif[item].detailsCSP[itemCsp].FechaInicioCargo).getTime(), new Date($scope.listaDif[item].detailsCSP[itemCsp].FechaFinCargo).getTime()],
                  fillColor: colors[Math.floor(Math.random() * colors.length)]
                });
              }
              $scope.arrayDif.push({
                'IdLicencia': $scope.listaDif[item].idSubscription,
                'Distribuidor': $scope.listaDif[item].detailsCSP[0].Distribuidor,
                'NombreEmpresa': $scope.listaDif[item].detailsCSP[0].NombreEmpresa,
                'NombreProducto': $scope.listaDif[item].detailsCSP[0].NombreProducto,
                'Renovacion': $scope.listaDif[item].detailsCSP[0].Nombre,
                'totalCSP': $scope.listaDif[item].totalCSP,
                'Estatus': 'ID no encontrado en el periodo',
                'detailsClick': false,
                'TimeLine': BodyTimeLine
              });
            }
          }
          $scope.listaDifAux = $scope.arrayDif;
          paginationDif();
        })
        .catch(function () {
          $scope.ShowToast('No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más tarde.', 'danger');
        });
    };

    pagination = () => {
      $scope.filtered = [];
      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.maxSize = 5;
      $scope.$watch('currentPage + numPerPage', function () {
        let begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.filtered = $scope.listaAux.slice(begin, end);
      });
    };

    $scope.filter = () => {
      $scope.listaAux = $scope.lista.filter(function (str) {
        return str.NombreEmpresa.toLowerCase().indexOf($scope.subFilter.toLowerCase()) !== -1;
      })
      pagination();
    }

    paginationDif = () => {
      $scope.filteredDif = [];
      $scope.currentPageDif = 1;
      $scope.numPerPageDif = 10;
      $scope.maxSizeDif = 5;
      $scope.$watch('currentPageDif + numPerPageDif', function () {
        let beginDif = (($scope.currentPageDif - 1) * $scope.numPerPageDif), endDif = beginDif + $scope.numPerPageDif;
        $scope.filteredDif = $scope.listaDifAux.slice(beginDif, endDif);
      });
    };

    $scope.filterDif = () => {
      $scope.listaDifAux = $scope.arrayDif.filterDif(function (str) {
        return str.NombreEmpresa.toLowerCase().indexOf($scope.subFilterDif.toLowerCase()) !== -1;
      })
      paginationDif();
    }

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

    $scope.timeChartDif = (IdLicencia) => {
      $('.collapse').collapse('hide');
      $('#collapseDif_' + IdLicencia).collapse('show');
      document.getElementById('timeDif_' + IdLicencia).innerHTML = '';
      let TimeFilter = $scope.arrayDif.filter(function (val) {
        return val.IdLicencia === IdLicencia;
      });

      if (TimeFilter[0].detailsClick) {
        $scope.arrayDetailsClick = TimeFilter[0].detailsClick;
        $scope.totalCSP = `$${TimeFilter[0].totalCSP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        $scope.totalClick = `$${TimeFilter[0].totalClick.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      } else {
        $scope.arrayDetailsClick = false;
      }
      var options = {
        series: [
          {
            data: TimeFilter[0].TimeLine
          }
        ],
        chart: {
          defaultLocale: 'es',
          locales: [{
            name: 'es',
            options: {
              months: LargemonthNames,
              shortMonths: ShortmonthNames,
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
      const chart = new ApexCharts(document.querySelector('#timeDif_' + IdLicencia), options);
      chart.render();
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
