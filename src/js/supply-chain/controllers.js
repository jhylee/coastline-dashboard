var app = angular.module('coastlineWebApp.supplyChain.controllers', ['ui.bootstrap',
    'coastlineWebApp.common.services',
    'coastlineWebApp.common.directives',
    'ui.router'
]);

// SUPPLY CHAINS TAB

app.controller('SupplyChainMenuCtrl', ['$scope', '$state', 'SupplyChainService', 'FisheryService',
    function($scope, $state, SupplyChainService, FisheryService) {

        $scope.createNewSupplyChain = function() {
            $state.go('dashboard.default.supply-chain.create');
        };

        $scope.editSupplyChain = function(selectedSupplyChainId) {
            // TODO - make a route to get just IDs
            console.log(selectedSupplyChainId);
            SupplyChainService.setSupplyChainId(selectedSupplyChainId);

            SupplyChainService.fetchStages().then(function(res) {
                $state.go('dashboard.default.supply-chain.builder');
            });
        };

        $scope.getSupplyChains = function() {
            // Fishery.getFishery(function (fishery) {
            SupplyChainService.fetchSupplyChains().then(function(supplyChains) {
                $scope.supplyChains = supplyChains;
            });

        };


        $scope.getSupplyChains();
    }
]);


app.controller('SupplyChainCreateCtrl', ['$scope', '$state', 'VisDataSet', 'SupplyChainService', 'FisheryService', '$localStorage',
    function($scope, $state, VisDataSet, SupplyChainService, FisheryService, $localStorage) {

        // get stages - for option display
        $scope.createSupplyChain = function() {
            var fisheryId;
            var data = {
                name: $scope.name
            };

            // Fishery.getFishery(function (fishery) {
            fisheryId = FisheryService.getFisheryId();
            // console.log("fisheryId " + fishery._id);

            SupplyChainService.postSupplyChain(fisheryId, data).then(function(res) {
                console.log(res);
                SupplyChainService.setSupplyChainId(res._id);
                $state.go('dashboard.default.supply-chain.builder');
            });

        };

    }
]);


