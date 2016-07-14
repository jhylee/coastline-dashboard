var app = angular.module('coastlineWebApp.customers.controllers', ['ui.bootstrap',
    'coastlineWebApp.customers.services',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'coastlineConstants',
    'ui.router'
]);



app.controller('CustomerDisplayCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModal', 'CustomerService', 'TutorialService',
    function($scope, AuthService, $state, FisheryService, $uibModal, CustomerService, TutorialService) {
      $scope.tutorial = TutorialService;

        var refreshCustomers = function(startIndex, endIndex) {
            CustomerService.getCustomersLength().then(function(data) {
                $scope.numberOfCustomers = data.length;
                var length = Math.ceil(data.length / 10);
                $scope.paginationArray = [];
                console.log($scope.numberOfCustomers);
                // console.log(Math.ceil(data.length / 10));
                for (var i = 0; i < length; i ++) {
                    $scope.paginationArray.push(0);
                }

                console.log($scope.paginationArray);
                CustomerService.getCustomers(startIndex, endIndex).then(function(data) {
                    $scope.customers = data;
                    console.log(data);
                    $scope.selectedCustomer = $scope.customers[0];
                })
            })
        };


        // CustomerService.getCustomersLength().then(function(data) {
        //     $scope.numberOfCustomers = data.length;
        //     var length = Math.ceil(data.length / 10)
        //     $scope.paginationArray = [];
        //     console.log($scope.numberOfCustomers);
        //     // console.log(Math.ceil(data.length / 10));
        //     for (var i = 0; i < length; i ++) {
        //         $scope.paginationArray.push(0);
        //     }
        //
        //     console.log($scope.paginationArray);
        //
        // });



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
                    refreshCustomers($scope.pageIndex * 10, ($scope.pageIndex + 1) * 10);
                },
                function() {});
        };

        $scope.editCustomer = function() {
            CustomerService.setSelectedCustomerId($scope.selectedCustomer._id);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addCustomerModal.html',
                controller: 'EditCustomerCtrl',
                size: 'lg',
                resolve: {}
            });

            modalInstance.result.then(
                function() {
                    refreshCustomers($scope.pageIndex * 10, ($scope.pageIndex + 1) * 10);
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
                    refreshCustomers($scope.pageIndex * 10, ($scope.pageIndex + 1) * 10);
                },
                function() {});
        };

        $scope.setPageIndex = function (index) {
            $scope.pageIndex = index;

            refreshCustomers($scope.pageIndex * 10, ($scope.pageIndex + 1) * 10);

        };

        $scope.setPageIndex(0);

    }
]);


app.controller('AddCustomerCtrl', ['$scope', 'AuthService', '$state', 'countries', 'states', 'FisheryService', '$uibModalInstance', 'CustomerService',
    function($scope, AuthService, $state, countries, states, FisheryService, $uibModalInstance, CustomerService) {
      $scope.countries = countries.COUNTRIES;
      $scope.states = states.STATES;

        $scope.ok = function() {

            var formValid = true;

            $scope.nameRequired = $scope.addCustomerForm.name.$error.required;
            $scope.companyRequired = $scope.addCustomerForm.company.$error.required;
            $scope.phoneRequired = $scope.addCustomerForm.phone.$error.required;
            $scope.addressRequired = $scope.addCustomerForm.address.$error.required;
            $scope.cityRequired = $scope.addCustomerForm.city.$error.required;
            $scope.stateRequired = $scope.addCustomerForm.state.$error.required;
            $scope.postalCodeRequired = $scope.addCustomerForm.postalCode.$error.required;
            $scope.countryRequired = $scope.addCustomerForm.country.$error.required;

            if (!$scope.name || !$scope.company || !$scope.phone || !$scope.address || !$scope.city || !$scope.postalCode || !$scope.country) {
                formValid = false;
            }

            if (formValid) {
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
                }).then(function(data) {
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


app.controller('EditCustomerCtrl', ['$scope', 'AuthService', '$state', 'states', 'countries', 'FisheryService', '$uibModalInstance', 'CustomerService',
    function($scope, AuthService, $state, states, countries, FisheryService, $uibModalInstance, CustomerService) {
      $scope.countries = countries.COUNTRIES;
      $scope.states = states.STATES;

        CustomerService.getSelectedCustomer().then(function(data) {
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
                state: $scope.state,
                country: $scope.country,
                notes: $scope.notes
            }).then(function(data) {
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
            CustomerService.deleteCustomer().then(function(data) {
                $uibModalInstance.close();
            })
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };
    }
]);
