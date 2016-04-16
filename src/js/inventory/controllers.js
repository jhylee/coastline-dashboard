var app = angular.module('coastlineWebApp.inventory.controllers', ['ui.bootstrap',
    'coastlineWebApp.dashboard.services',
    'coastlineWebApp.inventory.services',
    'coastlineWebApp.products.services',
    'coastlineWebApp.common.services',
    'ui.router',
    'ngNotify'
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
            SupplyChainService.setSupplyChainId(supplyChain._id);
            $state.go('dashboard.default.inventory.track');
        };

    }
]);


app.controller('TrackInventoryInterfaceCtrl', ['$scope', 'TrackInventoryManager', 'AuthService', '$state', '$uibModal',
    function($scope, TrackInventoryManager, AuthService, $state, $uibModal) {
        $scope.setSupplyChain = function(supplyChain) {
            TrackInventoryManager.setSupplyChain(supplyChain);
            $state.go('dashboard.default.inventory.track');
        };
    }
]);




app.controller('InventoryCtrl', ['$scope', '$rootScope', 'InventoryData', 'SupplyChainService', '$state', '$uibModal',
    function($scope, $rootScope, InventoryData, SupplyChainService, $state, $uibModal) {
        $scope.viewBlocks = function() {
            $rootScope.$broadcast("refreshStageEdit");

            var stageId = SupplyChainService.getSelectedStageId();
            var supplyChainId = SupplyChainService.getSupplyChainId()._id;

            // modal setup and preferences
            var modalInstance1 = $uibModal.open({
                animation: true,
                templateUrl: 'viewBlocksModal.html',
                controller: 'ViewBlocksCtrl',
                size: 'lg',
                resolve: {}
            });

            modalInstance1.result.then(
                function(block) {
                    console.log("then");
                },
                function() {});
        };

        $scope.saveSupplyChain = function(supplyChain) {
            console.log('$scope.saveSupplyChain');
        };
    }
]);

app.controller('ViewBlocksCtrl', ['$scope', '$rootScope', 'InventoryData', 'SupplyChainService', '$state', '$uibModalInstance', '$uibModal',
    function($scope, $rootScope, InventoryData, SupplyChainService, $state, $uibModalInstance, $uibModal) {

        // For when this controller is reused
        $rootScope.$on("refreshStageEdit", function() {
            SupplyChainService.fetchSelectedStage()
                .then(function(res) {
                    $scope.stageName = res.name;
                });
        });

        // Fetch stage name
        SupplyChainService.fetchSelectedStage()
            .then(function(res) {
                $scope.stageName = res.name;
            });

        // Fetch blocks
        SupplyChainService.fetchBlocksBySelectedStage().then(function(data) {
            $scope.blocks = data;
            if ($scope.blocks.length > 0) {
                $scope.selectedBlock = $scope.blocks[0];
            }
        });

        $scope.ok = function() {
            $uibModalInstance.dismiss('ok');
        };

        $scope.addBlock = function() {
            var modalInstance1 = $uibModal.open({
                animation: true,
                templateUrl: 'addBlockModal.html',
                controller: 'AddBlockCtrl',
                size: 'lg',
                resolve: {}
            });

            modalInstance1.result.then(function(block) {
                SupplyChainService.fetchBlocksBySelectedStage().then(function(data) {
                    $scope.blocks = data;
                    if ($scope.blocks.length > 0) {
                        $scope.selectedBlock = $scope.blocks[0];
                    }
                });
            }, function() {});
        };

        $scope.editBlock = function() {
            SupplyChainService.setSelectedBlockId($scope.selectedBlock._id);

            var modalInstance1 = $uibModal.open({
                animation: true,
                templateUrl: 'editBlockModal.html',
                controller: 'EditBlockCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance1.result.then(function(block) {
                SupplyChainService.fetchBlocksBySelectedStage().then(function(data) {
                    $scope.blocks = data;
                    if ($scope.blocks.length > 0) {
                        $scope.selectedBlock = $scope.blocks[0];
                    }
                });
            }, function() {});

        };

        $scope.moveBlock = function() {
            SupplyChainService.setSelectedBlockId($scope.selectedBlock._id);

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'moveBlockModal.html',
                controller: 'MoveBlockCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(function(block) {
                SupplyChainService.fetchBlocksBySelectedStage().then(function(data) {
                    $scope.blocks = data;
                    if ($scope.blocks.length > 0) {
                        $scope.selectedBlock = $scope.blocks[0];
                    }
                });
            });
        };

        $scope.moveBlockToSales = function() {
            SupplyChainService.setSelectedBlockId($scope.selectedBlock._id);

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'moveBlockToSalesModal.html',
                controller: 'MoveBlockToSalesCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(function(block) {
                SupplyChainService.fetchBlocksBySelectedStage().then(function(data) {
                    $scope.blocks = data;
                    if ($scope.blocks.length > 0) {
                        $scope.selectedBlock = $scope.blocks[0];
                    }
                });
            });
        };

        $scope.deleteBlock = function() {
            SupplyChainService.setSelectedBlockId($scope.selectedBlock._id);

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteBlockModal.html',
                controller: 'DeleteBlockCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(function(block) {
                SupplyChainService.fetchBlocksBySelectedStage().then(function(data) {
                    $scope.blocks = data;
                    if ($scope.blocks.length > 0) {
                        $scope.selectedBlock = $scope.blocks[0];
                    }
                });
            });
        }

        $scope.viewDetails = function() {
            SupplyChainService.setSelectedBlockId($scope.selectedBlock._id);
            // BlockService.setSelectedBlockId($scope.selectedBlock._id);

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'viewDetailsModal.html',
                controller: 'ViewDetailsCtrl',
                size: 'lg',
                resolve: {}
            });

            modalInstance.result.then(function(block) {
                SupplyChainService.fetchBlocksBySelectedStage().then(function(data) {
                    $scope.blocks = data;
                    if ($scope.blocks.length > 0) {
                        $scope.selectedBlock = $scope.blocks[0];
                    }
                });
            });
        }

    }
]);


