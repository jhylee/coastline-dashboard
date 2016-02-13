var app = angular.module('coastlineWebApp.products.controllers', ['ui.bootstrap', 
  'coastlineWebApp.products.services', 
  'coastlineWebApp.auth.services',
  'ui.router']);


app.controller('ProductDisplayCtrl', ['$scope', 'Products', 'AuthService', '$state', '$uibModal',
    function ($scope, Products, AuthService, $state, $uibModal) {
        $scope.fisheryName = "";
        

        var updateProducts = function () {
			Products.getProducts(function (products) {
	            console.log("getProducts");
	            $scope.products = products;
	            console.log($scope.products);
	        }, function (err) {
	        	console.log(err);
	        });
        };

        updateProducts();

        
        $scope.logout = function () {
            AuthService.logout(function () {
                $state.go('login');
            });
        };


        // add a stage - linked to the add button    
	    $scope.addProduct = function() {
	      console.log("addProduct");

	      // modal setup and preferences
	      var modalInstance = $uibModal.open({
	        animation: true,
	        templateUrl: 'addModalContent.html',
	        controller: 'AddProductCtrl',
	        size: 'lg',
	        resolve: {}
	      });

	      // called when modal is closed
	      modalInstance.result.then(
	        // OK callback
	        function (product) {
				// add the stage to the supply chain
				console.log(product);
				updateProducts();
	          

	          // CANCEL callback
	      }, function () {});
	    };

}]);


app.controller('AddProductCtrl', ['$scope', 'Products', 'AuthService', '$state', '$uibModalInstance',
    function ($scope, Products, AuthService, $state, $uibModalInstance) {
        $scope.fisheryName = "";
        
        Products.getProducts(function (products) {
            console.log("getProducts");
        }, function (err) {
        	console.log(err);
        });


    // tied to ok button
    $scope.ok = function () {
    	Products.addProduct({name: $scope.name, description: $scope.description}, function (res) {
    		$uibModalInstance.close(res);
    	}, function (err) {
    		$uibModalInstance.close(err);
    	})
      	
    };

    // tied to cancel button
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    
}]);
