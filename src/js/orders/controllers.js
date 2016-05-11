var app = angular.module('coastlineWebApp.orders.controllers', ['ui.bootstrap', 'ngStorage',
    'coastlineWebApp.common.services',
    'coastlineWebApp.orders.services',
    'coastlineWebApp.customers.services',
    'coastlineWebApp.products.services',
    'ui.router',
    'ngNotify'
]);


app.controller('OrderDisplayCtrl', ['$scope', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModal', '$window',
    function($scope, OrderData, ProductData, AuthService, $state, $uibModal, $window) {
        $scope.fisheryName = "";

        //TODO - change this
        // $scope.addInvoice = function(){
        //   $state.go('dashboard.default.orders.invoice');
        // }

        var updateOrders = function() {
            OrderData.getOrders(function(orders) {
                $scope.orders = orders;
                if ($scope.orders.length > 0) {
                    $scope.selectedOrder = $scope.orders[0];
                }

                $scope.totals = [];

                ProductData.getProductData(function(products) {
                    for (var i = 0; i < $scope.orders.length; i++) {
                        var total = 0;

                        for (var j = 0; j < $scope.orders[i].items.length; j++) {
                            for (var k = 0; k < products.length; k++) {
                                if ($scope.orders[i].items[j].product == products[k]._id) {
                                    $scope.orders[i].items[j].product = products[k];
                                    total += Math.round($scope.orders[i].items[j].unitPrice * $scope.orders[i].items[j].quantity * 100) / 100
                                }
                            }
                        }

                        $scope.totals.push(total);
                    }
                }, function(err) {
                    console.log(err);
                });

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
            // $state.go('dashboard.default.orders.invoice');

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addOrderModal.html',
                controller: 'AddOrderCtrl',
                size: 'lg',
                resolve: {}
            });

            modalInstance.result.then(
                function(order) {
                    updateOrders();
                },
                function() {});
        };


        $scope.addFilter = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/order-filter.html',
                controller: 'AddFilterCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function() {
                    updateOrders();
                    $scope.isFilterCleared = OrderData.isFilterCleared();
                },
                function() {});
        };

        $scope.clearFilter = function() {
            OrderData.clearFilter();
            $scope.isFilterCleared = OrderData.isFilterCleared();
            updateOrders();
        };

        $scope.exportOrders = function() {

            $scope.isLoading = true;

            OrderData.fetchOrderExport($scope.orders)
                .then(function(res) {

                    var blob = new Blob([res], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });
                    // var objectUrl = URL.createObjectURL(blob);
                    // $window.open(objectUrl);
                    var url = $window.URL || $window.webkitURL;
                    // var url = $window.URL || $window.webkitURL;
                    $scope.fileUrl = url.createObjectURL(blob);

                    var anchor = angular.element('<a/>');
                    anchor.attr({
                        href: $scope.fileUrl,
                        download: 'Order-export' + '.xlsx'
                    })[0].click();

                    $scope.isLoading = false;

                    $uibModalInstance.close();


                })
        };

        $scope.isFilterCleared = OrderData.isFilterCleared();

        $scope.editOrder = function() {

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
                    updateOrders();


                    // CANCEL callback
                },
                function() {});
        }

        // TODO - Filter orders
        // $scope.filterOrders = function() {
        //
        //     // modal setup and preferences
        //     var modalInstance = $uibModal.open({
        //         animation: true,
        //         templateUrl: 'filterOrders.html',
        //         // TODO make filterCtrl
        //         controller: 'OrderDisplayCtrl',
        //         size: 'md',
        //         resolve: {}
        //     });
        //
        //     // called when modal is closed
        //     modalInstance.result.then(
        //         // OK callback
        //         function(order) {
        //             // add the stage to the supply chain
        //             updateOrders();
        //
        //             // CANCEL callback
        //         },
        //         function() {});
        // };


    }
]);


app.controller('ViewOrderDetailCtrl', ['$scope', '$window', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModalInstance',
    function($scope, $window, OrderData, ProductData, AuthService, $state, $uibModalInstance) {

        $scope.order = OrderData.getSelectedOrder();



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

                    var anchor = angular.element('<a/>');
                    anchor.attr({
                        href: $scope.fileUrl,
                        download: 'Order-' + $scope.order.customerName + '-' + ($scope.order.date.substring(0, 10)) + '.pdf'
                    })[0].click();

                    $scope.pdfStatus = "";

                })
        }

        $scope.getTotal = function() {
            var totalPrice = 0;
            var order = OrderData.getSelectedOrder();
            for (var i = 0; i < order.items.length; i++) {
                totalPrice += order.items[i].unitPrice * order.items[i].quantity;
            }
            return Math.round(totalPrice * 100) / 100;
        }


    }
]);


