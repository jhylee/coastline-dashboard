var app = angular.module('coastlineWebApp.orders.controllers', ['ui.bootstrap', 'ngStorage',
  'coastlineWebApp.orders.services',
  'coastlineWebApp.products.services',
  'ui.router']);


  app.controller('OrderDisplayCtrl', ['$scope', 'OrderData', 'Products', 'AuthService', '$state', '$uibModal',
      function ($scope, OrderData, Products, AuthService, $state, $uibModal) {
          $scope.fisheryName = "";


          var updateOrders = function () {
            OrderData.getOrders(function (orders) {
  	            console.log("getOrders");
  	            $scope.orders = orders;
                console.log($scope.orders);

                $scope.totals = [];

                Products.getProducts(function (products) {
                  console.log(products);
                  for (var i = 0; i < $scope.orders.length; i ++) {
                    var total = 0;

                    for (var j = 0; j < $scope.orders[i].items.length; j ++) {
                      for (var k = 0; k < products.length; k ++) {
                        console.log($scope.orders[i].items[j].product + " " + products[k]._id);
                        if ($scope.orders[i].items[j].product == products[k]._id) {
                          $scope.orders[i].items[j].product = products[k];
                          total += $scope.orders[i].items[j].product.unitPrice * $scope.orders[i].items[j].quantity
                          console.log(total);
                        }
                      }
                    }

                    $scope.totals.push(total);
                  }
                }, function (err) {
                  console.log(err);
                })

    	        }, function (err) {
    	        	console.log(err);
    	      });
          };

          updateOrders();

          $scope.viewOrderDetail = function (order) {
            OrderData.setSelectedOrder(order);

            // modal setup and preferences
    	      var modalInstance = $uibModal.open({
    	        animation: true,
    	        templateUrl: 'viewOrderDetailModal.html',
    	        controller: 'ViewOrderDetailCtrl',
    	        size: 'lg',
    	        resolve: {}
    	      });

    	      // called when modal is closed
    	      modalInstance.result.then(
    	        function (res) {

    	      }, function () {});

          };

          // TODO add an invoice
          $scope.addOrder = function() {
            console.log("addOrder");

            // modal setup and preferences
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'addOrderModal.html',
              controller: 'AddOrderCtrl',
              size: 'lg',
              resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
              // OK callback
              function(order) {
                // add the stage to the supply chain
                console.log(order);
                updateOrders();

                // CANCEL callback
              },
              function() {});
          };


  }]);


  app.controller('ViewOrderDetailCtrl', ['$scope', 'OrderData', 'Products', 'AuthService', '$state', '$uibModalInstance',
      function ($scope, OrderData, Products, AuthService, $state, $uibModalInstance) {

        $scope.order = OrderData.getSelectedOrder();
        console.log($scope.order);

        $scope.dismiss = function () {
          $uibModalInstance.close("dismiss");
        };


  }]);


  app.controller('AddOrderCtrl', ['$scope', 'Orders', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, Orders, OrderData, Products, AuthService, $state, $uibModalInstance, $http) {

      Orders.getOrders(function(orders) {
        console.log("getOrders");
      }, function(err) {
        console.log(err);
      });

      // tied to ok button
      $scope.ok = function() {

        console.log($scope.file);

        if ($scope.file) {
          var data = {
            name: $scope.name,
            unitPrice: $scope.unitPrice,
            quantity: $scope.quantity,
            totalAmount: $scope.totalAmount,
            invoiceNum: $scope.invoiceNum,
            payMethod: $scope.payMethod,
            status: $scope.status,
            dateTime: $scope.dateTime,
          };
        } 

        console.log("data");
        console.log(data);

        Orders.addOrder(data, function(res) {
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
