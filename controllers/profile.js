app.controller("logCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$scope.userid = $localStorage.currentUser.id;
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listlogs&userid="+$scope.userid)
    .then(function(response) {
        $scope.logs = response.data;
	});
});

app.controller("privacyCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$scope.userid = $localStorage.currentUser.id;

});

app.controller("notificationsCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$scope.userid = $localStorage.currentUser.id;

});