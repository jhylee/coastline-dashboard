var app = angular.module('coastlineWebApp.customers.controllers', ['ui.bootstrap',
    'coastlineWebApp.customers.services',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('CustomerDisplayCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModal', 'CustomerService',
    function($scope, AuthService, $state, FisheryService, $uibModal, CustomerService) {

        var refreshCustomers = function () {
            CustomerService.getCustomers().then(function (data) {
                $scope.customers = data;
                console.log(data);
                $scope.selectedCustomer = $scope.customers[0];
            })
        };

        refreshCustomers();

        $scope.add = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addCustomerModal.html',
                controller: 'AddCustomerCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function() {
                    refreshCustomers();
                },
                function() {});
        };

        $scope.edit = function() {
            CustomerService.setSelectedCustomerId($scope.selectedCustomer._id);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'editCustomerModal.html',
                controller: 'EditCustomerCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function() {
                    refreshCustomers();
                },
                function() {});
        };

        $scope.delete = function() {
            CustomerService.setSelectedCustomerId($scope.selectedCustomer._id);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteCustomerModal.html',
                controller: 'DeleteCustomerCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function() {
                    refreshCustomers();
                },
                function() {});
        };
    }
]);


app.controller('AddCustomerCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModalInstance', 'CustomerService',
    function($scope, AuthService, $state, FisheryService, $uibModalInstance, CustomerService) {
        $scope.ok = function() {
            CustomerService.addCustomer({
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone
            }).then(function (data) {
                $scope.customers = data;
                console.log(data);
                $uibModalInstance.close();
            })
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };
    }
]);


app.controller('EditCustomerCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModalInstance', 'CustomerService',
    function($scope, AuthService, $state, FisheryService, $uibModalInstance, CustomerService) {

        CustomerService.getSelectedCustomer().then(function (data) {
            $scope.name = data.name;
            $scope.email = data.email;
            $scope.phone = data.phone;
        });

        $scope.ok = function() {
            CustomerService.editCustomer({
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone
            }).then(function (data) {
                $uibModalInstance.close();
            })
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };
    }
]);

app.controller('DeleteCustomerCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModalInstance', 'CustomerService',
    function($scope, AuthService, $state, FisheryService, $uibModalInstance, CustomerService) {
        $scope.ok = function() {
            CustomerService.deleteCustomer().then(function (data) {
                $uibModalInstance.close();
            })
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };
    }
]);
