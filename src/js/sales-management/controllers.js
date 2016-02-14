var app = angular.module('coastlineWebApp.salesManagement.controllers', ['ui.bootstrap', 
  'coastlineWebApp.salesManagement.services', 
  'coastlineWebApp.common.services', 
  'coastlineWebApp.auth.services',
  'ui.router']);



app.controller('SalesManagementMenuCtrl', ['$scope', 'SupplyChainData', 'AuthService', '$state', '$uibModal',
    function ($scope, SupplyChainData, AuthService, $state, $uibModal) {

        SupplyChainData.getSupplyChains(function (res) {
            console.log(res);
            $scope.supplyChains = res;
        }, function (error) {
            console.log(error);
        })


        var refreshSupplyChains = function () {
            SupplyChainData.getSupplyChains(function (res) {
                console.log(res);
                $scope.supplyChains = res;
            }, function (error) {
                console.log(error);
            })
        };

        refreshSupplyChains();
        
        
        $scope.setSupplyChain = function (supplyChain) {
            SupplyChainData.setSupplyChain(supplyChain);
            $state.go('dashboard.default.sales-management.track');
        };

        // $scope.setSupplyChain = function (supplyChain) {
        //     SupplyChainData.setSupplyChain(supplyChain);
        //     $state.go('dashboard.default.inventory.track');
        // };

}]);


app.controller('SellingPointsCtrl', ['$scope', 'SupplyChainData', 'SellingPointData', 'AuthService', '$state', '$uibModal',
    function ($scope, SupplyChainData, SellingPointData, AuthService, $state, $uibModal) {
        
        $scope.selectedSellingPoint = 0;
        
        
        var refreshSellingPoints = function () {
          	SellingPointData.getSellingPoints(function (res) {
                  $scope.sellingPoints = res;
              }, function (err) {
                  console.log(err);
              })
        };
        
        refreshSellingPoints();
        
        
        $scope.fisheryName = "";
        
        console.log(SupplyChainData.getSupplyChain());
        
        
        
        // add a stage - linked to the add button    
	    $scope.addSellingPoint = function () {
	      console.log("addSellingPoint");

	      // modal setup and preferences
	      var modalInstance = $uibModal.open({
	        animation: true,
	        templateUrl: 'addSellingPointModal.html',
	        controller: 'AddSellingPointCtrl',
	        size: 'lg',
	        resolve: {}
	      });

	      // called when modal is closed
	      modalInstance.result.then(
	        // OK callback
	        function (sellingPoint) {
                console.log("sellingPoint");
                console.log(sellingPoint);
                refreshSellingPoints();
	      }, function () {});
	    };
        
        
        // add a stage - linked to the add button    
	    $scope.editSellingPoint = function () {
          SellingPointData.setSelectedSellingPoint($scope.sellingPoints[$scope.selectedSellingPoint]);
	      console.log("editSellingPoint");

	      // modal setup and preferences
	      var modalInstance = $uibModal.open({
	        animation: true,
	        templateUrl: 'editSellingPointModal.html',
	        controller: 'EditSellingPointCtrl',
	        size: 'lg',
	        resolve: {}
	      });

	      // called when modal is closed
	      modalInstance.result.then(
	        // OK callback
	        function (sellingPoint) {
                console.log("sellingPoint");
                console.log(sellingPoint);
                refreshSellingPoints();
	      }, function () {});
	    };
        
        $scope.viewBlocks = function () {
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
                function (sellingPoint) {
                    console.log("sellingPoint");
                    console.log(sellingPoint);
                    refreshSellingPoints();
            }, function () {});
        };
        
    
}]);


app.controller('ViewSellingPointBlocksCtrl', ['$scope', 'SupplyChainData', 'SellingPointData', '$state', '$uibModalInstance', '$uibModal',
    function ($scope, SupplyChainData, SellingPointData, $state, $uibModalInstance, $uibModal) {
    
    
        $scope.ok = function () {
            $uibModalInstance.dismiss('ok');
        };
        
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        
        $scope.getBlocks = function () {
            
        };
                 
}]);

app.controller('ViewBlocksCtrl', ['$scope', 'InventoryData', 'SellingPointData', '$state', '$uibModalInstance', '$uibModal',
    function ($scope, InventoryData, SellingPointData, $state, $uibModalInstance, $uibModal) {
        
        $scope.sellingPoint = SellingPointData.getSelectedSellingPoint();

        SellingPointData.getBlocks(function (res) {
            console.log(res);
            $scope.blocks = res;
            $scope.selectedBlock = 0;
        }, function (err) {
            console.log(err);
        })


app.controller('AddSellingPointCtrl', ['$scope', 'SupplyChainData', 'SellingPointData', '$state', '$uibModalInstance', '$uibModal',
    function ($scope, SupplyChainData, SellingPointData, $state, $uibModalInstance, $uibModal) {
    
    
        $scope.ok = function () {
            
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
            
            SellingPointData.addSellingPoint(data, function (res) {
                console.log(res);
                $uibModalInstance.dismiss(res);
            }, function (err) {
                $uibModalInstance.dismiss(err);                
            })
            
        };
        
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        
        $scope.getBlocks = function () {
            
        };
                 
}]);

app.controller('EditSellingPointCtrl', ['$scope', 'SupplyChainData', 'SellingPointData', '$state', '$uibModalInstance', '$uibModal',
    function ($scope, SupplyChainData, SellingPointData, $state, $uibModalInstance, $uibModal) {
        
        $scope.sellingPoint = SellingPointData.getSelectedSellingPoint();
        
        for (var i = 0; i < $scope.sellingPoint.sellingTargets.length; i++) {
            if ($scope.sellingPoint.sellingTargets[i] == 'ecommerce') {
                $scope.isEcommerceStage = true;
            }
        }
            
    
    
        $scope.ok = function () {
            
            
            var sellingTargets = []
            
            // for ecommerce sellingTarget
            if ($scope.isEcommerceStage) {
                $scope.sellingPoint.sellingTargets = ['ecommerce'];
            } else {
                $scope.sellingPoint.sellingTargets = [];                
            }
            
            
            
            
            console.log($scope.sellingPoint._id);
            
            SellingPointData.updateSellingPoint($scope.sellingPoint._id, $scope.sellingPoint, function (res) {
                console.log(res);
                $uibModalInstance.dismiss(res);
            }, function (err) {
                $uibModalInstance.dismiss(err);                
            })
            
        };
        
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        
        $scope.getBlocks = function () {
            
        };
                 
}]);
