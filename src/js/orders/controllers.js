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

  }]);


  app.controller('ViewOrderDetailCtrl', ['$scope', 'OrderData', 'Products', 'AuthService', '$state', '$uibModalInstance',
      function ($scope, OrderData, Products, AuthService, $state, $uibModalInstance) {

        $scope.order = OrderData.getSelectedOrder();
        console.log($scope.order);

        $scope.dismiss = function () {
          $uibModalInstance.close("dismiss");
        };


  }]);
