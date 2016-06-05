var app = angular.module('coastlineWebApp.supplyChain.controllers', ['ui.bootstrap',
    'coastlineWebApp.common.services',
    'coastlineWebApp.common.directives',
    'ui.router'
]);

// SUPPLY CHAINS TAB

app.controller('SupplyChainMenuCtrl', ['$scope', '$state', 'SupplyChainService', 'FisheryService', '$uibModal',
    function($scope, $state, SupplyChainService, FisheryService, $uibModal) {

        var getSupplyChains = function() {
            // Fishery.getFishery(function (fishery) {
            return SupplyChainService.fetchSupplyChains().then(function(supplyChains) {
                $scope.supplyChains = supplyChains;
                if ($scope.supplyChains.length > 0) {
                    $scope.selectedSupplyChain = 0;
                    console.log($scope.supplyChains);
                }

            });

        };

        getSupplyChains();


        $scope.createNewSupplyChain = function() {
            $state.go('dashboard.default.supply-chain.create');
        };

        $scope.editSupplyChain = function(index) {
            // TODO - make a route to get just IDs
            SupplyChainService.setSupplyChainId($scope.supplyChains[index]._id);

            SupplyChainService.fetchStages().then(function(res) {
                $state.go('dashboard.default.supply-chain.builder');
            });
        };

        // $scope.noNodeSelected = function(){
        //    if ( !=null){
        //      return false;
        //    }
        //    else {
        //      return false;
        //    }
        // }

        $scope.renameSupplyChain = function(index) {
            // TODO - make a route to get just IDs
            SupplyChainService.setSupplyChainId($scope.supplyChains[index]._id);
            // console.log(selectedSupplyChain);

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'renameSupplyChain.html',
                controller: 'RenameSupplyChainCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function() {
                    getSupplyChains();
                },
                function() {

                });

        };


        $scope.deleteSupplyChain = function(index) {
            // TODO - make a route to get just IDs
            SupplyChainService.setSupplyChainId($scope.supplyChains[index]._id);
            // console.log(selectedSupplyChain);

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'deleteSupplyChain.html',
                controller: 'DeleteSupplyChainCtrl',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(
                function() {
                    getSupplyChains();
                },
                function() {

                });

        };


    }
]);


app.controller('SupplyChainCreateCtrl', ['$scope', '$state', 'VisDataSet', 'SupplyChainService', 'FisheryService', '$localStorage',
    function($scope, $state, VisDataSet, SupplyChainService, FisheryService, $localStorage) {

        $scope.isSubmitButtonDisabled = function() {
            if (!$scope.name) {
                return true;
            } else {
                return false;
            }
        };

        // get stages - for option display
        $scope.createSupplyChain = function() {
            var fisheryId;
            var data = {
                name: $scope.name
            };

            // Fishery.getFishery(function (fishery) {
            fisheryId = FisheryService.getFisheryId();

            SupplyChainService.postSupplyChain(fisheryId, data).then(function(res) {
                SupplyChainService.setSupplyChainId(res._id);
                $state.go('dashboard.default.supply-chain.builder');
            });

        };

    }
]);


