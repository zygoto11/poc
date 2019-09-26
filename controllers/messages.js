app.controller("messagesCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
	
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
        $scope.users = response.data.result.users;		
    });
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/messages/getmessages.php")
    .then(function(response) {
        $scope.messages = response.data;
			$scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 5;
    $scope.totalItems = $scope.messages.length;	

});  
			
    });
	
	



app.controller("messageCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
	
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
        $scope.users = response.data.result.users;		
    });
	

	
		if ($routeParams.message) {
		
		$scope.message = $routeParams.message;
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/messages/getmessage.php?id="+$scope.message)
		.then(function(response) {
        $scope.descmessage = response.data;	
		$scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 5;
    $scope.totalItems = $scope.descmessage.length;	
		});
		
		
		
		
		 $scope.tinyMceOptions = {
                        plugins: ['lists','emoticons template paste textcolor textpattern imagetools'],
                        statusbar: false,
                        menubar: false,
                        resize: false,
                        language: 'fr_FR',
						readonly : 0,
                        language_url:'https://cdn.jsdelivr.net/npm/tinymce-lang@0.0.1/langs/fr_FR.js',
                        toolbar: 'bold italic underline | bullist numlist | alignleft aligncenter alignright | undo redo | forecolor backcolor'

                    };
		
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
       $scope.users = response.data.result.users;
	$scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 10;
    $scope.totalItems = $scope.users.length;
	$scope.online = response.data.result.online;
    });
	
	
	
	$scope.showdest = true;
	
 	if ($routeParams.to) {

		$scope.newmessage = {};
		$scope.newmessage.dest = {};
		$scope.newmessage.dest.id = $routeParams.to;
		$scope.showdest = false;
		
	} 
	
	
	 $scope.tinyMceOptions = {
                        plugins: ['lists','emoticons template paste textcolor textpattern imagetools placeholder'],
                        statusbar: false,
                        menubar: false,
                        resize: false,
                        language: 'fr_FR',
						readonly : 0,
                        language_url:'https://cdn.jsdelivr.net/npm/tinymce-lang@0.0.1/langs/fr_FR.js',
                        toolbar: 'bold italic underline | bullist numlist | alignleft aligncenter alignright | undo redo | forecolor backcolor'

                    };
					
	

	
	$scope.createmessage = function(dest,msgname,msgcontent){			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/messages/createmessage.php',{  to:dest,msgname:msgname,msgcontent:msgcontent })
            .then(function (response) {
				if (response.data.code !== 200) {
					$scope.error_msg = response.data.message;
				}
				else{
					
					$location.path('/messages');	
				}
				}); 
			
	}
	
	
	
});