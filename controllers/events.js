app.controller("eventsCtrl", function ($scope,$http, $location,$routeParams,$route,$localStorage) {
	$scope.showsorties = true;
	$scope.shownewsortie = false;
	$scope.showdeletesortie = true;
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listsorties")
    .then(function(response) {
    $scope.sorties = response.data;
	$scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 5;
    $scope.totalItems = $scope.sorties.length;
	
    });

	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listusers")
    .then(function(response) {
        $scope.users = response.data;
    });
	
	
	
	if($location.path()=="/newsortie"){
		$scope.shownewsortie = true;
		$scope.showsorties = false;
		$scope.showdeletesortie = true;
		
		//default values for form
		$scope.newsortie = {};
		$scope.newsortie.scope = "public";

  
   $scope.poilist = [{'name':'Celt','location':'rue d\'armagnac'},
   {'name':'Divine Comédie','location':'rue de la zaza'},
   {'name':'la cavayere','location':'route du lac'},
   {'name':'paicherou','location':'à côté du tennis'}
];
  
		$scope.createsortie = function(name,desc,date,time,icon,scope){
			
			//"2018-08-07T22:00:00.000Z"
			
			var sortiedate = moment(date).format("YYYY-MM-DD");
			var sortietime = moment(time).format("HH:mm");
			var timestamp = moment(sortiedate + ' ' + sortietime);
			
			  $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/', { name: name, desc:desc,date:sortiedate,time:sortietime,timestamp:timestamp,icon:icon,scope:scope, leader: $scope.userid,action:"createsortie" })
             .then(function (response) {
					
					 $location.path('/sorties');
			
				 }); 
			
		}
  
  
		
	}
	
	
	if ($routeParams.sortie) {
		
		$scope.sortie = $routeParams.sortie;
		$scope.showsorties = false;
		$scope.showdeletesortie = false;
		
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=describesortie&id="+$scope.sortie)
			.then(function(response) {
			$scope.descsortie = response.data;
		});
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listinscriptions&sortieid="+$scope.sortie)
			.then(function(response) {
			$scope.inscriptions = response.data;
		});
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listcomments&sortieid="+$scope.sortie)
			.then(function(response) {
			$scope.comments = response.data;
		});
		
		
		$scope.register = function(sortie){
			
			$http.get('https://zygotopoc.westeurope.cloudapp.azure.com/?action=registersortie&sortieid='+sortie+'&userid='+$scope.userid)
            .then(function (response) {					
					$route.reload();	
				});
			
		}
		
		$scope.unregister = function(sortie){
			
			$http.get('https://zygotopoc.westeurope.cloudapp.azure.com/?action=unregistersortie&sortieid='+sortie+'&userid='+$scope.userid)
            .then(function (response) {					
					$route.reload();	
				});
			
		}
		
		$scope.addcomment = function(sortie,comment){
			
			$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/',{ userid: $scope.userid , sortieid:sortie,comment:comment,action:"addcomment" })
            .then(function (response) {					
					$route.reload();	
				});
			
		}
		
		
		$scope.deletesortie = function(sortie){
			
			$http.get('https://zygotopoc.westeurope.cloudapp.azure.com/?action=deletesortie&id='+sortie)
            .then(function (response) {					
					$location.path('/sorties');
					$route.reload();				
			
				});
			
		}
		
		
		}
		

});