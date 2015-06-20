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
	.when('/specializations',{
		templateUrl: "specializations.html",
		controller: "specializationsController"
	})
	.when('/insertClinic',{
		templateUrl: "insertClinic.html",
		controller: "insertClinicController"
	})
	.when('/insertDoctor',{
		templateUrl: "insertDoctor.html",
		controller: "insertDoctorController"
	})
	.when('/insertSpecialization',{
		templateUrl: "insertSpecialization.html",
		controller: "insertSpecializationController"
	})
	.when('/editDoctor',{
		templateUrl: "editDoctor.html",
		controller: "editDoctorController"
	})
	.when('/editClinic',{
		templateUrl: "editClinic.html",
		controller: "editClinicController"
	})
	.when('/editSpecialization',{
		templateUrl: "editSpecialization.html",
		controller: "editSpecializationController"
	})
	.otherwise({redirectTo:'/doctors'})
});


practo.controller("tabsController",function($scope,$rootScope,$location){
	$rootScope.activeTab = 1;
	$scope.tabClicked = function(tab){
			if(tab == 1){
				$rootScope.activeTab = 1;
				$location.path('/doctors');
			}
			else if(tab == 2){
				$rootScope.activeTab = 2;
				$location.path('/clinics');
			}
			else {
				$rootScope.activeTab = 3;
				$location.path('/specializations');
			}
	}
});

practo.controller("doctorsController", function($scope,$rootScope,$http,$location) {
	$rootScope.activeTab = 1;
	var req = {
    method: 'GET',
    url: 'http://localhost:5000/getAllDoctors',
    headers: {'Content-Type': 'application/json'}
  };
  $http(req)
  .success(function(data){
    if(data.returnCode == "SUCCESS")
    {
    	$scope.doctors = data.data;
    	console.log($scope.doctors);
  	}
  	else
  	{
  		console.log("There is an error")
  	}
  })
  .error(function(){
  	console.log("Error connecting to the server");
  });


  $scope.addDoctor = function() {
    $location.path('/insertDoctor');
  }

  $scope.editDoctor = function(doctor){
  	$rootScope.doctorToEdit = doctor;
  	$location.path('/editDoctor');
  }

  $scope.removeDoctor = function(doctor,index){
    var req = {
      method: 'POST',
      url: 'http://localhost:5000/deleteDoctor',
      headers: {'Content-Type': 'application/json'},
      data : {doctorId: doctor.id}
    };
    $http(req)
    .success(function(data){
      if(data.returnCode == "SUCCESS")
      {
        $scope.doctors.splice(index,index+1)
        console.log("doctor deleted");
      }
      else
      {
        console.log("There is an error")
      }
    })
    .error(function(){
      console.log("Error connecting to the server");
    });
  }


});


practo.controller("clinicsController", function($scope,$http,$rootScope,$location){
	$rootScope.activeTab = 2;
	$scope.clinics = [];

	var req = {
    method: 'GET',
    url: 'http://localhost:5000/getAllClinics',
    headers: {'Content-Type': 'application/json'}
  };
  $http(req)
  .success(function(data){
    if(data.returnCode == "SUCCESS")
    {
    	$scope.clinics = data.data;
    }
    else
    {
    	console.log("There is an error")
    }
  })
  .error(function(){
  	console.log("Error connecting to the server");
  });

  $scope.addClinic = function() {
    $location.path('/insertClinic');
  }

  $scope.editClinic = function(clinic){
  	$rootScope.clinicToEdit = clinic;
		$location.path('/editClinic');
  };

  $scope.removeClinic = function(clinic,index){
    console.log(clinic);
    var req = {
      method: 'POST',
      url: 'http://localhost:5000/deleteClinic',
      headers: {'Content-Type': 'application/json'},
      data : {id: clinic.id}
    };
    $http(req)
    .success(function(data){
      if(data.returnCode == "SUCCESS")
      {
        $scope.clinics.splice(index,index+1)
        console.log("clinic deleted");
      }
      else
      {
        console.log("There is an error")
      }
    })
    .error(function(){
      console.log("Error connecting to the server");
    });
  }

});

