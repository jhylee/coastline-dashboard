var app = angular.module('coastlineWebApp.inventory.controllers', ['ui.bootstrap',
    'coastlineWebApp.dashboard.services',
    'coastlineWebApp.inventory.services',
    'coastlineWebApp.products.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);





app.controller('TrackInventoryMenuCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainService', 'AuthService', '$state', '$uibModal',
    function($scope, TrackInventoryManager, InventoryData, SupplyChainService, AuthService, $state, $uibModal) {

        var getSupplyChains = function() {
            TrackInventoryManager.getSupplyChains(function(res) {
                console.log(res);
                $scope.supplyChains = res;
            }, function(error) {
                console.log(error);
            })
        };

        getSupplyChains();

        $scope.setSupplyChain = function(supplyChain) {
            TrackInventoryManager.setSupplyChain(supplyChain);
            SupplyChainService.setSupplyChain(supplyChain._id);
            $state.go('dashboard.default.inventory.track');
        };

    }
]);


app.controller('TrackInventoryInterfaceCtrl', ['$scope', 'TrackInventoryManager', 'AuthService', '$state', '$uibModal',
    function($scope, TrackInventoryManager, AuthService, $state, $uibModal) {

        //$scope.data = TrackInventoryManager.getDisplayData();

        $scope.setSupplyChain = function(supplyChain) {
            TrackInventoryManager.setSupplyChain(supplyChain);
            $state.go('dashboard.default.inventory.track');


        };



    }
]);




app.controller('InventoryCtrl', ['$scope', '$rootScope', 'StageService', 'InventoryData', 'SupplyChainService', '$state', '$uibModal',
    function($scope, $rootScope, StageService, InventoryData, SupplyChainService, $state, $uibModal) {

        //$scope.data = TrackInventoryManager.getDisplayData();

        $scope.viewBlocks = function() {
            console.log('$scope.viewBlocks');
            $rootScope.$broadcast("refreshStageEdit");


            var stageId = SupplyChainService.getSelectedStageId();
            console.log(stageId);
            // SupplyChainService.setSelectedStageId(stageId);
            var supplyChainId = SupplyChainService.getSupplyChain()._id;
            console.log(supplyChainId);

            // modal setup and preferences
            var modalInstance1 = $uibModal.open({
                animation: true,
                templateUrl: 'viewBlocksModal.html',
                controller: 'ViewBlocksCtrl',
                size: 'lg',
                resolve: {}
            });

            console.log(modalInstance1);

            // called when modal is closed
            modalInstance1.result.then(
                // OK callback
                function(block) {
                    // add the stage to the supply chain
                    console.log("then");


                    // CANCEL callback
                },
                function() {});

        };



        $scope.saveSupplyChain = function(supplyChain) {
            console.log('$scope.saveSupplyChain');
        };

    }
]);

app.controller('ViewBlocksCtrl', ['$scope', '$rootScope', 'StageService', 'TrackInventoryManager', 'InventoryData', 'BlockService', 'SupplyChainService', '$state', '$uibModalInstance', '$uibModal',
    function($scope, $rootScope, StageService, TrackInventoryManager, InventoryData, BlockService, SupplyChainService, $state, $uibModalInstance, $uibModal) {

        InventoryData.getBlocks(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedStageId(), function(res) {
            console.log(res);
            $scope.blocks = res;
            $scope.selectedBlock = 0;
        }, function(err) {
            console.log(err);
        })

        SupplyChainService.fetchSelectedStage()
            .then(function(res) {
                $scope.stageName = res.name;
            });

        $rootScope.$on("refreshStageEdit", function() {
            StageService.fetchSelectedStage()
                .then(function(res) {
                    $scope.stageName = res.name;
                });

        });


        $scope.ok = function() {
            $uibModalInstance.dismiss('ok');
        };

        $scope.printSelected = function() {
            console.log($scope.blocks[$scope.selectedBlock]);
        };

        $scope.splitBlock = function() {
            SupplyChainService.setSelectedBlock($scope.blocks[$scope.selectedBlock]);

            console.log($scope.blocks[$scope.selectedBlock]);

            // modal setup and preferences
            var modalInstance1 = $uibModal.open({
                animation: true,
                templateUrl: 'splitBlockModal.html',
                controller: 'SplitBlockCtrl',
                size: 'lg',
                resolve: {}
            });

            console.log(modalInstance1);

            // called when modal is closed
            modalInstance1.result.then(function(block) {
                // add the stage to the supply chain
                console.log("then");

                // add the stage to the supply chain
                InventoryData.getBlocks(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedStageId(), function(res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function(err) {
                    console.log(err);
                });
            });
        }

        $scope.addBlock = function() {

            console.log('addBlock');


            // modal setup and preferences
            var modalInstance1 = $uibModal.open({
                animation: true,
                templateUrl: 'addBlockModal.html',
                controller: 'AddBlockCtrl',
                size: 'lg',
                resolve: {}
            });

            console.log(modalInstance1);

            // called when modal is closed
            modalInstance1.result.then(function(block) {
                // add the stage to the supply chain
                console.log("then");

                // add the stage to the supply chain
                InventoryData.getBlocks(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedStageId(), function(res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function(err) {
                    console.log(err);
                });

            }, function() {});

        };

        $scope.editBlock = function() {

            console.log('editBlock');
            SupplyChainService.setSelectedBlock($scope.blocks[$scope.selectedBlock]);



            // modal setup and preferences
            var modalInstance1 = $uibModal.open({
                animation: true,
                templateUrl: 'editBlockModal.html',
                controller: 'EditBlockCtrl',
                size: 'md',
                resolve: {}
            });

            console.log(modalInstance1);

            // called when modal is closed
            modalInstance1.result.then(function(block) {
                // add the stage to the supply chain
                console.log("then");

                // add the stage to the supply chain
                InventoryData.getBlocks(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedStageId(), function(res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function(err) {
                    console.log(err);
                });

            }, function() {});

        };

        $scope.moveBlock = function() {


            SupplyChainService.setSelectedBlockId($scope.blocks[$scope.selectedBlock]._id);
            console.log(SupplyChainService.getSelectedBlock());

            console.log(modalInstance);

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'moveBlockModal.html',
                controller: 'MoveBlockCtrl',
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
                InventoryData.getBlocks(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedStageId(), function(res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function(err) {
                    console.log(err);
                });

                console.log("then");
            });
        };

        $scope.moveBlockToSales = function() {


            SupplyChainService.setSelectedBlockId($scope.blocks[$scope.selectedBlock]._id);
            // console.log(SupplyChainService.getSelectedBlock());

            console.log(modalInstance);

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'moveBlockToSalesModal.html',
                controller: 'MoveBlockToSalesCtrl',
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
                InventoryData.getBlocks(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedStageId(), function(res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function(err) {
                    console.log(err);
                });

                console.log("then");
            });
        };

        $scope.deleteBlock = function() {


            SupplyChainService.setSelectedBlock($scope.blocks[$scope.selectedBlock]);
            console.log(SupplyChainService.getSelectedBlock());

            console.log(modalInstance);

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteBlockModal.html',
                controller: 'DeleteBlockCtrl',
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
                InventoryData.getBlocks(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedStageId(), function(res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function(err) {
                    console.log(err);
                });

                console.log("then");
            });
        }


        ////////////////////////////////////////
        //DUMMY VIEW DETAILS FUNCTION//
        ///////////////////////////////////////
        $scope.viewDetails = function() {

            SupplyChainService.setSelectedBlock($scope.blocks[$scope.selectedBlock]);
            console.log(SupplyChainService.getSelectedBlock());



            BlockService.setSelectedBlockId($scope.blocks[$scope.selectedBlock]._id);

            console.log(modalInstance);

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
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function(err) {
                    console.log(err);
                });

                console.log("then");
            });
        }

    }
]);


