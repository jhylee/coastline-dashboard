var app = angular.module('coastlineWebApp.overview.controllers', ['ui.bootstrap',
   'coastlineWebApp.overview.services',
   'coastlineWebApp.auth.services',
   'coastlineWebApp.orders.controllers',
   'coastlineWebApp.orders.services',
   'coastlineWebApp.common.services',
   'coastlineWebApp.products.services',
   'ui.router',
   'chart.js'
]);

app.controller('OverviewCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', 'OverviewService', 'OrderData', '$uibModal', 'ProductData',
   function($scope, AuthService, $state, FisheryService, OverviewService, OrderData, $uibModal, ProductData) {
      $scope.isFilterCleared = true;

      $scope.bar_labels = [];
      $scope.bar_data = [];

      $scope.line_labels = [];
      $scope.line_data = [];

      $scope.products = [];

      OverviewService.getProductData(function(data) {
         for (var i = 0; i < data.length; ++i) {
            $scope.products.push(data[i]);
            for (var j = 0; j < data[i].finishedProducts.length; ++j) {
               $scope.products.push(data[i].finishedProducts[j]);
            }
         }

         console.log($scope.products);
      }, function(err) {
         console.log(err);
      });

      $scope.updateRevenueByProduct = function(filter) {
         OverviewService.fetchRevenueByProduct(filter || {}).then(function(data) {
            $scope.bar_labels = [];
            $scope.bar_data = data.data;

            data.labels.map(function(item) {
               $scope.bar_labels.push(item);
            });
         });
      }

      $scope.updateRevenueByMonth = function(filter) {
         OverviewService.fetchRevenueByMonth(filter || {}).then(function(data) {
            $scope.line_labels = [];
            $scope.line_data = data.data;

            data.labels.map(function(item) {
               $scope.line_labels.push(item);
            });
         });
      };

      $scope.updateRevenueByProduct();
      $scope.updateRevenueByMonth();

      OverviewService.fetchUpcomingOrders().then(function(data) {
         $scope.upcomingOrders = data;

         if ($scope.upcomingOrders.length > 0) {
            $scope.selectedOrder = $scope.upcomingOrders[0];
         }

         $scope.totals = [];

         ProductData.getProductData(function(products) {
            for (var i = 0; i < $scope.upcomingOrders.length; i++) {
               var total = 0;

               for (var j = 0; j < $scope.upcomingOrders[i].items.length; j++) {
                  for (var k = 0; k < products.length; k++) {
                     if ($scope.upcomingOrders[i].items[j].product == products[k]._id) {
                        $scope.upcomingOrders[i].items[j].product = products[k];
                        total += Math.round($scope.upcomingOrders[i].items[j].unitPrice * $scope.upcomingOrders[i].items[j].quantity * 100) / 100
                     }
                  }
               }

               $scope.totals.push(total);
            }
         }, function(err) {
            console.log(err);
         });

      });

      OverviewService.fetchOverdueOrders().then(function(data) {
         $scope.overdueOrders = data;

         if ($scope.overdueOrders.length > 0) {
            $scope.selectedOrder = $scope.overdueOrders[0];
         }

         $scope.totals = [];
         //
         // for (var i = 0; i < $scope.overdueOrders.length; i++) {
         //    for (var j = 0; j < $scope.overdueOrders[i].items.length; j++) {
         //       if ($scope.overdueOrders[i].items[j].block.finishedProduct) {
         //          ProductData.getFinishedProductData($scope.overdueOrders[i].items[j].block.finishedProduct).then(function(data) {
         //             $scope.overdueOrders[i].items[j].block.finishedProduct = data;
         //          });
         //       } else {
         //          ProductData.getSourcedProductData($scope.overdueOrders[i].items[j].block.sourcedProduct).then(function(data) {
         //             $scope.overdueOrders[i].items[j].block.sourcedProduct = data;
         //          });
         //       }
         //    }
         // };

      }, function(err) {
         console.log(err);
      });

      $scope.clearFilter = function() {
         $scope.isFilterCleared = true;
         $scope.updateRevenueByProduct();
         $scope.updateRevenueByMonth();
      };


      $scope.viewOrderDetail = function(order) {
         OrderData.setSelectedOrder(order);

         var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'viewOrderDetailModal.html',
            controller: 'ViewOrderDetailCtrl',
            size: 'lg',
            resolve: {}
         });

         // called when modal is closed
         modalInstance.result.then(
            function(res) {

            },
            function() {});
      };

      // $scope.addFilter = function() {
      //     var modalInstance = $uibModal.open({
      //       animation: true,
      //       templateUrl: 'views/modals/analytics-filter.html',
      //       controller: 'AddFilterCtrl',
      //       size: 'md',
      //       scope: $scope,
      //     });
      // };

      $scope.addFilter = function() {
         var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/filterAnalytics.html',
            controller: 'AddFilterCtrl',
            size: 'md',
            scope: $scope,
            resolve: {}
         });

         modalInstance.result.then(
            function() {

            },
            function() {});

      };
   }
]);



app.controller('AddFilterCtrl', ['$scope', 'OverviewService', 'FisheryService', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, OverviewService, FisheryService, OrderData, ProductData, AuthService, $state, $uibModalInstance, $http) {
      $scope.dateEnd = new Date();
      $scope.dateEnd.setHours(23);
      $scope.dateEnd.setMinutes(59);
      $scope.dateEnd.setSeconds(59);
      console.log($scope.isFilterCleared);

        $scope.isFilterDisabled = function() {
           console.log("DATE", typeof $scope.dateStart);
           if (typeof $scope.productName === "undefined" && typeof $scope.dateStart === "undefined") {
             return true;
           }
           else {
             return false;
           }
        };

        // tied to ok button
        $scope.ok = function() {
            var filter = {};

            if ($scope.productName)
               filter.productName = $scope.productName;

            if ($scope.dateStart)
               filter.dateStart = $scope.dateStart;

            if ($scope.dateEnd)
               filter.dateEnd = $scope.dateEnd;

            $scope.updateRevenueByProduct(filter);
            $scope.updateRevenueByMonth(filter);
            $scope.isFilterCleared = false;
            console.log($scope.isFilterCleared)

            $uibModalInstance.close();
        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
