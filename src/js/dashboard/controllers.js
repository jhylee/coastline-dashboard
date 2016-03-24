var app = angular.module('coastlineWebApp.dashboard.controllers', ['ui.bootstrap',
  'coastlineWebApp.dashboard.services',
  'coastlineWebApp.auth.services',
  'coastlineWebApp.common.services',
  'ui.router']);



app.controller('NavTopCtrl', ['$scope', 'AuthService', '$state', 'FisheryData',
    function ($scope, AuthService, $state, FisheryData) {
        $scope.fisheryName = "";

        $scope.fisheryName = FisheryData.getFisheryName();

        $scope.navbarCollapsed = true;

        $scope.logout = function () {
            AuthService.logout(function () {
                $state.go('login');
            });
        };
}]);
