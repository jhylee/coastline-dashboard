var app = angular.module('coastlineWebApp.products.controllers', ['ui.bootstrap',
  'coastlineWebApp.products.services',
  'coastlineWebApp.auth.services',
  'ui.router',
  'ngFileUpload' /*, 'searchApp', 'ngSanitize'*/
]);


app.controller('ProductDisplayCtrl', ['$scope', '$rootScope', 'Products', 'AuthService', '$state', '$uibModal',
  function($scope, $rootScope, Products, AuthService, $state, $uibModal) {
    $scope.fisheryName = "";

    $scope.selectedProduct = 0;

    // $scope.search = 'orig';
    // $scope.reverse = false;
    // $scope.list = false;



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
      Products.setSelectedProductId($scope.products[$scope.selectedProduct]._id);
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
    $scope.editProduct = function() {
      console.log("editProduct");

      Products.setSelectedProductId($scope.products[$scope.selectedProduct]._id);

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
          console.log(product);
          updateProducts();


          // CANCEL callback
        },
        function() {});
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


app.controller('AddProductCtrl', ['$scope', 'Products', 'Upload', 'AuthService', '$state', '$uibModalInstance', '$http',
  function($scope, Products, Upload, AuthService, $state, $uibModalInstance, $http) {
    $scope.fisheryName = "";



    Products.getProducts(function(products) {
      console.log("getProducts");
    }, function(err) {
      console.log(err);
    });


    // tied to ok button
    $scope.ok = function() {

      console.log($scope.file);

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


      console.log("data");
      console.log(data);

      Products.addProduct(data, function(res) {
        $uibModalInstance.close(res);
      }, function(err) {
        $uibModalInstance.close(err);
      }).success(function(res) {

        console.log($scope.file);
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

    };

    // tied to cancel button
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };


  }
]);


app.controller('EditProductCtrl', ['$scope', "$rootScope", 'Products', 'Upload', 'AuthService', '$state', '$uibModalInstance', '$http',
  function($scope, $rootScope, Products, Upload, AuthService, $state, $uibModalInstance, $http) {
    $scope.fisheryName = "";

    var products;

    Products.getProducts(function(res) {
      console.log(res);
      products = res;

      for (var i = 0; i < products.length; i++) {
        if (products[i]._id == Products.getSelectedProductId()) {
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
      Products.getProducts(function(res) {
        console.log(res);
        products = res;

        for (var i = 0; i < products.length; i++) {
          if (products[i]._id = Products.getSelectedProductId()) {
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

      console.log($scope.file);



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


      console.log("data");
      console.log(data);


      Products.updateProduct(data, Products.getSelectedProductId(), function(res) {
        $uibModalInstance.close(res);
      }, function(err) {
        $uibModalInstance.close(err);
      }).success(function(res) {

        console.log($scope.file);
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

        console.log(payload);

        Upload.http(payload);


      });

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