practo.controller("specializationsController", function($scope,$http,$rootScope,$location){
	$rootScope.activeTab = 3;
	$scope.specializations = [];
	var req = {
        	method: 'GET',
            url: 'http://localhost:5000/getAllSpecializations',
            headers: {'Content-Type': 'application/json'}
        };

  $http(req).
  success(function(data){
    if(data.returnCode == "SUCCESS")
    {
    	$scope.specializations = data.data;
    }
    else
    {
    	console.log("Error in retrieving specializations");
    }
  })
  .error(function(){
		console.log("Error Connecting to the backend");
  });


  $scope.addSpecialization = function() {
    $location.path('/insertSpecialization');
  }

  $scope.editSpecialization= function(spec){
      $rootScope.specializationToEdit = spec;
      console.log(spec);
      $location.path('/editSpecialization');
  }

  $scope.removeSpecialization = function(spec,index){

    var req = {
      method: 'POST',
      url: 'http://localhost:5000/deleteSpecialization',
      headers: {'Content-Type': 'application/json'},
      data : {specId: spec.id}
    };
    $http(req)
    .success(function(data){
      if(data.returnCode == "SUCCESS")
      {
        $scope.specializations.splice(index,index+1)
        console.log("spec deleted");
      }
      else
      {
        console.log("There is an error")
      }
    })
    .error(function(){
      console.log("Error connecting to the server");
    });
  }


});

practo.controller("insertClinicController",function($scope,$http,$location){
	$scope.addClinic = function(){
		var req = {
        	method: 'POST',
            url: 'http://localhost:5000/addClinic',
            headers: {'Content-Type': 'application/json'},
            data: {name: $scope.name, location:$scope.location, city:$scope.city, address: $scope.address}
        };
       	$http(req).
       	success(function(data){

          $location.path('/clinics');
       		console.log(data);
       	})
       	.error(function(){
       		console.log("Error Connecting to the backend");
       	})
	}
});


practo.controller("insertDoctorController",function($scope,$http,$location){
	var req = {
        	method: 'GET',
            url: 'http://localhost:5000/getAllSpecializations',
            headers: {'Content-Type': 'application/json'}
        };

    $http(req).
    success(function(data){
    	if(data.returnCode == "SUCCESS")
    	{
    		$scope.specializations = data.data;
    		console.log($scope.specializations);
    	}
    	else
    	{
    		console.log("Error in retrieving specializations");
    	}
    })
    .error(function(){
		console.log("Error Connecting to the backend");
    });

    req = {
        	method: 'GET',
            url: 'http://localhost:5000/getAllClinics',
            headers: {'Content-Type': 'application/json'}
        };

    $http(req).
    success(function(data){
    	if(data.returnCode == "SUCCESS")
    	{
    		$scope.clinics = data.data;
    	}
    	else
    	{
    		console.log("Error in retrieving clinics");
    	}
    })
    .error(function(){
		console.log("Error Connecting to the backend");
    });


	$scope.addDoctor = function(){
		console.log($scope.specSelected);
		console.log($scope.clinicSelected);

		var req = {
        	method: 'POST',
            url: 'http://localhost:5000/addDoctor',
            headers: {'Content-Type': 'application/json'},
            data: {name: $scope.name, qual:$scope.qual, exp: $scope.exp, clinicId:$scope.clinicSelected, specId:$scope.specSelected, mobileNumber:$scope.mobileNumber, email: $scope.email}
        };
       	$http(req).
       	success(function(data){
          $location.path('/doctors');
       		console.log(data);
       	})
       	.error(function(){
       		console.log("Error Connecting to the backend");
       	})
	}
});

practo.controller("insertSpecializationController",function($scope,$http,$location){
	$scope.addSpecialization = function(){
		var req = {
        	method: 'POST',
            url: 'http://localhost:5000/addSpecialization',
            headers: {'Content-Type': 'application/json'},
            data: {name: $scope.specialization}
        };
       	$http(req).
       	success(function(data){

          $location.path('/specializations');
       		console.log(data);
       	})
       	.error(function(){
       		console.log("Error Connecting to the backend");
       	})
	}
});

