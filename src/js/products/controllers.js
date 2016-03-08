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
	        templateUrl: 'addProductModal.html',
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


app.controller('AddProductCtrl', ['$scope', 'Products', 'AuthService', '$state', '$uibModalInstance', '$http',
    function ($scope, Products, AuthService, $state, $uibModalInstance, $http) {
        $scope.fisheryName = "";

        Products.getProducts(function (products) {
            console.log("getProducts");
        }, function (err) {
        	console.log(err);
        });


    // tied to ok button
    $scope.ok = function () {

        var data = {
            name: $scope.name,
            description: $scope.description,
            unit: $scope.unit,
            unitPrice: $scope.unitPrice,
            fileName: $scope.photo.name,
            fileType: $scope.photo.type,
            fileSize: $scope.photo.size
        };

        console.log("data");
        console.log(data);

    	Products.addProduct(data, function (res) {
    		$uibModalInstance.close(res);
    	}, function (err) {
    		$uibModalInstance.close(err);
    	}).success(function(res) {
        console.log('here');
        $http({
          method: 'PUT',
          url: res.signedUrl,
          headers: {
            'Content-Type': data.fileType,
            'x-amz-acl': 'public-read'
          },
          body: data.body,
          ignoreInterceptor: true
        })
        .then(function(res) {
          console.log('img upload success!');
          console.log(res);
        }, function(err) {
          console.log('img upload fail');
          console.log(err);
        });
      });

    };

    // tied to cancel button
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


}]);
