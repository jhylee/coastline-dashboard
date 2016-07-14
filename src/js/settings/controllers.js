var app = angular.module('coastlineWebApp.settings.controllers', ['ui.bootstrap',
   'coastlineWebApp.settings.services',
   'coastlineWebApp.auth.services',
   'coastlineWebApp.common.services',
   'coastlineConstants',
   'ui.router',
   'ngNotify'
]);

app.controller('MobileNavCtrl', ['$scope', 'AuthService', '$state', '$window', 'FisheryService', 'SettingsService',
   function($scope, AuthService, $state,  $window, FisheryService, SettingsService) {

      $scope.window = $window;


      //TODO dynamic changing navButons
      // $scope.$watch('window.innerWidth', function() {

      if ($window.innerWidth <= 768) {
         $scope.showMobileTab = true;
         console.log(true);
         return true;
      } else {
         console.log(false);
         return false;
      }

      // })



   }
]);

app.controller('GeneralSettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', 'SettingsService', 'TutorialService',
   function($scope, AuthService, $state, FisheryService, SettingsService, TutorialService) {

      $scope.isLoading = true;
      $scope.tutorial = TutorialService;

      SettingsService.fetchUser().then(function(data) {
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
         } else {
            return false;
         }
      };

      $scope.saveChanges = function() {
         $scope.isLoading = true;

         SettingsService.updateUser({
            name: $scope.name,
            email: $scope.email,
            phone: $scope.phone,
         }).then(function(data) {
            $scope.name = data.name;
            $scope.email = data.email;
            $scope.phone = data.phone;

            $scope.isLoading = false;
         })
      };
   }
]);

app.controller('EcommerceSettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', 'SettingsService', '$location', 'ngNotify', 'TutorialService',
   function($scope, AuthService, $state, FisheryService, SettingsService, $location, ngNotify, TutorialService) {
     $scope.tutorial = TutorialService;

      var url = $location.absUrl();
      console.log(url);
      // isStripeValid = $scope.isStripeValid;

      var checkStripeIntegration = function () {
         SettingsService.fetchStripeIntegration().then(function(data) {
            console.log(data);

            if (url.includes("true")) {
               console.log('failure');
               $scope.isStripeValid = 0;
            }
            else if (url.includes("false")) {
               console.log('success');
               $scope.isStripeValid = 1;
            }
            else {
               $scope.isStripeValid = 2;
            }
         });
      };

      checkStripeIntegration();

      $scope.remove = function () {
         SettingsService.removeStripeIntegration().then(function (data) {
            console.log(data);
            if (data.error == "No Stripe Integration found.") {
               $scope.stripeRemoved = 0;
            }
            else if (data.msg == "Successfully deleted stripeIntegration.") {
               $scope.stripeRemoved = 1;
            }
            else {
               $scope.stripeRemoved = 2;
            }


            checkStripeIntegration();

         });
      };

   }
]);

