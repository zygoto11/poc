app.controller("logCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$scope.userid = $localStorage.currentUser.id;
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listlogs&userid="+$scope.userid)
    .then(function(response) {
        $scope.logs = response.data;
	});
});

app.controller("privacyCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$scope.userid = $localStorage.currentUser.id;
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/profile/getprivacy.php")
    .then(function(response) {
        $scope.privacy = response.data.result[0];
	});
	
	$scope.updateprivacy = function(city,birthday,online){		
		$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/profile/updateprivacy.php',{city:city,birthday:birthday,online:online})
        .then(function (response) {
			$scope.msg = "Changements enregistrés !"
		});		
	}
});

app.controller("notificationsCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$scope.userid = $localStorage.currentUser.id;
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/profile/getnotifications.php")
    .then(function(response) {
        $scope.notifications = response.data.result[0];
	});
	
	$scope.updatenotifications = function(register,unregister,comment){		
		$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/profile/updatenotifications.php',{register:register,unregister:unregister,comment:comment})
        .then(function (response) {
			$scope.msg = "Changements enregistrés !"
		});		
	}
	
});