app.controller('MoveBlockCtrl', ['$scope', 'InventoryData', 'SupplyChainService', 'ngNotify', '$state', '$uibModalInstance',
    function($scope, InventoryData, SupplyChainService, ngNotify, $state, $uibModalInstance) {

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
        SupplyChainService.fetchStages().then(function(res) {
            $scope.stages = res;
        });
        SupplyChainService.fetchSelectedStage()
            .then(function(res) {
                $scope.fromStage = res;
            });
        SupplyChainService.fetchSelectedBlock()
            .then(function(data) {
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

        var supplyChainId = SupplyChainService.getSupplyChainId();

        $scope.ok = function() {
            if ($scope.quantity == $scope.block1.quantity) {
                var data = {
                    productId: selectedBlock.productType._id,
                    stageId: $scope.toStage.self,
                    quantity: $scope.quantity,
                    units: $scope.units,
                    processType: $scope.processType
                };

                InventoryData.moveBlock(SupplyChainService.getSupplyChainId(), selectedBlock._id, data, function(res) {
                    $uibModalInstance.close(res);
                }, function(err) {
                    $uibModalInstance.close(err);
                });
            } else {
                var block2 = {
                    quantity: $scope.quantity,
                    units: $scope.block1.units,
                    stage: $scope.toStage.self,
                    productType: $scope.block1.productType,
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

                InventoryData.splitBlock(SupplyChainService.getSupplyChainId(), selectedBlock._id, data, function(res) {
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

app.controller('ViewDetailsCtrl', ['$scope', 'InventoryData', 'SupplyChainService', '$state', '$uibModalInstance',
    function($scope, InventoryData, SupplyChainService, $state, $uibModalInstance) {

        var blockId = SupplyChainService.getSelectedBlockId();
        var block;
        var history;

        SupplyChainService.fetchSelectedStage()
            .then(function(res) {
                $scope.stage = res;
                $scope.stageName = res.name;
            });
        SupplyChainService.fetchSelectedBlock()
            .then(function(res) {
                $scope.block = res;
                console.log($scope.block);
            });
        SupplyChainService.fetchSelectedBlockHistory()
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

app.controller('MoveBlockToSalesCtrl', ['$scope', 'InventoryData', 'SupplyChainService', 'ngNotify', '$state', '$uibModalInstance',
    function($scope, InventoryData, SupplyChainService, ngNotify, $state, $uibModalInstance) {

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
            .then(function(res) {
                $scope.fromStage = res;
            });

        var selectedBlock;

        SupplyChainService.fetchSelectedBlock()
            .then(function(data) {
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

                InventoryData.splitBlock(SupplyChainService.getSupplyChainId(), selectedBlock._id, data, function(res) {
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

app.controller('DeleteBlockCtrl', ['$scope', 'InventoryData', 'SupplyChainService', '$state', '$uibModalInstance',
    function($scope, InventoryData, SupplyChainService, $state, $uibModalInstance) {

        var selectedBlockId = SupplyChainService.getSelectedBlockId();
        var supplyChainId = SupplyChainService.getSupplyChainId();

        $scope.ok = function() {
            console.log("deleteBlock ok()");

            InventoryData.deleteBlock(SupplyChainService.getSupplyChainId(), selectedBlockId, function(res) {
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




app.controller('AddBlockCtrl', ['$scope', 'InventoryData', 'ProductData', 'SupplyChainService', 'ngNotify', '$state', '$uibModalInstance',
    function($scope, InventoryData, ProductData, SupplyChainService, ngNotify, $state, $uibModalInstance) {


        ProductData.getProductData(function(res) {
            $scope.products = res;
        }, function(err) {
            console.log(err);
        });


        $scope.ok = function() {

            console.log($scope.selectedProduct);

            if (!$scope.selectedProduct ||
                !$scope.quantity ||
                !$scope.units) {
                ngNotify.set('Please fill out all mandatory product batch details.', {
                    sticky: false,
                    button: false,
                    type: 'error',
                    duration: 1000,
                    position: 'top'
                })
            } else {
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
            }



        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }
]);

app.controller('EditBlockCtrl', ['$scope', 'InventoryData', 'ProductData', 'SupplyChainService', '$state', '$uibModalInstance',
    function($scope, InventoryData, ProductData, SupplyChainService, $state, $uibModalInstance) {





        var block;

        SupplyChainService.fetchSelectedBlock()
            .then(function(res) {
                block = res;
                $scope.quantity = block.quantity;
                $scope.units = block.units;
            }).then(function() {
                ProductData.getProductData(function(res) {
                    $scope.products = res;
                    findCurrentProduct(block.productType._id);
                    console.log(res);
                }, function(err) {
                    console.log(err);
                });
            });


        var findCurrentProduct = function(id) {
            for (var i = 0; i < $scope.products.length; i++) {
                if ($scope.products[i]._id == id) {
                    console.log("match");
                    $scope.selectedProduct = $scope.products[i];
                }
            }
        }

        $scope.ok = function() {

            console.log($scope.selectedProduct);

            var data = {
                productId: $scope.selectedProduct._id,
                stageId: SupplyChainService.getSelectedStageId(),
                quantity: $scope.quantity,
                units: $scope.units
            };


            InventoryData.updateBlock(SupplyChainService.getSupplyChainId(), block._id, data, function(res) {
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
