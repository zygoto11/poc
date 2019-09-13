app.controller("friendsCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$scope.username = $localStorage.currentUser.username;
	$scope.userid = $localStorage.currentUser.id;
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listusers")
    .then(function(response) {
        $scope.users = response.data;		
    });
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getmembers.php")
	.then(function(response) {
		$scope.relations = response.data.result;
	});
});