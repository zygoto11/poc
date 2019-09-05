var app = angular.module("myApp", ["ngRoute",'angular.filter','ui.bootstrap','ngStorage','ngMessages',"ngSanitize",'angular-loading-bar','ngTagsInput']);
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
	.when("/intro", {
        templateUrl : "intro.html"
    })
	.when("/api", {
        templateUrl : "api.html"
    })
	.when("/createaccount", {
        templateUrl : "createaccount.html",
		controller : "createAccountCtrl"
    })
	.when("/sorties/:sortie", {
        templateUrl : "sorties.html",
		controller : "sortiesCtrl"
    })
	.when("/profile", {
        templateUrl : "profile.html",
		controller : "profileCtrl"
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
        templateUrl : "members.html",
		controller : "membersCtrl"
    })
	;
});


app.filter('pgtimestamp', function () {
    return function (input) {
      return new Date(input);
    }});


app.directive('datatableSetup', ['$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $timeout(function () {
                   // do something
                });
            }
        }
    }
]);


app.run(function($rootScope, $http, $location, $localStorage) {
	
	 // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/login','/intro','/createaccount','/api'];
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


app.controller("membersCtrl", function ($scope,$http, $routeParams,$localStorage) {
	
$scope.showusers = true;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listusers")
    .then(function(response) {
        $scope.users = response.data;
    });

	if ($routeParams.userid) {
		
		$scope.showusers = false;
		$scope.userid = $routeParams.userid;
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=describeuser&id="+$scope.userid)
			.then(function(response) {
			$scope.user = response.data;
			
			
	});
		
		
		
		}
	
});



app.controller("createAccountCtrl", function ($scope,$http, $routeParams,$localStorage) {
	
var $input = $(".typeahead");
$input.typeahead({
  source: [
		{ name : "Aigues-Vives", id :"11800"},
		{ name : "Airoux", id :"11320"},
		{ name : "Ajac", id :"11300"},
		{ name : "Alaigne", id :"11240"},
		{ name : "Alairac", id :"11290"},
		{ name : "Albas", id :"11360"},
		{ name : "Albières", id :"11330"},
		{ name : "Alet-les-Bains", id :"11580"},
		{ name : "Alzonne", id :"11170"},
		{ name : "Antugnac", id :"11190"},
		{ name : "Aragon", id :"11600"},
		{ name : "Argeliers", id :"11120"},
		{ name : "Argens-Minervois", id :"11200"},
		{ name : "Armissan", id :"11110"},
		{ name : "Arques", id :"11190"},
		{ name : "Arquettes-en-Val", id :"11220"},
		{ name : "Artigues", id :"11140"},
		{ name : "Arzens", id :"11290"},
		{ name : "Aunat", id :"11140"},
		{ name : "Auriac", id :"11330"},
		{ name : "Axat", id :"11140"},
		{ name : "Azille", id :"11700"},
		{ name : "Badens", id :"11800"},
		{ name : "Bages", id :"11100"},
		{ name : "Bagnoles", id :"11600"},
		{ name : "Baraigne", id :"11410"},
		{ name : "Barbaira", id :"11800"},
		{ name : "Belcaire", id :"11340"},
		{ name : "Belcastel-et-Buc", id :"11580"},
		{ name : "Belflou", id :"11410"},
		{ name : "Belfort-sur-Rebenty", id :"11140"},
		{ name : "Bellegarde-du-Razès", id :"11240"},
		{ name : "Belpech", id :"11420"},
		{ name : "Belvèze-du-Razès", id :"11240"},
		{ name : "Belvianes-et-Cavirac", id :"11500"},
		{ name : "Belvis", id :"11340"},
		{ name : "Berriac", id :"11000"},
		{ name : "Bessède-de-Sault", id :"11140"},
		{ name : "Bizanet", id :"11200"},
		{ name : "Bize-Minervois", id :"11120"},
		{ name : "Blomac", id :"11700"},
		{ name : "Bouilhonnac", id :"11800"},
		{ name : "Bouisse", id :"11330"},
		{ name : "Bouriège", id :"11300"},
		{ name : "Bourigeole", id :"11300"},
		{ name : "Boutenac", id :"11200"},
		{ name : "Bram", id :"11150"},
		{ name : "Brézilhac", id :"11270"},
		{ name : "Brousses-et-Villaret", id :"11390"},
		{ name : "Brugairolles", id :"11300"},
		{ name : "Bugarach", id :"11190"},
		{ name : "Cabrespine", id :"11160"},
		{ name : "Cahuzac", id :"11420"},
		{ name : "Cailhau", id :"11240"},
		{ name : "Cailhavel", id :"11240"},
		{ name : "Cailla", id :"11140"},
		{ name : "Cambieure", id :"11240"},
		{ name : "Campagna-de-Sault", id :"11140"},
		{ name : "Campagne-sur-Aude", id :"11260"},
		{ name : "Camplong-d'Aude", id :"11200"},
		{ name : "Camps-sur-l'Agly", id :"11190"},
		{ name : "Camurac", id :"11340"},
		{ name : "Canet", id :"11200"},
		{ name : "Capendu", id :"11700"},
		{ name : "Carcassonne", id :"11000"},
		{ name : "Carlipa", id :"11170"},
		{ name : "Cascastel-des-Corbières", id :"11360"},
		{ name : "Cassaignes", id :"11190"},
		{ name : "Castans", id :"11160"},
		{ name : "Castelnau-d'Aude", id :"11700"},
		{ name : "Castelnaudary", id :"11400"},
		{ name : "Castelreng", id :"11300"},
		{ name : "Caudebronde", id :"11390"},
		{ name : "Caunes-Minervois", id :"11160"},
		{ name : "Caunette-sur-Lauquet", id :"11250"},
		{ name : "Caunettes-en-Val", id :"11220"},
		{ name : "Caux-et-Sauzens", id :"11170"},
		{ name : "Cavanac", id :"11570"},
		{ name : "Caves", id :"11510"},
		{ name : "Cazalrenoux", id :"11270"},
		{ name : "Cazilhac", id :"11570"},
		{ name : "Cenne-Monestiés", id :"11170"},
		{ name : "Cépie", id :"11300"},
		{ name : "Chalabre", id :"11230"},
		{ name : "Citou", id :"11160"},
		{ name : "Clermont-sur-Lauquet", id :"11250"},
		{ name : "Comigne", id :"11700"},
		{ name : "Comus", id :"11340"},
		{ name : "Conilhac-Corbières", id :"11200"},
		{ name : "Conilhac-de-la-Montagne", id :"11190"},
		{ name : "Conques-sur-Orbiel", id :"11600"},
		{ name : "Corbières", id :"11230"},
		{ name : "Coudons", id :"11500"},
		{ name : "Couffoulens", id :"11250"},
		{ name : "Couiza", id :"11190"},
		{ name : "Counozouls", id :"11140"},
		{ name : "Cournanel", id :"11300"},
		{ name : "Coursan", id :"11110"},
		{ name : "Courtauly", id :"11230"},
		{ name : "Coustaussa", id :"11190"},
		{ name : "Coustouge", id :"11220"},
		{ name : "Cruscades", id :"11200"},
		{ name : "Cubières-sur-Cinoble", id :"11190"},
		{ name : "Cucugnan", id :"11350"},
		{ name : "Cumiès", id :"11410"},
		{ name : "Cuxac-Cabardès", id :"11390"},
		{ name : "Cuxac-d'Aude", id :"11590"},
		{ name : "Davejean", id :"11330"},
		{ name : "Dernacueillette", id :"11330"},
		{ name : "Donazac", id :"11240"},
		{ name : "Douzens", id :"11700"},
		{ name : "Duilhac-sous-Peyrepertuse", id :"11350"},
		{ name : "Durban-Corbières", id :"11360"},
		{ name : "Embres-et-Castelmaure", id :"11360"},
		{ name : "Escales", id :"11200"},
		{ name : "Escouloubre", id :"11140"},
		{ name : "Escueillens-et-Saint-Just-de-Bélengard", id :"11240"},
		{ name : "Espéraza", id :"11260"},
		{ name : "Espezel", id :"11340"},
		{ name : "Fa", id :"11260"},
		{ name : "Fabrezan", id :"11200"},
		{ name : "Fajac-en-Val", id :"11220"},
		{ name : "Fajac-la-Relenque", id :"11410"},
		{ name : "Fanjeaux", id :"11270"},
		{ name : "Félines-Termenès", id :"11330"},
		{ name : "Fendeille", id :"11400"},
		{ name : "Fenouillet-du-Razès", id :"11240"},
		{ name : "Ferrals-les-Corbières", id :"11200"},
		{ name : "Ferran", id :"11240"},
		{ name : "Festes-et-Saint-André", id :"11300"},
		{ name : "Feuilla", id :"11510"},
		{ name : "Fitou", id :"11510"},
		{ name : "Fleury", id :"11560"},
		{ name : "Floure", id :"11800"},
		{ name : "Fontanès-de-Sault", id :"11140"},
		{ name : "Fontcouverte", id :"11700"},
		{ name : "Fonters-du-Razès", id :"11400"},
		{ name : "Fontiers-Cabardès", id :"11390"},
		{ name : "Fontiès-d'Aude", id :"11800"},
		{ name : "Fontjoncouse", id :"11360"},
		{ name : "Fournes-Cabardès", id :"11600"},
		{ name : "Fourtou", id :"11190"},
		{ name : "Fraisse-Cabardès", id :"11600"},
		{ name : "Fraissé-des-Corbières", id :"11360"},
		{ name : "Gaja-et-Villedieu", id :"11300"},
		{ name : "Gaja-la-Selve", id :"11270"},
		{ name : "Galinagues", id :"11140"},
		{ name : "Gardie", id :"11250"},
		{ name : "Generville", id :"11270"},
		{ name : "Gincla", id :"11140"},
		{ name : "Ginestas", id :"11120"},
		{ name : "Ginoles", id :"11500"},
		{ name : "Gourvieille", id :"11410"},
		{ name : "Gramazie", id :"11240"},
		{ name : "Granès", id :"11500"},
		{ name : "Greffeil", id :"11250"},
		{ name : "Gruissan", id :"11430"},
		{ name : "Homps", id :"11200"},
		{ name : "Hounoux", id :"11240"},
		{ name : "Issel", id :"11400"},
		{ name : "Jonquières", id :"11220"},
		{ name : "Joucou", id :"11140"},
		{ name : "La Bezole", id :"11300"},
		{ name : "La Cassaigne", id :"11270"},
		{ name : "La Courtète", id :"11240"},
		{ name : "La Digne-d'Amont", id :"11300"},
		{ name : "La Digne-d'Aval", id :"11300"},
		{ name : "La Fajolle", id :"11140"},
		{ name : "La Force", id :"11270"},
		{ name : "La Louvière-Lauragais", id :"11410"},
		{ name : "La Palme", id :"11480"},
		{ name : "La Pomarède", id :"11400"},
		{ name : "La Redorte", id :"11700"},
		{ name : "La Serpent", id :"11190"},
		{ name : "La Tourette-Cabardès", id :"11380"},
		{ name : "Labastide-d'Anjou", id :"11320"},
		{ name : "Labastide-en-Val", id :"11220"},
		{ name : "Labastide-Esparbairenque", id :"11380"},
		{ name : "Labécède-Lauragais", id :"11400"},
		{ name : "Lacombe", id :"11310"},
		{ name : "Ladern-sur-Lauquet", id :"11250"},
		{ name : "Lafage", id :"11420"},
		{ name : "Lagrasse", id :"11220"},
		{ name : "Lairière", id :"11330"},
		{ name : "Lanet", id :"11330"},
		{ name : "Laprade", id :"11390"},
		{ name : "Laroque-de-Fa", id :"11330"},
		{ name : "Lasbordes", id :"11400"},
		{ name : "Lasserre-de-Prouille", id :"11270"},
		{ name : "Lastours", id :"11600"},
		{ name : "Laurabuc", id :"11400"},
		{ name : "Laurac", id :"11270"},
		{ name : "Lauraguel", id :"11300"},
		{ name : "Laure-Minervois", id :"11800"},
		{ name : "Lavalette", id :"11290"},
		{ name : "Le Bousquet", id :"11140"},
		{ name : "Le Clat", id :"11140"},
		{ name : "Les Brunels", id :"11400"},
		{ name : "Les Cassés", id :"11320"},
		{ name : "Les Ilhes", id :"11380"},
		{ name : "Les Martys", id :"11390"},
		{ name : "Lespinassière", id :"11160"},
		{ name : "Leuc", id :"11250"},
		{ name : "Leucate", id :"11370"},
		{ name : "Lézignan-Corbières", id :"11200"},
		{ name : "Lignairolles", id :"11240"},
		{ name : "Limousis", id :"11600"},
		{ name : "Limoux", id :"11300"},
		{ name : "Loupia", id :"11300"},
		{ name : "Luc-sur-Aude", id :"11190"},
		{ name : "Luc-sur-Orbieu", id :"11200"},
		{ name : "Magrie", id :"11300"},
		{ name : "Mailhac", id :"11120"},
		{ name : "Maisons", id :"11330"},
		{ name : "Malras", id :"11300"},
		{ name : "Malves-en-Minervois", id :"11600"},
		{ name : "Malviès", id :"11300"},
		{ name : "Marcorignan", id :"11120"},
		{ name : "Marquein", id :"11410"},
		{ name : "Marsa", id :"11140"},
		{ name : "Marseillette", id :"11800"},
		{ name : "Mas-Cabardès", id :"11380"},
		{ name : "Mas-des-Cours", id :"11570"},
		{ name : "Mas-Saintes-Puelles", id :"11400"},
		{ name : "Massac", id :"11330"},
		{ name : "Mayreville", id :"11420"},
		{ name : "Mayronnes", id :"11220"},
		{ name : "Mazerolles-du-Razès", id :"11240"},
		{ name : "Mazuby", id :"11140"},
		{ name : "Mérial", id :"11140"},
		{ name : "Mézerville", id :"11410"},
		{ name : "Miraval-Cabardès", id :"11380"},
		{ name : "Mirepeisset", id :"11120"},
		{ name : "Mireval-Lauragais", id :"11400"},
		{ name : "Missègre", id :"11580"},
		{ name : "Molandier", id :"11420"},
		{ name : "Molleville", id :"11410"},
		{ name : "Montauriol", id :"11410"},
		{ name : "Montazels", id :"11190"},
		{ name : "Montbrun-des-Corbières", id :"11700"},
		{ name : "Montclar", id :"11250"},
		{ name : "Montferrand", id :"11320"},
		{ name : "Montfort-sur-Boulzane", id :"11140"},
		{ name : "Montgaillard", id :"11330"},
		{ name : "Montgradail", id :"11240"},
		{ name : "Monthaut", id :"11240"},
		{ name : "Montirat", id :"11800"},
		{ name : "Montjardin", id :"11230"},
		{ name : "Montjoi", id :"11330"},
		{ name : "Montlaur", id :"11220"},
		{ name : "Montmaur", id :"11320"},
		{ name : "Montolieu", id :"11170"},
		{ name : "Montréal", id :"11290"},
		{ name : "Montredon-des-Corbières", id :"11100"},
		{ name : "Montséret", id :"11200"},
		{ name : "Monze", id :"11800"},
		{ name : "Moussan", id :"11120"},
		{ name : "Moussoulens", id :"11170"},
		{ name : "Mouthoumet", id :"11330"},
		{ name : "Moux", id :"11700"},
		{ name : "Narbonne", id :"11100"},
		{ name : "Nébias", id :"11500"},
		{ name : "Névian", id :"11200"},
		{ name : "Niort-de-Sault", id :"11140"},
		{ name : "Ornaisons", id :"11200"},
		{ name : "Orsans", id :"11270"},
		{ name : "Ouveillan", id :"11590"},
		{ name : "Padern", id :"11350"},
		{ name : "Palairac", id :"11330"},
		{ name : "Palaja", id :"11570"},
		{ name : "Paraza", id :"11200"},
		{ name : "Pauligne", id :"11300"},
		{ name : "Payra-sur-l'Hers", id :"11410"},
		{ name : "Paziols", id :"11350"},
		{ name : "Pech-Luna", id :"11420"},
		{ name : "Pécharic-et-le-Py", id :"11420"},
		{ name : "Pennautier", id :"11610"},
		{ name : "Pépieux", id :"11700"},
		{ name : "Pexiora", id :"11150"},
		{ name : "Peyrefitte-du-Razès", id :"11230"},
		{ name : "Peyrefitte-sur-l'Hers", id :"11420"},
		{ name : "Peyrens", id :"11400"},
		{ name : "Peyriac-de-Mer", id :"11440"},
		{ name : "Peyriac-Minervois", id :"11160"},
		{ name : "Peyrolles", id :"11190"},
		{ name : "Pezens", id :"11170"},
		{ name : "Pieusse", id :"11300"},
		{ name : "Plaigne", id :"11420"},
		{ name : "Plavilla", id :"11270"},
		{ name : "Pomas", id :"11250"},
		{ name : "Pomy", id :"11300"},
		{ name : "Port-la-Nouvelle", id :"11210"},
		{ name : "Portel-des-Corbières", id :"11490"},
		{ name : "Pouzols-Minervois", id :"11120"},
		{ name : "Pradelles-Cabardès", id :"11380"},
		{ name : "Pradelles-en-Val", id :"11220"},
		{ name : "Preixan", id :"11250"},
		{ name : "Puginier", id :"11400"},
		{ name : "Puichéric", id :"11700"},
		{ name : "Puilaurens", id :"11140"},
		{ name : "Puivert", id :"11230"},
		{ name : "Quillan", id :"11500"},
		{ name : "Quintillan", id :"11360"},
		{ name : "Quirbajou", id :"11500"},
		{ name : "Raissac-d'Aude", id :"11200"},
		{ name : "Raissac-sur-Lampy", id :"11170"},
		{ name : "Rennes-le-Château", id :"11190"},
		{ name : "Rennes-les-Bains", id :"11190"},
		{ name : "Ribaute", id :"11220"},
		{ name : "Ribouisse", id :"11270"},
		{ name : "Ricaud", id :"11400"},
		{ name : "Rieux-en-Val", id :"11220"},
		{ name : "Rieux-Minervois", id :"11160"},
		{ name : "Rivel", id :"11230"},
		{ name : "Rodome", id :"11140"},
		{ name : "Roquecourbe-Minervois", id :"11700"},
		{ name : "Roquefère", id :"11380"},
		{ name : "Roquefeuil", id :"11340"},
		{ name : "Roquefort-de-Sault", id :"11140"},
		{ name : "Roquefort-des-Corbières", id :"11540"},
		{ name : "Roquetaillade", id :"11300"},
		{ name : "Roubia", id :"11200"},
		{ name : "Rouffiac-d'Aude", id :"11250"},
		{ name : "Rouffiac-des-Corbières", id :"11350"},
		{ name : "Roullens", id :"11290"},
		{ name : "Routier", id :"11240"},
		{ name : "Rouvenac", id :"11260"},
		{ name : "Rustiques", id :"11800"},
		{ name : "Saint-Amans", id :"11270"},
		{ name : "Saint-André-de-Roquelongue", id :"11200"},
		{ name : "Saint-Benoît", id :"11230"},
		{ name : "Saint-Couat-d'Aude", id :"11700"},
		{ name : "Saint-Couat-du-Razès", id :"11300"},
		{ name : "Saint-Denis", id :"11310"},
		{ name : "Saint-Ferriol", id :"11500"},
		{ name : "Saint-Frichoux", id :"11800"},
		{ name : "Saint-Gaudéric", id :"11270"},
		{ name : "Saint-Hilaire", id :"11250"},
		{ name : "Saint-Jean-de-Barrou", id :"11360"},
		{ name : "Saint-Jean-de-Paracol", id :"11260"},
		{ name : "Saint-Julia-de-Bec", id :"11500"},
		{ name : "Saint-Julien-de-Briola", id :"11270"},
		{ name : "Saint-Just-et-le-Bézu", id :"11500"},
		{ name : "Saint-Laurent-de-la-Cabrerisse", id :"11220"},
		{ name : "Saint-Louis-et-Parahou", id :"11500"},
		{ name : "Saint-Marcel-sur-Aude", id :"11120"},
		{ name : "Saint-Martin-de-Villereglan", id :"11300"},
		{ name : "Saint-Martin-des-Puits", id :"11220"},
		{ name : "Saint-Martin-Lalande", id :"11400"},
		{ name : "Saint-Martin-le-Vieil", id :"11170"},
		{ name : "Saint-Martin-Lys", id :"11500"},
		{ name : "Saint-Michel-de-Lanès", id :"11410"},
		{ name : "Saint-Nazaire-d'Aude", id :"11120"},
		{ name : "Saint-Papoul", id :"11400"},
		{ name : "Saint-Paulet", id :"11320"},
		{ name : "Saint-Pierre-des-Champs", id :"11220"},
		{ name : "Saint-Polycarpe", id :"11300"},
		{ name : "Saint-Sernin", id :"11420"},
		{ name : "Sainte-Camelle", id :"11410"},
		{ name : "Sainte-Colombe-sur-Guette", id :"11140"},
		{ name : "Sainte-Colombe-sur-l'Hers", id :"11230"},
		{ name : "Sainte-Eulalie", id :"11170"},
		{ name : "Sainte-Valière", id :"11120"},
		{ name : "Saissac", id :"11310"},
		{ name : "Sallèles-Cabardès", id :"11600"},
		{ name : "Sallèles-d'Aude", id :"11590"},
		{ name : "Salles-d'Aude", id :"11110"},
		{ name : "Salles-sur-l'Hers", id :"11410"},
		{ name : "Salsigne", id :"11600"},
		{ name : "Salvezines", id :"11140"},
		{ name : "Salza", id :"11330"},
		{ name : "Seignalens", id :"11240"},
		{ name : "Serres", id :"11190"},
		{ name : "Serviès-en-Val", id :"11220"},
		{ name : "Sigean", id :"11130"},
		{ name : "Sonnac-sur-l'Hers", id :"11230"},
		{ name : "Sougraigne", id :"11190"},
		{ name : "Souilhanels", id :"11400"},
		{ name : "Souilhe", id :"11400"},
		{ name : "Soulatgé", id :"11330"},
		{ name : "Soupex", id :"11320"},
		{ name : "Talairan", id :"11220"},
		{ name : "Taurize", id :"11220"},
		{ name : "Termes", id :"11330"},
		{ name : "Terroles", id :"11580"},
		{ name : "Thézan-des-Corbières", id :"11200"},
		{ name : "Tournissan", id :"11220"},
		{ name : "Tourouzelle", id :"11200"},
		{ name : "Tourreilles", id :"11300"},
		{ name : "Trassanel", id :"11160"},
		{ name : "Trausse", id :"11160"},
		{ name : "Trèbes", id :"11800"},
		{ name : "Treilles", id :"11510"},
		{ name : "Tréville", id :"11400"},
		{ name : "Tréziers", id :"11230"},
		{ name : "Tuchan", id :"11350"},
		{ name : "Val de Lambronne", id :"11230"},
		{ name : "Valmigère", id :"11580"},
		{ name : "Ventenac-Cabardès", id :"11610"},
		{ name : "Ventenac-en-Minervois", id :"11120"},
		{ name : "Véraza", id :"11580"},
		{ name : "Verdun-en-Lauragais", id :"11400"},
		{ name : "Verzeille", id :"11250"},
		{ name : "Vignevieille", id :"11330"},
		{ name : "Villalier", id :"11600"},
		{ name : "Villanière", id :"11600"},
		{ name : "Villar-en-Val", id :"11220"},
		{ name : "Villar-Saint-Anselme", id :"11250"},
		{ name : "Villardebelle", id :"11580"},
		{ name : "Villardonnel", id :"11600"},
		{ name : "Villarzel-Cabardès", id :"11600"},
		{ name : "Villarzel-du-Razès", id :"11300"},
		{ name : "Villasavary", id :"11150"},
		{ name : "Villautou", id :"11420"},
		{ name : "Villebazy", id :"11250"},
		{ name : "Villedaigne", id :"11200"},
		{ name : "Villedubert", id :"11800"},
		{ name : "Villefloure", id :"11570"},
		{ name : "Villefort", id :"11230"},
		{ name : "Villegailhenc", id :"11600"},
		{ name : "Villegly", id :"11600"},
		{ name : "Villelongue-d'Aude", id :"11300"},
		{ name : "Villemagne", id :"11310"},
		{ name : "Villemoustaussou", id :"11620"},
		{ name : "Villeneuve-la-Comptal", id :"11400"},
		{ name : "Villeneuve-les-Corbières", id :"11360"},
		{ name : "Villeneuve-lès-Montréal", id :"11290"},
		{ name : "Villeneuve-Minervois", id :"11160"},
		{ name : "Villepinte", id :"11150"},
		{ name : "Villerouge-Termenès", id :"11330"},
		{ name : "Villesèque-des-Corbières", id :"11360"},
		{ name : "Villesèquelande", id :"11170"},
		{ name : "Villesiscle", id :"11150"},
		{ name : "Villespy", id :"11170"},
		{ name : "Villetritouls", id :"11220"},
		{ name : "Vinassan", id :"11110"}
	]
  ,
  autoSelect: true
});
$input.change(function() {
  var current = $input.typeahead("getActive");
  if (current) {
    // Some item from your model is active!
    if (current.name == $input.val()) {
      // This means the exact match is found. Use toLowerCase() if you want case insensitive match.
    } else {
      // This means it is only a partial match, you can either add a new item
      // or take the active if you don't want new items
    }
  } else {
    // Nothing is active so it is a new value (or maybe empty value)
  }
});
	
});


app.controller("profileCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {	

$scope.username = $localStorage.currentUser.username;
$scope.userid = $localStorage.currentUser.id;
$scope.noavatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAAAAACupDjxAAAFGUlEQVR4XuzTsQqAMAxFUf//A9u36OAggoM42KxSaQno4GY73CwhaaGHBx1i5wUQIECAADssgAABAgQIECBAgAABAgQIMET5oM/bvwND7Xo9rrpyvZokWLue9rySj60+iUo4uonjvO6nmSVLx7ZM+azo1AroAV3Fmsty6kgQROf//28qC8TDPI2NH1wMBgSqnBhHBYtZjKVWV3MWwAbikKlqotUM5ruaPxid5rAZAa75kIr1Xt7sT0PHcdXjeiiAAip4gKDPwepEuyfH/7y6vQ1d7zEVK+YX/j/NVuGOBQXVH0Z7/k69cjtoGUFRhbfbsA3Nn4ECUJ/oaEGBQlUA/fRZ+J3zBIBooYpVfvSGJ2N7Fj7zUmxIqkvL9HzG11J2isfXlno0f96Iz0l8xQCGF2tIM3ZgqW4Yn6AMTp5NF2wGKTUkO6ZwqyDBFbvfmsbuGI9SZorHxiSMW6gUEDyQqYojFEhwlehnJL8KVKxXY2qExnl8xc+eB5P4jk+wdrlEZnGC4ldgD4z2BQDQuAQP7IdVsRVXPfXIjfcRJLhmT+wEABoiqIAc2ZsqsmJt2Jt1pOATe2O7QEHZsD/fkQm+sz+mgQv1FzNQBSZ4ZgamQYIKlZoZmEUJCtAwA8vAipmDVZCgKGCPEOzClf2xRZSgAHWmKZYQQRU9MQPjwIp3zMAwbJlReWV/rghMcGXsix0kSlCBMfuzDUwwyxjPEgRLTokNAIVECS74gzGZPUIT1Cutn+E8TFBFgb8/mI7ReEPsvlgnqfF55u/R92awd8M0RasUUIQNiQJT9uETiLwGBRB8kekBDhFesY7T/fgKQDT6IOc1VY8XdwsW1O97KLRWbo5NVTReUDFqXK0dZv70En/S5CxpCWd1R2iRihXAq8t1qfg0KHlevDNatwwvQ1+hywjKjrQuE1yPCp64i9+J6xDhqUI5QWdDWlvD4wDlBXVatzV8hZQVdIb7Vnr1TESluKAKROdn/oZtARRP0A2BpyN/YT/T+/9GywqKDp5P/B2rX4eeYVnB6u3Wcp1p+DGBAlpU8N267JW4G6nECyqgEAiwvrEjtlX1pjVEUAV3pt9M4LpUHxYJStAVB7vUfd1xfB+w/ILi15BOL5a8b2+WgPpnZa/Yd3Yvxj58qgAadgwhwwN7cp7ACUhQx7VvlZJbJm9zQCW/oACY3tjvxgdJslllPoYQjxALYx5e4IhmEPR2VdYeRH/s/b5cawZBj3DDXBj5qV5MrgRFl2ROw63/6kkGQRVAZw0tU8NmNHIjAsmX4LTJGyBpa0iuKVYZN/5bldGwmeVbB/VMx5iP2yiLoADYGbNjtJP2Wmb83RCsSWMEH/ftlCYmKAB0YhYkyKV4FmkViyiAwZkMitCakeulVSyAKD6MNGMM315UUoKigGJKhiVI4wYqiQm64ilIz3w1rAQCqCYJKvDMKLyTP4BCkCYIVA2jeUJyxaKyN0ZzThcEnozxPAPQFEEBDozHrgAkLcGZsQQvqRXLgSWwm6YJyrSIHsm1iqYI7lnIsE5LsCKNZVikCMqWxThod0HRC8sxTkhwwYK8JST4xYLU3ae4MpZk1llww3KGRu46C34bjeW4dhUcsTDzjoJrFuazm6B8sTDXToKiV5Zm1CnBKYvz3EnwhcXZCxTSVvBgLE2tAkBbCt5YnkqhbSue8AGs0F5wwQew7TAkbzQW59BeUA58ANcOglc+gkFrQTU+gklrwQkfwqq14JwJBI3xPwpOpY0EIp9cAAAAAElFTkSuQmCC';

$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=describeuser&id="+$scope.userid)
			.then(function(response) {
			$scope.user = response.data;
			

			$scope.thumbnail = {	
				dataUrl:$scope.user[0].avatar,
				rd:$scope.user[0].avatarrd
			};
			
});



$scope.fileReaderSupported = window.FileReader != null;

 $scope.updateavatar = function(files){
        if (files != null) {
            var file = files[0];
        if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function(){
						$scope.thumbnail.dataUrl = e.target.result;
                    });
                }
            });
        }
    }
    };

	$scope.saveavatar = function(avatar,rd){
		
		$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/',{ userid: $scope.userid , avatar:avatar,avatarrd:rd,action:"saveavatar" })
            .then(function (response) {					

				});
		
	}

	
	
