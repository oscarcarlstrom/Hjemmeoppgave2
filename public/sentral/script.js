Chart.defaults.global.defaultFontFamily = "Open Sans";
Chart.defaults.global.defaultFontColor = "#006153e0";
Chart.defaults.global.colors = [ "#009681", "#C0A859", "#CC5A4E", "#CA524A", "#3F7D7F", "#5C5245", "#6DC0B7"];

let app = angular.module("app", ["chart.js", "angularjs-gauge"]);

//Tusenskille
app.run(["$locale", function ($locale) {
    $locale.NUMBER_FORMATS.GROUP_SEP = " ";
}]);

const DB_URL = "http://localhost:3000/logg";

//Init mainController (hoved controller)
app.controller("mainController", function($scope, $http, $filter) {
  //Vis loading animasjon før http request er ferdig
  $scope.isLoading = function () {
     return $http.pendingRequests.length !== 0;
  };

  //Hent data og vis grafer
  $http.get(DB_URL).then(function (response) {
    let logg = response.data;
    let dagensTotaleVolum = 0;
    let dagensTotaleAntall = 0;
    let dagensDato = $filter("date")(new Date(), "dd.MM.yyyy");
    let dager = [];
    let volum = [];
    let antall = [];

    //Itererer over alle logg entries
    angular.forEach(logg, function(obj) {
      let volParsed = parseFloat(obj.volum);

      if (dager.includes(obj.dato)) {
        volum[volum.length - 1] += volParsed;
        antall[antall.length - 1]++;
      }
      else {
        dager.push(obj.dato);
        volum.push(volParsed);
        antall.push(1);
      }
      if (obj.dato === dagensDato) {
        dagensTotaleAntall++;
        dagensTotaleVolum += volParsed;
      }
    });

    $scope.dagensDato = dagensDato;
    $scope.dagensTotaleAntall = dagensTotaleAntall;
    $scope.dagensTotaleVolum = dagensTotaleVolum;

    $scope.antallDager = volum.length;
    $scope.labels = dager;

    $scope.seriesVolume = ["Volum"];
    $scope.dataVolume = [
      volum
    ];

    $scope.seriesCount = ["Antall"];
    $scope.dataCount = [
      antall
    ];

    $scope.chartOptionsVolume = {
      scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                },
                /*scaleLabel: {
                  display: true,
                  labelString: "m³",
                },*/
                ticks: {
                    callback: function(value) {
                        return value + " m³";
                    }
                }
            }]
        }
    }

    $scope.chartOptionsCount = {
      scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                },
            }]
        }
    }
  });
});
