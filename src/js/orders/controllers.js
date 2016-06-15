var app = angular.module('coastlineWebApp.orders.controllers', ['ui.bootstrap', 'ngStorage',
    'coastlineWebApp.common.services',
    'coastlineWebApp.orders.services',
    'coastlineWebApp.customers.services',
    'coastlineWebApp.products.services',
    'coastlineConstants',
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
        //


        OrderData.getOrdersLength().then(function(data) {
            $scope.numberOfCustomers = data.length;
            var length = Math.ceil(data.length / 10)
            $scope.paginationArray = [];
            console.log($scope.numberOfCustomers);
            // console.log(Math.ceil(data.length / 10));
            for (var i = 0; i < length; i++) {
                $scope.paginationArray.push(0);
            }

            console.log($scope.paginationArray);

        });

        var updateOrders = function(startIndex, endIndex) {
            OrderData.getOrdersLength().then(function(data) {
                $scope.numberOfCustomers = data.length;
                var length = Math.ceil(data.length / 10)
                $scope.paginationArray = [];
                console.log($scope.numberOfCustomers);
                // console.log(Math.ceil(data.length / 10));
                for (var i = 0; i < length; i++) {
                    $scope.paginationArray.push(0);
                }

                console.log($scope.paginationArray);




                OrderData.getOrders(function(orders) {
                    $scope.orders = orders;
                    if ($scope.orders.length > 0) {
                        $scope.selectedOrder = $scope.orders[0];
                    }

                    $scope.totals = [];

                    ProductData.getProductData(function(products) {
                        for (var i = 0; i < $scope.orders.length; i++) {
                            var total = 0;
                            var totalPrice = 0;


                            for (var j = 0; j < $scope.orders[i].items.length; j++) {
                                for (var k = 0; k < products.length; k++) {
                                    if ($scope.orders[i].items[j].product == products[k]._id) {
                                        $scope.orders[i].items[j].product = products[k];
                                        // total += Math.round($scope.orders[i].items[j].unitPrice * $scope.orders[i].items[j].quantity * 100) / 100
                                    }
                                }

                                var itemTax = $scope.orders[i].items[j].taxRate || 0;
                                totalPrice += (1 + itemTax / 100) * ($scope.orders[i].items[j].unitPrice * $scope.orders[i].items[j].quantity);
                                // console.log(totalPrice);
                            }

                            var deliveryCharge = $scope.orders[i].deliveryCharge || 0;
                            var deliveryChargeTax = $scope.orders[i].deliveryChargeTax || 0;;

                            totalPrice += deliveryCharge + deliveryChargeTax;
                            // console.log(totalPrice);

                            total = Math.round(totalPrice * 100) / 100;
                            $scope.totals.push(total);



                        }
                    }, function(err) {
                        console.log(err);
                    });

                }, function(err) {
                    console.log(err);
                }, startIndex, endIndex);
            });

        };

        // updateOrders(0, 10);

        $scope.setPageIndex = function(index) {
            $scope.pageIndex = index;

            updateOrders(index * 10, (index + 1) * 10);

        };

        $scope.setPageIndex(0);

        $scope.viewOrderDetail = function(order) {
            // OrderData.setSelectedOrder(order);
            //
            // // modal setup and preferences
            // var modalInstance = $uibModal.open({
            //     animation: true,
            //     templateUrl: 'viewOrderDetailModal.html',
            //     controller: 'ViewOrderDetailCtrl',
            //     size: 'lg',
            //     resolve: {}
            // });
            //
            // // called when modal is closed
            // modalInstance.result.then(
            //     function(res) {
            //
            //     },
            //     function() {});
            //
            $scope.isLoadingPDF = true;

            OrderData.fetchOrderPDF(order._id)
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
                        download: 'Order-' + order.customerName + '-' + (order.date.substring(0, 10)) + '.pdf'
                    })[0].click();

                    $scope.pdfStatus = "";
                    $scope.isLoadingPDF = false;


                });



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
                    updateOrders($scope.index * 10, ($scope.index + 1) * 10);
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
                    updateOrders($scope.index * 10, ($scope.index + 1) * 10);
                    $scope.isFilterCleared = OrderData.isFilterCleared();
                },
                function() {});

        };

        $scope.clearFilter = function() {
            OrderData.clearFilter();
            $scope.isFilterCleared = OrderData.isFilterCleared();
            updateOrders($scope.index * 10, ($scope.index + 1) * 10);
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
                templateUrl: 'editOrderModal.html',
                controller: 'EditOrderCtrl',
                size: 'lg',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(order) {
                    // add the stage to the supply chain
                    updateOrders($scope.index * 10, ($scope.index + 1) * 10);

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
                    updateOrders($scope.index * 10, ($scope.index + 1) * 10);


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


app.controller('AddOrderCtrl', ['$scope', 'FisheryService', 'countries', 'states', 'OrderData', 'ProductData', 'SupplyChainService', '$uibModal', 'ngNotify', '$state', '$uibModalInstance', '$http', 'CustomerService',
    function($scope, FisheryService, countries, states, OrderData, ProductData, SupplyChainService, $uibModal, ngNotify, $state, $uibModalInstance, $http, CustomerService) {

        $scope.invoiceNumber;
        $scope.paymentMethod;
        $scope.status;
        $scope.creditTerms;
        $scope.customerName;
        $scope.date;
        $scope.email;
        $scope.phone;
        $scope.deliveryCharge;
        $scope.items = [];

        $scope.countries = countries.COUNTRIES;
        $scope.states = states.STATES;
        console.log($scope.countries);




        var refreshCustomerData = function() {
            if (OrderData.getSelectedCustomerId()) {
                CustomerService.getCustomer(OrderData.getSelectedCustomerId()).then(function(data) {
                    $scope.customerName = data.name;
                    $scope.email = data.email;
                    $scope.phone = data.phone;
                    $scope.address = data.address;
                    $scope.city = data.city;
                    $scope.state = data.state;
                    $scope.postalCode = data.postalCode;
                    $scope.company = data.company;
                    $scope.country = data.country;
                    $scope.notes = data.notes;

                });
            };
        };


        var refreshTotal = function() {
            var totalPrice = 0;
            var deliveryCharge = $scope.deliveryCharge || 0;
            var deliveryChargeTax;
            if (deliveryCharge && $scope.deliveryChargeTaxRate) {
                deliveryChargeTax = deliveryCharge * $scope.deliveryChargeTaxRate / 100;
            } else {
                deliveryChargeTax = 0;
            };
            console.log(totalPrice);
            for (var i = 0; i < $scope.items.length; i++) {
                var itemTax = $scope.items[i].taxRate / 100 || 0;
                totalPrice += (1 + itemTax / 100) * ($scope.items[i].unitPrice * $scope.items[i].quantity);
                console.log(totalPrice);
            };
            totalPrice += deliveryCharge + deliveryChargeTax;

            $scope.total = Math.round(totalPrice * 100) / 100;
        };

        var refreshSourcedProducts = function() {
            ProductData.getSourcedProductData(function(res) {
                $scope.sourcedProducts = res;
                if (res.length > 0) $scope.selectedProduct = res[0];
            }, function(err) {
                console.log(err);
            });
        };

        var refreshFinishedProducts = function() {
            if ($scope.selectedSourcedProduct) {
                ProductData.getFinishedProductData($scope.selectedSourcedProduct._id).then(function(res) {
                    $scope.finishedProducts = res;
                });
            }

        };

        var refreshBatches = function() {
            if ($scope.selectedSourcedProduct && !$scope.selectedFinishedProduct) {
                console.log('fds');
                return SupplyChainService.fetchBlocksByProduct($scope.selectedSourcedProduct._id).then(function(res) {
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
            } else {
                return SupplyChainService.fetchBlocksByProduct($scope.selectedSourcedProduct._id, $scope.selectedFinishedProduct._id).then(function(res) {
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

        };

        refreshSourcedProducts();

        $scope.$watch('selectedSourcedProduct', function(newValue, oldValue) {
            if ($scope.selectedProduct) {
                refreshFinishedProducts();
                refreshBatches();
            }
        });

        $scope.$watch('selectedFinishedProduct', function(newValue, oldValue) {
            if ($scope.selectedProduct) {
                refreshBatches();
            }
        });

        $scope.$watch('selectedBlock', function(newValue, oldValue) {
            if ($scope.selectedBlock) {
                $scope.quantity = $scope.selectedBlock.quantity;
            }
        });

        $scope.$watch('deliveryCharge', function(newValue, oldValue) {
            refreshTotal();
        });

        $scope.$watch('deliveryChargeTaxRate', function(newValue, oldValue) {
            refreshTotal();
        });

        $scope.$watch('quantity', function() {
            if ($scope.quantity && $scope.selectedBlock) {
                if ($scope.quantity > $scope.selectedBlock.quantity) {
                    $scope.quantity = $scope.selectedBlock.quantity;

                    ngNotify.set('The quantity entered exceeds availabilty.', {
                        sticky: false,
                        button: false,
                        type: 'error',
                        duration: 1500,
                        position: 'top'
                    });

                    console.log("hello world");
                }
            }
        });


        $scope.loadCustomer = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'loadCustomerModal.html',
                controller: 'LoadCustomerCtrl',
                size: 'lg',
                resolve: {}
            });

            modalInstance.result.then(
                function() {
                    refreshCustomerData();
                },
                function() {});
        }




        var getProductData = function() {
            ProductData.getProductData(function(res) {
                $scope.products = res;
                if (res.length > 0) $scope.selectedProduct = res[0];
            }, function(err) {
                console.log(err);
            });
        };



        $scope.addItem = function() {
            $scope.items.push({
                quantity: $scope.quantity,
                product: $scope.selectedFinishedProduct || $scope.selectedSourcedProduct,
                fisheryId: FisheryService.getFisheryId(),
                block: $scope.selectedBlock,
                unitPrice: $scope.unitPrice,
                units: $scope.selectedBlock.units,
                taxRate: $scope.taxRate
            });

            delete $scope.quantity;
            delete $scope.selectedSourcedProduct;
            delete $scope.selectedFinishedProduct;
            delete $scope.selectedBlock;
            delete $scope.unitPrice;
            delete $scope.taxRate;

            getProductData();
            refreshTotal();
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
            refreshTotal();
            getProductData();
        };

        $scope.getMaxQuantity = function() {
            if ($scope.selectedBlock) {
                return $scope.selectedBlock.quantity;
            }
        };

        $scope.isAddButtonDisabled = function() {
            if ($scope.selectedProduct && $scope.selectedBlock && $scope.unitPrice && $scope.quantity) {
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
            var deliveryCharge = $scope.deliveryCharge || 0;
            var deliveryChargeTax;
            if (deliveryCharge && deliveryChargeTaxRate) {
                deliveryChargeTax = deliveryCharge * deliveryChargeTaxRate;
            } else {
                deliveryChargeTax = 0;
            };
            for (var i = 0; i < $scope.items.length; i++) {
                var itemTax = $scope.taxRate || 0;
                totalPrice += (1 + taxRate) * ($scope.items[i].unitPrice * $scope.items[i].quantity);
            };
            totalPrice += deliveryCharge + deliveryChargeTax;

            $scope.totalPrice = Math.round(totalPrice * 100) / 100;
        }


        refreshTotal();

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
                deliveryCharge: $scope.deliveryCharge,
                deliveryChargeTaxRate: $scope.deliveryChargeTaxRate,
                currency: $scope.currency,
                company: $scope.company,
                address: $scope.address,
                city: $scope.city,
                state: $scope.state,
                postalCode: $scope.postalCode,
                country: $scope.country,
                notes: $scope.notes,
                // taxRate: $scope.taxRate / 100,
                items: []
            };


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

            var formValid = true;
            //
            $scope.nameRequired = $scope.addOrderForm.name.$error.required;
            $scope.invoiceRequired = $scope.addOrderForm.invoice.$error.required;
            $scope.statusRequired = $scope.addOrderForm.status.$error.required;
            $scope.dateRequired = $scope.addOrderForm.date.$error.required;
            $scope.creditRequired = $scope.addOrderForm.credit.$error.required;
            $scope.phoneRequired = $scope.addOrderForm.phone.$error.required;



            if (!$scope.customerName || !$scope.invoiceNumber || !$scope.status || !$scope.date || !$scope.creditTerms || !$scope.phone) {
                console.log("here");
                formValid = false;
            }

            if ($scope.items.length == 0) {
                formValid = false;
                $scope.productRequired = true;
                $scope.sourcedProductRequired = true;
                $scope.batchRequired = true;
                $scope.unitPriceRequired = true;
                $scope.quantityRequired = true;

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

// app.controller('TabCtrl', ['$scope', function($scope) {
//   $scope.tabs = [{
//     title: 'One',
//     url: 'customerInfo.html'},
//     { title: 'Two',
//       url: 'paymentInfo.html'}];
//
//       $scope.currentTab = 'customerInfo.html';
//       $scope.onClickTab = function(tab){
//         $scope.currentTab =tab.url;
//       }
//
//       $scope.isActiveTab = function(tabUrl) {
//         return tabUrl == $scope.currentTab;
//       }
// }]);

app.controller('EditOrderCtrl', ['$scope', 'FisheryService', 'countries', 'states', 'SupplyChainService', 'OrderData', 'ProductData', 'AuthService', '$state', '$uibModalInstance', '$http',
    function($scope, FisheryService, countries, states, SupplyChainService, OrderData, ProductData, AuthService, $state, $uibModalInstance, $http) {

        var order = OrderData.getSelectedOrder($scope.selectedOrder);
        console.log(order);

        // $scope.dateEnd = new Date();
        // $scope.dateEnd.setHours(23);
        // $scope.dateEnd.setMinutes(59);
        // $scope.dateEnd.setSeconds(59);

        $scope.customerName = order.customerName;
        $scope.company = order.company;
        $scope.email = order.email;
        $scope.phone = order.phone;
        $scope.address = order.address;
        $scope.city = order.city;
        $scope.postalCode = order.postalCode;
        $scope.state = order.state;
        $scope.country = order.country;
        $scope.notes = order.notes;
        $scope.invoiceNumber = order.invoiceNumber;
        $scope.paymentMethod = order.paymentMethod;
        $scope.status = order.status;
        $scope.creditTerms = order.creditTerms;
        $scope.currency = order.currency;
        $scope.deliveryCharge = order.deliveryCharge;
        $scope.deliveryChargeTaxRate = order.deliveryChargeTax / order.deliveryCharge * 100;
        $scope.countries = countries.COUNTRIES;
        $scope.states = states.STATES;


        if (typeof order.date == "string") {
            $scope.date = new Date(order.date);
        }



        // tied to ok button
        $scope.ok = function() {

            var data = {
                customerName: $scope.customerName,
                company: $scope.company,
                email: $scope.email,
                phone: $scope.phone,
                address: $scope.address,
                city: $scope.city,
                postalCode: $scope.postalCode,
                state: $scope.state,
                country: $scope.country,
                notes: $scope.notes,
                invoiceNumber: $scope.invoiceNumber,
                paymentMethod: $scope.paymentMethod,
                status: $scope.status,
                creditTerms: $scope.creditTerms,
                currency: $scope.currency,
                deliveryCharge: $scope.deliveryCharge,
                deliveryChargeTaxRate: $scope.deliveryChargeTaxRate,
                date: $scope.date
            };


            OrderData.editOrder(OrderData.getSelectedOrder()._id, data).then(function(res) {
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
                !$scope.company &&
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
            if ($scope.company) filter.company = $scope.company;

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

        // $scope.selectedCustomer = 0;
        // $scope.customers = customers;
        // if ($scope.customers.length > 0) {
        //     $scope.selectedCustomer = $scope.customers[0];
        // }

        CustomerService.getCustomers().then(function(data) {
            $scope.customers = data;
            console.log(data);
            if ($scope.customers.length > 0) {
                $scope.selectedCustomer = $scope.customers[0];
            }
        });

        // tied to ok button
        $scope.ok = function() {
            // OrderData.setSelectedCustomerId($scope.customers[0]._id);
            OrderData.setSelectedCustomerId($scope.selectedCustomer._id);
            $uibModalInstance.close();
            console.log($scope.selectedCustomer);
        };


        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);
