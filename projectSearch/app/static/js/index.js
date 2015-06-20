var practo = angular.module('PractoSearch',["ngRoute","autocomplete"]);

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
});


practo.factory('AutocompleteRetriever', function($http, $q, $timeout,$rootScope){
  var AutocompleteRetriever = new Object();

  AutocompleteRetriever.getLocations = function(i) {
    var locationdata = $q.defer();
    var locations;

    var req = {
        method: 'POST',
        url: 'http://localhost:5000/getLocalities',
        headers: {'Content-Type': 'application/json'},
        data: {city: $rootScope.citySelected}
    };
    console.log("Request Sent");
	$http(req).
    success(function(data){
       	console.log(data);
        if(data.returnCode == "SUCCESS")
        {
        	console.log("Results Received");
        	locations = data.data;
        }
       	else
        {
        	console.log("Some Error");
        }
    }).
    error(function(data,status,headers,config){
    	console.log("Unable to Reach the Server");
    });

    $timeout(function(){
      locationdata.resolve(locations);
    },1000);

    return locationdata.promise
  }
	AutocompleteRetriever.getSpecializations = function() {
		var specializationdata = $q.defer();
		var specializations;
		var req = {
        	method: 'GET',
            url: 'http://localhost:5000/getSpecializations',
            headers: {'Content-Type': 'application/json'}
        };
        console.log("Request Sent");
		$http(req).
        success(function(data){
        	console.log(data);
            if(data.returnCode == "SUCCESS")
            {
            	console.log("Results Received");
            	specializations = data.data;
            }
            else
            {
            	console.log("Some Error");
            }
        }).
        error(function(data,status,headers,config){
        	console.log("Unable to Reach the Server");
        });

	    $timeout(function(){
	      specializationdata.resolve(specializations);
	    },1000);

	    return specializationdata.promise

	}

  return AutocompleteRetriever;
});

practo.controller("headerController",function($scope,$rootScope,$http){
	$scope.clicked = false;
	$scope.citySelected = "Bangalore";
	$rootScope.citySelected = $scope.citySelected;
	var req = {
        method: 'GET',
        url: 'http://localhost:5000/getCities',
        headers: {'Content-Type': 'application/json'}
    };
	$http(req).
    success(function(data){
        console.log(data);
        if(data.returnCode == "SUCCESS")
        {
        	console.log("Results Received");
        	$scope.cities = data.data;
        }
        else
        {
        	console.log("Some Error");
        }
    }).
    error(function(data,status,headers,config){
    	console.log("Unable to Reach the Server");
    });
	$scope.toggleClass = function(){
		if($scope.clicked === true)
			$scope.clicked = false;
		else
			$scope.clicked = true;
	}

	$scope.select = function(city){
		$scope.clicked = false;
		$scope.citySelected = city;
		$rootScope.citySelected = $scope.citySelected;
	}

});

practo.controller("homeController",function($scope,$http,$rootScope,$location,AutocompleteRetriever){
	console.log("Inside Controller");
	$scope.locations = AutocompleteRetriever.getLocations("...");
	$scope.locations.then(function(data){
		$scope.locations = data;
	});
	
	$scope.specializations = AutocompleteRetriever.getSpecializations();
	$scope.specializations.then(function(data){
		$scope.specializations = data;
	});
    
	$scope.searchClicked = function(){
		console.log($scope.specialization);
		var req = {
        	method: 'POST',
            url: 'http://localhost:5000/getDoctorsBySpecialityRegion',
            headers: {'Content-Type': 'application/json'},
            data: {city: $rootScope.citySelected, location:$scope.region, specialization: $scope.specialization}
        };
        console.log("Request Sent");
		$http(req).
        success(function(data){
        	console.log(data);
            if(data.returnCode == "SUCCESS")
            {
            	$rootScope.searchResults = data.data;
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
	$scope.doctors = $rootScope.searchResults;
});


practo.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                      iElement.trigger('input');
                    }, 0);
                }
            });
    };
}).controller('DefaultCtrl', function ($scope) {
    $scope.specializations = $rootScope.specializations;
});