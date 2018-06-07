let app = angular.module("app", ["ngRoute"]);

//Init routing
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "logg.html",
        controller  : 'loggController'
    })
    .when("/ny", {
        templateUrl : "ny.html",
        controller  : 'nyController'
    });
});

//Tusenskille
app.run(["$locale", function ($locale) {
    $locale.NUMBER_FORMATS.GROUP_SEP = " ";
}]);

//Init mainController (hoved controller)
app.controller("mainController", function($scope, $http, $location) {
  //Viser loading animasjon før http request er ferdig
  $scope.isLoading = function () {
     return $http.pendingRequests.length !== 0;
  };

  //Used to navigate to URL
  $scope.goTo = function(path) {
     $location.path(path);
  };
});

const DB_URL = "http://localhost:3000/logg";

//Init loggController (selve loggen)
app.controller("loggController", function($scope, $http, $filter) {

  //Hent data og vis i tabellen
  $http.get(DB_URL + "?dato=" + $filter("date")(new Date(), "dd.MM.yyyy")).then(function (response) {
    $scope.logg = response.data;
  });

  //Funksjon for å slette en rad i tabellen
  $scope.slett = function (index) {
      let id = $scope.logg[index].id;
      $http.delete(DB_URL + "/" + id).then(
        function(response){
          console.log("success:" + JSON.stringify(response));
          $scope.logg.splice(index, 1);
        },
        function(response){
          console.log("failure:" + JSON.stringify(response))
        }
      );
  };

  //Viser dagens dato
  $scope.today = new Date();

});

//Init nyController (brukes for å legge til ny entry i loggen)
app.controller("nyController", function($scope, $http, $location, $filter) {
  //For kun numerisk input
  $scope.onlyNumbers = /^\d+$/;

  document.getElementById("seddelnr-input").focus();

  //Legger til en ny entry i loggen
  //og går tilbake til å vise loggen
  $scope.leggTilNyTomming = function() {
    let data = {
      "seddelnummer": $scope.seddelnummer,
      "volum": $scope.antall,
      "dato": $filter("date")(new Date(), "dd.MM.yyyy")
    };

    $http({
      method: 'POST',
      url: DB_URL,
      data: data,
      headers: {'Content-Type': 'application/json'}
    }).then(
       function(response){
         console.log("success:" + JSON.stringify(response));
       },
       function(response){
         console.log("failure:" + JSON.stringify(response))
       }
    );

    $scope.seddelnummer = "";
    $scope.antall = "";

    $location.path("");
  };
});
