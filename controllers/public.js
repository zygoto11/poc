app.controller("createAccountCtrl", function ($scope,$http, $routeParams,$localStorage) {



$scope.createuser = function(username,email){
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/public/create_user.php',{ username: username,email:email })
            .then(function (response) {
					//response.status
					
					if (response.data.code !== 200) {
						
						$scope.api_error = response.data.message;
						
					}
					else {
						
						$scope.api_ok = "Votre compte a été créé, vous devez l'activer en cliquant sur le lien qui vous a été envoyé par email";
						
					}
						
				}); 
			
}
	
});

app.controller("validationAccountCtrl", function ($scope,$http, $routeParams,$localStorage,$location) {
	
		if ($routeParams.token) {
		
		$scope.token = $routeParams.token;
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/public/validate_user.php?token="+$scope.token)
			.then(function(response) {
		
			//add if
			$localStorage.currentUser = { username: response.data.username,id:response.data.id, token: response.data.token };
			$http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
			$location.url('/profile?showhelp=yes');
			
			
		});	
		
		}
	
});

app.controller("connectAccountCtrl", function ($scope,$http, $routeParams,$localStorage,$location) {
	
		if ($routeParams.token) {
		$scope.token = $routeParams.token;
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/public/validate_magic.php?token="+$scope.token)
			.then(function(response) {
		
			//add if
			$localStorage.currentUser = { username: response.data.username,id:response.data.id, token: response.data.token };
			$http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
			$location.path('/sorties');
			
			
		});	
		
		}
	
});
