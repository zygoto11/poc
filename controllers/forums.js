app.controller("forumsCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
		if ($routeParams.forumid) {
		
		$scope.forumid = $routeParams.forumid;
		$scope.showforums = false;
		$scope.userid = $localStorage.currentUser.id;
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/forums/gettopics.php?forumid="+$scope.forumid)
		.then(function(response) {
        $scope.topics = response.data;		
		});		
	
		
		
		}
		
		
		if ($routeParams.newtopic) {
			
			
			if ($routeParams.forumid) {
			$scope.shownewtopic = true;
			$scope.showforums = false;
			}
			
		}
		
		
		
		
		

	
	
	
});