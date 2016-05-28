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
            ProductData.setSelectedProductId($scope.selectedProduct._id);
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

            ProductData.setSelectedProductId($scope.selectedProduct._id);

            $rootScope.$broadcast("refreshProductEdit");

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'editProductModal.html',
                controller: 'EditProductCtrl',
                size: 'lg',
                resolve: {}
            });

            // called when modabl is closed
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

        $scope.removeFinishedProduct = function(index) {
            var newFinishedProducts = []
            for (var i = 0; i < $scope.finishedProducts.length; i++) {
                if (i != index) {
                    newFinishedProducts.push($scope.finishedProducts[i]);
                }
            }
            $scope.finishedProducts = newFinishedProducts;
        };


        $scope.ok = function() {

            var data = {
                name: $scope.name,
                description: $scope.description,
                finishedProducts: $scope.finishedProducts
            };

            if (!$scope.name) {
                $scope.productRequired = (!$scope.name);
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
                productNumber: $scope.productNumber
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


app.controller('EditProductCtrl', ['$scope', "$rootScope", 'ProductData', 'Upload', 'AuthService', '$state', '$uibModalInstance', '$http', '$uibModal',
    function($scope, $rootScope, ProductData, Upload, AuthService, $state, $uibModalInstance, $http, $uibModal) {


        ProductData.getFinishedProductData(ProductData.getSelectedProductId()).then(function(data) {
            $scope.finishedProducts = data;
        });

        ProductData.getSelectedSourcedProduct().then(function(data) {
            $scope.name = data.name;
            $scope.description = data.description;
        });


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
                ProductData.addFinishedProduct(data).then(function(data) {
                    ProductData.getFinishedProductData(ProductData.getSelectedProductId()).then(function(data) {
                        $scope.finishedProducts = data;
                    });
                });
            });
        };

        $scope.editFinishedProduct = function(productId, isServer) {
            ProductData.setSelectedFinishedProductId(productId);
            console.log(ProductData.getSelectedFinishedProductId());

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addFinishedProductModal.html',
                controller: 'EditFinishedProductCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(function(data) {
                ProductData.updateSelectedFinishedProduct(data).then(function(data) {
                    ProductData.getFinishedProductData(ProductData.getSelectedProductId()).then(function(data) {
                        $scope.finishedProducts = data;
                    });
                });
            });
        };


        $scope.removeFinishedProduct = function(finishedProductId) {
            ProductData.deleteFinishedProduct(finishedProductId).then(function() {
                ProductData.getFinishedProductData(ProductData.getSelectedProductId()).then(function(data) {
                    $scope.finishedProducts = data;
                });
            });
        };


        $scope.ok = function() {

            var data = {
                name: $scope.name,
                description: $scope.description,
                finishedProducts: $scope.finishedProducts
            };

            if (!$scope.name) {
                $scope.productRequired = (!$scope.name);
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

app.controller('EditFinishedProductCtrl', ['$scope', 'ProductData', 'Upload', 'AuthService', '$state', '$uibModalInstance', '$http', '$uibModal',
    function($scope, ProductData, Upload, AuthService, $state, $uibModalInstance, $http, $uibModal) {

        ProductData.getSelectedFinishedProduct().then(function(data) {
            $scope.name = data.name;
            $scope.description = data.description;
            $scope.productNumber = data.productNumber;
            console.log(data);
        });

        $scope.ok = function() {
            var data = {
                name: $scope.name,
                description: $scope.description,
                productNumber: $scope.productNumber
            };

            if (!$scope.name) {
                $scope.productRequired = $scope.addProductForm.name.$error.required;
            } else {
                ProductData.updateSelectedFinishedProduct(data).then(function(res) {
                    $uibModalInstance.close(res);
                }).catch(function(err) {
                    $uibModalInstance.close(err);
                });
                $uibModalInstance.close(data);
            }

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

            ProductData.deleteSourcedProduct(ProductData.getSelectedProductId()).then(function(res) {
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
