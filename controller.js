var app = angular.module("myApp", ["ngRoute",'angular.filter','ui.bootstrap','ngStorage','ngMessages',"ngSanitize",'ngTagsInput','textAngular']);
app.config(function($routeProvider) {
    $routeProvider
	.when("/", {
        templateUrl : "sorties.html",
		controller : "sortiesCtrl"
    })
    .when("/sorties", {
        templateUrl : "sorties.html",
		controller : "sortiesCtrl"
    })
	.when("/eventsarchives", {
        templateUrl : "events_archive.html",
		controller : "eventsCtrl"
    })
	.when("/newsortie", {
        templateUrl : "newevent.html",
		controller : "sortiesCtrl"
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


app.controller("sortiesCtrl", function ($scope,$http, $location,$routeParams,$route,$localStorage) {
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
    //$scope.totalItems = $scope.nextsorties.length;
	
	$scope.nextsorties = $scope.sorties.filter(function (sortie) {		
    return ( moment(sortie.timestamp).valueOf() > Date.now());	
	}); 
	
	$scope.totalItems = $scope.nextsorties.length;
	
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


app.controller("membersCtrl", function ($scope,$http, $routeParams,$location,$route,$localStorage) {
	
$scope.showusers = true;


	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listusers")
    .then(function(response) {
        $scope.users = response.data;
	$scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 10;
    $scope.totalItems = $scope.users.length;		
		
    });
	
	
 
	


	if ($routeParams.userid) {
		
		$scope.showusers = false;
		$scope.userid = $routeParams.userid;
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=describeuser&id="+$scope.userid)
			.then(function(response) {
			$scope.user = response.data;		
		});
		
		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getfriend.php?from="+$localStorage.currentUser.id+"&to="+$scope.userid)
			.then(function(response) {
			
			
			if (response.data.code !== 200) {
						
			$scope.rels = "";
						
			}
			
			else {
				
			$scope.rels = response.data;

			}
			
			
		});
		
		
		
		$scope.addfriend = function(friendid,listid){			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/members/addfriend.php',{ from: $localStorage.currentUser.id , to:friendid,listid:listid })
            .then(function (response) {
					if (response.data.code !== 200) {
						$scope.msg_error = response.data.message;
					}
					else {
						$scope.msg_ok = "Cette personne est maintenant dans votre liste d'ami";
						$route.reload();
					}
			});
		}
		
		
		$scope.removefriend = function(friendid,listid){
			
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/members/removefriend.php',{ from: $localStorage.currentUser.id , to:friendid,listid:listid })
            .then(function (response) {	

					if (response.data.code !== 200) {
						
						$scope.msg_error = response.data.message;
						
					}
					else {
						
						$scope.msg_ok = "Cette personne n'est plus dans votre liste d'ami";
						$route.reload();
					}

			
						
			}); 			
		}	
		
		
		}	
});






app.controller("profileCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {	

$http.get("https://zygoto11.github.io/poc/data/cities.json")
    .then(function(response) {
        $scope.cities = response.data;
			var $input = $(".typeahead");
			$input.typeahead({
			  source: $scope.cities,
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


$scope.showsettings = true;

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


	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/?action=listusers")
    .then(function(response) {
        $scope.users = response.data;
		
    });


		$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getfriends.php?userid="+$localStorage.currentUser.id)
			.then(function(response) {
			
			
			if (response.data.code !== 200) {
						
			$scope.friends = "";
						
			}
			
			else {
				
			$scope.friends = response.data;

			}
			
			
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


