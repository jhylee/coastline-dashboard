var app = angular.module('coastlineWebApp.settings.controllers', ['ui.bootstrap',
    'coastlineWebApp.settings.services',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('GeneralSettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', 'SettingsService',
    function($scope, AuthService, $state, FisheryService, SettingsService) {

        $scope.isLoading = true;

        SettingsService.fetchUser().then(function (data) {
            $scope.username = data.username;
            $scope.name = data.name;
            $scope.email = data.email;
            $scope.phone = data.phone;

            $scope.isLoading = false;
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
            $scope.isLoading = true;

            SettingsService.updateUser({
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
            }).then(function (data) {
                $scope.name = data.name;
                $scope.email = data.email;
                $scope.phone = data.phone;

                $scope.isLoading = false;
            })
        };
    }
]);


app.controller('FisherySettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService','SettingsService',
    function($scope, AuthService, $state, FisheryService, SettingsService) {

        $scope.isLoading = true;

        SettingsService.fetchFishery().then(function (data) {
            $scope.name = data.name;
            $scope.address = data.address;
            $scope.city = data.city;
            $scope.state = data.state;
            $scope.postalCode = data.postalCode;
            $scope.phone = data.phone;
            $scope.salesPhone = data.salesPhone;
            $scope.faxPhone = data.faxPhone;

            $scope.isLoading = false;

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

            $scope.isLoading = true;

            SettingsService.updateFishery({
                name: $scope.name,
                address: $scope.address,
                city: $scope.city,
                state: $scope.state,
                postalCode: $scope.postalCode,
                phone: $scope.phone,
                salesPhone: $scope.salesPhone,
                faxPhone: $scope.faxPhone
            }).then(function (data) {
                $scope.name = data.name;
                $scope.address = data.address;
                $scope.city = data.city;
                $scope.state = data.state;
                $scope.postalCode = data.postalCode;
                $scope.phone = data.phone;
                $scope.salesPhone = data.salesPhone;
                $scope.faxPhone = data.faxPhone;

                $scope.isLoading = false;

            })
        };
    }
]);


app.controller('UserSettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModal', 'SettingsService',
    function($scope, AuthService, $state, FisheryService, $uibModal, SettingsService) {

        SettingsService.fetchUsers().then(function (data) {
            $scope.users = data;
        })

        $scope.inviteUser = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'inviteUser.html',
                controller: 'InviteUserCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function(order) {
                    // updateOrders();
                },
                function() {});
        };


        $scope.saveChanges = function () {
            console.log($scope.email);
            console.log($scope.accountType);
        };
    }
]);


app.controller('InviteUserCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', 'SettingsService', '$uibModalInstance',
    function($scope, AuthService, $state, FisheryService, SettingsService, $uibModalInstance) {

        $scope.ok = function () {
            console.log($scope.email);
            console.log($scope.accountType);
            SettingsService.inviteUser({
                email: $scope.email,
                accountType: $scope.accountType
            }).then(function (res) {
                $uibModalInstance.close();
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    }
]);
