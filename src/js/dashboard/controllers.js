var app = angular.module('coastlineWebApp.dashboard.controllers', ['ui.bootstrap',
    'coastlineWebApp.dashboard.services',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('NavTopCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', 'TutorialService',
    function($scope, AuthService, $state, FisheryService, TutorialService) {
        $scope.fisheryName = "";

        $scope.fisheryName = FisheryService.getFisheryName();

        $scope.navbarCollapsed = true;

        $scope.logout = function() {
            AuthService.logout(function() {
                $state.go('login');
            });
        };

        $scope.tutorial = TutorialService;
    }

]);
