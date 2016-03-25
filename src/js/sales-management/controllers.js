var app = angular.module('coastlineWebApp.salesManagement.controllers', ['ui.bootstrap',
    'coastlineWebApp.salesManagement.services',
    'coastlineWebApp.common.services',
    'coastlineWebApp.auth.services',
    'ui.router'
]);



app.controller('SalesManagementMenuCtrl', ['$scope', 'SupplyChainMenu', 'AuthService', '$state', '$uibModal',
    function($scope, SupplyChainMenu, AuthService, $state, $uibModal) {

        SupplyChainMenu.getSupplyChains().then(function(res) {
            console.log(res);
            $scope.supplyChains = res;
        });

        var refreshSupplyChains = function() {
            SupplyChainMenu.getSupplyChains().then(function(res) {
                console.log(res);
                $scope.supplyChains = res;
            });
        };

        refreshSupplyChains();


        $scope.setSupplyChain = function(supplyChain) {
            SupplyChainData.setSupplyChain(supplyChain);
            console.log(SupplyChainData.getSupplyChain());
            $state.go('dashboard.default.sales-management.track');
        };

        // $scope.setSupplyChain = function (supplyChain) {
        //     SupplyChainData.setSupplyChain(supplyChain);
        //     $state.go('dashboard.default.inventory.track');
        // };

    }
]);


app.controller('SellingPointsCtrl', ['$scope', 'SupplyChainData', 'SellingPointData', 'AuthService', '$state', '$uibModal',
    function($scope, SupplyChainData, SellingPointData, AuthService, $state, $uibModal) {

        $scope.selectedSellingPoint = 0;


        var refreshSellingPoints = function() {
            SellingPointData.getSellingPoints(function(res) {
                $scope.sellingPoints = res;
            }, function(err) {
                console.log(err);
            })
        };

        refreshSellingPoints();


        $scope.fisheryName = "";

        console.log(SupplyChainData.getSupplyChain());



        // add a stage - linked to the add button
        $scope.addSellingPoint = function() {
            console.log("addSellingPoint");

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addSellingPointModal.html',
                controller: 'AddSellingPointCtrl',
                size: 'md',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(sellingPoint) {
                    console.log("sellingPoint");
                    console.log(sellingPoint);
                    refreshSellingPoints();
                },
                function() {});
        };


        // add a stage - linked to the add button
        $scope.editSellingPoint = function() {
            SellingPointData.setSelectedSellingPoint($scope.sellingPoints[$scope.selectedSellingPoint]);
            console.log("editSellingPoint");

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'editSellingPointModal.html',
                controller: 'EditSellingPointCtrl',
                size: 'md',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(sellingPoint) {
                    console.log("sellingPoint");
                    console.log(sellingPoint);
                    refreshSellingPoints();
                },
                function() {});
        };

        $scope.viewBlocks = function() {
            SellingPointData.setSelectedSellingPoint($scope.sellingPoints[$scope.selectedSellingPoint]);
            console.log(SellingPointData.getSelectedSellingPoint());
            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'viewSellingPointBlocksModal.html',
                controller: 'ViewSellingPointBlocksCtrl',
                size: 'lg',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(sellingPoint) {
                    console.log("sellingPoint");
                    console.log(sellingPoint);
                    refreshSellingPoints();
                },
                function() {});
        };


    }
]);



