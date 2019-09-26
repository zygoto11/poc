app.controller("eventsCtrl", function ($scope,$http, $location,$routeParams,$route,$localStorage) {
	$scope.showsorties = true;
	$scope.shownewsortie = false;
	$scope.showdeletesortie = true;
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/events/getevents.php")
    .then(function(response) {
    $scope.sorties = response.data;
	$scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 5;
    //$scope.totalItems = $scope.nextsorties.length;
	
	$scope.nextsorties = $scope.sorties.filter(function (sortie) {		
		return ( moment(sortie.timestamp).valueOf() > Date.now());	
	}); 
	
	$scope.totalItems = $scope.nextsorties.length;
	
    });

	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
        $scope.users = response.data.result.users;
    });
	
	
	
	
	
	
	if ($routeParams.sortie) {
		
		$scope.sortie = $routeParams.sortie;
		$scope.showsorties = false;
		$scope.showdeletesortie = false;
		
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/events/getevent.php?id="+$scope.sortie)
			.then(function(response) {
			$scope.descsortie = response.data;
		});
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/events/getregistrations.php?sortieid="+$scope.sortie)
			.then(function(response) {
			$scope.inscriptions = response.data;
		});
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/events/getcomments.php?sortieid="+$scope.sortie)
			.then(function(response) {
			$scope.comments = response.data;
		});
		
		
		$scope.register = function(sortie){			
			$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/events/registerevent.php',{eventid:sortie})
            .then(function (response) {	
				$scope.reg = response.data;
				$route.reload();
				});
		}
		
		$scope.unregister = function(sortie){			
			$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/events/unregisterevent.php',{eventid:sortie})
            .then(function (response) {					
					$route.reload();	
				});
		}
		
		$scope.addcomment = function(sortie,comment){			
			$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/events/addcomment.php',{ eventid:sortie,comment:comment })
            .then(function (response) {					
					$route.reload();	
				});			
		}
		
		
		$scope.deletesortie = function(sortie){
			
			$http.get('https://zygotopoc.westeurope.cloudapp.azure.com/events/deleteevent.php?id='+sortie)
            .then(function (response) {					
					$location.path('/sorties');
					$route.reload();				
			
				});
			
		}
		
		
		}
		

});


app.controller("pasteventsCtrl", function ($scope,$http, $location,$routeParams,$route,$localStorage) {
	$scope.showsorties = true;
	$scope.shownewsortie = false;
	$scope.showdeletesortie = true;
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/events/getevents.php")
    .then(function(response) {
    $scope.sorties = response.data;
	$scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 5;
    $scope.totalItems = $scope.sorties.length;	
    });	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
        $scope.users = response.data.result.users;
    });
	

  $scope.options = {
    showWeeks: false,
	showButtonBar: false,
	minMode:'day',
	maxMode:'month',
	customClass: getDayClass
  };
 

  function getDayClass(data) {
	 return "mycal";
  }


	
	
	
});

app.controller("neweventCtrl", function ($scope,$http, $location,$routeParams,$route,$localStorage) {
	
	//default values for form
	$scope.newsortie = {};
	$scope.newsortie.scope = "public";
  
   $scope.poilist = [{'name':'Celt','location':'rue d\'armagnac'},
   {'name':'Divine Comédie','location':'rue de la zaza'},
   {'name':'la cavayere','location':'route du lac'},
   {'name':'paicherou','location':'à côté du tennis'}
];

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
  
	$scope.createsortie = function(name,desc,date,time,icon,scope){
		var sortiedate = moment(date).format("YYYY-MM-DD");
		var sortietime = moment(time).format("HH:mm");
		var timestamp = sortiedate + ' ' + sortietime;
		$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/events/create_event.php', { name: name, desc:desc,date:sortiedate,time:sortietime,timestamp:timestamp,icon:icon,scope:scope })
		.then(function (response) {
			$location.path('/sorties');
		});
	}
});