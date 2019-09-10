app.controller("Login.IndexController", function ($http,$scope,$location, AuthenticationService) {
	
	 var vm = this;

        vm.login = login;

        initController();

        function initController() {
            // reset login status
            AuthenticationService.Logout();
        };
		
        function login() {
            AuthenticationService.Login(vm.username, vm.password, function (result) {
                if (result === true) {
                    $location.path('/sorties');
                } else {
                    vm.error = 'Pseudo ou mot de passe incorrect !';
                    vm.loading = false;
                }
            });
        };
		
		$scope.send_magic = function(username){
			
			if (username) {
			
			username.toLowerCase();
			$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/public/send_magic.php?username="+username)
				.then(function(response) {
				//$scope.magic = response.data;
				$scope.magic = "Un email vous a été envoyé !";
				
			});
			
			}
			
		}
		
	
});