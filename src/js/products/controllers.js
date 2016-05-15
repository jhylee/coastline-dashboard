var app = angular.module('coastlineWebApp.products.controllers', ['ui.bootstrap',
    'coastlineWebApp.products.services',
    'coastlineWebApp.auth.services',
    'ui.router',
    'ngFileUpload', /*, 'searchApp', 'ngSanitize'*/
    'ngNotify'
]);


app.controller('ProductDisplayCtrl', ['$scope', '$rootScope', 'ProductData', 'AuthService', 'ngNotify', '$state', '$uibModal',
    function($scope, $rootScope, ProductData, AuthService, ngNotify, $state, $uibModal) {
        $scope.selectedProduct = 0;

        var updateProductData = function() {
            ProductData.getSourcedProductData(function(sourcedProducts) {
                $scope.sourcedProducts = sourcedProducts;
            }, function(err) {
                console.log(err);
            });

            // ProductData.getFinishedProductData(function(finishedProducts) {
            //     $scope.finishedProducts = finishedProducts;
            // }, function(err) {
            //     console.log(err);
            // });
        };

        $scope.logout = function() {
            AuthService.logout(function() {
                $state.go('login');
            });
        };

        $scope.deleteProduct = function() {
            ProductData.setSelectedProductId($scope.products[$scope.selectedProduct]._id);
            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteProductModal.html',
                controller: 'DeleteProductCtrl',
                size: 'md',
                resolve: {}
            });


            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(product) {
                    // add the stage to the supply chain
                    updateProductData();


                    // CANCEL callback
                },
                function() {});


            updateProductData();
        };

        $scope.editProduct = function() {

            ProductData.setSelectedProductId($scope.products[$scope.selectedProduct]._id);

            $rootScope.$broadcast("refreshProductEdit");

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'editProductModal.html',
                controller: 'EditProductCtrl',
                size: 'lg',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(product) {
                    // add the stage to the supply chain
                    updateProductData();


                    // CANCEL callback
                },
                function() {});
        };

        $scope.addProduct = function() {
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

                function() {
                    updateProductData();
                });
        };

        updateProductData();
    }
]);


app.controller('AddProductCtrl', ['$scope', 'ProductData', 'Upload', 'AuthService', '$state', '$uibModalInstance', '$http', '$uibModal',
    function($scope, ProductData, Upload, AuthService, $state, $uibModalInstance, $http, $uibModal) {
        $scope.finishedProducts = [];


        $scope.isSubmitButtonDisabled = function() {
            if (!$scope.name ||
                !$scope.unit ||
                !$scope.unitPrice) {
                return true;
            } else {
                return false;
            }
        };

        $scope.addFinishedProduct = function() {

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addFinishedProductModal.html',
                controller: 'AddFinishedProductCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(function(data) {
                $scope.finishedProducts.push(data);
            });
        };


        $scope.ok = function() {

            var data = {
                name: $scope.name,
                description: $scope.description,
                finishedProducts: $scope.finishedProducts
            };

            if (!$scope.name) {
                $scope.productRequired = $scope.addProductForm.name.$error.required;
            } else {
                ProductData.addSourcedProduct(data, function(res) {
                    $uibModalInstance.close(res);
                }, function(err) {
                    $uibModalInstance.close(err);
                });
            }

            // if ($scope.file) {
            //     var data = {
            //         name: $scope.name,
            //         description: $scope.description,
            //         unit: $scope.unit,
            //         unitPrice: $scope.unitPrice,
            //         fileName: $scope.file.name,
            //         fileType: $scope.file.type,
            //         fileSize: $scope.file.size
            //     };
            // } else {
            //     var data = {
            //         name: $scope.name,
            //         description: $scope.description,
            //         unit: $scope.unit,
            //         unitPrice: $scope.unitPrice,
            //     };
            // }
            //
            // if (!$scope.name) {
            //     $scope.productRequired = $scope.addProductForm.name.$error.required;
            // } else {
            //     ProductData.addProduct(data, function(res) {
            //         $uibModalInstance.close(res);
            //     }, function(err) {
            //         $uibModalInstance.close(err);
            //     }).success(function(res) {
            //         if ($scope.file) {
            //             var payload = {
            //                 url: res.signedUrl,
            //                 data: $scope.file,
            //                 headers: {
            //                     'Content-Type': $scope.file.type,
            //                     'x-amz-acl': 'public-read',
            //                 },
            //                 ignoreInterceptor: true,
            //                 method: "PUT"
            //             };
            //         }
            //         Upload.http(payload);
            //     });
            // }

        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);


app.controller('AddFinishedProductCtrl', ['$scope', 'ProductData', 'Upload', 'AuthService', '$state', '$uibModalInstance', '$http', '$uibModal',
    function($scope, ProductData, Upload, AuthService, $state, $uibModalInstance, $http, $uibModal) {

        $scope.ok = function() {
            var data = {
                name: $scope.name,
                description: $scope.description,
                finishedProductNumber: $scope.finishedProductNumber
            };

            if (!$scope.name) {
                $scope.productRequired = $scope.addProductForm.name.$error.required;
            } else {
                $uibModalInstance.close(data);
            }

        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);


app.controller('EditProductCtrl', ['$scope', "$rootScope", 'ProductData', 'Upload', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, $rootScope, ProductData, Upload, AuthService, $state, $uibModalInstance, $http) {

        var products;

        ProductData.getProductData(function(res) {
            products = res;

            for (var i = 0; i < products.length; i++) {
                if (products[i]._id == ProductData.getSelectedProductId()) {
                    $scope.name = products[i].name;
                    $scope.description = products[i].description;
                    $scope.unit = products[i].unit;
                    $scope.unitPrice = products[i].unitPrice;
                }
            }
        }, function(err) {
            console.log(err);
        });

        $rootScope.$on("refreshProductEdit", function() {
            ProductData.getProductData(function(res) {
                products = res;

                for (var i = 0; i < products.length; i++) {
                    if (products[i]._id = ProductData.getSelectedProductId()) {
                        $scope.name = products[i].name;
                        $scope.description = products[i].description;
                        $scope.unit = products[i].unit;
                        $scope.unitPrice = products[i].unitPrice;
                    }
                }
            }, function(err) {
                console.log(err);
            });

        });



        // tied to ok button
        $scope.ok = function() {




            if ($scope.file) {
                var data = {
                    name: $scope.name,
                    description: $scope.description,
                    unit: $scope.unit,
                    unitPrice: $scope.unitPrice,
                    fileName: $scope.file.name,
                    fileType: $scope.file.type,
                    fileSize: $scope.file.size
                };
            } else {
                var data = {
                    name: $scope.name,
                    description: $scope.description,
                    unit: $scope.unit,
                    unitPrice: $scope.unitPrice,
                };
            }




            ProductData.updateProduct(data, ProductData.getSelectedProductId(), function(res) {
                $uibModalInstance.close(res);
            }, function(err) {
                $uibModalInstance.close(err);
            }).success(function(res) {

                var payload = {
                    url: res.signedUrl,
                    data: $scope.file,
                    headers: {
                        'Content-Type': $scope.file.type,
                        'x-amz-acl': 'public-read',
                    },
                    ignoreInterceptor: true,
                    method: "PUT"
                };


                Upload.http(payload);


            });

        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);

app.controller('DeleteProductCtrl', ['$scope', 'ProductData', 'AuthService', '$state', '$uibModalInstance',
    function($scope, ProductData, AuthService, $state, $uibModalInstance) {



        // tied to ok button
        $scope.ok = function() {

            ProductData.deleteProduct(ProductData.getSelectedProductId()).then(function(res) {
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
