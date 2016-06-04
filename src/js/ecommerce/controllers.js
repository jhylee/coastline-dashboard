var app = angular.module('coastlineWebApp.ecommerce.controllers', ['ui.bootstrap',
   'coastlineWebApp.ecommerce.services',
   'coastlineWebApp.common.services',
   'coastlineWebApp.auth.services',
   'ui.router',
   'ngFileUpload', /*, 'searchApp', 'ngSanitize'*/
   'ngNotify'
]);



app.controller('EcommerceCtrl', ['$scope', 'AuthService', '$state', '$uibModal', 'EcommerceService',
   function($scope, AuthService, $state, $uibModal, EcommerceService) {

      EcommerceService.getEcommerceBlocks().then(function(data) {
         $scope.blocks = data;
      });

      $scope.add = function() {
         var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addEcommerceBlockModal.html',
            controller: 'AddEcommerceBlockCtrl',
            size: 'lg',
            resolve: {}
         });

         modalInstance.result.then(
            function() {
               refreshCustomers($scope.pageIndex * 10, ($scope.pageIndex + 1) * 10);
            },
            function() {});
      };

      $scope.remove = function(blockId) {
         // EcommerceService.setSelectedBlockId(blockId);
         var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'removeEcommerceBlockModal.html',
            controller: 'RemoveEcommerceBlockCtrl',
            size: 'md',
            resolve: {}
         });

         modalInstance.result.then(
            function() {},
            function() {});
      };

   }
]);

app.controller('AddEcommerceBlockCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModalInstance', 'SupplyChainService', 'EcommerceService', 'Upload',
   function($scope, AuthService, $state, FisheryService, $uibModalInstance, SupplyChainService, EcommerceService, Upload) {


      SupplyChainService.fetchSupplyChains().then(function(data) {
         console.log(data);
         $scope.supplyChains = data;
         // if ($scope.supplyChains.length > 0) {
         //    $scope.selectedSupplyChain = $scope.supplyChains[0];
         // };
      });

      $scope.$watch('selectedSupplyChain', function() {
         SupplyChainService.setSupplyChainId($scope.selectedSupplyChain._id);
         SupplyChainService.fetchStages().then(function(data) {
            $scope.stages = data
         });
      });

      $scope.$watch('selectedStage', function() {
         SupplyChainService.setSelectedStageId($scope.selectedStage.self._id);
         SupplyChainService.fetchBlocksBySelectedStage().then(function(data) {
            $scope.blocks = data;
         });
      });


      $scope.upload = function() {
         $scope.allDisabled = true;
         var data = {
            fileName: $scope.file.name,
            fileType: $scope.file.type,
            fileSize: $scope.file.size
         };

         console.log(data);

         EcommerceService.uploadImage(data).then(function(data) {
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
            Upload.http(payload).then(function() {
               $scope.allDisabled = false;
               $scope.imageUrl = data.imageUrl;
               $scope.imageName = $scope.file.name;
               console.log($scope.imageUrl);
               console.log($scope.imageName);
            });
         });


      }


      $scope.ok = function() {
         var data = {
            unitPrice: $scope.unitPrice,
            units: $scope.selectedBlock.units,
            imageUrl: $scope.imageUrl,
            description: $scope.description
         };
         EcommerceService.addBlockToEcommerce(data, $scope.selectedBlock._id).then(function() {
            $uibModalInstance.close();
         });
      };

      $scope.cancel = function() {
         $uibModalInstance.dismiss();
      };
   }
]);


app.controller('EditEcommerceBlockCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModalInstance',
   function($scope, AuthService, $state, FisheryService, $uibModalInstance) {


      $scope.ok = function() {
         $uibModalInstance.close();
      };

      $scope.cancel = function() {
         $uibModalInstance.dismiss();
      };
   }
]);

app.controller('RemoveEcommerceBlockCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', '$uibModalInstance',
   function($scope, AuthService, $state, FisheryService, $uibModalInstance) {
      $scope.ok = function() {
         $uibModalInstance.close();
      };

      $scope.cancel = function() {
         $uibModalInstance.dismiss();
      };
   }
]);
