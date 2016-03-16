var app = angular.module('coastlineWebApp.inventory.controllers', ['ui.bootstrap',
  'coastlineWebApp.dashboard.services',
  'coastlineWebApp.inventory.services',
  'coastlineWebApp.products.services',
  'coastlineWebApp.common.services',
  'ui.router']);





app.controller('TrackInventoryMenuCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainData', 'AuthService', '$state', '$uibModal',
    function ($scope, TrackInventoryManager, InventoryData, SupplyChainData, AuthService, $state, $uibModal) {

        var getSupplyChains = function () {
            TrackInventoryManager.getSupplyChains(function (res) {
                console.log(res);
                $scope.supplyChains = res;
            }, function (error) {
                console.log(error);
            })
        };

        getSupplyChains();

        $scope.setSupplyChain = function (supplyChain) {
            TrackInventoryManager.setSupplyChain(supplyChain);
            SupplyChainData.setSupplyChain(supplyChain);
            $state.go('dashboard.default.inventory.track');
        };

}]);


app.controller('TrackInventoryInterfaceCtrl', ['$scope', 'TrackInventoryManager', 'AuthService', '$state', '$uibModal',
    function ($scope, TrackInventoryManager, AuthService, $state, $uibModal) {

        //$scope.data = TrackInventoryManager.getDisplayData();

        $scope.setSupplyChain = function (supplyChain) {
            TrackInventoryManager.setSupplyChain(supplyChain);
            $state.go('dashboard.default.inventory.track');


        };



}]);




app.controller('InventoryCtrl', ['$scope', '$rootScope', 'StageData', 'InventoryData', 'SupplyChainData', '$state', '$uibModal',
    function ($scope, $rootScope, StageData, InventoryData, SupplyChainData, $state, $uibModal) {

        //$scope.data = TrackInventoryManager.getDisplayData();

        $scope.viewBlocks = function () {
            console.log('$scope.viewBlocks');
            $rootScope.$broadcast("refreshStageEdit");


            var stageId = SupplyChainData.getSelectedStageId();
            StageData.setSelectedStageId(stageId);
            var supplyChainId = SupplyChainData.getSupplyChain()._id;
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
                function (block) {
                    // add the stage to the supply chain
                    console.log("then");


                // CANCEL callback
            }, function () {});

        };



        $scope.saveSupplyChain = function (supplyChain) {
            console.log('$scope.saveSupplyChain');
        };

}]);

