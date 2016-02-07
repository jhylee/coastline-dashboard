var app = angular.module('coastlineWebApp.trackInventory.controllers', ['ui.bootstrap', 
  'coastlineWebApp.dashboard.services',
  'coastlineWebApp.trackInventory.services',
  'coastlineWebApp.trackInventory.directives',
  'coastlineWebApp.auth.services',
  'ui.router']);



app.controller('TrackInventoryDisplayCtrl', ['$scope', 'TrackInventoryMenuNavigation', 'AuthService', '$state', '$uibModal',
    function ($scope, TrackInventoryMenuNavigation, AuthService, $state, $uibModal) {
        $scope.view = TrackInventoryMenuNavigation.getView();

        $scope.getView = function () {
            return TrackInventoryMenuNavigation.getView(); 
        }
}]);


app.controller('TrackInventoryMenuCtrl', ['$scope', 'TrackInventoryMenuNavigation', 'TrackInventoryManager', 'SupplyChainData', 'AuthService', '$state', '$uibModal',
    function ($scope, TrackInventoryMenuNavigation, TrackInventoryManager, SupplyChainData, AuthService, $state, $uibModal) {

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
            TrackInventoryMenuNavigation.setView('supply-chain');
        };

}]);


app.controller('TrackInventoryInterfaceCtrl', ['$scope', 'TrackInventoryMenuNavigation', 'TrackInventoryManager', 'AuthService', '$state', '$uibModal',
    function ($scope, TrackInventoryMenuNavigation, TrackInventoryManager, AuthService, $state, $uibModal) {

        //$scope.data = TrackInventoryManager.getDisplayData();

        $scope.setSupplyChain = function (supplyChain) {
            TrackInventoryManager.setSupplyChain(supplyChain);
            TrackInventoryMenuNavigation.setView('supply-chain');
        };

}]);