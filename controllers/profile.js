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
$scope.noavatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAAAAACupDjxAAAFGUlEQVR4XuzTsQqAMAxFUf//A9u36OAggoM42KxSaQno4GY73CwhaaGHBx1i5wUQIECAADssgAABAgQIECBAgAABAgQIMET5oM/bvwND7Xo9rrpyvZokWLue9rySj60+iUo4uonjvO6nmSVLx7ZM+azo1AroAV3Fmsty6kgQROf//28qC8TDPI2NH1wMBgSqnBhHBYtZjKVWV3MWwAbikKlqotUM5ruaPxid5rAZAa75kIr1Xt7sT0PHcdXjeiiAAip4gKDPwepEuyfH/7y6vQ1d7zEVK+YX/j/NVuGOBQXVH0Z7/k69cjtoGUFRhbfbsA3Nn4ECUJ/oaEGBQlUA/fRZ+J3zBIBooYpVfvSGJ2N7Fj7zUmxIqkvL9HzG11J2isfXlno0f96Iz0l8xQCGF2tIM3ZgqW4Yn6AMTp5NF2wGKTUkO6ZwqyDBFbvfmsbuGI9SZorHxiSMW6gUEDyQqYojFEhwlehnJL8KVKxXY2qExnl8xc+eB5P4jk+wdrlEZnGC4ldgD4z2BQDQuAQP7IdVsRVXPfXIjfcRJLhmT+wEABoiqIAc2ZsqsmJt2Jt1pOATe2O7QEHZsD/fkQm+sz+mgQv1FzNQBSZ4ZgamQYIKlZoZmEUJCtAwA8vAipmDVZCgKGCPEOzClf2xRZSgAHWmKZYQQRU9MQPjwIp3zMAwbJlReWV/rghMcGXsix0kSlCBMfuzDUwwyxjPEgRLTokNAIVECS74gzGZPUIT1Cutn+E8TFBFgb8/mI7ReEPsvlgnqfF55u/R92awd8M0RasUUIQNiQJT9uETiLwGBRB8kekBDhFesY7T/fgKQDT6IOc1VY8XdwsW1O97KLRWbo5NVTReUDFqXK0dZv70En/S5CxpCWd1R2iRihXAq8t1qfg0KHlevDNatwwvQ1+hywjKjrQuE1yPCp64i9+J6xDhqUI5QWdDWlvD4wDlBXVatzV8hZQVdIb7Vnr1TESluKAKROdn/oZtARRP0A2BpyN/YT/T+/9GywqKDp5P/B2rX4eeYVnB6u3Wcp1p+DGBAlpU8N267JW4G6nECyqgEAiwvrEjtlX1pjVEUAV3pt9M4LpUHxYJStAVB7vUfd1xfB+w/ILi15BOL5a8b2+WgPpnZa/Yd3Yvxj58qgAadgwhwwN7cp7ACUhQx7VvlZJbJm9zQCW/oACY3tjvxgdJslllPoYQjxALYx5e4IhmEPR2VdYeRH/s/b5cawZBj3DDXBj5qV5MrgRFl2ROw63/6kkGQRVAZw0tU8NmNHIjAsmX4LTJGyBpa0iuKVYZN/5bldGwmeVbB/VMx5iP2yiLoADYGbNjtJP2Wmb83RCsSWMEH/ftlCYmKAB0YhYkyKV4FmkViyiAwZkMitCakeulVSyAKD6MNGMM315UUoKigGJKhiVI4wYqiQm64ilIz3w1rAQCqCYJKvDMKLyTP4BCkCYIVA2jeUJyxaKyN0ZzThcEnozxPAPQFEEBDozHrgAkLcGZsQQvqRXLgSWwm6YJyrSIHsm1iqYI7lnIsE5LsCKNZVikCMqWxThod0HRC8sxTkhwwYK8JST4xYLU3ae4MpZk1llww3KGRu46C34bjeW4dhUcsTDzjoJrFuazm6B8sTDXToKiV5Zm1CnBKYvz3EnwhcXZCxTSVvBgLE2tAkBbCt5YnkqhbSue8AGs0F5wwQew7TAkbzQW59BeUA58ANcOglc+gkFrQTU+gklrwQkfwqq14JwJBI3xPwpOpY0EIp9cAAAAAElFTkSuQmCC';

$http.get("https://zygotopoc.westeurope.cloudapp.azure.com/members/getuser.php?id="+$scope.userid)
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