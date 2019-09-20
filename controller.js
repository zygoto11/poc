var app = angular.module("myApp", ["ngRoute",'angular.filter','ui.bootstrap','ngStorage','ngMessages',"ngSanitize",'ngTagsInput','textAngular']);
app.config(function($routeProvider) {
    $routeProvider
	.when("/", {
        templateUrl : "sorties.html",
		controller : "eventsCtrl"
    })
    .when("/sorties", {
        templateUrl : "sorties.html",
		controller : "eventsCtrl"
    })
	.when("/eventsarchives", {
        templateUrl : "events_archive.html",
		controller : "pasteventsCtrl"
    })
	.when("/newsortie", {
        templateUrl : "newevent.html",
		controller : "neweventCtrl"
    })
	.when("/login", {
        templateUrl : "login.html",
		controller : "Login.IndexController",
		controllerAs: 'vm'
    })
	.when("/createaccount", {
        templateUrl : "createaccount.html",
		controller : "createAccountCtrl"
    })
	.when("/validation", {
        templateUrl : "validation.html",
		controller : "validationAccountCtrl"
    })
	.when("/connect", {
		templateUrl : "validation.html",
		controller : "connectAccountCtrl"
    })
	.when("/sorties/:sortie", {
        templateUrl : "sorties.html",
		controller : "eventsCtrl"
    })
	.when("/profile", {
        templateUrl : "profile.html",
		controller : "profileCtrl"
    })
	.when("/log", {
        templateUrl : "log.html",
		controller : "logCtrl"
    })
	.when("/privacy", {
        templateUrl : "privacy.html",
		controller : "privacyCtrl"
    })
	.when("/notifications", {
        templateUrl : "notifications.html",
		controller : "notificationsCtrl"
    })
	.when("/newmessage", {
        templateUrl : "messages.html",
		controller : "messagesCtrl"
    })
	.when("/messages", {
        templateUrl : "messages.html",
		controller : "messagesCtrl"
    })
	.when("/messages/:message", {
        templateUrl : "messages.html",
		controller : "messagesCtrl"
    })
	.when("/forums", {
        templateUrl : "forums.html",
		controller : "forumsCtrl"
    })
	.when("/forums/:forumid", {
        templateUrl : "forums.html",
		controller : "forumsCtrl"
    })
	.when("/newtopic/:forumid/", {
        templateUrl : "forums.html",
		controller : "forumsCtrl"
    })
    .when("/members", {
        templateUrl : "members.html",
		controller : "membersCtrl"
    })
    .when("/members/:userid", {
        templateUrl : "member.html",
		controller : "membersCtrl"
    })
	.when("/friends", {
        templateUrl : "friends.html",
		controller : "friendsCtrl"
    })
	;
});


moment.locale('fr');
app.filter('moment', function () {
  return function (input, momentFn /*, param1, param2, ...param n */) {
    var args = Array.prototype.slice.call(arguments, 2),
        momentObj = moment(input);
    return momentObj[momentFn].apply(momentObj, args);
  };
});


app.run(function($rootScope, $http, $location, $localStorage) {
	
	 // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/login','/intro','/createaccount','/api','/validation','/connect'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$localStorage.currentUser) {
                $location.path('/login');
            }
        });
	
});



app.controller("messagesCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
	
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	$scope.showmessages = true;
	$scope.shownewmessage = false;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getusers.php")
    .then(function(response) {
        $scope.users = response.data;		
    });
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/messages/getmessages.php")
    .then(function(response) {
        $scope.messages = response.data;
			
			angular.element(document).ready(function() {  
			dTable = $('#tablemessages');  
			dTable.DataTable();  
});  
			
    });
	
	
	
	
		if ($routeParams.message) {
		
		$scope.message = $routeParams.message;
		$scope.showmessages = false;
		$scope.userid = $localStorage.currentUser.id;
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/messages/getmessage.php?id="+$scope.message)
		.then(function(response) {
        $scope.descmessage = response.data;		
		});
		
		
		$scope.replymessage = function(msgcontent){
			
			$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/messages/replymessage.php',{ msgid:$scope.message,msgcontent:msgcontent})
            .then(function (response) {					
				$route.reload();		
				});
			
		}
		
		
	
		}
	
	
	if($location.path()=="/newmessage"){
		$scope.shownewmessage = true;
		$scope.showmessages = false;
		$scope.userid = $localStorage.currentUser.id;
		$scope.createmessage = function(dest,msgname,msgcontent){

			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/messages/createmessage.php',{  to:dest,msgname:msgname,msgcontent:msgcontent })
            .then(function (response) {					
					$location.path('/messages');	
				}); 
			
	}
	

	
	
	}
	
	
});


app.controller("forumsCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
	
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	$scope.showforums = true;
	$scope.shownewtopic = false;
		
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


