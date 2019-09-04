app.controller("Login.IndexController", function ($http,$scope,$location, AuthenticationService) {
	
	 var vm = this;

        vm.login = login;

        initController();

        function initController() {
            // reset login status
            AuthenticationService.Logout();
        };
		

		
		
			$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/readonly.php?action=listsorties")
				.then(function(response) {
				$scope.sorties = response.data;
			});
			$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/readonly.php?action=listusers")
				.then(function(response) {
				$scope.users = response.data;
			});
			$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/readonly.php?action=listinscriptions")
				.then(function(response) {
				$scope.inscriptions = response.data;
			});

        function login() {
            vm.loading = true;
            AuthenticationService.Login(vm.username, vm.password, function (result) {
                if (result === true) {
                    $location.path('/sorties');
                } else {
                    vm.error = 'Username or password is incorrect';
                    vm.loading = false;
                }
            });
        };
	
});