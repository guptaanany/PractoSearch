var practo = angular.module('PractoSearch',["ngRoute"]);

practo.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl: 'home.html',
		controller: 'homeController'
	})
	.when('/results',{
		templateUrl: "results.html",
		controller: "resultsController"
	})
	.otherwise({redirectTo:'/'});
})

practo.controller("headerController",function($scope,$rootScope){
	$scope.clicked = false;
	$scope.citySelected = "Bangalore";
	$rootScope.citySelected = $scope.citySelected;
	$scope.toggleClass = function(){
		if($scope.clicked === true)
			$scope.clicked = false;
		else
			$scope.clicked = true;
	}

	$scope.select = function($event){
		console.log($event.currentTarget.text);
		$scope.clicked = false;
		$scope.citySelected = $event.currentTarget.text;
		$rootScope.citySelected = $scope.citySelected;
	}

});

practo.controller("homeController",function($scope,$http,$rootScope,$location){
	console.log("Inside Controller");
	$scope.searchClicked = function(){
		var req = {
        	method: 'POST',
            url: 'http://localhost:5000/getDoctorsBySpecialityRegion',
            headers: {'Content-Type': 'application/json'},
            data: {city: $rootScope.citySelected,speciality:$scope.speciality,region:$scope.region}
        };
        console.log("Request Sent");
		$http(req).
        success(function(data){
        	console.log(data);
            if(data.returnCode == "SUCCESS")
            {
            	console.log("Results Received");
            	$rootScope.searchResults = data;
        		$location.path('/results');
            }
            else
            {
            	console.log("Some Error");
            }
        }).
        error(function(data,status,headers,config){
        	console.log("Unable to Reach the Server");
        });
	};

});

practo.controller("resultsController",function($scope,$rootScope){
	console.log("Inside resultsController");
	$scope.doctors = $rootScope.searchResults.data;
	console.log($scope.doctors[0].doc_name);
});