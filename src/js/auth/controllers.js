angular.module('coastlineWebApp.auth.controllers', ['ui.router', 'ngStorage', 'ngNotify', 'coastlineWebApp.auth.services'])

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
.controller('loginCtrl', ['$rootScope', '$scope', '$state', '$location', '$localStorage', 'ngNotify','AuthService', function($rootScope, $scope, $state, $location, $localStorage, ngNotify, AuthService) {

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
        });

    };

    $scope.sendResetLink = function () {
        var data = {
            username: $scope.username
        };

        AuthService.sendResetLink(data).then(function (res) {
            $state.go('login');
        })
        ngNotify.set('Please Check Your Email for Reset Instructions ', {
            sticky: false,
            button: true,
            type: 'success',
            duration: 1500,
            position: 'top'
        })
    };


    $scope.createFishery = function() {
        var formData = {
            name: $scope.fisheryName,
        };

        AuthService.createFishery(formData, function(res) {
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

            if (res.statusText === "Unauthorized"){
                      ngNotify.set('The credentials entered are incorrect. Please try again.', {
                            sticky: false,
                            button: false,
                            type: 'error',
                            duration: 1000,
                            position: 'top'
                  })
            }
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
