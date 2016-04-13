angular.module('coastlineWebApp.auth.controllers', ['ui.router', 'ngStorage', 'coastlineWebApp.auth.services'])

.controller('accountCtrl', ['$rootScope', '$scope', '$state', '$location', '$localStorage', 'AuthService', function($rootScope, $scope, $state, $location, $localStorage, AuthService) {

    // $scope.$storage = $localStorage;
    // $scope.isToken = !($scope.$storage.token === undefined || $scope.$storage.token === null);

    $scope.logout = function() {
        AuthService.logout(function() {
            $state.go('login');
        });

    };

}])

// CONTROLLER FOR LOGIN/LOGOUT
.controller('loginCtrl', ['$rootScope', '$scope', '$state', '$location', '$localStorage', 'AuthService', function($rootScope, $scope, $state, $location, $localStorage, AuthService) {

    $scope.isToken = AuthService.isAuthenticated();

    $scope.$storage = $localStorage;

    $scope.signUp = function() {

        var formData = {
            username: $scope.username,
            password: $scope.password,
            email: $scope.email,
            accountType: $scope.accountType
        };

        var fisheryName = $scope.fisheryName

        AuthService.signUp(formData, fisheryName, function(res) {
            //   AuthService.login(formData, function (res) {
            $state.go('fishery-setup');
            //   });
        }, function(err) {
            console.log(err);
        });

    };


    $scope.createFishery = function() {
        var formData = {
            name: $scope.fisheryName,
        };

        AuthService.createFishery(formData, function(res) {
                console.log(res);
                // $state.go('dashboard.default.products');
            },
            function(err) {
                $rootScope.error = 'Failed to createFishery';
            });
    };

    $scope.login = function() {
        var formData = {
            username: $scope.username,
            password: $scope.password
        };

        var loginPromise = AuthService.login(formData);

        loginPromise.then(function(res) {
            console.log(res);
            // $state.go('dashboard.default.products');
        });
    };


    $scope.me = function() {
        AuthService.me(function(res) {
            $scope.myDetails = res;
        }, function() {
            $rootScope.error = 'Failed to fetch details';
        });
    };

}]);
