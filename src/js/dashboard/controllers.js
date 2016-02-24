var app = angular.module('coastlineWebApp.dashboard.controllers', ['ui.bootstrap',
  'coastlineWebApp.dashboard.services',
  'coastlineWebApp.auth.services',
  'ui.router']);



app.controller('NavTopCtrl', ['$scope', 'Fishery', 'AuthService', '$state',
    function ($scope, Fishery, AuthService, $state) {
        $scope.fisheryName = "";

        Fishery.getFishery(function (fishery) {
            $scope.fisheryName = fishery.name;
            console.log("$scope.fisheryName " + fishery);
        });

        $scope.logout = function () {
            AuthService.logout(function () {
                $state.go('login');
            });
        };

}]);
