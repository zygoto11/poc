app.controller("createAccountCtrl", function ($scope,$http, $routeParams,$localStorage) {

$http.get("/data/cities.json")
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

$scope.createuser = function(username,email){
			 $http.post('https://zygotopoc.westeurope.cloudapp.azure.com/public/create_user.php',{ username: username,email:email })
            .then(function (response) {
					//response.status
					
					if (response.data.code !== 200) {
						
						$scope.api_error = response.data.message;
						
					}
					else {
						
						alert("OK");
						
					}
						
					//$location.path('/messages');	
				}); 
			
}




	
});