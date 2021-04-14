(function () {
  const ReconciliacionController = function ($scope, ReconciliacionFactory) {
    const lineChart = () => {
      const options = {
        series: [
          {
            name: 'Microsoft CSP',
            data: [
              28,
              29,
              33,
              36,
              32,
              32,
              33
            ]
          }, {
            name: 'Clicksuscribe',
            data: [
              12,
              11,
              14,
              18,
              17,
              13,
              13
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
          }
        },
        colors: [
          '#77B6EA', '#545454'
        ],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Ventas microsoft CSP y clicksuscribe',
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
          categories: [
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
            'Ene',
            'Feb',
            'Mar'
          ],
          title: {
            text: 'Mes'
          }
        },
        yaxis: {
          title: {
            text: 'Cantidad (dolares)'
          },
          min: 5,
          max: 40
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
    };

    $scope.timeChart = (IdReconciliacion) => {
      var options = {
        series: [
          {
            name: 'Bob',
            data: [
              {
                x: 'Design',
                y: [new Date('2019-03-05').getTime(), new Date('2019-03-08').getTime()]
              }, {
                x: 'Code',
                y: [new Date('2019-03-02').getTime(), new Date('2019-03-05').getTime()]
              }, {
                x: 'Code',
                y: [new Date('2019-03-05').getTime(), new Date('2019-03-07').getTime()]
              }, {
                x: 'Test',
                y: [new Date('2019-03-03').getTime(), new Date('2019-03-09').getTime()]
              }, {
                x: 'Test',
                y: [new Date('2019-03-08').getTime(), new Date('2019-03-11').getTime()]
              }, {
                  x: 'Validation',
                  y: [new Date('2019-03-11').getTime(), new Date('2019-03-16').getTime()]
                }, {
                    x: 'Design',
                    y: [new Date('2019-03-01').getTime(), new Date('2019-03-03').getTime()]
                  }
            ]
          }, {
            name: 'Joe',
            data: [
              {
                x: 'Design',
                y: [new Date('2019-03-02').getTime(), new Date('2019-03-05').getTime()]
              }, {
                x: 'Test',
                y: [new Date('2019-03-06').getTime(), new Date('2019-03-16').getTime()]
              }, {
                x: 'Code',
                y: [new Date('2019-03-03').getTime(), new Date('2019-03-07').getTime()]
              }, {
                x: 'Deployment',
                y: [new Date('2019-03-20').getTime(), new Date('2019-03-22').getTime()]
              }, {
                  x: 'Design',
                  y: [new Date('2019-03-10').getTime(), new Date('2019-03-16').getTime()]
                }
            ]
          }, {
            name: 'Dan',
            data: [
              {
                x: 'Code',
                y: [new Date('2019-03-10').getTime(), new Date('2019-03-17').getTime()]
              }, {
                x: 'Validation',
                y: [new Date('2019-03-05').getTime(), new Date('2019-03-09').getTime()]
              }
            ]
          }
        ],
        chart: {
          height: 450,
          type: 'rangeBar'
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
          width: 1
        },
        fill: {
          type: 'solid',
          opacity: 0.6
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        }
      };

      const chart = new ApexCharts(document.querySelector(
                '#chart_' + IdReconciliacion
            ), options);
      chart.render();
    };

    const getReconciliacionData = () => {
      return ReconciliacionFactory
                .getReconciliacion()
                .then(res => {
                  $scope.lista = res.data.data;
                  $scope.listaAux = $scope.lista;
                  pagination();
                })
                .catch(function () {
                  $scope.ShowToast(
                        'No pudimos cargar la lista de reconciliación, por favor intenta de nuevo más t' +
                                'arde.',
                        'danger'
                    );
                });
    };

    const pagination = () => {
      $scope.filtered = [];
      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.maxSize = 5;

      $scope.$watch('currentPage + numPerPage', function () {
        let begin = (($scope.currentPage - 1) * $scope.numPerPage),
          end = begin + $scope.numPerPage;
        $scope.filtered = $scope
                    .lista
                    .slice(begin, end);
      });
    };

    $scope.init = function () {
      lineChart();
      getReconciliacionData();
    };

    $scope.init();
  };

  ReconciliacionController.$inject = ['$scope', 'ReconciliacionFactory'];
  angular
        .module('marketplace')
        .controller('ReconciliacionController', ReconciliacionController);
}());
