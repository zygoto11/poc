app.controller("Login.IndexController", function ($http,$scope,$location, AuthenticationService) {
	
	 var vm = this;

        vm.login = login;

        initController();

        function initController() {
            // reset login status
            AuthenticationService.Logout();
        };
		
			$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listsorties")
				.then(function(response) {
				$scope.sorties = response.data;
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