app.controller('ViewBlocksCtrl', ['$scope', '$rootScope', 'StageData', 'TrackInventoryManager', 'InventoryData', 'BlockData', 'SupplyChainData', '$state', '$uibModalInstance', '$uibModal',
    function ($scope, $rootScope, StageData, TrackInventoryManager, InventoryData, BlockData, SupplyChainData, $state, $uibModalInstance, $uibModal) {

        InventoryData.getBlocks(SupplyChainData.getSupplyChainId(), SupplyChainData.getSelectedStageId(), function (res) {
            console.log(res);
            $scope.blocks = res;
            $scope.selectedBlock = 0;
        }, function (err) {
            console.log(err);
        })

        StageData.fetchSelectedStage()
            .then(function (res) {
                $scope.stageName = res.name;
            });

        $rootScope.$on("refreshStageEdit", function () {
            StageData.fetchSelectedStage()
                .then(function (res) {
                    $scope.stageName = res.name;
                });

        });


        $scope.ok = function () {
            $uibModalInstance.dismiss('ok');
        };

        $scope.printSelected = function () {
            console.log($scope.blocks[$scope.selectedBlock]);
        };

        $scope.addBlock = function () {

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
            modalInstance1.result.then(function (block) {
                // add the stage to the supply chain
                console.log("then");

                // add the stage to the supply chain
                InventoryData.getBlocks(SupplyChainData.getSupplyChainId(), SupplyChainData.getSelectedStageId(), function (res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function (err) {
                    console.log(err);
                });

            }, function () {});

        };

        $scope.editBlock = function () {

            console.log('editBlock');
            SupplyChainData.setSelectedBlock($scope.blocks[$scope.selectedBlock]);



            // modal setup and preferences
            var modalInstance1 = $uibModal.open({
                animation: true,
                templateUrl: 'editBlockModal.html',
                controller: 'EditBlockCtrl',
                size: 'lg',
                resolve: {}
            });

            console.log(modalInstance1);

            // called when modal is closed
            modalInstance1.result.then(function (block) {
                // add the stage to the supply chain
                console.log("then");

                // add the stage to the supply chain
                InventoryData.getBlocks(SupplyChainData.getSupplyChainId(), SupplyChainData.getSelectedStageId(), function (res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function (err) {
                    console.log(err);
                });

            }, function () {});

        };

        $scope.moveBlock = function () {


            SupplyChainData.setSelectedBlock($scope.blocks[$scope.selectedBlock]);
            console.log(SupplyChainData.getSelectedBlock());

            console.log(modalInstance);

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'moveBlockModal.html',
                controller: 'MoveBlockCtrl',
                size: 'lg',
                resolve: {}
            });

            // var blocksToMove = [];

            // for (var i = 0; i < $scope.blocks.length; i ++) {
            //     if ($scope.selectedBlocks[i]) {
            //         blocksToMove.push($scope.blocks[i]);
            //     }
            // };



            // called when modal is closed
            modalInstance.result.then(function (block) {
                // add the stage to the supply chain
                InventoryData.getBlocks(SupplyChainData.getSupplyChainId(), SupplyChainData.getSelectedStageId(), function (res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function (err) {
                    console.log(err);
                });

                console.log("then");
            });
        };

        $scope.moveBlockToSales = function () {


            SupplyChainData.setSelectedBlock($scope.blocks[$scope.selectedBlock]);
            console.log(SupplyChainData.getSelectedBlock());

            console.log(modalInstance);

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'moveBlockToSalesModal.html',
                controller: 'MoveBlockToSalesCtrl',
                size: 'lg',
                resolve: {}
            });

            // var blocksToMove = [];

            // for (var i = 0; i < $scope.blocks.length; i ++) {
            //     if ($scope.selectedBlocks[i]) {
            //         blocksToMove.push($scope.blocks[i]);
            //     }
            // };



            // called when modal is closed
            modalInstance.result.then(function (block) {
                // add the stage to the supply chain
                InventoryData.getBlocks(SupplyChainData.getSupplyChainId(), SupplyChainData.getSelectedStageId(), function (res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function (err) {
                    console.log(err);
                });

                console.log("then");
            });
        };

        $scope.deleteBlock = function () {


            SupplyChainData.setSelectedBlock($scope.blocks[$scope.selectedBlock]);
            console.log(SupplyChainData.getSelectedBlock());

            console.log(modalInstance);

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteBlockModal.html',
                controller: 'DeleteBlockCtrl',
                size: 'lg',
                resolve: {}
            });

            // var blocksToMove = [];

            // for (var i = 0; i < $scope.blocks.length; i ++) {
            //     if ($scope.selectedBlocks[i]) {
            //         blocksToMove.push($scope.blocks[i]);
            //     }
            // };



            // called when modal is closed
            modalInstance.result.then(function (block) {
                // add the stage to the supply chain
                InventoryData.getBlocks(SupplyChainData.getSupplyChainId(), SupplyChainData.getSelectedStageId(), function (res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function (err) {
                    console.log(err);
                });

                console.log("then");
            });
        }


////////////////////////////////////////
    //DUMMY VIEW DETAILS FUNCTION//
///////////////////////////////////////
        $scope.viewDetails = function () {

            SupplyChainData.setSelectedBlock($scope.blocks[$scope.selectedBlock]);
            console.log(SupplyChainData.getSelectedBlock());

            BlockData.setSelectedBlockId($scope.blocks[$scope.selectedBlock]._id);

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
            modalInstance.result.then(function (block) {
                // add the stage to the supply chain
                InventoryData.getBlocks(SupplyChainData.getSupplyChainId(), SupplyChainData.getSelectedStageId(), function (res) {
                    console.log(res);
                    $scope.blocks = res;
                    $scope.selectedBlock = 0;
                }, function (err) {
                    console.log(err);
                });

                console.log("then");
            });
        }

}]);
//
//

