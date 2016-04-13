var app = angular.module('coastlineWebApp.orders.controllers', ['ui.bootstrap', 'ngStorage',
    'coastlineWebApp.common.services',
    'coastlineWebApp.orders.services',
    'coastlineWebApp.products.services',
    'ui.router',
    'ngNotify'
]);


app.controller('OrderDisplayCtrl', ['$scope', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModal',
    function($scope, OrderData, ProductData, AuthService, $state, $uibModal) {
        $scope.fisheryName = "";



        var updateOrders = function() {
            OrderData.getOrders(function(orders) {
                console.log("getOrders");
                $scope.orders = orders;
                console.log($scope.orders);
                if ($scope.orders.length > 0) {
                    $scope.selectedOrder = $scope.orders[0];
                }

                $scope.totals = [];

                ProductData.getProductData(function(products) {
                    console.log(products);
                    for (var i = 0; i < $scope.orders.length; i++) {
                        var total = 0;

                        for (var j = 0; j < $scope.orders[i].items.length; j++) {
                            for (var k = 0; k < products.length; k++) {
                                console.log($scope.orders[i].items[j].product + " " + products[k]._id);
                                if ($scope.orders[i].items[j].product == products[k]._id) {
                                    $scope.orders[i].items[j].product = products[k];
                                    total += Math.round($scope.orders[i].items[j].unitPrice * $scope.orders[i].items[j].quantity * 100) / 100
                                    console.log(total);
                                }
                            }
                        }

                        $scope.totals.push(total);
                    }
                }, function(err) {
                    console.log(err);
                })

            }, function(err) {
                console.log(err);
            });
        };

        updateOrders();

        $scope.viewOrderDetail = function(order) {
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
                function(res) {

                },
                function() {});

        };

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

        $scope.editOrder = function() {
            console.log("editOrder");

            OrderData.setSelectedOrder($scope.selectedOrder);

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addOrderModal.html',
                controller: 'EditOrderCtrl',
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

        $scope.deleteOrder = function() {
            OrderData.setSelectedOrder($scope.selectedOrder);

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteOrderModal.html',
                controller: 'DeleteOrderCtrl',
                size: 'md',
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


        }


    }
]);


app.controller('ViewOrderDetailCtrl', ['$scope', '$window', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModalInstance',
    function($scope, $window, OrderData, ProductData, AuthService, $state, $uibModalInstance) {

        $scope.order = OrderData.getSelectedOrder();
        console.log($scope.order);



        $scope.dismiss = function() {
            $uibModalInstance.close("dismiss");
        };

        $scope.getPDF = function() {

            $scope.pdfStatus = "loading";

            OrderData.fetchOrderPDF($scope.order._id)
                .then(function(res) {

                    var blob = new Blob([res], {
                        type: 'application/pdf'
                    });
                    // var objectUrl = URL.createObjectURL(blob);
                    // $window.open(objectUrl);
                    var url = $window.URL || $window.webkitURL;
                    // var url = $window.URL || $window.webkitURL;
                    $scope.fileUrl = url.createObjectURL(blob);
                    console.log($scope.fileUrl);

                    var anchor = angular.element('<a/>');
                    anchor.attr({
                        href: $scope.fileUrl,
                        download: 'order.pdf'
                    })[0].click();

                    $scope.pdfStatus = "";

                })
        }

        $scope.getTotal = function() {
            var totalPrice = 0;
            console.log(totalPrice);
            var order = OrderData.getSelectedOrder();
            for (var i = 0; i < order.items.length; i++) {
                totalPrice += order.items[i].unitPrice * order.items[i].quantity;
                console.log(totalPrice);
            }
            return Math.round(totalPrice * 100) / 100;
        }


    }
]);