practo.controller("editDoctorController",function($scope,$http,$rootScope,$location){
	var doctor = $rootScope.doctorToEdit;
	$scope.name = doctor.name;
	$scope.qual = doctor.qual;
	$scope.exp = doctor.exp;
	$scope.mobileNumber = Number(doctor.mobileNumber);
	$scope.email = doctor.email;

	var req = {
        	method: 'GET',
            url: 'http://localhost:5000/getAllSpecializations',
            headers: {'Content-Type': 'application/json'}
        };

    $http(req).
    success(function(data){
    	if(data.returnCode == "SUCCESS")
    	{
    		$scope.specializations = data.data;
    		console.log($scope.specializations);
        $scope.specSelected = doctor.spec.id;
        console.log($scope.specSelected);
        for(spec in $scope.specializations)
        {
          if($scope.specializations[spec].id == $scope.specSelected)
          {
            $scope.specializations[spec].selected = true;
          }
        }
    	}
    	else
    	{
    		console.log("Error in retrieving specializations");
    	}
    })
    .error(function(){
		console.log("Error Connecting to the backend");
    });

    req = {
        	method: 'GET',
            url: 'http://localhost:5000/getAllClinics',
            headers: {'Content-Type': 'application/json'}
        };

    $http(req).
    success(function(data){
    	if(data.returnCode == "SUCCESS")
    	{
    		$scope.clinics = data.data;
        $scope.clinicSelected = doctor.clinicList[0].clinic_id;
        for(clinic in $scope.clinics)
        {
          if($scope.clinics[clinic].id == $scope.clinicSelected)
          {
            $scope.clinics[clinic].selected = true;
          }
        }
        console.log($scope.clinicSelected);
    	}
    	else
    	{
    		console.log("Error in retrieving clinics");
    	}
    })
    .error(function(){
		console.log("Error Connecting to the backend");
    });

	$scope.editDoctor = function(){
    console.log("Entered into editDoctor");
		var req = {
        	method: 'POST',
            url: 'http://localhost:5000/editDoctor',
            headers: {'Content-Type': 'application/json'},
            data: {id:doctor.id, name: $scope.name, qual:$scope.qual , exp: $scope.exp, clinicId:$scope.clinicSelected, specId:$scope.specSelected, mobileNumber:$scope.mobileNumber, email: $scope.email}
        };
       	$http(req).
       	success(function(data){
       		if(data.returnCode == "SUCCESS")
       		{
       			console.log(data);
            $location.path('/doctors');
       		}
       		else
       		{
       			console.log("Error Updating the doctor");
       		}
       	})
       	.error(function(){
       		console.log("Error Connecting to the backend");
       	});
	}
});


practo.controller("editClinicController",function($scope,$http,$rootScope,$location){
	var clinic = $rootScope.clinicToEdit;
	console.log(clinic);
	$scope.name = clinic.name;
	$scope.location = clinic.location;
	$scope.city = clinic.city;
	$scope.address = clinic.address;

	$scope.editClinic = function(){
		var req = {
        	method: 'POST',
            url: 'http://localhost:5000/editClinic',
            headers: {'Content-Type': 'application/json'},
            data: {id:clinic.id, name: $scope.name, location:$scope.location, city:$scope.city, address: $scope.address}
        };
       	$http(req).
       	success(function(data){
       		console.log(data);
          $location.path('/clinics');
       	})
       	.error(function(){
       		console.log("Error Connecting to the Server");
       	})
	}
});


practo.controller("editSpecializationController",function($scope,$http,$rootScope,$location){
  var specialization = $rootScope.specializationToEdit; 
  $scope.specialization = specialization.name;
  $scope.addSpecialization = function(){
    var req = {
      method: 'POST',
      url: 'http://localhost:5000/editSpecialization',
      headers: {'Content-Type': 'application/json'},
      data: {id:specialization.id,name: $scope.specialization}
    };
    $http(req).
    success(function(data){
      console.log(data);
      $location.path('/specializations');
    })
    .error(function(){
      console.log("Error Connecting to the backend");
    })
  }
});