app.controller('SupplyChainDisplayCtrl', ['$scope', '$state', '$rootScope', '$uibModal', 'VisDataSet', 'SupplyChainService',
    function($scope, $state, $rootScope, $uibModal, VisDataSet, SupplyChainService) {

        $rootScope.$on('leaving-supply-chain-builder', function() {


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
        });

        // refresh the graph display - done when changes are made
        $scope.refreshGraph = function() {
            SupplyChainService.updateStages();
            $scope.noNodeSelected = !SupplyChainService.getSelectedStageId();
            console.log($scope.noNodeSelected);
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
            nodes: {
                color: {
                    background: '#3E525C',
                    highlight: {
                        // border: '#2B7CE9',
                        background: '#202B31'
                    },
                },
                font: {
                    color: '#FFF',
                    size: 16,
                    face: 'Roboto'
                },
                shape: 'box',
                scaling: {
                    min: 10,
                    max: 10,
                    label: {
                        min: 10,
                        max: 24
                    }
                }
            },

            edges: {
                color: {
                    color: '#000',
                    highlight: '#000å'
                },
                arrows: {
                    to: {
                        enabled: true,
                        scaleFactor: 1.1
                    }
                },
                smooth: {
                    enabled: false
                }
            }
        };

        // get initial supply chain data
        $scope.data = SupplyChainService.getDisplayData();

        // callback for selectNode events
        $scope.events.selectNode = function(items) {
            SupplyChainService.setSelectedStageId(items.nodes[0]);
            $scope.noNodeSelected = false;
            console.log('selectNode' + $scope.noNodeSelected);
            console.log($scope.noNodeSelected);


        };

        // callback for deselectNode events
        $scope.events.deselectNode = function(items) {
            SupplyChainService.setSelectedStageId(null);
            $scope.noNodeSelected = true;
            console.log('deselectNode' + $scope.noNodeSelected);
            console.log($scope.noNodeSelected);

        };

        $scope.events.dragEnd = function(items) {
            if (items.nodes.length > 0) SupplyChainService.moveStage(items.nodes[0], items.pointer.canvas.x, items.pointer.canvas.y);
            SupplyChainService.updateStages();
            SupplyChainService.setSelectedStageId(items.nodes[0]);
            // $scope.noNodeSelected = !SupplyChainService.getSelectedStageId();


        };

        // add a stage - linked to the add button
        $scope.addStage = function() {

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

                    SupplyChainService.addStage(function(res, stages) {
                        // refresh the graph to show the changes
                        $scope.refreshGraph();
                    }, stage.name, stage.prev, stage.isSellingPoint, stage.sellingTargets);

                    // CANCEL callback
                },
                function() {});
        };

        // edit a stage - linked to the edit button
        $scope.editStage = function() {

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
            SupplyChainService.updateStages().then(function(res) {
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
                $uibModalInstance.close({
                    name: $scope.name,
                    isSellingPoint: $scope.isSellingPoint,
                    // sellingTargets: sellingTargets,
                    prev: $scope.prev.self
                });
            } else {
                $uibModalInstance.close({
                    name: $scope.name,
                    isSellingPoint: $scope.isSellingPoint
                        // sellingTargets: sellingTargets
                });
            }
        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.isSubmitButtonDisabled = function() {
            if (!$scope.name) {
                return true;
            } else {
                return false;
            }
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

            if ($scope.sourceStage && $scope.targetStage) {
                SupplyChainService.linkStages($scope.sourceStage.self._id, $scope.targetStage.self._id);


                $uibModalInstance.close('ok');


            }

            //   if ($scope.prev) {
            //       ('scope.prev._id ' + $scope.prev)
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



            if ($scope.sourceStage && $scope.targetStage) {
                SupplyChainService.unlinkStages($scope.sourceStage.self._id, $scope.targetStage.self._id);


                $uibModalInstance.close('ok');


            }

        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


app.controller('EditStageCtrl', ['$scope', 'VisDataSet', 'SupplyChainService', '$uibModalInstance',
    function($scope, VisDataSet, SupplyChainService, $uibModalInstance) {

        SupplyChainService.fetchSelectedStage().then(function(data) {
            $scope.name = data.name;
            $scope.isSellingPoint = data.isSellingPoint;
        })

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
                    name: $scope.name,
                    isSellingPoint: $scope.isSellingPoint
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

        $scope.isSubmitButtonDisabled = function() {
            if (!$scope.name) {
                return true;
            } else {
                return false;
            }
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
            $uibModalInstance.close(true);
        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss(false);
        };
    }
]);


app.controller('RenameSupplyChainCtrl', ['$scope', 'VisDataSet', 'SupplyChainService', '$uibModalInstance',
    function($scope, VisDataSet, SupplyChainService, $uibModalInstance) {


        SupplyChainService.fetchSelectedSupplyChain().then(function(data) {
            $scope.supplyChain = data;
        });

        // tied to ok button
        $scope.ok = function() {
            SupplyChainService.updateSelectedSupplyChain($scope.supplyChain).then(function(data) {
                console.log(data);
                $uibModalInstance.close(true);
            })
        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss(false);
        };
    }
]);

app.controller('DeleteSupplyChainCtrl', ['$scope', 'VisDataSet', 'SupplyChainService', '$uibModalInstance',
    function($scope, VisDataSet, SupplyChainService, $uibModalInstance) {


        SupplyChainService.fetchSelectedSupplyChain().then(function(data) {
            $scope.supplyChain = data;
        });

        // tied to ok button
        $scope.ok = function() {
            SupplyChainService.deleteSelectedSupplyChain().then(function(data) {
                console.log(data);
                $uibModalInstance.close(true);
            })
        };

        // tied to cancel button
        $scope.cancel = function() {
            $uibModalInstance.dismiss(false);
        };
    }
]);
