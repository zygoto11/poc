app.controller("messagesCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
	
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
        $scope.users = response.data;		
    });
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/messages/getmessages.php")
    .then(function(response) {
        $scope.messages = response.data;
			$scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 5;
    $scope.totalItems = $scope.messages.length;	

});  
			
    });
	
	



app.controller("messageCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
	
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
        $scope.users = response.data;		
    });
	

	
		if ($routeParams.message) {
		
		$scope.message = $routeParams.message;
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/messages/getmessage.php?id="+$scope.message)
		.then(function(response) {
        $scope.descmessage = response.data;		
		});
		
		
		$scope.replymessage = function(msgcontent){
			
			$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/messages/replymessage.php',{ msgid:$scope.message,msgcontent:msgcontent})
            .then(function (response) {					
				$route.reload();		
				});
			
		}
		
		
	
		}

	
});


app.controller("newmessageCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
	
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
        $scope.users = response.data;		
    });
	
	$scope.createmessage = function(dest,msgname,msgcontent){			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/messages/createmessage.php',{  to:dest,msgname:msgname,msgcontent:msgcontent })
            .then(function (response) {					
					$location.path('/messages');	
				}); 
			
	}
	
	
	
});