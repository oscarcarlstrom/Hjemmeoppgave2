var app = angular.module("app", []);

//Customize number format
app.run(["$locale", function ($locale) {
    $locale.NUMBER_FORMATS.GROUP_SEP = " ";
}]);

//Init controller
app.controller("log", function($scope, $http) {
  const DB_URL = "http://localhost:3000/logg"

  $http.get(DB_URL).then(function (response) {
    $scope.logg = response.data;
  });

  $scope.leggTilNyTomming = function() {
    var data = {
      "seddelnummer": $scope.seddelnummer,
      "volum": $scope.antall
    };

    $http({
      method: 'POST',
      url: DB_URL,
      data: data,
      headers: {'Content-Type': 'application/json'}
    }).then(
       function(response){
         console.log("success:" + JSON.stringify(response));
         $scope.logg.push(data);
       },
       function(response){
         console.log("failure:" + JSON.stringify(response))
       }
    );

    $scope.seddelnummer = "";
    $scope.antall = "";
    $scope.visModal = false;
  };

  $scope.slett = function (index) {
      var id = $scope.logg[index].id;
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

  $scope.onlyNumbers = /^\d+$/;

  $scope.today = new Date();
});