app.controller('SupplyChainDisplayCtrl', ['$scope', '$state', '$rootScope', '$uibModal', 'VisDataSet', 'SupplyChainService', 'StageService',
    function($scope, $state, $rootScope, $uibModal, VisDataSet, SupplyChainService, StageService) {

        $rootScope.$on('leaving-supply-chain-builder', function() {

            console.log('leaving');

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'saveChangesModal.html',
                controller: 'SaveChangesCtrl',
                size: 'lg',
                resolve: {}
            });

            modalInstance.result.then(
                function(res) {
                    $state.go(SupplyChainService.getToState());
                },
                function() {});
        });

        SupplyChainService.fetchStages().then(function() {
            $scope.refreshGraph();
            console.log("here");
        });

        // refresh the graph display - done when changes are made
        $scope.refreshGraph = function() {
            console.log('refreshGraph');
            SupplyChainService.updateStages();
            $scope.data = SupplyChainService.getDisplayData();
        };

        // $scope.refreshGraph();

        // initialize events object
        $scope.events = {};

        // parameters for the graph display
        $scope.options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            physics: {
                enabled: false
            },
            edges: {
                arrows: {
                    to: {
                        enabled: true,
                        scaleFactor: 1
                    }
                },
                smooth: {
                    enabled: false
                }
            }
        };

        // get initial supply chain data
        $scope.data = SupplyChainService.getDisplayData();
        console.log(SupplyChainService.getStages());
        // console.log(SupplyChainService.getSupplyChain());

        // callback for selectNode events
        $scope.events.selectNode = function(items) {
            console.log('selectNode');
            SupplyChainService.selectStage(items.nodes[0]);
        };

        // callback for deselectNode events
        $scope.events.deselectNode = function(items) {
            console.log('deselectNode');
            SupplyChainService.deselectStage();
        };

        $scope.events.dragEnd = function(items) {
            console.log(items);
            console.log(items.nodes[0]);

            if (items.nodes.length > 0) SupplyChainService.moveStage(items.nodes[0], items.pointer.canvas.x, items.pointer.canvas.y);
            SupplyChainService.updateStages();

        };

        // add a stage - linked to the add button
        $scope.addStage = function() {
            console.log("addStage");

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addModalContent.html',
                controller: 'AddStageCtrl',
                size: 'md',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(stage) {
                    // add the stage to the supply chain
                    console.log(stage);
                    SupplyChainService.addStage(stage.name, stage.prev, function(res, stages) {
                        // refresh the graph to show the changes
                        console.log(res);
                        console.log(stages);
                        $scope.refreshGraph();
                    });



                    // CANCEL callback
                },
                function() {});
        };

        // edit a stage - linked to the edit button
        $scope.editStage = function() {
            console.log("addStage");

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'editModalContent.html',
                controller: 'EditStageCtrl',
                size: 'md',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(res) {
                    // retrieve the stage based on the selected id
                    var stage = SupplyChainService.getStage(SupplyChainService.getSelectedStageId());
                    console.log(res);

                    // set the stage name to the new name
                    stage.name = res.name;

                    // refresh the graph to show the changes
                    $scope.refreshGraph();

                    // CANCEL callback
                },
                function() {});
        };

        // edit a stage - linked to the edit button
        $scope.linkStages = function() {
            console.log("editStage");

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'linkModalContent.html',
                controller: 'LinkStagesCtrl',
                size: 'md',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(res) {
                    // retrieve the stage based on the selected id
                    console.log(res);
                    //   var stage = SupplyChainService.getStage(res._id);

                    // set the stage name to the new name
                    //   stage.name = res.name;

                    // refresh the graph to show the changes
                    $scope.refreshGraph();

                    // CANCEL callback
                },
                function() {});
        };

        // edit a stage - linked to the edit button
        $scope.unlinkStages = function() {
            console.log("linkStages");

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'unlinkModalContent.html',
                controller: 'UnlinkStagesCtrl',
                size: 'md',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(res) {
                    // retrieve the stage based on the selected id
                    console.log(res);
                    //   var stage = SupplyChainService.getStage(res._id);

                    // set the stage name to the new name
                    //   stage.name = res.name;

                    // refresh the graph to show the changes
                    $scope.refreshGraph();

                    // CANCEL callback
                },
                function() {});
        };

        // edit a stage - linked to the edit button
        $scope.deleteStage = function() {
            console.log("deleteStage");

            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteStageModal.html',
                controller: 'DeleteStageCtrl',
                size: 'md',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(res) {
                    // retrieve the stage based on the selected id
                    // var stage = SupplyChainService.getStage(res.id);

                    // set the stage name to the new name
                    // stage.name = res.name;

                    // refresh the graph to show the changes
                    $scope.refreshGraph();

                    // CANCEL callback
                },
                function() {});
        };

        $scope.saveSupplyChain = function() {
            console.log("here");
            SupplyChainService.updateStages().then(function(res) {
                console.log(res);
                $scope.refreshGraph();
            });
        }

        // edit a stage - linked to the edit button
        $scope.dashboardViewChange = function(dashboardView) {
            // modal setup and preferences
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'exitSupplyChain.html',
                controller: 'ExitSupplyChainCtrl',
                size: 'md',
                resolve: {}
            });

            // called when modal is closed
            modalInstance.result.then(
                // OK callback
                function(res) {
                    // TODO - Go to menu once save prompt is implemented
                },
                function() {

                });
        };


    }

]);




