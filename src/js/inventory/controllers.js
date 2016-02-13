var app = angular.module('coastlineWebApp.inventory.controllers', ['ui.bootstrap', 
  'coastlineWebApp.dashboard.services',
  'coastlineWebApp.inventory.services',
  'coastlineWebApp.supplyChain.services',
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




app.controller('InventoryCtrl', ['$scope', 'InventoryData', 'SupplyChainData', '$state', '$uibModal',
    function ($scope, InventoryData, SupplyChainData, $state, $uibModal) {

        //$scope.data = TrackInventoryManager.getDisplayData();

        $scope.viewBlocks = function () {
            console.log('$scope.viewBlocks');
            
            var stageId = SupplyChainData.getSelectedStageId();
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
        
        $scope.addBlock = function () {
            
            console.log('addBlock');

            
            // modal setup and preferences
            var modalInstance1 = $uibModal.open({
                animation: true,
                templateUrl: 'addModalContent.html',
                controller: 'AddBlockCtrl',
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
                
        }
        
        

        $scope.saveSupplyChain = function (supplyChain) {
            console.log('$scope.saveSupplyChain');
        };

}]);

app.controller('ViewBlocksCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainData', '$state', '$uibModalInstance', '$uibModal',
    function ($scope, TrackInventoryManager, InventoryData, SupplyChainData, $state, $uibModalInstance, $uibModal) {
    
        InventoryData.getBlocks(SupplyChainData.getSupplyChainId(), SupplyChainData.getSelectedStageId(), function (res) {
            console.log(res);
            $scope.blocks = res;
            $scope.selectedBlock = 0;
            
            
        }, function (err) {
            console.log(err);
        })
        
    
        $scope.ok = function () {
            $uibModalInstance.dismiss('ok');
        };
        
        $scope.printSelected = function () {
            console.log($scope.selectedBlock);
        };
        
        $scope.moveBlock = function () {
            
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
            
            
            SupplyChainData.setSelectedBlock($scope.selectedBlock);
            console.log(SupplyChainData.getSelectedBlock());
            
            console.log(modalInstance);
            
            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function (block) {
                    // add the stage to the supply chain
                    console.log("then");
                

                // CANCEL callback
            }, function () {});
            
        };
        
}]);


app.controller('MoveBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainData', '$state', '$uibModalInstance',
    function ($scope, TrackInventoryManager, InventoryData, SupplyChainData, $state, $uibModalInstance) {
        
        $scope.fromStage = SupplyChainData.getSelectedStage();
        
        $scope.stages = SupplyChainData.getStages();
        var selectedBlock = SupplyChainData.getSelectedBlock();
        var supplyChainId = SupplyChainData.getSupplyChainId();
        
        
        
        
        
        $scope.ok = function () {
            var data = {
                name: $scope.name,
                stageId: SupplyChainData.getSelectedStageId(),
                quantity: $scope.quantity,
                units: $scope.units
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




app.controller('AddBlockCtrl', ['$scope', 'TrackInventoryManager', 'InventoryData', 'SupplyChainData', '$state', '$uibModalInstance',
    function ($scope, TrackInventoryManager, InventoryData, SupplyChainData, $state, $uibModalInstance) {
    
    
        $scope.ok = function () {
            
            var data = {
                name: $scope.name,
                stageId: SupplyChainData.getSelectedStageId(),
                quantity: $scope.quantity,
                units: $scope.units
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
