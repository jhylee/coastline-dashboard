var app = angular.module('coastlineWebApp.products.controllers', ['ui.bootstrap',
    'coastlineWebApp.products.services',
    'coastlineWebApp.auth.services',
    'ui.router',
    'ngFileUpload', /*, 'searchApp', 'ngSanitize'*/
    'ngNotify'
]);


app.controller('ProductDisplayCtrl', ['$scope', '$rootScope', 'ProductData', 'AuthService', 'ngNotify', '$state', '$uibModal',
    function($scope, $rootScope, ProductData, AuthService, ngNotify, $state, $uibModal) {
        $scope.fisheryName = "";

        $scope.selectedProduct = 0;

        // $scope.search = 'orig';
        // $scope.reverse = false;
        // $scope.list = false;



        var updateProductData = function() {
            ProductData.getProductData(function(products) {
                $scope.products = products;

            }, function(err) {
                console.log(err);
            });
        };

        updateProductData();

        // if ($scope.products.length > 0) {
        //     $scope.selectedProduct = 0;
        // };


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



        // add a stage - linked to the add button
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


        // add a product - linked to the add button
        $scope.addProduct = function() {

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

                function() {});
        };


        // // search for a specific product
        // $scope.filterProduct = function () {
        //   var pat = / /gi;
        //   return function (text) {
        //       var clean = text.replace(pat, "-");
        //       var temp = clean.split("---");
        //       if (temp.length>1) {
        //         clean = temp[0];
        //       }
        //       return clean;
        //   };
        // }


    }
]);


app.controller('AddProductCtrl', ['$scope', 'ProductData', 'Upload', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, ProductData, Upload, AuthService, $state, $uibModalInstance, $http) {
        $scope.fisheryName = "";



        ProductData.getProductData(function(products) {
        }, function(err) {
            console.log(err);
        });

        $scope.isSubmitButtonDisabled = function() {
          if (!$scope.name ||
              !$scope.unit ||
              !$scope.unitPrice) {
               return true;
              }
            else {
              return false;
            }
          };



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

            if (!$scope.name) {
              $scope.productRequired = $scope.addProductForm.name.$error.required;
            }
            else {
              ProductData.addProduct(data, function(res) {
                  $uibModalInstance.close(res);
              }, function(err) {
                  $uibModalInstance.close(err);
              }).success(function(res) {
                if ($scope.file) {
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
                }
                Upload.http(payload);
              });
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
        $scope.fisheryName = "";

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
        $scope.fisheryName = "";



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