app.controller('SaveChangesCtrl', ['$scope', 'VisDataSet', 'SupplyChainService', '$uibModalInstance',
    function($scope, VisDataSet, SupplyChainService, $uibModalInstance) {

        // var prev = SupplyChainService.getSelectedStage();

        // get stages - for option display
        $scope.stages = SupplyChainService.getStages();

        // tied to ok button
        $scope.yes = function() {

            SupplyChainService.updateStages().then(function(res) {
                $uibModalInstance.close(res);
            });

        };

        // tied to ok button
        $scope.no = function() {

            $uibModalInstance.close("no");

        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

app.controller('AddStageCtrl', ['$scope', 'VisDataSet', 'SupplyChainService', '$uibModalInstance',
    function($scope, VisDataSet, SupplyChainService, $uibModalInstance) {

        // var prev = SupplyChainService.getSelectedStage();

        // get stages - for option display
        $scope.stages = SupplyChainService.getStages();

        // tied to ok button
        $scope.ok = function() {
            if ($scope.prev) {
                console.log('scope.prev._id ' + $scope.prev)
                $uibModalInstance.close({
                    name: $scope.name,
                    prev: $scope.prev.self
                });
            } else {
                $uibModalInstance.close({
                    name: $scope.name
                });
            }
        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

app.controller('LinkStagesCtrl', ['$scope', 'VisDataSet', 'SupplyChainService', '$uibModalInstance',
    function($scope, VisDataSet, SupplyChainService, $uibModalInstance) {

        // var prev = SupplyChainService.getSelectedStage();

        // get stages - for option display
        $scope.stages = SupplyChainService.getStages();

        // tied to ok button
        $scope.ok = function() {

            console.log($scope.sourceStage);
            console.log($scope.targetStage);

            if ($scope.sourceStage && $scope.targetStage) {
                SupplyChainService.linkStages($scope.sourceStage.self._id, $scope.targetStage.self._id);
                console.log(SupplyChainService.getStages());


                $uibModalInstance.close('ok');


            }

            //   if ($scope.prev) {
            //       console.log('scope.prev._id ' + $scope.prev)
            //       $uibModalInstance.close({name: $scope.name, prev: $scope.prev.self});
            //   } else {
            //       $uibModalInstance.close({name: $scope.name});
            //   }
        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

app.controller('UnlinkStagesCtrl', ['$scope', 'VisDataSet', 'SupplyChainService', '$uibModalInstance',
    function($scope, VisDataSet, SupplyChainService, $uibModalInstance) {

        // var prev = SupplyChainService.getSelectedStage();

        // get stages - for option display
        $scope.stages = SupplyChainService.getStages();

        // tied to ok button
        $scope.ok = function() {


            console.log($scope.sourceStage);
            console.log($scope.targetStage);

            if ($scope.sourceStage && $scope.targetStage) {
                SupplyChainService.unlinkStages($scope.sourceStage.self._id, $scope.targetStage.self._id);
                console.log(SupplyChainService.getStages());


                $uibModalInstance.close('ok');


            }

            //   if ($scope.prev) {
            //       console.log('scope.prev._id ' + $scope.prev)
            //       $uibModalInstance.close({name: $scope.name, prev: $scope.prev.self});
            //   } else {
            //       $uibModalInstance.close({name: $scope.name});
            //   }
        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


app.controller('EditStageCtrl', ['$scope', 'VisDataSet', 'SupplyChainService', '$uibModalInstance',
    function($scope, VisDataSet, SupplyChainService, $uibModalInstance) {

        // get stages - for option display
        $scope.getStages = function() {
            return SupplyChainService.getStages();
        };

        // tied to ok button
        $scope.ok = function() {
            var res = {
                name: $scope.name,
                _id: SupplyChainService.getSelectedStageId()
            };

            SupplyChainService.updateStage(res._id, {
                    name: $scope.name
                })
                .then(function(res) {
                    SupplyChainService.fetchStages().then(function(res) {
                        $uibModalInstance.close(res);
                    })

                });




        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

app.controller('DeleteStageCtrl', ['$scope', 'VisDataSet', 'SupplyChainService', '$uibModalInstance',
    function($scope, VisDataSet, SupplyChainService, $uibModalInstance) {

        // get stages - for option display
        $scope.getStages = function() {
            return SupplyChainService.getStages();
        };

        // tied to ok button
        $scope.ok = function() {

            SupplyChainService.deleteStage(SupplyChainService.getSelectedStageId());
            console.log(SupplyChainService.getStages());
            $uibModalInstance.close('ok');


        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);




app.controller('ExitSupplyChainCtrl', ['$scope', 'VisDataSet', 'SupplyChainService', '$uibModalInstance',
    function($scope, VisDataSet, SupplyChainService, $uibModalInstance) {

        // get stages - for option display
        $scope.getStages = function() {
            return SupplyChainService.getStages();
        };

        // tied to ok button
        $scope.ok = function() {
            console.log("ok");
            $uibModalInstance.close(true);
        };

        // tied to cancel button
        $scope.cancel = function() {
            console.log("cancel");
            $uibModalInstance.dismiss(false);
        };
    }
]);
