var app = angular.module('coastlineWebApp.overview.controllers', ['ui.bootstrap',
    'coastlineWebApp.overview.services',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.orders.controllers',
    'coastlineWebApp.orders.services',
    'coastlineWebApp.common.services',
    'coastlineWebApp.products.services',
    'ui.router'
]);



app.controller('OverviewCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', 'OverviewService', 'OrderData', '$uibModal', 'ProductData',
    function($scope, AuthService, $state, FisheryService, OverviewService, OrderData, $uibModal, ProductData) {

        OverviewService.fetchUpcomingOrders().then(function (data) {
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

        OverviewService.fetchOverdueOrders().then(function (data) {
            $scope.overdueOrders = data;
            console.log(data);

            if ($scope.overdueOrders.length > 0) {
                $scope.selectedOrder = $scope.overdueOrders[0];
            }

            $scope.totals = [];

            ProductData.getProductData(function(products) {
                for (var i = 0; i < $scope.overdueOrders.length; i++) {
                    var total = 0;

                    for (var j = 0; j < $scope.overdueOrders[i].items.length; j++) {
                        for (var k = 0; k < products.length; k++) {
                            if ($scope.overdueOrders[i].items[j].product == products[k]._id) {
                                $scope.overdueOrders[i].items[j].product = products[k];
                                total += Math.round($scope.overdueOrders[i].items[j].unitPrice * $scope.overdueOrders[i].items[j].quantity * 100) / 100
                            }
                        }
                    }

                    $scope.totals.push(total);
                }
            }, function(err) {
                console.log(err);
            });

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

    }
]);
