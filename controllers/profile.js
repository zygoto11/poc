app.controller("logCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$scope.userid = $localStorage.currentUser.id;
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getlogs.php")
    .then(function(response) {
        $scope.logs = response.data;
	$scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 5;
    $scope.totalItems = $scope.logs.length;	
	});
});

app.controller("privacyCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$scope.userid = $localStorage.currentUser.id;
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/profile/getprivacy.php")
    .then(function(response) {
        $scope.privacy = response.data.result[0];
	});
	
	$scope.updateprivacy = function(city,birthday,online){		
		$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/profile/updateprivacy.php',{city:city,birthday:birthday,online:online})
        .then(function (response) {
			$scope.msg = "Changements enregistrés !"
		});		
	}
});

app.controller("notificationsCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {
	$scope.userid = $localStorage.currentUser.id;
	$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/profile/getnotifications.php")
    .then(function(response) {
        $scope.notifications = response.data.result[0];
	});
	
	$scope.updatenotifications = function(register,unregister,comment){		
		$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/profile/updatenotifications.php',{register:register,unregister:unregister,comment:comment})
        .then(function (response) {
			$scope.msg = "Changements enregistrés !"
		});		
	}
	
});

app.controller("profileCtrl", function ($scope,$http, $routeParams,$localStorage,$timeout) {	

$http.get("https://zygoto11.github.io/poc/data/cities.json")
    .then(function(response) {
        $scope.cities = response.data;
});


$scope.username = $localStorage.currentUser.username;
$scope.userid = $localStorage.currentUser.id;


$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getuser.php?id="+$scope.userid)
			.then(function(response) {
			$scope.user = response.data;
			

			$scope.thumbnail = {	
				dataUrl:'https://zygotopoc.westeurope.cloudapp.azure.com/images/'+$scope.userid+'.png',
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
		rd = 1;
		$http.post('https://zygotopoc.westeurope.cloudapp.azure.com/profile/saveavatar.php',{  avatar:avatar,avatarrd:rd })
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
	


});