app.controller('MoveBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainData', '$state', '$uibModalInstance',
    function ($scope, TrackInventoryManager, InventoryData, SupplyChainData, $state, $uibModalInstance) {

        $scope.fromStage = SupplyChainData.getSelectedStage();

        $scope.stages = SupplyChainData.getStages();
        var selectedBlock = SupplyChainData.getSelectedBlock();
        console.log(selectedBlock);
        var supplyChainId = SupplyChainData.getSupplyChainId();

        $scope.ok = function () {
            console.log("moveBlock ok()");
            var data = {
                productId: selectedBlock.productType._id,
                stageId: $scope.toStage.self,
                quantity: $scope.quantity,
                units: $scope.units
            };

            console.log($scope.toStage.self);

            InventoryData.moveBlock(SupplyChainData.getSupplyChainId(), selectedBlock._id, data, function (res) {
                console.log(res);
                $uibModalInstance.close(res);
            }, function (err) {
                $uibModalInstance.close(err);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

}]);

app.controller('ViewDetailsCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'BlockData', 'SupplyChainData', 'StageData', '$state', '$uibModalInstance',
    function ($scope, TrackInventoryManager, InventoryData, BlockData, SupplyChainData, StageData, $state, $uibModalInstance) {

        var blockId = BlockData.getSelectedBlockId();

        var block;
        var history;

        BlockData.fetchBlock(blockId)
            .then(function (res) {
                $scope.block = res;
                console.log($scope.block);
            });

        BlockData.fetchSelectedBlockHistory()
            .then(function (res) {
                console.log(res);
                $scope.history = res;
                $scope.stageNames = new Array($scope.history.events.length);
                $scope.quantities = new Array($scope.history.events.length);
                $scope.units = new Array($scope.history.events.length);

                for (i = 0; i < $scope.stageNames.length; i ++) {
                    if ($scope.history.events[i].operation == "create") {
                        $scope.quantities[i] = $scope.history.events[i].createDetails.block.quantity;
                        $scope.units[i] = $scope.history.events[i].createDetails.block.units;

                    } else if ($scope.history.events[i].operation == "move") {
                        $scope.quantities[i] = $scope.history.events[i].moveDetails.after.quantity;
                        $scope.units[i] = $scope.history.events[i].moveDetails.after.units;

                    } else {

                    }
                }

            });

            $scope.getStageName = function (i) {
                // return $scope.stageNames[index];
                if ($scope.history.events[i].operation == "create") {
                    return $scope.history.events[i].createDetails.block.stage.name;
                } else if ($scope.history.events[i].operation == "move") {
                    return $scope.history.events[i].moveDetails.after.stage.name;

                } else {

                }
            };

            $scope.getDate = function (i) {
                // return $scope.stageNames[index];
                if ($scope.history.events[i].operation == "create") {
                    return $scope.history.events[i].date.substring(0,10);
                } else if ($scope.history.events[i].operation == "move") {
                    return $scope.history.events[i].date.substring(0,10);

                } else {

                }
            };


        $scope.ok = function () {
            $uibModalInstance.close('ok');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

}]);

app.controller('MoveBlockToSalesCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainData', '$state', '$uibModalInstance',
    function ($scope, TrackInventoryManager, InventoryData, SupplyChainData, $state, $uibModalInstance) {

        $scope.fromStage = SupplyChainData.getSelectedStage();


        InventoryData.getSellingPoints(function (res) {
            $scope.stages = res;
            console.log(res);
        }, function (err) {
            console.log(err);
        });

        var selectedBlock = SupplyChainData.getSelectedBlock();
        console.log(selectedBlock);
        var supplyChainId = SupplyChainData.getSupplyChainId();

        $scope.ok = function () {
            console.log("moveBlockToSales ok()");
            var data = {
                stageId: $scope.toStage._id,
                quantity: $scope.quantity,
                units: $scope.units
            };

            console.log($scope.toStage._id);

            InventoryData.moveBlock(SupplyChainData.getSupplyChainId(), selectedBlock._id, data, function (res) {
                console.log(res);
                $uibModalInstance.close(res);
            }, function (err) {
                $uibModalInstance.close(err);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

}]);

app.controller('DeleteBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainData', '$state', '$uibModalInstance',
    function ($scope, TrackInventoryManager, InventoryData, SupplyChainData, $state, $uibModalInstance) {

        $scope.fromStage = SupplyChainData.getSelectedStage();

        $scope.stages = SupplyChainData.getStages();
        var selectedBlock = SupplyChainData.getSelectedBlock();
        console.log(selectedBlock);
        var supplyChainId = SupplyChainData.getSupplyChainId();

        $scope.ok = function () {
            console.log("deleteBlock ok()");

            InventoryData.deleteBlock(SupplyChainData.getSupplyChainId(), selectedBlock._id, function (res) {
                console.log(res);
                $uibModalInstance.close(res);
            }, function (err) {
                $uibModalInstance.close(err);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

}]);

app.controller('AddBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'Products', 'SupplyChainData', '$state', '$uibModalInstance',
    function ($scope, TrackInventoryManager, InventoryData, Products, SupplyChainData, $state, $uibModalInstance) {


        Products.getProducts(function (res) {
            $scope.products = res;
        }, function (err) {
            console.log(err);
        });


        $scope.ok = function () {

            console.log($scope.selectedProduct);

            var data = {
                productId: $scope.selectedProduct._id,
                stageId: SupplyChainData.getSelectedStageId(),
                quantity: $scope.quantity,
                units: $scope.units,
                catchDate: $scope.catchDate,
                catchRegion: $scope.catchRegion,
                caughtBy: $scope.caughtBy,
                catchType: $scope.catchType,
                waterDepth: $scope.waterDepth
            };


            InventoryData.addBlock(SupplyChainData.getSupplyChainId(), data, function (res) {
                console.log(res);
                $uibModalInstance.close(res);
            }, function (err) {
                $uibModalInstance.close(err);
            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };




}]);

app.controller('EditBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'Products', 'SupplyChainData', '$state', '$uibModalInstance',
    function ($scope, TrackInventoryManager, InventoryData, Products, SupplyChainData, $state, $uibModalInstance) {





        var block = SupplyChainData.getSelectedBlock();
        // $scope.selectedProduct = block.productType;
        console.log(block);
        $scope.quantity = block.quantity;
        $scope.units = block.units;

        var findCurrentProduct = function (id) {
            for (var i = 0; i < $scope.products.length; i ++) {
                if ($scope.products[i]._id == id) {
                    console.log("match");
                    $scope.selectedProduct = $scope.products[i];
                }
            }
        }



        Products.getProducts(function (res) {
            $scope.products = res;
            findCurrentProduct(block.productType._id);
            console.log(res);
        }, function (err) {
            console.log(err);
        });



        $scope.ok = function () {

            console.log($scope.selectedProduct);

            var data = {
                productId: $scope.selectedProduct._id,
                stageId: SupplyChainData.getSelectedStageId(),
                quantity: $scope.quantity,
                units: $scope.units
            };


            InventoryData.updateBlock(SupplyChainData.getSupplyChainId(), SupplyChainData.getSelectedBlock()._id, data, function (res) {
                console.log(res);
                $uibModalInstance.close(res);
            }, function (err) {
                $uibModalInstance.close(err);
            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

}]);