$scope.RotateImage = function (id,deg) {
    var deg = 90 * deg;
    $('#' + id).css({
        '-webkit-transform': 'rotate(' + deg + 'deg)',  //Safari 3.1+, Chrome  
        '-moz-transform': 'rotate(' + deg + 'deg)',     //Firefox 3.5-15  
        '-ms-transform': 'rotate(' + deg + 'deg)',      //IE9+  
        '-o-transform': 'rotate(' + deg + 'deg)',       //Opera 10.5-12.00  
        'transform': 'rotate(' + deg + 'deg)'          //Firefox 16+, Opera 12.50+  

    });
}
	


$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listlogs&userid="+$scope.userid)
    .then(function(response) {
        $scope.logs = response.data;
			
			angular.element(document).ready(function() {  
			dTable = $('#tablelogs');  
			dTable.DataTable();  
		});  


});

});

app.controller("messagesCtrl", function ($scope,$route,$http, $routeParams,$localStorage,$location) {
	
	$scope.userid = $localStorage.currentUser.id;
	$scope.username = $localStorage.currentUser.username;
	$scope.showmessages = true;
	$scope.shownewmessage = false;
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listusers")
    .then(function(response) {
        $scope.users = response.data;		
    });
	
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listmessages&userid="+$scope.userid)
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
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=describemessage&id="+$scope.message)
		.then(function(response) {
        $scope.descmessage = response.data;		
		});
		
		
		$scope.replymessage = function(msgcontent){
			
			$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/',{ from: $scope.userid , msgid:$scope.message,msgcontent:msgcontent,action:"replymessage" })
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

			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/',{ from: $scope.userid , to:dest,msgname:msgname,msgcontent:msgcontent,action:"createmessage" })
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
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listtopics&forumid="+$scope.forumid)
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


