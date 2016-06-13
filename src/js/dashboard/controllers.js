var app = angular.module('coastlineWebApp.dashboard.controllers', ['ui.bootstrap',
    'coastlineWebApp.dashboard.services',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('NavTopCtrl', ['$scope', 'AuthService', '$state', 'FisheryService',
    function($scope, AuthService, $state, FisheryService) {
        $scope.fisheryName = "";

        $scope.fisheryName = FisheryService.getFisheryName();

        $scope.navbarCollapsed = true;

        $scope.logout = function() {
            AuthService.logout(function() {
                $state.go('login');
            });
        };
    }

]);
