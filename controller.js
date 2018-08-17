var app = angular.module("myApp", ["ngRoute",'ui.bootstrap','ngStorage','ngMessages','ngMockE2E']);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html"
    })
    .when("/sorties", {
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
    .when("/members", {
        templateUrl : "members.html",
		controller : "membersCtrl"
    })
    .when("/member/:username", {
        templateUrl : "member.html",
		controller : "memberCtrl"
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


app.controller("sortiesCtrl", function ($scope,$http, $routeParams) {
	$http.get("fake/sorties.json")
    .then(function(response) {
        $scope.sorties = response.data;
    });
	
	

	
	
	if ($routeParams.sortie) {
		
		$scope.sortie = $routeParams.sortie;
		
		
		}
});


app.controller("membersCtrl", function ($scope) {
	
	$scope.sidebarCollapse = function(){
		$('#sidebar').toggleClass('active');
	};
	
    $scope.users = [
  { avatar:true,gender: 'male',username:'bart',firstname:'bart',birthdate:'1984' },
  { avatar:true,gender: 'male',username:'homer',firstname:'homer',birthdate:'1984' },
  { avatar:true,gender: 'female',username:'marge',firstname:'marge',birthdate:'1984' },
  { avatar:true,gender: 'female',username:'lisa',firstname:'lisa',birthdate:'1984' },
  { avatar:true,gender: 'female',username:'maggie',firstname:'maggie',birthdate:'1984' },
  { avatar:true,gender: 'male',username:'furet',firstname:'furet',birthdate:'1900' }
	]
	;
});


app.controller("memberCtrl", function ($scope, $routeParams) {
    $scope.user = $routeParams.username
	;
});



