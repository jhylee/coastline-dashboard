var app = angular.module('coastlineWebApp.inventory.controllers', ['ui.bootstrap', 
  'coastlineWebApp.dashboard.services',
  'coastlineWebApp.inventory.services',
  'coastlineWebApp.supplyChain.services',
  'ui.router']);





app.controller('TrackInventoryMenuCtrl', ['$scope', 'TrackInventoryManager', 'SupplyChainData', 'AuthService', '$state', '$uibModal',
    function ($scope, TrackInventoryManager, SupplyChainData, AuthService, $state, $uibModal) {

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