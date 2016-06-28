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

      $scope.bar_labels = [];
      $scope.bar_data = [];

      $scope.line_labels = [];
      $scope.line_data = [];
      $scope.line_options = {
         lineTension: 0,
      };

      OverviewService.fetchRevenueByProduct().then(function(data) {
         $scope.bar_data = data.data;

         data.labels.map(function(item) {
            $scope.bar_labels.push(item);
         });
      });

      OverviewService.fetchRevenueByMonth().then(function(data) {
         $scope.line_data = data.data;

         data.labels.map(function(item) {
            $scope.line_labels.push(item);
         });
      });

      OverviewService.fetchUpcomingOrders().then(function(data) {
         $scope.upcomingOrders = data;
         console.log(data);
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
         console.log(data);

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

      $scope.addFilter = function() {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/filterAnalytics.html',
            controller: 'AddFilterCtrl',
            size: 'md',
            resolve: {}
          });
      };
   }
]);



app.controller('AddFilterCtrl', ['$scope', 'FisheryService', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, FisheryService, OrderData, ProductData, AuthService, $state, $uibModalInstance, $http) {

        // var order = OrderData.getSelectedOrder();
        $scope.dateEnd = new Date();
        $scope.dateEnd.setHours(23);
        $scope.dateEnd.setMinutes(59);
        $scope.dateEnd.setSeconds(59);

        $scope.isFilterDisabled = function() {
            if (!$scope.product &&
                !$scope.dateStart) {
                return true;
            } else {
                return false;
            }
        };

        // tied to ok button
        $scope.ok = function() {
            var filter = {};

            if ($scope.product) filter.product = $scope.product;

            if ($scope.dateStart) {
                console.log($scope.dateStart);
                filter.dateStart = $scope.dateStart;
            }

            if ($scope.dateEnd) {
                console.log(new Date($scope.dateEnd.getFullYear(),
                    $scope.dateEnd.getMonth(),
                    $scope.dateEnd.getDate(),
                    23, 59, 59, 59, 0));
                filter.dateEnd = new Date($scope.dateEnd.getFullYear(),
                    $scope.dateEnd.getMonth(),
                    $scope.dateEnd.getDate(),
                    23, 59, 59, 59, 0)
            }

            OrderData.setFilter(filter);

            $uibModalInstance.close();


        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);
