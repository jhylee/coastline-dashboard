var app = angular.module('coastlineWebApp.supplyChain.controllers', ['ui.bootstrap',
  'coastlineWebApp.common.services',
  'coastlineWebApp.common.directives',
  'ui.router']);

  // SUPPLY CHAINS TAB

app.controller('SupplyChainMenuCtrl', ['$scope', '$state', 'SupplyChainMenu', 'SupplyChainData', 'Fishery',
    function ($scope, $state, SupplyChainMenu, SupplyChainData, Fishery) {

        $scope.createNewSupplyChain = function () {
            $state.go('dashboard.default.supply-chain.create');
        };

        $scope.editSupplyChain = function (supplyChain) {
            SupplyChainData.setSupplyChain(supplyChain);
            $state.go('dashboard.default.supply-chain.builder');
        };

        $scope.getSupplyChains = function () {
            Fishery.getFishery(function (fishery) {
                SupplyChainMenu.getSupplyChains(fishery._id, function (res) {
                    $scope.supplyChains = res;
                }, function (error) {
                  console.log("Error creating supplyChain.");
                      console.log(error);
                });
            })
        };


        $scope.getSupplyChains();
}]);


app.controller('SupplyChainCreateCtrl', ['$scope', '$state', 'VisDataSet', 'SupplyChainData', 'SupplyChainMenu', 'Fishery', 'FisheryData', '$localStorage',
    function ($scope, $state, VisDataSet, SupplyChainData, SupplyChainMenu, Fishery, FisheryData, $localStorage) {

        // get stages - for option display
        $scope.createSupplyChain = function () {
            var fisheryId;
            var data = {name: $scope.name};

            Fishery.getFishery(function (fishery) {
                fisheryId = FisheryData.getFisheryId();
                console.log("fisheryId " + fishery._id);

                SupplyChainData.postSupplyChain(fisheryId, data, function (res) {
                    console.log(res);
                    //SupplyChainMenu.setView('builder');
                    SupplyChainData.setSupplyChain(res);
                    $state.go('dashboard.default.supply-chain.builder');


                }, function (error) {
                    console.log("Error creating supplyChain.");
                    console.log(error);
                });

            });

        };

}]);