app.controller('SplitBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'ProductData', 'SupplyChainService', '$state', '$uibModalInstance',
    function($scope, TrackInventoryManager, InventoryData, ProductData, SupplyChainService, $state, $uibModalInstance) {

        // $scope = SupplyChainService.getSelectedBlock();
        $scope.quantity = 0;



        ProductData.getProductData(function(res) {
            $scope.products = res;
        }, function(err) {
            console.log(err);
        });

        $scope.block1 = SupplyChainService.getSelectedBlock();
        console.log("block1");
        console.log($scope.block1);

        $scope.getOriginalBlockQuantity = function() {
            if ($scope.block1.quantity - $scope.quantity < 0) {
                return 0;
            } else {
                return ($scope.block1.quantity - $scope.quantity);
            }
        }


        $scope.ok = function() {

            console.log($scope.selectedProduct);

            var block2 = {
                quantity: $scope.quantity,
                units: $scope.block1.units,
                stage: $scope.block1.stage,
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


            InventoryData.splitBlock(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedBlock()._id, data, function(res) {
                console.log(res);
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

app.controller('MoveBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainService', 'ngNotify', '$state', '$uibModalInstance',
    function($scope, TrackInventoryManager, InventoryData, SupplyChainService, ngNotify, $state, $uibModalInstance) {

        // $scope.block1 = SupplyChainService.getSelectedBlock();
        // $scope.quantity = $scope.block1.quantity;

        $scope.$watch('quantity', function() {
            if ($scope.quantity > $scope.block1.quantity) {
                $scope.quantity = $scope.block1.quantity;

                ngNotify.set('Quantity entered exceeds availability', {
                    sticky: false,
                    button: true,
                    type: 'error',
                    duration: 900,
                    position: 'top'
                })
              }
        });

        SupplyChainService.fetchSelectedStage()
            .then(function (res) {
                $scope.fromStage = res;
            });

        SupplyChainService.fetchSelectedBlock()
            .then(function (data) {
                $scope.block1 = data;
                $scope.quantity = $scope.block1.quantity;
                selectedBlock = data;
            });

        $scope.getRemainingQuantity = function() {
            if ($scope.block1.quantity - $scope.quantity < 0) {
                return 0;
            } else {
                return ($scope.block1.quantity - $scope.quantity);
            }
        }

        $scope.stages = SupplyChainService.getStages();
        var selectedBlock = SupplyChainService.getSelectedBlock();
        console.log(selectedBlock);
        var supplyChainId = SupplyChainService.getSupplyChainId();

        $scope.ok = function() {
            console.log("moveBlock ok()");

            if ($scope.quantity == $scope.block1.quantity) {
                var data = {
                    productId: selectedBlock.productType._id,
                    stageId: $scope.toStage.self,
                    quantity: $scope.quantity,
                    units: $scope.units,
                    // TODO
                    // jobNum: $scope.block1.jobNum,
                    processType: $scope.processType
                };

                console.log($scope.toStage.self);

                InventoryData.moveBlock(SupplyChainService.getSupplyChainId(), selectedBlock._id, data, function(res) {
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
                    productType: $scope.block1.productType,
                    // TODO
                    // jobNum: $scope.block2.jobNum,
                };

                $scope.block1.quantity = $scope.block1.quantity - block2.quantity;

                if ($scope.block1.quantity < 0) {
                    $scope.block1.quantity = 0
                };

                var data = {
                    block1: $scope.block1,
                    block2: block2,
                    processType: $scope.processType
                };


                InventoryData.splitBlock(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedBlock()._id, data, function(res) {
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

app.controller('ViewDetailsCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'BlockService', 'SupplyChainService', 'StageService', '$state', '$uibModalInstance',
    function($scope, TrackInventoryManager, InventoryData, BlockService, SupplyChainService, StageService, $state, $uibModalInstance) {

        var blockId = BlockService.getSelectedBlockId();

        var block;
        var history;

        SupplyChainService.fetchSelectedStage()
            .then(function (res) {
                $scope.stage = res;
                $scope.stageName = res.name;
            });


        BlockService.fetchBlock(blockId)
            .then(function(res) {
                $scope.block = res;
                console.log($scope.block);
            });

        BlockService.fetchSelectedBlockHistory()
            .then(function(res) {
                console.log(res);
                $scope.history = res;
                $scope.stageNames = new Array($scope.history.events.length);
                $scope.quantities = new Array($scope.history.events.length);
                $scope.units = new Array($scope.history.events.length);

                for (i = 0; i < $scope.stageNames.length; i++) {
                    if ($scope.history.events[i].operation == "create") {
                        $scope.quantities[i] = $scope.history.events[i].createDetails.block.quantity;
                        $scope.units[i] = $scope.history.events[i].createDetails.block.units;

                    } else if ($scope.history.events[i].operation == "move") {
                        $scope.quantities[i] = $scope.history.events[i].moveDetails.after.quantity;
                        $scope.units[i] = $scope.history.events[i].moveDetails.after.units;
                    } else if ($scope.history.events[i].operation == "edit") {
                        $scope.quantities[i] = $scope.history.events[i].editDetails.after.quantity;
                        $scope.units[i] = $scope.history.events[i].editDetails.after.units;
                    } else {

                    }
                }

            });

        $scope.getStageName = function(i) {
            // return $scope.stageNames[index];
            if ($scope.history.events[i].operation == "create") {
                return $scope.history.events[i].createDetails.block.stage.name;
            } else if ($scope.history.events[i].operation == "move") {
                return $scope.history.events[i].moveDetails.after.stage.name;
            } else if ($scope.history.events[i].operation == "edit") {
                return $scope.block.stage.name;

            } else {

            }
        };

        $scope.getDate = function(i) {
            // return $scope.stageNames[index];
            if ($scope.history.events[i].operation == "create") {
                return $scope.history.events[i].date.substring(0, 10);
            } else if ($scope.history.events[i].operation == "move") {
                return $scope.history.events[i].date.substring(0, 10);
            } else if ($scope.history.events[i].operation == "edit") {
                return $scope.history.events[i].date.substring(0, 10);
            } else if ($scope.history.events[i].operation == "split") {
                return $scope.history.events[i].date.substring(0, 10);
            } else {

            }
        };


        $scope.ok = function() {
            $uibModalInstance.close('ok');
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }
]);

app.controller('MoveBlockToSalesCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainService', 'ngNotify', '$state', '$uibModalInstance',
    function($scope, TrackInventoryManager, InventoryData, SupplyChainService, ngNotify, $state, $uibModalInstance) {

        $scope.$watch('quantity', function() {
            if ($scope.quantity > $scope.block1.quantity) {
                $scope.quantity = $scope.block1.quantity;

                ngNotify.set('Quantity entered exceeds availability', {
                    sticky: false,
                    button: true,
                    type: 'error',
                    duration: 900,
                    position: 'top'
                })
              }
        });

        SupplyChainService.fetchSelectedStage()
            .then(function (res) {
                $scope.fromStage = res;
            });



        // $scope.block1 = SupplyChainService.getSelectedBlock();
        // $scope.quantity = $scope.block1.quantity;
        var selectedBlock;


        SupplyChainService.fetchSelectedBlock()
            .then(function (data) {
                $scope.block1 = data;
                $scope.quantity = $scope.block1.quantity;
                selectedBlock = data;
            });

        $scope.getRemainingQuantity = function() {
            if ($scope.block1.quantity - $scope.quantity < 0) {
                return 0;
            } else {
                return ($scope.block1.quantity - $scope.quantity);
            }
        }


        InventoryData.getSellingPoints(function(res) {
            $scope.stages = res;
            console.log(res);
        }, function(err) {
            console.log(err);
        });

        // var selectedBlock = SupplyChainService.getSelectedBlock();
        // console.log(selectedBlock);
        var supplyChainId = SupplyChainService.getSupplyChainId();

        $scope.ok = function() {
            console.log($scope.toStage);


            if ($scope.quantity == $scope.block1.quantity) {
                var data = {
                    productId: selectedBlock.productType._id,
                    stageId: $scope.toStage,
                    quantity: $scope.quantity,
                    units: $scope.units,
                    // TODO
                    // jobNum: $scope.block1.jobNum,
                    processType: $scope.processType
                };

                console.log($scope.toStage);

                InventoryData.moveBlock(SupplyChainService.getSupplyChainId(), selectedBlock._id, data, function(res) {
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
                    stage: $scope.toStage._id,
                    productType: $scope.block1.productType,
                    // TODO
                    // jobNum: $scope.block2.jobNum,
                    processType: $scope.processType
                };

                $scope.block1.quantity = $scope.block1.quantity - block2.quantity;

                if ($scope.block1.quantity < 0) {
                    $scope.block1.quantity = 0
                };

                var data = {
                    block1: $scope.block1,
                    block2: block2
                };


                InventoryData.splitBlock(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedBlock()._id, data, function(res) {
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

app.controller('DeleteBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainService', '$state', '$uibModalInstance',
    function($scope, TrackInventoryManager, InventoryData, SupplyChainService, $state, $uibModalInstance) {

        $scope.fromStage = SupplyChainService.getSelectedStage();

        $scope.stages = SupplyChainService.getStages();
        var selectedBlock = SupplyChainService.getSelectedBlock();
        console.log(selectedBlock);
        var supplyChainId = SupplyChainService.getSupplyChainId();

        $scope.ok = function() {
            console.log("deleteBlock ok()");

            InventoryData.deleteBlock(SupplyChainService.getSupplyChainId(), selectedBlock._id, function(res) {
                console.log(res);
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




app.controller('AddBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'ProductData', 'SupplyChainService', '$state', '$uibModalInstance',
    function($scope, TrackInventoryManager, InventoryData, ProductData, SupplyChainService, $state, $uibModalInstance) {


        ProductData.getProductData(function(res) {
            $scope.products = res;
        }, function(err) {
            console.log(err);
        });


        $scope.ok = function() {

            console.log($scope.selectedProduct);

            var data = {
                productId: $scope.selectedProduct._id,
                stageId: SupplyChainService.getSelectedStageId(),
                quantity: $scope.quantity,
                units: $scope.units,
                catchDate: $scope.catchDate,
                catchRegion: $scope.catchRegion,
                caughtBy: $scope.caughtBy,
                catchType: $scope.catchType,
                waterDepth: $scope.waterDepth,
                jobNumber: $scope.jobNumber
            };


            InventoryData.addBlock(SupplyChainService.getSupplyChainId(), data, function(res) {
                console.log(res);
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

app.controller('EditBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'ProductData', 'SupplyChainService', '$state', '$uibModalInstance',
    function($scope, TrackInventoryManager, InventoryData, ProductData, SupplyChainService, $state, $uibModalInstance) {





        var block = SupplyChainService.getSelectedBlock();
        // $scope.selectedProduct = block.productType;
        console.log(block);
        $scope.quantity = block.quantity;
        $scope.units = block.units;

        var findCurrentProduct = function(id) {
            for (var i = 0; i < $scope.products.length; i++) {
                if ($scope.products[i]._id == id) {
                    console.log("match");
                    $scope.selectedProduct = $scope.products[i];
                }
            }
        }



        ProductData.getProductData(function(res) {
            $scope.products = res;
            findCurrentProduct(block.productType._id);
            console.log(res);
        }, function(err) {
            console.log(err);
        });



        $scope.ok = function() {

            console.log($scope.selectedProduct);

            var data = {
                productId: $scope.selectedProduct._id,
                stageId: SupplyChainService.getSelectedStageId(),
                quantity: $scope.quantity,
                units: $scope.units
            };


            InventoryData.updateBlock(SupplyChainService.getSupplyChainId(), SupplyChainService.getSelectedBlock()._id, data, function(res) {
                console.log(res);
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
