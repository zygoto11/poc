var app = angular.module("myApp", ["ngRoute",'angular.filter','ui.bootstrap','ngStorage','ngMessages',"ngSanitize"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html"
    })
    .when("/sorties", {
        templateUrl : "sorties.html",
		controller : "sortiesCtrl"
    })
	.when("/newsortie", {
        templateUrl : "sorties.html",
		controller : "sortiesCtrl"
    })
	.when("/login", {
        templateUrl : "login.html",
		controller : "Login.IndexController",
		controllerAs: 'vm'
    })
	.when("/sorties/:sortie", {
        templateUrl : "sorties.html",
		controller : "sortiesCtrl"
    })
	.when("/profile", {
        templateUrl : "profile.html",
		controller : "profileCtrl"
    })
	.when("/messages", {
        templateUrl : "messages.html",
		controller : "messagesCtrl"
    })
    .when("/members", {
        templateUrl : "members.html",
		controller : "membersCtrl"
    })
    .when("/members/:username", {
        templateUrl : "members.html",
		controller : "membersCtrl"
    })
	;
});



app.run(function($rootScope, $http, $location, $localStorage) {
	
	 // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/login'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$localStorage.currentUser) {
                $location.path('/login');
            }
        });
	
});


app.controller("sortiesCtrl", function ($scope,$http, $location,$routeParams,$route,$localStorage) {
	$scope.showsorties = true;
	$scope.shownewsortie = false;
	$scope.showdeletesortie = true;
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listsorties")
    .then(function(response) {
        $scope.sorties = response.data;
    });
	
	
	if($location.path()=="/newsortie"){
		$scope.shownewsortie = true;
		$scope.showsorties = false;
		$scope.showdeletesortie = true;

  
   $scope.poilist = [{'name':'Celt','location':'rue d\'armagnac'},
   {'name':'Divine Comédie','location':'rue de la zaza'},
   {'name':'la cavayere','location':'route du lac'},
   {'name':'paicherou','location':'à côté du tennis'}
];
  
		$scope.createsortie = function(sortie){
			
			$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/', { name: sortie, leader: $scope.userid,action:"createsortie" })
            .then(function (response) {
					
					$location.path('/sorties');
			
				});
			
		}
  
  
		
	}
	
	
	if ($routeParams.sortie) {
		
		$scope.sortie = $routeParams.sortie;
		$scope.showsorties = false;
		$scope.showdeletesortie = false;
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listinscriptions&sortieid="+$scope.sortie)
			.then(function(response) {
			$scope.inscriptions = response.data;
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
		
		
		$scope.deletesortie = function(sortie){
			
			$http.get('https://zygotopoc.westeurope.cloudapp.azure.com/?action=deletesortie&id='+sortie)
            .then(function (response) {					
					$location.path('/sorties');
					$route.reload();				
			
				});
			
		}
		
		
		}
		

});


app.controller("membersCtrl", function ($scope,$http, $routeParams,$localStorage) {
	
$scope.showusers = true;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listusers")
    .then(function(response) {
        $scope.users = response.data;
    });
	
	


		
	
	if ($routeParams.username) {
		
		$scope.user = $routeParams.username.toLowerCase();
		$scope.showusers = false;
		
		}
	
});


app.controller("profileCtrl", function ($scope,$http, $routeParams,$localStorage) {	

$scope.username = $localStorage.currentUser.username;
$scope.userid = $localStorage.currentUser.id;

});

app.controller("messagesCtrl", function ($scope,$http, $routeParams) {
	
	
});


