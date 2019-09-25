app.controller("friendsCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
        $scope.users = response.data.result.users;
		$scope.friends = response.data.result.friends;
		$scope.bans = response.data.result.bans;
		
    });
});


app.controller("membersCtrl", function ($scope,$http, $routeParams,$location,$route,$localStorage) {
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
        $scope.users = response.data.result.users;
	$scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 10;
    $scope.totalItems = $scope.users.length;
	$scope.online = response.data.result.online;
    });
});


app.controller("memberCtrl", function ($scope,$http, $routeParams,$location,$route,$localStorage) {
	if ($routeParams.userid) {
		
		$scope.userid = $routeParams.userid;

		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getmember.php?to="+$scope.userid)
			.then(function(response) {
			$scope.userrel = response.data.result;		
		});

		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getuser.php?id="+$scope.userid)
			.then(function(response) {
			$scope.user = response.data;		
		});
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getfriend.php?from="+$localStorage.currentUser.id+"&to="+$scope.userid)
			.then(function(response) {
			
			
			if (response.data.code !== 200) {
						
			$scope.rels = "";
						
			}
			
			else {
				
			$scope.rels = response.data;

			}
			
			
		});
		
		
		
		$scope.addfriend = function(friendid,listid){			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/members/addfriend.php',{ from: $localStorage.currentUser.id , to:friendid,listid:listid })
            .then(function (response) {
					if (response.data.code !== 200) {
						$scope.msg_error = response.data.message;
					}
					else {
						$scope.msg_ok = "Cette personne est maintenant dans votre liste d'ami";
						$route.reload();
					}
			});
		}
		
		
		
		$scope.removefriend = function(friendid,listid){
			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/members/removefriend.php',{ from: $localStorage.currentUser.id , to:friendid,listid:listid })
            .then(function (response) {	

					if (response.data.code !== 200) {
						
						$scope.msg_error = response.data.message;
						
					}
					else {
						
						$scope.msg_ok = "Cette personne n'est plus dans votre liste d'ami";
						$route.reload();
					}

			
						
			}); 			
		}
		
		$scope.blockmember = function(member){			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/members/blockmember.php',{ to:member })
            .then(function (response) {
					if (response.data.code !== 200) {
						$scope.msg_error = response.data.message;
					}
					else {
						$scope.msg_ok = "Cette personne est maintenant bloquée";
						$route.reload();
					}
			});
		}
		
		$scope.unblockmember = function(member){			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/members/unblockmember.php',{ to:member })
            .then(function (response) {
					if (response.data.code !== 200) {
						$scope.msg_error = response.data.message;
					}
					else {
						$scope.msg_ok = "Cette personne est maintenant débloquée";
						$route.reload();
					}
			});
		}
		
		
		$scope.validatemember = function(to){			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/members/validatemember.php',{ from: $localStorage.currentUser.id , to:to })
            .then(function (response) {
					if (response.data.code !== 200) {
						$scope.msg_error = response.data.message;
					}
					else {
						$scope.msg_ok = "Cette personne est maintenant validée";
						$route.reload();
					}
			});
		}
		
		
		}	
});