app.controller('ViewSellingPointBlocksCtrl', ['$scope', 'InventoryData', 'BlockData', 'SupplyChainData', 'SellingPointData', '$state', '$uibModalInstance', '$uibModal',
    function($scope, InventoryData, BlockData, SupplyChainData, SellingPointData, $state, $uibModalInstance, $uibModal) {

        console.log(SupplyChainData.getSupplyChainId());
        var sellingPoint = SellingPointData.getSelectedSellingPoint();
        $scope.stageName = sellingPoint.name;


        SellingPointData.getBlocks(SupplyChainData.getSupplyChainId(), sellingPoint._id, function(res) {
            console.log(res);
            $scope.blocks = res;
            $scope.selectedBlock = 0;
        }, function(err) {
            console.log(err);
        })

        $scope.blocks = sellingPoint.blocks;

        $scope.moveBlock = function() {

            BlockData.setSelectedBlock($scope.blocks[$scope.selectedBlock]);

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'moveBlockModal.html',
                controller: 'MoveBlockFromSellingPointCtrl',
                size: 'md',
                resolve: {}
            });


            // called when modal is closed
            modalInstance.result.then(function(block) {
                // add the stage to the supply chain
                InventoryData.getBlocks("gjhkj", SellingPointData.getSelectedSellingPointId(), function(res) {
                    console.log(res);
                    $scope.blocks = res;
                    // $scope.selectedBlock = $scope.blockc0;
                }, function(err) {
                    console.log(err);
                });

                console.log("then");
            });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


app.controller('AddSellingPointCtrl', ['$scope', 'SupplyChainData', 'SellingPointData', '$state', '$uibModalInstance', '$uibModal',
    function($scope, SupplyChainData, SellingPointData, $state, $uibModalInstance, $uibModal) {


        $scope.ok = function() {

            var sellingTargets = []

            // for ecommerce sellingTarget
            if ($scope.isEcommerceStage) {
                sellingTargets.push('ecommerce')
            };


            var data = {
                name: $scope.name,
                isSellingPoint: true,
                sellingTargets: sellingTargets
            };

            SellingPointData.addSellingPoint(data, function(res) {
                console.log(res);
                $uibModalInstance.close(res);
            }, function(err) {
                $uibModalInstance.dismiss(err);
            })

        };


        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


        $scope.getBlocks = function() {

        };

    }
]);

app.controller('EditSellingPointCtrl', ['$scope', 'SupplyChainData', 'SellingPointData', '$state', '$uibModalInstance', '$uibModal',
    function($scope, SupplyChainData, SellingPointData, $state, $uibModalInstance, $uibModal) {

        $scope.sellingPoint = SellingPointData.getSelectedSellingPoint();

        for (var i = 0; i < $scope.sellingPoint.sellingTargets.length; i++) {
            if ($scope.sellingPoint.sellingTargets[i] == 'ecommerce') {
                $scope.isEcommerceStage = true;
            }
        }



        $scope.ok = function() {


            var sellingTargets = []

            // for ecommerce sellingTarget
            if ($scope.isEcommerceStage) {
                $scope.sellingPoint.sellingTargets = ['ecommerce'];
            } else {
                $scope.sellingPoint.sellingTargets = [];
            }




            console.log($scope.sellingPoint._id);

            SellingPointData.updateSellingPoint($scope.sellingPoint._id, $scope.sellingPoint, function(res) {
                console.log(res);
                $uibModalInstance.dismiss(res);
            }, function(err) {
                $uibModalInstance.dismiss(err);
            })

        };


        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


        $scope.getBlocks = function() {

        };

    }
]);

app.controller('MoveBlockFromSellingPointCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'BlockData', 'SupplyChainMenu', 'SupplyChainData', 'SellingPointData', '$state', '$uibModalInstance',
    function($scope, TrackInventoryManager, InventoryData, BlockData, SupplyChainMenu, SupplyChainData, SellingPointData, $state, $uibModalInstance) {

        $scope.fromStage = SellingPointData.getSelectedSellingPoint();

        SupplyChainMenu.getSupplyChains().then(function(res) {
            $scope.supplyChains = res;
            if ($scope.supplyChains.length > 0) {
                $scope.selectedSupplyChain = $scope.supplyChains[0];
                if ($scope.selectedSupplyChain.stages.length > 0) {
                    $scope.toStage = $scope.selectedSupplyChain.stages[0];
                }
            }
        });


        $scope.block1 = BlockData.getSelectedBlock();
        console.log(BlockData.getSelectedBlock());
        $scope.quantity = $scope.block1.quantity;

        $scope.$watch('quantity', function () {
            if ($scope.quantity > $scope.block1.quantity) {
                $scope.quantity = $scope.block1.quantity;
                // TODO - insert cgNotify popup or something to tell them not to exceed the batch quantity
            }
        });

        $scope.getRemainingQuantity = function() {
            if ($scope.block1.quantity - $scope.quantity < 0) {
                return 0;
            } else {
                return ($scope.block1.quantity - $scope.quantity);
            }
        },

        $scope.ok = function() {
            console.log("moveBlock ok()");

            if ($scope.quantity == $scope.block1.quantity) {
                var data = {
                    productId: $scope.block1.productType._id,
                    stageId: $scope.toStage.self,
                    quantity: $scope.quantity,
                    units: $scope.units
                };

                console.log($scope.toStage.self);

                InventoryData.moveBlock(SupplyChainData.getSupplyChainId(), $scope.block1._id, data, function(res) {
                    console.log(res);
                    $uibModalInstance.close(res);
                }, function(err) {
                    $uibModalInstance.close(err);
                });
            } else {
                console.log($scope.selectedProduct);

                var block2 = {
                    quantity: $scope.quantity,
                    units: $scope.block1.units,
                    stage: $scope.toStage.self,
                    productType: $scope.block1.productType
                };

                $scope.block1.quantity = $scope.block1.quantity - block2.quantity;

                if ($scope.block1.quantity < 0) {
                    $scope.block1.quantity = 0
                };

                var data = {
                    block1: $scope.block1,
                    block2: block2
                };


                InventoryData.splitBlock(SupplyChainData.getSupplyChainId(), $scope.block1._id, data, function(res) {
                    console.log(res);
                    $uibModalInstance.close(res);
                }, function(err) {
                    $uibModalInstance.close(err);
                });

            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }
]);
