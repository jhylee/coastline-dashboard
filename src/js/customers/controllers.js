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
                size: 'lg',
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
                templateUrl: 'addCustomerModal.html',
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

          var formValid =  true;

          $scope.nameRequired = $scope.addCustomerForm.name.$error.required;
          $scope.emailRequired = $scope.addCustomerForm.email.$error.required;
          $scope.phoneRequired = $scope.addCustomerForm.phone.$error.required;
          $scope.addressRequired = $scope.addCustomerForm.address.$error.required;
          $scope.cityRequired = $scope.addCustomerForm.city.$error.required;
          $scope.stateRequired = $scope.addCustomerForm.state.$error.required;
          $scope.postalCodeRequired = $scope.addCustomerForm.postalCode.$error.required;
          $scope.countryRequired = $scope.addCustomerForm.country.$error.required;
          console.log($scope.notes);

          if (!$scope.name || !$scope.email
              || !$scope.phone || !$scope.address || !$scope.city || !$scope.postalCode || !$scope.country) {
                formValid = false;
          }

          if (formValid){
            CustomerService.addCustomer({
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                company: $scope.company,
                address: $scope.address,
                city: $scope.city,
                state: $scope.state,
                postalCode: $scope.postalCode,
                country: $scope.country,
                notes: $scope.notes
            }).then(function (data) {
                $scope.customers = data;
                console.log(data);
                $uibModalInstance.close();
            })

          }

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
            $scope.company = data.company;
            $scope.address = data.address;
            $scope.city = data.city;
            $scope.state = data.state;
            $scope.postalCode = data.postalCode;
            $scope.country = data.country;
            $scope.notes = data.notes;
        });

        $scope.ok = function() {
            CustomerService.editCustomer({
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                company: $scope.company,
                address: $scope.address,
                city: $scope.city,
                postalCode: $scope.postalCode,
                country: $scope.country,
                notes: $scope.notes
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