app.controller('AddOrderCtrl', ['$scope', 'FisheryService', 'OrderData', 'ProductData', 'SupplyChainService', '$uibModal', 'ngNotify', '$state', '$uibModalInstance', '$http', 'CustomerService',
    function($scope, FisheryService, OrderData, ProductData, SupplyChainService, $uibModal, ngNotify, $state, $uibModalInstance, $http, CustomerService) {

        $scope.invoiceNumber;
        $scope.paymentMethod;
        $scope.status;
        $scope.creditTerms;
        $scope.customerName;
        $scope.date;
        $scope.email;
        $scope.phone;
        $scope.items = [];

        var refreshCustomerData = function () {
            if (OrderData.getSelectedCustomerId()) {
                CustomerService.getCustomer(OrderData.getSelectedCustomerId()).then(function (data) {
                    $scope.customerName = data.name;
                    $scope.email = data.email;
                    $scope.phone = data.phone;
                });
            };
        }

        // $scope.isSubmitButtonDisabled = function() {
        //     if (!$scope.invoiceNumber ||
        //         !$scope.paymentMethod ||
        //         !$scope.status ||
        //         !$scope.creditTerms ||
        //         !$scope.customerName ||
        //         !$scope.date ||
        //         !$scope.email ||
        //         !$scope.phone ||
        //         $scope.items.length == 0) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // };

        $scope.loadCustomer = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'loadCustomerModal.html',
                controller: 'LoadCustomerCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function() {
                    refreshCustomerData();
                },
                function() {});
        }


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

        var refreshBatches = function() {
            return SupplyChainService.fetchBlocksByProduct($scope.selectedProduct._id).then(function(res) {
                $scope.blocks = []
                for (i = 0; i < res.length; i++) {
                    var isBlockInItems = false;

                    for (j = 0; j < $scope.items.length; j++) {
                        if (res[i]._id == $scope.items[j].block._id) {
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

                return;

            });
        }

        $scope.addItem = function() {
            $scope.items.push({
                quantity: $scope.quantity,
                product: $scope.selectedProduct,
                fisheryId: FisheryService.getFisheryId(),
                block: $scope.selectedBlock,
                unitPrice: $scope.unitPrice,
                units: $scope.units,
                taxRate: $scope.taxRate
            });

            delete $scope.quantity;
            delete $scope.selectedProduct;
            delete $scope.selectedBlock;
            delete $scope.unitPrice;
            delete $scope.units;
            delete $scope.taxRate;

            getProductData();
        };

        $scope.removeItem = function(index) {
            var newItems = []

            for (var i = 0; i < $scope.items.length; i++) {
                if (i != index) {
                    newItems.push($scope.items[i]);
                }
            }

            $scope.items = newItems;

            refreshBatches();

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
            for (var i = 0; i < $scope.items.length; i++) {
                totalPrice += $scope.items[i].unitPrice * $scope.items[i].quantity;
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
            if ($scope.selectedProduct) {
                refreshBatches();
            }
        });

        $scope.$watch('selectedBlock', function(newValue, oldValue) {
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
                // taxRate: $scope.taxRate / 100,
                items: []
            };

            // if (angular.isUndefined(data.customerName) ||
            //     angular.isUndefined(data.invoiceNumber) ||
            //     angular.isUndefined(data.paymentMethod) ||
            //     angular.isUndefined(data.status) ||
            //     angular.isUndefined(data.customerName) ||
            //     angular.isUndefined(data.creditTerms)) {
            //     ngNotify.set('Please fill out all mandatory invoice fields.', {
            //         sticky: false,
            //         button: false,
            //         type: 'error',
            //         duration: 1500,
            //         position: 'top'
            //     })
            //
            // }



            for (i = 0; i < $scope.items.length; i++) {
                data.items.push({
                    quantity: $scope.items[i].quantity,
                    productId: $scope.items[i].product._id,
                    fisheryId: $scope.items[i].fisheryId,
                    blockId: $scope.items[i].block._id,
                    unitPrice: $scope.items[i].unitPrice,
                    units: $scope.items[i].units,
                    taxRate: $scope.items[i].taxRate
                });
            };

            var formValid =  true;

            $scope.nameRequired = $scope.addOrderForm.name.$error.required;
            $scope.emailRequired = $scope.addOrderForm.email.$error.required;
            $scope.invoiceRequired = $scope.addOrderForm.invoice.$error.required;
            $scope.paymentRequired = $scope.addOrderForm.payment.$error.required;
            $scope.statusRequired = $scope.addOrderForm.status.$error.required;
            $scope.dateRequired = $scope.addOrderForm.date.$error.required;
            $scope.creditRequired = $scope.addOrderForm.credit.$error.required;
            $scope.phoneRequired = $scope.addOrderForm.phone.$error.required;



            if (!$scope.customerName || !$scope.email
                || !$scope.invoiceNumber || !$scope.paymentMethod
                || !$scope.status || !$scope.date
                || !$scope.creditTerms || !$scope.phone) {
                  console.log("here");
                  formValid = false;

            }

            console.log(formValid);

            if (formValid) {
              OrderData.addOrder(data).then(function(res) {
                  $uibModalInstance.close(res);
              });
            }


        };



        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


app.controller('EditOrderCtrl', ['$scope', 'FisheryService', 'SupplyChainService', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, FisheryService, SupplyChainService, OrderData, ProductData, AuthService, $state, $uibModalInstance, $http) {

        var order = OrderData.getSelectedOrder($scope.selectedOrder);
        console.log(order);

        // $scope.dateEnd = new Date();
        // $scope.dateEnd.setHours(23);
        // $scope.dateEnd.setMinutes(59);
        // $scope.dateEnd.setSeconds(59);

        $scope.invoiceNumber = order.invoiceNumber;
        $scope.paymentMethod = order.paymentMethod;
        $scope.status = order.status;
        $scope.creditTerms = order.creditTerms;
        $scope.customerName = order.customerName;

        if (typeof order.date == "string") {
            $scope.date = new Date(order.date);
        }
        // $scope.date = new Date(order.date.getFullYear());
        $scope.email = order.email;
        $scope.phone = order.phone;
        $scope.currency = order.currency;
        $scope.items = order.items;

        $scope.removedItems = [];

        console.log($scope.items);

        var populateItemStage = function(items, index) {
            if (index == items.length - 1) {
                SupplyChainService.fetchStage($scope.items[index].block.stage).then(function(data) {
                    items[index].block.stage = data;
                });
            } else {
                SupplyChainService.fetchStage($scope.items[index].block.stage).then(function(data) {
                    items[index].block.stage = data;
                    populateItemStage(items, index + 1);
                });
            }
        }

        populateItemStage($scope.items, 0);

        $scope.isSubmitButtonDisabled = function() {
            if (!$scope.invoiceNumber ||
                !$scope.paymentMethod ||
                !$scope.status ||
                !$scope.creditTerms ||
                !$scope.customerName ||
                !$scope.date ||
                !$scope.email ||
                !$scope.phone ||
                $scope.items.length == 0) {
                return true;
            } else {
                return false;
            }
        };

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

        var refreshBatches = function() {
            return SupplyChainService.fetchBlocksByProduct($scope.selectedProduct._id).then(function(data) {
                $scope.blocks = []

                for (i = 0; i < data.length; i++) {
                    var isBlockInItems = false;

                    for (j = 0; j < $scope.items.length; j++) {
                        if (data[i]._id == $scope.items[j].block._id) {
                            isBlockInItems = true;
                        }
                    }

                    if (!isBlockInItems) {
                        $scope.blocks.push(data[i]);
                    }

                }

                if ($scope.blocks.length > 0) {
                    // $scope.selectedBlock = $scope.blocks[0];
                }

            });
        }

        $scope.addItem = function() {
            $scope.items.push({
                quantity: $scope.quantity,
                product: $scope.selectedProduct,
                fisheryId: FisheryService.getFisheryId(),
                block: $scope.selectedBlock,
                unitPrice: $scope.unitPrice,
                units: $scope.units,
                taxRate: $scope.taxRate
            });

            var newRemovedItems = []

            for (var i = 0; i < $scope.removedItems.length; i++) {
                if ($scope.removedItems[i].block._id != $scope.selectedBlock._id) {
                    newRemovedItems.push($scope.removedItems[i]);
                }
            }

            $scope.removedItems = newRemovedItems;

            delete $scope.quantity;
            delete $scope.selectedProduct;
            delete $scope.selectedBlock;
            delete $scope.unitPrice;
            delete $scope.units;
            delete $scope.taxRate;



            getProductData();
        };

        $scope.removeItem = function(index) {
            var newItems = []

            $scope.removedItems.push($scope.items[index]);

            for (var i = 0; i < $scope.items.length; i++) {
                if (i != index) {
                    newItems.push($scope.items[i]);
                }
            }

            $scope.items = newItems;

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
            for (var i = 0; i < $scope.items.length; i++) {
                totalPrice += $scope.items[i].unitPrice * $scope.items[i].quantity;
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
            if ($scope.selectedProduct) {
                refreshBatches().then(function() {

                    console.log("here");
                    console.log($scope.blocks);


                    for (var i = 0; i < $scope.removedItems.length; i++) {
                        var isInBlocks = false;

                        for (var j = 0; j < $scope.blocks.length; j++) {
                            if ($scope.removedItems[i].block._id == $scope.blocks[j]._id) {
                                $scope.blocks[i].quantity += $scope.removedItems[i].quantity;
                                isInBlocks = true;
                            }
                        }

                        if (!isInBlocks) {
                            var block = $scope.removedItems[i].block;
                            block.displayData = block.catchDate.toString().substring(0, 10) + ", " + block.stage.name
                            block.quantity = $scope.removedItems[i].quantity;
                            console.log(block.displayData);
                            console.log(block.quantity);
                            $scope.blocks.push(block);
                        }
                    }



                });
            }
        });

        $scope.$watch('selectedBlock', function(newValue, oldValue) {
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
                // taxRate: $scope.taxRate / 100,
                items: []
            };

            if (angular.isUndefined(data.customerName) ||
                angular.isUndefined(data.invoiceNumber) ||
                angular.isUndefined(data.paymentMethod) ||
                angular.isUndefined(data.status) ||
                angular.isUndefined(data.customerName) ||
                angular.isUndefined(data.creditTerms)) {
                ngNotify.set('Please fill out all mandatory invoice fields.', {
                    sticky: false,
                    button: false,
                    type: 'error',
                    duration: 1500,
                    position: 'top'
                })

            }


            for (i = 0; i < $scope.items.length; i++) {
                data.items.push({
                    quantity: $scope.items[i].quantity,
                    productId: $scope.items[i].product._id,
                    fisheryId: $scope.items[i].fisheryId,
                    blockId: $scope.items[i].block._id,
                    unitPrice: $scope.items[i].unitPrice,
                    units: $scope.items[i].units,
                    taxRate: $scope.items[i].taxRate
                });
            };

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

app.controller('DeleteOrderCtrl', ['$scope', 'FisheryService', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, FisheryService, OrderData, ProductData, AuthService, $state, $uibModalInstance, $http) {

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


app.controller('AddFilterCtrl', ['$scope', 'FisheryService', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, FisheryService, OrderData, ProductData, AuthService, $state, $uibModalInstance, $http) {

        // var order = OrderData.getSelectedOrder();
        $scope.dateEnd = new Date();
        $scope.dateEnd.setHours(23);
        $scope.dateEnd.setMinutes(59);
        $scope.dateEnd.setSeconds(59);

        $scope.isFilterDisabled = function() {
            if (!$scope.customerName &&
                !$scope.invoiceNumber &&
                !$scope.paymentMethod &&
                !$scope.dateStart) {
                return true;
            } else {
                return false;
            }
        };


        // tied to ok button
        $scope.ok = function() {
            var filter = {};

            if ($scope.customerName) filter.customerName = $scope.customerName;
            if ($scope.invoiceNumber) filter.invoiceNumber = $scope.invoiceNumber;
            if ($scope.paymentMethod) filter.paymentMethod = $scope.paymentMethod;
            if ($scope.status) filter.status = $scope.status;

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


app.controller('OrderExportCtrl', ['$scope', 'FisheryService', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, FisheryService, OrderData, ProductData, AuthService, $state, $uibModalInstance, $http) {

        // var order = OrderData.getSelectedOrder();
        $scope.dateEnd = new Date();
        $scope.dateEnd.setHours(23);
        $scope.dateEnd.setMinutes(59);
        $scope.dateEnd.setSeconds(59);

        $scope.isFilterDisabled = function() {
            if (!$scope.customerName &&
                !$scope.invoiceNumber &&
                !$scope.paymentMethod &&
                !$scope.dateStart) {
                return true;
            } else {
                return false;
            }
        };




        // tied to ok button
        $scope.ok = function() {




        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);

app.controller('LoadCustomerCtrl', ['$scope', 'FisheryService', 'OrderData', 'CustomerService', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, FisheryService, OrderData, CustomerService, AuthService, $state, $uibModalInstance, $http) {


        CustomerService.getCustomers().then(function (data) {
            $scope.customers = data;
            console.log(data);
        });



        // tied to ok button
        $scope.ok = function() {
            OrderData.setSelectedCustomerId($scope.customers[0]._id);
            $uibModalInstance.close();
        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);