app.controller('SupplyChainDisplayCtrl', ['$scope', '$uibModal', 'VisDataSet', 'SupplyChainData', 'SupplyChainMenu', 'StageData',
  function ($scope, $uibModal, VisDataSet, SupplyChainData, SupplyChainMenu, StageData) {

    // $scope.$on("dashboardSwitch", function (event, newView) {
    //   console.log(newView);
    //   $scope.dashboardViewChange(newView);
    // });

    SupplyChainData.fetchStages();
    

    SupplyChainData.saveSupplyChain(function (res) {
          console.log("saved");
          $scope.refreshGraph();
      }, function (err) {
          console.log("error saving");
      });


    // refresh the graph display - done when changes are made
    $scope.refreshGraph = function () {
        $scope.data = SupplyChainData.getDisplayData();
    };

    $scope.refreshGraph();

    // initialize events object
    $scope.events = {};

    // parameters for the graph display
    $scope.options = {
        autoResize: true,
        height: '100%',
        width: '100%',
        physics: { enabled: false},
        edges: {
            arrows: {
                to: { enabled: true, scaleFactor: 1}
            },
            smooth: {
                enabled: false
            }
        }
    };

    // get initial supply chain data
    $scope.data = SupplyChainData.getDisplayData();
    console.log(SupplyChainData.getSupplyChain());

    // callback for selectNode events
    $scope.events.selectNode = function (items) {
        console.log('selectNode');
        SupplyChainData.selectStage(items.nodes[0]);
    };

    // callback for deselectNode events
    $scope.events.deselectNode = function (items) {
        console.log('deselectNode');
        SupplyChainData.deselectStage();
    };

    $scope.events.dragEnd = function (items) {
      console.log(items);
      if (items.nodes.length > 0) SupplyChainData.moveStage(items.nodes[0], items.pointer.canvas.x, items.pointer.canvas.y);
    };

    // add a stage - linked to the add button
    $scope.addStage = function() {
      console.log("addStage");

      // modal setup and preferences
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'addModalContent.html',
        controller: 'AddStageCtrl',
        size: 'lg',
        resolve: {}
      });

      // called when modal is closed
      modalInstance.result.then(
        // OK callback
        function (stage) {
          // add the stage to the supply chain
          console.log(stage);
          SupplyChainData.addStage(stage.name, stage.prev, function() {
              // refresh the graph to show the changes
              $scope.refreshGraph();
          });



          // CANCEL callback
      }, function () {});
    };

    // edit a stage - linked to the edit button
    $scope.editStage = function() {
      console.log("addStage");

      // modal setup and preferences
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'editModalContent.html',
        controller: 'EditStageCtrl',
        size: 'lg',
        resolve: {}
      });

      // called when modal is closed
      modalInstance.result.then(
        // OK callback
        function (res) {
          // retrieve the stage based on the selected id
          var stage = SupplyChainData.getStage(res.id);

          // set the stage name to the new name
          stage.name = res.name;

          // refresh the graph to show the changes
          $scope.refreshGraph();

          // CANCEL callback
      }, function () {});
    };

    $scope.saveSupplyChain = function() {
      SupplyChainData.saveSupplyChain(function (res) {
          console.log("saved");
          $scope.refreshGraph();
      }, function (err) {
          console.log("error saving");
      });
    }

    // edit a stage - linked to the edit button
    $scope.dashboardViewChange = function(dashboardView) {
      // modal setup and preferences
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'exitSupplyChain.html',
        controller: 'ExitSupplyChainCtrl',
        size: 'lg',
        resolve: {}
      });

      // called when modal is closed
      modalInstance.result.then(
        // OK callback
        function (res) {
          // TODO - Go to menu once save prompt is implemented
      }, function () {

      });
    };


  }

]);



app.controller('AddStageCtrl', ['$scope', 'VisDataSet', 'SupplyChainData', '$uibModalInstance',
    function ($scope, VisDataSet, SupplyChainData, $uibModalInstance) {

        // var prev = SupplyChainData.getSelectedStage();

        // get stages - for option display
        $scope.stages = SupplyChainData.getStages();

        // tied to ok button
        $scope.ok = function () {
          if ($scope.prev) {
              console.log('scope.prev._id ' + $scope.prev)
              $uibModalInstance.close({name: $scope.name, prev: $scope.prev.self});
          } else {
              $uibModalInstance.close({name: $scope.name});
          }
        };

        // tied to cancel button
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
}]);



app.controller('EditStageCtrl', ['$scope', 'VisDataSet', 'SupplyChainData', '$uibModalInstance',
    function ($scope, VisDataSet, SupplyChainData, $uibModalInstance) {

        // get stages - for option display
        $scope.getStages = function () {
            return SupplyChainData.getStages();
        };

        // tied to ok button
        $scope.ok = function () {
          var res = {
            name: $scope.name,
            id: $scope.selectedStage.id
          };
          $uibModalInstance.close(res);
        };

        // tied to cancel button
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
}]);




app.controller('ExitSupplyChainCtrl', ['$scope', 'VisDataSet', 'SupplyChainData', '$uibModalInstance',
    function ($scope, VisDataSet, SupplyChainData, $uibModalInstance) {

        // get stages - for option display
        $scope.getStages = function () {
            return SupplyChainData.getStages();
        };

        // tied to ok button
        $scope.ok = function () {
          console.log("ok");
          $uibModalInstance.close(true);
        };

        // tied to cancel button
        $scope.cancel = function () {
          console.log("cancel");
          $uibModalInstance.dismiss(false);
        };
}]);
