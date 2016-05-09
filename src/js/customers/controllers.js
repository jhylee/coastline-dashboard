var app = angular.module('coastlineWebApp.customers.controllers', ['ui.bootstrap',
    'coastlineWebApp.customers.services',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('CustomerDisplayCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModal', 'CustomerService',
    function($scope, AuthService, $state, FisheryService, $uibModal, CustomerService) {
        $scope.add = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addCustomerModal.html',
                controller: 'AddCustomerCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function() {},
                function() {});
        };

        $scope.edit = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'editCustomerModal.html',
                controller: 'EditCustomerCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function() {},
                function() {});
        };

        $scope.delete = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteCustomerModal.html',
                controller: 'DeleteCustomerCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function() {},
                function() {});
        };
    }
]);


app.controller('AddCustomerCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModalInstance', 'CustomerService',
    function($scope, AuthService, $state, FisheryService, $uibModalInstance, CustomerService) {
        $scope.ok = function() {
            console.log('ok');
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };
    }
]);


app.controller('EditCustomerCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModalInstance', 'CustomerService',
    function($scope, AuthService, $state, FisheryService, $uibModalInstance, CustomerService) {
        $scope.ok = function() {
            console.log('ok')
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };
    }
]);

app.controller('DeleteCustomerCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModalInstance', 'CustomerService',
    function($scope, AuthService, $state, FisheryService, $uibModalInstance, CustomerService) {
        $scope.ok = function() {
            console.log('ok')
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };
    }
]);
