var app = angular.module('coastlineWebApp.salesManagement.controllers', ['ui.bootstrap',
    'coastlineWebApp.salesManagement.services',
    'coastlineWebApp.common.services',
    'coastlineWebApp.auth.services',
    'ui.router'
]);



app.controller('SalesManagementMenuCtrl', ['$scope', 'SupplyChainMenu', 'AuthService', '$state', '$uibModal',
    function($scope, SupplyChainMenu, AuthService, $state, $uibModal) {

        SupplyChainMenu.getSupplyChains().then(function(res) {
            $scope.supplyChains = res;
        });

        var refreshSupplyChains = function() {
            SupplyChainMenu.getSupplyChains().then(function(res) {
                $scope.supplyChains = res;
            });
        };

        refreshSupplyChains();


        $scope.setSupplyChain = function(supplyChain) {
            SupplyChainService.setSupplyChain(supplyChain._id);
            $state.go('dashboard.default.sales-management.track');
        };

    }
]);


app.controller('SellingPointsCtrl', ['$scope', 'SupplyChainService', 'SellingPointData', 'AuthService', '$state', '$uibModal',
    function($scope, SupplyChainService, SellingPointData, AuthService, $state, $uibModal) {

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




        // add a stage - linked to the add button
        $scope.addSellingPoint = function() {

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
                    refreshSellingPoints();
                },
                function() {});
        };


        // add a stage - linked to the add button
        $scope.editSellingPoint = function() {
            SellingPointData.setSelectedSellingPoint($scope.sellingPoints[$scope.selectedSellingPoint]);

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
                    refreshSellingPoints();
                },
                function() {});
        };

        $scope.viewBlocks = function() {
            SellingPointData.setSelectedSellingPoint($scope.sellingPoints[$scope.selectedSellingPoint]);
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
                    refreshSellingPoints();
                },
                function() {});
        };


    }
]);



app.controller('ViewSellingPointBlocksCtrl', ['$scope', 'InventoryData', 'SupplyChainService', 'SellingPointData', '$state', '$uibModalInstance', '$uibModal',
    function($scope, InventoryData, SupplyChainService, SellingPointData, $state, $uibModalInstance, $uibModal) {

        var sellingPoint = SellingPointData.getSelectedSellingPoint();
        $scope.stageName = sellingPoint.name;


        SellingPointData.getBlocks(SupplyChainService.getSupplyChainId(), sellingPoint._id, function(res) {
            $scope.blocks = res;
            $scope.selectedBlock = 0;
        }, function(err) {
            console.log(err);
        })

        $scope.blocks = sellingPoint.blocks;

        $scope.deleteBlock = function() {


            SupplyChainService.setSelectedBlockId($scope.blocks[$scope.selectedBlock]._id);

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteBlockModal.html',
                controller: 'DeleteBlockFromSellingPointCtrl',
                size: 'md',
                resolve: {}
            });

            // var blocksToMove = [];

            // for (var i = 0; i < $scope.blocks.length; i ++) {
            //     if ($scope.selectedBlocks[i]) {
            //         blocksToMove.push($scope.blocks[i]);
            //     }
            // };



            // called when modal is closed
            modalInstance.result.then(function(block) {
                // add the stage to the supply chain
                InventoryData.getBlocks("gjhkj", SellingPointData.getSelectedSellingPointId(), function(res) {
                    $scope.blocks = res;
                    // $scope.selectedBlock = $scope.blockc0;
                }, function(err) {
                    console.log(err);
                });


            });
        }

        $scope.viewDetails = function() {

            SupplyChainService.setSelectedBlockId($scope.blocks[$scope.selectedBlock]._id);

            // BlockService.setSelectedBlockId($scope.blocks[$scope.selectedBlock]._id);


            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'viewDetailsModal.html',
                controller: 'ViewDetailsCtrl',
                size: 'lg',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(function(block) {
                // add the stage to the supply chain
                InventoryData.getBlocks(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedStageId(), function(res) {
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function(err) {
                    console.log(err);
                });

            });
        }

        $scope.moveBlock = function() {

            SupplyChainService.setSelectedBlockId($scope.blocks[$scope.selectedBlock]._id);

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
                    $scope.blocks = res;
                    // $scope.selectedBlock = $scope.blockc0;
                }, function(err) {
                    console.log(err);
                });

            });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


app.controller('AddSellingPointCtrl', ['$scope', 'SupplyChainService', 'SellingPointData', '$state', '$uibModalInstance', '$uibModal',
    function($scope, SupplyChainService, SellingPointData, $state, $uibModalInstance, $uibModal) {


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

app.controller('DeleteBlockFromSellingPointCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainService', '$state', '$uibModalInstance',
    function($scope, TrackInventoryManager, InventoryData, SupplyChainService, $state, $uibModalInstance) {

        var selectedBlockId = SupplyChainService.getSelectedBlockId();
        // $scope.fromStage = SellingPointData.getSelectedSellingPoint();


        $scope.ok = function() {

            InventoryData.deleteBlock(SupplyChainService.getSupplyChainId(), selectedBlockId, function(res) {
                $uibModalInstance.close(res);
            }, function(err) {
                $uibModalInstance.close(err);
            });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }
]);

app.controller('EditSellingPointCtrl', ['$scope', 'SupplyChainService', 'SellingPointData', '$state', '$uibModalInstance', '$uibModal',
    function($scope, SupplyChainService, SellingPointData, $state, $uibModalInstance, $uibModal) {

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





            SellingPointData.updateSellingPoint($scope.sellingPoint._id, $scope.sellingPoint, function(res) {
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

app.controller('MoveBlockFromSellingPointCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainService', 'SellingPointData', '$state', '$uibModalInstance',
    function($scope, TrackInventoryManager, InventoryData, SupplyChainService, SellingPointData, $state, $uibModalInstance) {

        $scope.fromStage = SellingPointData.getSelectedSellingPoint();

        SupplyChainService.fetchSupplyChains().then(function(res) {
            $scope.supplyChains = res;
            if ($scope.supplyChains.length > 0) {
                $scope.selectedSupplyChain = $scope.supplyChains[0];
                if ($scope.selectedSupplyChain.stages.length > 0) {
                    $scope.toStage = $scope.selectedSupplyChain.stages[0];
                }
            }
        });

        SupplyChainService.fetchSelectedBlock().then(function (res) {
            $scope.block1 = res;
            $scope.quantity = $scope.block1.quantity;
        });


        // $scope.block1 = BlockService.getSelectedBlock();

        $scope.$watch('quantity', function() {
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

                if ($scope.quantity == $scope.block1.quantity) {
                    var data = {
                        productId: $scope.block1.productType._id,
                        stageId: $scope.toStage.self,
                        quantity: $scope.quantity,
                        units: $scope.units
                    };


                    InventoryData.moveBlock(SupplyChainService.getSupplyChainId(), $scope.block1._id, data, function(res) {
                        $uibModalInstance.close(res);
                    }, function(err) {
                        $uibModalInstance.close(err);
                    });
                } else {

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


                    InventoryData.splitBlock(SupplyChainService.getSupplyChainId(), $scope.block1._id, data, function(res) {
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
