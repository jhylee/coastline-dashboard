var app = angular.module('coastlineWebApp.products.controllers', ['ui.bootstrap',
  'coastlineWebApp.products.services',
  'coastlineWebApp.auth.services',
  'ui.router',
'ngFileUpload']);


app.controller('ProductDisplayCtrl', ['$scope', 'Products', 'AuthService', '$state', '$uibModal',
    function($scope, Products, AuthService, $state, $uibModal) {
        $scope.fisheryName = "";




        var updateProducts = function() {
            Products.getProducts(function(products) {
                console.log("getProducts");
                $scope.products = products;

                console.log($scope.products);
            }, function(err) {
                console.log(err);
            });
        };

        updateProducts();

        // if ($scope.products.length > 0) {
        //     $scope.selectedProduct = 0;
        // };


        $scope.logout = function() {
            AuthService.logout(function() {
                $state.go('login');
            });
        };

        $scope.deleteProduct = function() {
            Products.setSelectedProductId($scope.products[$scope.selectedProduct]._id   );
            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteProductModal.html',
                controller: 'DeleteProductCtrl',
                size: 'lg',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(product) {
                    // add the stage to the supply chain
                    console.log(product);
                    updateProducts();


                    // CANCEL callback
                },
                function() {});


            updateProducts();
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
                function(product) {
                    // add the stage to the supply chain
                    console.log(product);
                    updateProducts();


                    // CANCEL callback
                },
                function() {});
        };

    }
]);


<<<<<<< HEAD
app.controller('AddProductCtrl', ['$scope', 'Products', 'Upload', 'AuthService', '$state', '$uibModalInstance', '$http',
    function ($scope, Products, Upload, AuthService, $state, $uibModalInstance, $http) {
=======
app.controller('AddProductCtrl', ['$scope', 'Products', 'AuthService', '$state', '$uibModalInstance',
    function($scope, Products, AuthService, $state, $uibModalInstance) {
>>>>>>> master
        $scope.fisheryName = "";

        Products.getProducts(function(products) {
            console.log("getProducts");
        }, function(err) {
            console.log(err);
        });


        // tied to ok button
        $scope.ok = function() {

            var data = {
                name: $scope.name,
                description: $scope.description,
                unit: $scope.unit,
                unitPrice: $scope.unitPrice
            };

            console.log("data");
            console.log(data);

            Products.addProduct(data, function(res) {
                $uibModalInstance.close(res);
            }, function(err) {
                $uibModalInstance.close(err);
            })

<<<<<<< HEAD
        console.log($scope.file);

        var data = {
            name: $scope.name,
            description: $scope.description,
            unit: $scope.unit,
            unitPrice: $scope.unitPrice,
            fileName: $scope.file.name,
            fileType: $scope.file.type,
            fileSize: $scope.file.size
=======
>>>>>>> master
        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);

<<<<<<< HEAD
    	Products.addProduct(data, function (res) {
    		$uibModalInstance.close(res);
    	}, function (err) {
    		$uibModalInstance.close(err);
    	}).success(function(res) {
            var payload = {
                url: res.signedUrl,
                data: $scope.file,
                headers: {
                    'Content-Type': "image/png",
                    'x-amz-acl': 'public-read',
                },
                ignoreInterceptor: true,
                method: "PUT"
            };

            console.log(payload);

            Upload.http(payload);

            // Upload.upload(payload).then(function (resp) {
            //     // console.log('Success ' + resp.config.data.name + 'uploaded. Response: ' + resp.data);
            // }, function (resp) {
            //     // console.log('Error status: ' + resp.status);
            // }, function (evt) {
            //     // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //     // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.name);
            // });



            // console.log('here');
            // console.log({
            //     method: 'PUT',
            //     url: res.signedUrl,
            //     headers: {
            //         'Content-Type': data.fileType,
            //         'x-amz-acl': 'public-read'
            //     },
            //     body: data,
            //     file: $scope.file,
            //     ignoreInterceptor: true
            // });
            // $http({
            //     method: 'PUT',
            //     url: res.signedUrl,
            //     headers: {
            //         'Content-Type': data.fileType,
            //         'x-amz-acl': 'public-read'
            //     },
            //     body: $scope.file,
            //     file: $scope.file,
            //     ignoreInterceptor: true
            // })
            // .then(function(res) {
            //     console.log('img upload success!');
            //     console.log(res);
            // }, function(err) {
            //     console.log('img upload fail');
            //     console.log(err);
            // });


      });
=======
app.controller('DeleteProductCtrl', ['$scope', 'Products', 'AuthService', '$state', '$uibModalInstance',
    function($scope, Products, AuthService, $state, $uibModalInstance) {
        $scope.fisheryName = "";



        // tied to ok button
        $scope.ok = function() {
>>>>>>> master

            Products.deleteProduct(Products.getSelectedProductId()).then(function(res) {
                $uibModalInstance.close(res);
            }, function (err) {
                $uibModalInstance.close(err);
            })

        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);
