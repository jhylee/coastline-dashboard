var app = angular.module('coastlineWebApp.products.controllers', ['ui.bootstrap',
    'coastlineWebApp.products.services',
    'coastlineWebApp.auth.services',
    'ui.router'
]);


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


app.controller('AddProductCtrl', ['$scope', 'Products', 'AuthService', '$state', '$uibModalInstance',
    function($scope, Products, AuthService, $state, $uibModalInstance) {
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

        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);

app.controller('DeleteProductCtrl', ['$scope', 'Products', 'AuthService', '$state', '$uibModalInstance',
    function($scope, Products, AuthService, $state, $uibModalInstance) {
        $scope.fisheryName = "";



        // tied to ok button
        $scope.ok = function() {

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
