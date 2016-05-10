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

          var formValid =  true;

          $scope.nameRequired = $scope.addCustomerForm.name.$error.required;
          $scope.emailRequired = $scope.addCustomerForm.email.$error.required;
          $scope.phoneRequired = $scope.addCustomerForm.phone.$error.required;
          $scope.streetRequired = $scope.addCustomerForm.street.$error.required;
          $scope.cityRequired = $scope.addCustomerForm.city.$error.required;
          $scope.zipRequired = $scope.addCustomerForm.zip.$error.required;
          $scope.countryRequired = $scope.addCustomerForm.country.$error.required;
          console.log($scope.note);

          if (!$scope.name || !$scope.email
              || !$scope.phone || !$scope.street || !$scope.city || !$scope.zip || !$scope.country) {
                formValid = false;
          }

          if (formValid){
            CustomerService.addCustomer({
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                company: $scope.company,
                street: $scope.street,
                city: $scope.city,
                zip: $scope.zip,
                country: $scope.country,
                note: $scope.note
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
            $scope.street = data.street;
            $scope.city = data.city;
            $scope.zip = data.zip;
            $scope.country = data.country;
            $scope.note = data.note;
        });

        $scope.ok = function() {
            CustomerService.editCustomer({
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                company: $scope.company,
                street: $scope.street,
                city: $scope.city,
                zip: $scope.zip,
                country: $scope.country,
                note: $scope.note
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