app.controller('FisherySettingsCtrl', ['$scope', 'AuthService', '$state', 'states', 'countries', 'FisheryService', 'SettingsService', 'TutorialService', 'Upload',
   function($scope, AuthService, $state, states, countries, FisheryService, SettingsService, TutorialService, Upload) {

      $scope.isLoading = true;
      $scope.countries = countries.COUNTRIES;
      $scope.states = states.STATES;
      $scope.tutorial = TutorialService;


      SettingsService.fetchFishery().then(function(data) {
         $scope.name = data.name;
         $scope.address = data.address;
         $scope.city = data.city;
         $scope.state = data.state;
         $scope.postalCode = data.postalCode;
         $scope.phone = data.phone;
         $scope.salesPhone = data.salesPhone;
         $scope.faxPhone = data.faxPhone;
         $scope.disclaimer = data.disclaimer;
         $scope.shopName = data.shopName;
         $scope.isLoading = false;

      });

      SettingsService.fetchUser().then(function(data) {
         if (data.accountType == "staff") {
            $scope.isDisabled = true;
         }
      });

      $scope.isSubmitButtonDisabled = function() {
         return false;
      };



      $scope.saveChanges = function() {

         $scope.isLoading = true;
         console.log($scope.taxNumber);

         var data = {
            name: $scope.name,
            address: $scope.address,
            city: $scope.city,
            state: $scope.state,
            postalCode: $scope.postalCode,
            phone: $scope.phone,
            salesPhone: $scope.salesPhone,
            faxPhone: $scope.faxPhone,
            taxNumber: $scope.taxNumber,
            shopName: $scope.shopName,
            disclaimer: $scope.disclaimer
         };

         if ($scope.file) {
            data.fileName = $scope.file.name;
            data.fileType = $scope.file.type;
            data.fileSize = $scope.file.size;
         };

         SettingsService.updateFishery(data).then(function(data) {
            $scope.name = data.fishery.name;
            $scope.address = data.fishery.address;
            $scope.city = data.fishery.city;
            $scope.state = data.fishery.state;
            $scope.postalCode = data.fishery.postalCode;
            $scope.phone = data.fishery.phone;
            $scope.salesPhone = data.fishery.salesPhone;
            $scope.faxPhone = data.fishery.faxPhone;
            $scope.taxNumber = data.fishery.taxNumber;
            $scope.shopName = data.fishery.shopName;
            $scope.disclaimer = data.fishery.disclaimer;

            console.log(data);
            if ($scope.file) {
               if (data.signedUrl) {
                  var payload = {
                     url: data.signedUrl,
                     data: $scope.file,
                     headers: {
                        'Content-Type': $scope.file.type,
                        'x-amz-acl': 'public-read',
                     },
                     ignoreInterceptor: true,
                     method: "PUT"
                  };
               }
               Upload.http(payload);
            }
            $scope.isLoading = false;

         })
      };
   }
]);


app.controller('UserSettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModal', 'SettingsService', 'TutorialService',
   function($scope, AuthService, $state, FisheryService, $uibModal, SettingsService, TutorialService) {
     $scope.tutorial = TutorialService;

      SettingsService.fetchUsers().then(function(data) {
         $scope.users = data;
      });

      SettingsService.fetchUser().then(function(data) {
         if (data.accountType == "staff") {
            $scope.isInviteDisabled = true;
         }
      });

      $scope.inviteUser = function() {
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


   }
]);


app.controller('SecuritySettingsCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModal', 'SettingsService', '$window', 'TutorialService',
   function($scope, AuthService, $state, FisheryService, $uibModal, SettingsService, $window, TutorialService) {
     $scope.tutorial = TutorialService;

      $scope.formData = {};
      $scope.isDisabled = true;

      $scope.saveChanges = function() {
         var formValid = false;
         if ($scope.formData.password || $scope.formData.newPassword || $scope.formData.newPasswordAgain) {
            if ($scope.formData.newPassword == $scope.formData.newPasswordAgain) {
               formValid = true;
            }
         }

         $scope.isDisabled = true;
         if (formValid) {
            SettingsService.changePassword($scope.formData).then(function(data) {
               $scope.isDisabled = false;
               if (data.success) {
                  $window.alert("Password changed.");

               } else {
                  $window.alert("Incorrect old password!");

               }
               console.log("password changed");
            }).catch(function (err) {
               console.log("password not changed - invalid old pw");

            });
         } else {
            // TODO validation pls
            $window.alert("Please fill in all the required fields correctly.");
            console.log("password bad form");


         }
      };
   }
]);


app.controller('InviteUserCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', 'SettingsService', '$uibModalInstance',
   function($scope, AuthService, $state, FisheryService, SettingsService, $uibModalInstance) {

      $scope.ok = function() {
         console.log($scope.email);
         console.log($scope.accountType);
         SettingsService.inviteUser({
            email: $scope.email,
            accountType: $scope.accountType
         }).then(function(res) {
            $uibModalInstance.close();
         })
      };

      $scope.cancel = function() {
         $uibModalInstance.dismiss();
      };

   }
]);