app.controller('AddOrderCtrl', ['$scope', 'FisheryData', 'OrderData', 'ProductData', 'BlockData', 'AuthService', 'ngNotify', '$state', '$uibModalInstance', '$http',
    function($scope, FisheryData, OrderData, ProductData, BlockData, AuthService, ngNotify, $state, $uibModalInstance, $http) {

        $scope.invoiceNumber;
        $scope.paymentMethod;
        $scope.status;
        $scope.creditTerms;
        $scope.customerName;
        $scope.date;
        $scope.email;
        $scope.phone;
        $scope.items = [];

        $scope.$watch('quantity', function() {
            if ($scope.quantity && $scope.selectedBlock) {
                if ($scope.quantity > $scope.selectedBlock.quantity) {
                    $scope.quantity = $scope.selectedBlock.quantity;

                    ngNotify.set('Quantity exceeds availability in this batch', {
                        sticky: false,
                        button: true,
                        type: 'error',
                        duration: 700,
                        position: 'top'
                    })
                }
            }
        });

        var getProductData = function() {
            ProductData.getProductData(function(res) {
                $scope.products = res;
                if (res.length > 0) $scope.selectedProduct = res[0];
            }, function(err) {
                console.log(err);
            });
        };

        $scope.addItem = function() {
            console.log('addItem');
            $scope.items.push({
                quantity: $scope.quantity,
                product: $scope.selectedProduct,
                fisheryId: FisheryData.getFisheryId(),
                block: $scope.selectedBlock,
                unitPrice: $scope.unitPrice,
                units: $scope.units
            });

            delete $scope.quantity;
            delete $scope.selectedProduct;
            delete $scope.selectedBlock;
            delete $scope.unitPrice;
            delete $scope.units;

            getProductData();
        };

        $scope.getMaxQuantity = function() {
            if ($scope.selectedBlock) {
                return $scope.selectedBlock.quantity;
            }
        };

        $scope.isAddButtonDisabled = function() {
            if ($scope.selectedProduct && $scope.selectedBlock && $scope.unitPrice && $scope.units && $scope.quantity) {
                if ($scope.selectedBlock) {
                    if ($scope.quantity > $scope.selectedBlock.quantity) return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        };

        $scope.getTotal = function() {
            var totalPrice = 0;
            console.log(totalPrice);
            for (var i = 0; i < $scope.items.length; i++) {
                totalPrice += $scope.items[i].unitPrice * $scope.items[i].quantity;
                console.log(totalPrice);
            }
            return Math.round(totalPrice * 100) / 100;
        }

        ProductData.getProductData(function(res) {
            $scope.products = res;
            // if (res.length > 0) $scope.selectedProduct = res[0];
        }, function(err) {
            console.log(err);
        });

        $scope.$watch('selectedProduct', function(newValue, oldValue) {
            console.log($scope.selectedProduct);
            if ($scope.selectedProduct) {
                BlockData.fetchBlocksByProduct($scope.selectedProduct._id).then(function(res) {
                    $scope.blocks = []
                    for (i = 0; i < res.length; i++) {
                        var isBlockInItems = false;

                        for (j = 0; j < $scope.items.length; j++) {
                            if (res[i]._id == $scope.items[j].block._id) {
                                console.log('HERE');
                                isBlockInItems = true;
                            }
                        }

                        if (!isBlockInItems) {
                            $scope.blocks.push(res[i]);
                        }

                    }

                    if ($scope.blocks.length > 0) {
                        // $scope.selectedBlock = $scope.blocks[0];
                    }

                    console.log($scope.blocks);
                });
            }

        });

        $scope.$watch('selectedBlock', function(newValue, oldValue) {
            console.log($scope.selectedBlock);
            if ($scope.selectedBlock) {
                $scope.quantity = $scope.selectedBlock.quantity;
            }

        });





        // tied to ok button
        $scope.ok = function() {
            var data = {
                invoiceNumber: $scope.invoiceNumber,
                paymentMethod: $scope.paymentMethod,
                status: $scope.status,
                creditTerms: $scope.creditTerms,
                customerName: $scope.customerName,
                date: $scope.date,
                email: $scope.email,
                phone: $scope.phone,
                currency: $scope.currency,
                taxRate: $scope.taxRate / 100,
                items: []
            };


            for (i = 0; i < $scope.items.length; i++) {
                data.items.push({
                    quantity: $scope.items[i].quantity,
                    productId: $scope.items[i].product._id,
                    fisheryId: $scope.items[i].fisheryId,
                    blockId: $scope.items[i].block._id,
                    unitPrice: $scope.items[i].unitPrice,
                    units: $scope.items[i].units
                });
            };

            console.log(data.items);


            OrderData.addOrder(data).then(function(res) {
                $uibModalInstance.close(res);
            });

        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);


app.controller('EditOrderCtrl', ['$scope', 'FisheryData', 'OrderData', 'ProductData', 'BlockData', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, FisheryData, OrderData, ProductData, BlockData, AuthService, $state, $uibModalInstance, $http) {

        var order = OrderData.getSelectedOrder();

        $scope.invoiceNumber = order.invoiceNumber;
        $scope.paymentMethod = order.paymentMethod;
        $scope.status = order.status;
        $scope.creditTerms = order.creditTerms;
        $scope.customerName = order.customerName;
        // $scope.date = order.date;
        $scope.email = order.email;
        $scope.phone = order.phone;
        $scope.items = order.items;

        console.log(order);

        var getProductData = function() {
            ProductData.getProductData(function(res) {
                $scope.products = res;
                if (res.length > 0) $scope.selectedProduct = res[0];
            }, function(err) {
                console.log(err);
            });
        };

        $scope.addItem = function() {
            console.log('addItem');
            $scope.items.push({
                quantity: $scope.quantity,
                product: $scope.selectedProduct,
                fisheryId: FisheryData.getFisheryId(),
                block: $scope.selectedBlock,
                unitPrice: $scope.unitPrice,
                units: $scope.units
            });

            delete $scope.quantity;
            delete $scope.selectedProduct;
            delete $scope.selectedBlock;
            delete $scope.unitPrice;
            delete $scope.units;

            getProductData();
        };

        $scope.getMaxQuantity = function() {
            if ($scope.selectedBlock) {
                return $scope.selectedBlock.quantity;
            }
        };

        $scope.isAddButtonDisabled = function() {
            if ($scope.selectedProduct && $scope.selectedBlock && $scope.unitPrice && $scope.units && $scope.quantity) {
                if ($scope.selectedBlock) {
                    if ($scope.quantity > $scope.selectedBlock.quantity) return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        };

        ProductData.getProductData(function(res) {
            $scope.products = res;
            // if (res.length > 0) $scope.selectedProduct = res[0];
        }, function(err) {
            console.log(err);
        });

        $scope.$watch('selectedProduct', function(newValue, oldValue) {
            console.log($scope.selectedProduct);
            if ($scope.selectedProduct) {
                BlockData.fetchBlocksByProduct($scope.selectedProduct._id).then(function(res) {
                    $scope.blocks = []
                    for (i = 0; i < res.length; i++) {
                        var isBlockInItems = false;

                        for (j = 0; j < $scope.items.length; j++) {
                            if (res[i]._id == $scope.items[j].block._id) {
                                console.log('HERE');
                                isBlockInItems = true;
                            }
                        }

                        if (!isBlockInItems) {
                            $scope.blocks.push(res[i]);
                        }

                    }

                    if ($scope.blocks.length > 0) {
                        // $scope.selectedBlock = $scope.blocks[0];
                    }

                    console.log($scope.blocks);
                });
            }

        });

        $scope.$watch('selectedBlock', function(newValue, oldValue) {
            console.log($scope.selectedBlock);
            if ($scope.selectedBlock) {
                $scope.quantity = $scope.selectedBlock.quantity;
            }

        });




        // tied to ok button
        $scope.ok = function() {
            var data = {
                invoiceNumber: $scope.invoiceNumber,
                paymentMethod: $scope.paymentMethod,
                status: $scope.status,
                creditTerms: $scope.creditTerms,
                customerName: $scope.customerName,
                date: $scope.date,
                email: $scope.email,
                phone: $scope.phone,
                items: []
            };


            for (i = 0; i < $scope.items.length; i++) {
                data.items.push({
                    quantity: $scope.items[i].quantity,
                    productId: $scope.items[i].product._id,
                    fisheryId: $scope.items[i].fisheryId,
                    blockId: $scope.items[i].block._id,
                    unitPrice: $scope.items[i].unitPrice,
                    units: $scope.items[i].units
                });
            };

            console.log(data.items);


            OrderData.addOrder(data).then(function(res) {
                $uibModalInstance.close(res);
            });

        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);

app.controller('DeleteOrderCtrl', ['$scope', 'FisheryData', 'OrderData', 'ProductData', 'BlockData', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, FisheryData, OrderData, ProductData, BlockData, AuthService, $state, $uibModalInstance, $http) {

        var order = OrderData.getSelectedOrder();


        // tied to ok button
        $scope.ok = function() {



            OrderData.deleteOrder(order._id).then(function(res) {
                $uibModalInstance.close(res);
            });

        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);
