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
.controller('loginCtrl', ['$rootScope', '$scope', '$state', '$location', '$localStorage', 'ngNotify', 'AuthService', function($rootScope, $scope, $state, $location, $localStorage, ngNotify, AuthService) {

   $scope.isToken = AuthService.isAuthenticated();

   $scope.$storage = $localStorage;

   $scope.signUp = function(isTrial) {

      var formData = {
         username: $scope.username,
         password: $scope.password,
         email: $scope.email,
         accountType: 'admin',
         trial: isTrial ? {
            companyName: $scope.companyName,
            annualSeafoodVolume: $scope.annualSeafoodVolume,
         } : false,
      };

      var formValid = true;

      if ($scope.password != $scope.passwordAgain) {
         formValid = false;
         $scope.passwordNotMatching = true;
         console.log(formValid);

      } else if (!$scope.username || !$scope.password || !$scope.email) {
         formValid = false;
         $scope.usernameRequired = true;
         $scope.passwordRequired = true;
         $scope.emailRequired = true;
         console.log(formValid);

      } else {
         formValid = true;
         $scope.usernameRequired = false;
         $scope.passwordRequired = false;
         $scope.emailRequired = false;
         $scope.passwordNotMatching = false;
         console.log(formValid);

      }
      console.log(formValid);

      if (formValid) {
         var fisheryName = $scope.fisheryName;
         AuthService.signUp(formData, function(res) {
            if (res.statusText === "Unauthorized" || res.statusText === "Not Found") {
               $scope.usernameRequired = true;
               $scope.passwordRequired = true;
            }

            $state.go('fishery-setup');
            //   });
         }, function(err) {
            $scope.usernameRequired = true;
            $scope.passwordRequired = true;
         });

      }

   };

   $scope.signUpWithCode = function() {

      var formData = {
         username: $scope.username,
         password: $scope.password,
         inviteCode: $scope.inviteCode
      };

      var formValid = true;

      if (!$scope.username || !$scope.password || !$scope.inviteCode) {
         formValid = false;
         $scope.usernameRequired = true;
         $scope.passwordRequired = true;
         $scope.inviteCodeRequired = true;
      } else {
         formValid = true;
         $scope.usernameRequired = false;
         $scope.passwordRequired = false;
         $scope.inviteCodeRequired = false;
      }

      if (formValid) {
         AuthService.signUp(formData, function(res) {
            $state.go('dashboard.default.overview');
         }, function(err) {});
      }

   };

   $scope.sendResetLink = function() {
      var data = {
         username: $scope.username
      };

      var formValid = true;

      if (!$scope.username) {
         formValid = false;
         $scope.usernameRequired = true;
      } else {
         formValid = true;
         $scope.usernameRequired = false;
      }
      if (formValid) {
         AuthService.sendResetLink(data).then(function(res) {
            if (res.statusText === "Unauthorized" || res.statusText === "Not Found") {
               $scope.usernameRequired = true;
            } else {
               $state.go('login');
            }
         })
      }
   };


   $scope.createFishery = function() {
      var formData = {
         name: $scope.fisheryName,
      };

      var formValid = true;

      if (!$scope.fisheryName) {
         formValid = false;
         $scope.fisheryNameRequired = true;
      } else {
         formValid = true;
         $scope.fisheryNameRequired = false;
      }

      if (formValid) {
         AuthService.createFishery(formData, function(res) {
               // $state.go('dashboard.default.products');
            },
            function(err) {
               $rootScope.error = 'Failed to createFishery';
            });
      }


   };

   $scope.login = function() {
      var formData = {
         username: $scope.username,
         password: $scope.password
      };


      var formValid = true;

      if (!$scope.username || !$scope.password) {
         formValid = false;
      }
      if (!$scope.username || !$scope.password) {
         formValid = false;
         $scope.usernameRequired = true;
         $scope.passwordRequired = true;
      } else {
         formValid = true;
         $scope.usernameRequired = false;
         $scope.passwordRequired = false;
      }

      if (formValid) {
         var loginPromise = AuthService.login(formData);
         loginPromise.then(function(res) {

            if (res.statusText === "Unauthorized" || res.statusText === "Not Found") {
               $scope.usernameRequired = true;
               $scope.passwordRequired = true;
            }
         });
      }




   };



   $scope.me = function() {
      AuthService.me(function(res) {
         $scope.myDetails = res;
      }, function() {
         $rootScope.error = 'Failed to fetch details';
      });
   };

}]);
