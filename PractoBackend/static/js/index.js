var practo = angular.module("PractoBackend", ["ngRoute"]);

practo.config(function($routeProvider){
	$routeProvider
	.when('/doctors',{
		templateUrl: 'doctors.html',
		controller: 'doctorsController'
	})
	.when('/clinics',{
		templateUrl: "clinics.html",
		controller: "clinicsController"
	})
	.otherwise({redirectTo:'/doctors'});
});

practo.controller("tabsController",function($scope,$rootScope,$location){
	$rootScope.activeTab = 1;
	$scope.tabClicked = function(tab){
		if(tab != $rootScope.activeTab){
			if(tab == 1){
				$rootScope.activeTab = 1;
				$location.path('/doctors');
			}
			else{
				$rootScope.activeTab = 2;
				$location.path('/clinics');
			}
		}
	}
});

practo.controller("doctorsController", function($scope) {
	$scope.doctors = [];
});


practo.controller("clinicsController", function($scope){
	$scope.clinics = []
});