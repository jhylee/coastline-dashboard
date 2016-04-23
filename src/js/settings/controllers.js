var app = angular.module('coastlineWebApp.settings.controllers', ['ui.bootstrap',
    'coastlineWebApp.settings.services',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('GeneralSettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', 'SettingsService',
    function($scope, AuthService, $state, FisheryService, SettingsService) {

        SettingsService.fetchUser().then(function (data) {
            $scope.username = data.username;
            $scope.name = data.name;
            $scope.email = data.email;
            $scope.phone = data.phone;

        });

        $scope.isSubmitButtonDisabled = function() {
          if (!$scope.name &&
              !$scope.status &&
              !$scope.email &&
              !$scope.phone) {
               return true;
              }
            else {
              return false;
            }
          };

        $scope.saveChanges = function () {
            console.log("saveChanges");
        };
    }
]);


app.controller('FisherySettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService','SettingsService',
    function($scope, AuthService, $state, FisheryService, SettingsService) {

        SettingsService.fetchFishery().then(function (data) {
            $scope.name = data.name;
            $scope.address = data.address;
            $scope.city = data.city;
            $scope.postalCode = data.postalCode;
            $scope.phone = data.phone;
            $scope.salesPhone = data.salesPhone;
            $scope.faxPhone = data.faxPhone;

        });

        $scope.isSubmitButtonDisabled = function() {
          if (!$scope.address &&
              !$scope.city &&
              !$scope.postalCode &&
              !$scope.phone &&
              !$scope.salesPhone &&
              !$scope.faxPhone) {
               return true;
              }
            else {
              return false;
            }
          };



        $scope.saveChanges = function () {
            console.log("saveChanges");
        };
    }
]);


app.controller('UserSettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService',
    function($scope, AuthService, $state, FisheryService) {
        $scope.saveChanges = function () {
            console.log("saveChanges");
        };


    }
]);
