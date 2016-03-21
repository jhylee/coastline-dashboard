var app = angular.module('coastlineWebApp.dashboard.controllers', ['ui.bootstrap',
  'coastlineWebApp.dashboard.services',
  'coastlineWebApp.auth.services',
  'coastlineWebApp.common.services',
  'ui.router']);



// app.controller('NavTopCtrl', ['$scope', 'Fishery', 'AuthService', '$state',
//     function ($scope, Fishery, AuthService, $state) {
app.controller('NavTopCtrl', ['$scope', 'Fishery', 'AuthService', '$state', 'FisheryData',
    function ($scope, Fishery, AuthService, $state, FisheryData) {
        $scope.fisheryName = "";

        $scope.fisheryName = FisheryData.getFisheryName();

        $scope.navbarCollapsed = true;
        
        $scope.logout = function () {
            AuthService.logout(function () {
                $state.go('login');
            });
        };
}]);
