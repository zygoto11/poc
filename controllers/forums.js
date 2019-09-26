app.controller("forumsCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
		if ($routeParams.forumid) {
		
		$scope.forumid = $routeParams.forumid;
		$scope.showforums = false;
		$scope.userid = $localStorage.currentUser.id;
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/forums/gettopics.php?forumid="+$scope.forumid)
		.then(function(response) {
        $scope.topics = response.data;		
		});		
	
				$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
       $scope.users = response.data.result.users;
	$scope.online = response.data.result.online;
    });
	
		
		
		}

	
});


app.controller("topicCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
	
	if ($routeParams.forumid) {
		
		$scope.forumid = $routeParams.forumid;
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/forums/gettopics.php?forumid="+$scope.forumid)
		.then(function(response) {
        $scope.topics = response.data;		
		});		
		
	
		if ($routeParams.topicid) {
		
		$scope.topicid = $routeParams.topicid;
		$scope.userid = $localStorage.currentUser.id;
	
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/forums/gettopic.php?id="+$scope.topicid)
		.then(function(response) {
        $scope.topic = response.data;		
		});		
	
				$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
    $scope.users = response.data.result.users;
	$scope.online = response.data.result.online;
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
		
		$scope.replytopic = function(msgcontent){
			
			$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/forums/replytopic.php',{ msgid:$scope.topicid,msgcontent:msgcontent})
            .then(function (response) {					
				$route.reload();		
				});
			
		}
	
		
		
		}
		
	}

	
});


app.controller("newtopicCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
		if ($routeParams.forumid) {
		

		$scope.forumid = $routeParams.forumid;
	

		
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
					
					
						$scope.createtopic = function(title,content){			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/forums/createtopic.php',{  forumid:$scope.forumid,title:title,content:content })
            .then(function (response) {
				if (response.data.code !== 200) {
					$scope.error_msg = response.data.message;
				}
				else{
					
					$location.path('/forums/'+$scope.forumid);	
				}
				}); 
			
	}
		
		
		
		}

	
});