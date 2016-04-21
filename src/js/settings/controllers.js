var app = angular.module('coastlineWebApp.settings.controllers', ['ui.bootstrap',
    'coastlineWebApp.settings.services',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('UserSettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService',
    function($scope, AuthService, $state, FisheryService) {

        $scope.user = {name: "Abdul"};

        $scope.logout = function() {
            AuthService.logout(function() {
                $state.go('login');
            });
        };
    }
]);
