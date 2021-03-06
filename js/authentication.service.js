app.factory("AuthenticationService", function ($http, $localStorage) {
	
	var service = {};

        service.Login = Login;
        service.Logout = Logout;

        return service;

        function Login(username, password, callback) {
            $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/login.php', { username: username, password: password})
                .then(function (response) {
                    // login successful if there's a token in the response
                    if (response.data.token) {

                        // store username and token in local storage to keep user logged in between page refreshes
                        $localStorage.currentUser = { username: response.data.username,id:response.data.id, token: response.data.token };

                        // add jwt token to auth header for all requests made by the $http service
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;

                        // execute callback with true to indicate successful login
                        callback(true);
                    } else {
                        // execute callback with false to indicate failed login
                        callback(false);
                    }
                });
        }
		
        function Logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
        }
	
});