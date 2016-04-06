var app = angular.module('coastlineWebApp.common.services', ['ui.bootstrap', 'ngStorage',
    'ui.router'
]);


app.factory('SideNavService', ['$http', '$localStorage', 'FisheryService', function($http, $localStorage, FisheryService) {

    $localStorage.view = overview;

    return {
        getView: function() {
            return view;
        },

        setView: function(newView) {
            view = newView;
        }
    }
}]);


app.factory('FisheryService', ['$http', 'apiUrl', '$localStorage', function($http, apiUrl, $localStorage) {
    'use strict';

    var baseUrl = apiUrl;

    var fishery;

    $http.get(baseUrl + '/api/user').then(function(res) {
        console.log(res);
        return res.data.fishery;
    }).then(function(res) {
        fishery = {
            name: res.name,
            _id: res._id
        };
        console.log(fishery);
        return fishery;
    }).catch(function(err) {
        return err;
    });


    return {
        fetchFishery: function() {

            return $http.get(baseUrl + '/api/user').then(function(res) {
                console.log(res);
                return res.data.fishery;
            }).then(function(res) {
                fishery = {
                    name: res.name,
                    _id: res._id
                };
                console.log(fishery);
                return fishery;
            }).catch(function(err) {
                return err;
            });
        },
        getFishery: function() {
            return fishery;
        },
        getFisheryName: function() {
            if (fishery) {
                return fishery.name;
            };
        },
        getFisheryId: function() {
            if (fishery) {
                return fishery._id;
            };
        }
    };
}]);


app.factory('BlockService', ['$http', 'apiUrl', '$localStorage', 'FisheryService', function($http, apiUrl, $localStorage, FisheryService) {
    'use strict';

    var baseUrl = apiUrl;

    var _selectedBlockId;
    var _selectedBlock;



    return {
        getSelectedBlockId: function() {
            return _selectedBlockId;
        },
        setSelectedBlockId: function(selectedBlockId) {
            _selectedBlockId = selectedBlockId;
        },
        getSelectedBlock: function() {
            return _selectedBlock;
        },
        setSelectedBlock: function(selectedBlock) {
            _selectedBlock = selectedBlock;
        },
        fetchHistory: function(blockId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/history/' + blockId)
                .then(function(res) {
                    return res.data;
                }).catch(function(err) {
                    console.log(err);
                    return err
                })
        },
        fetchSelectedBlockHistory: function() {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/history/' + _selectedBlockId)
                .then(function(res) {
                    return res.data;
                }).catch(function(err) {
                    console.log(err);
                    return err
                })
        },
        fetchBlock: function(blockId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/blocks/' + blockId)
                .then(function(res) {
                    return res.data;
                });
        },
        fetchBlocksByProduct: function(productId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/products/' + productId + '/blocks')
                .then(function(res) {
                    return res.data;
                });
        }

    };
}]);


/**
 * Used to manage SupplyChain objects.
 */

app.factory('SupplyChainService', ['$http', 'apiUrl', '$localStorage', 'FisheryService', function($http, apiUrl, $localStorage, FisheryService) {
    var baseUrl = apiUrl;

    // farthest x point to the right
    var furthestRight = -150;

    // set initial stage object
    var stages;

    // stage currently selected on display
    var selectedStageId = null;

    var supplyChain;

    var selectedBlocks;
    var selectedBlock;

    var canLeave = false;
    var toState;

    // $localStorage.selectedSupplyChainId;

    // HELPER FUNCTIONS

    // find a stage by id
    var findStage = function(stageId) {
        if (stages) {
            for (var i = 0; i < stages.length; i++) {
                if (stages[i].self._id == stageId) {
                    return i;
                }
            }
        }
        return null;
    };

    // find an edge given the to and from values
    var findEdge = function(fromId, toId, edges) {
        for (var i = 0; i < edges.length; i++) {
            if (edges[i].fromId == fromId && edges[i].to == toId) {
                return i;
            }
        };
        return null;
    };

    // get the stage furthest right
    var refreshStageFurthestRight = function() {
            // if (supplyChain) {
            for (var i = 0; i < stages.length; i++) {
                if (stages[i].x > furthestRight) furthestRight = stages[i].x;
            }
        // }
    };

    // public methods
    return {

        getSupplyChainId: function() {
            return $localStorage.selectedSupplyChainId;
        },

            setSupplyChainId: function(supplyChainId) {
                $localStorage.selectedSupplyChainId = supplyChainId;
            $localStorage.$save();
        },

        // TODO - delete
        getSupplyChain: function() {
            return $localStorage.selectedSupplyChainId;
        },

        // TODO - delete
        setSupplyChain: function(newSupplyChain) {
            stages = [];
                supplyChain = newSupplyChain;
        },

        // TODO - review and/or delete
        clearStages: function() {
            stages = [];
        },

        setToState: function(state) {
            toState = state;
        },

        getToState: function() {
            return toState;
        },


        // get all stages
        getStages: function() {
            if (stages) {
                return stages;
            }
        },

        fetchStages: function() {
            console.log(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + $localStorage.selectedSupplyChainId + '/stages/normal');
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + $localStorage.selectedSupplyChainId + '/stages/normal')
                .then(function(res) {
                    console.log(res.data);
                    stages = res.data;
                    return stages;
                })
        },

            fetchSupplyChain: function (supplyChainId) {
            // $localStorage.selectedSupplyChainId;
                $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + supplyChainId)
                .then(function(res) {
                    console.log(res.data);
                        supplyChain = res.data;
                        return supplyChain;
                }).catch(function(err) {
                    console.log(err);
                })
        },

        fetchSupplyChains: function() {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains').then(function(res) {
                return res.data;
            }).catch(function(err) {
                console.log(err);
            })
        },

        fetchSelectedSupplyChain: function (supplyChainId) {
            // $localStorage.selectedSupplyChainId;
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + supplyChainId)
                .then(function(res) {
                    console.log(res.data);
                        supplyChain = res.data;
                        return supplyChain;
                }).catch(function(err) {
                    console.log(err);
                })
        },

        getSellingPoints: function() {
            if (supplyChain) {
                    return supplyChain.sellingPoints;
            }
        },

        postSupplyChain: function(fisheryId, data) {
            return $http.post(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains', data)
                .then(function(res) {
                    return res.data;
                }).catch(function(err) {
                    console.log(err);
                })
        },

        // get stage by id
        getStage: function(id) {
            if (stages) {
                return stages[findStage(id)];
            }
        },


        updateStages: function() {
            console.log($localStorage.selectedSupplyChainId);
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + $localStorage.selectedSupplyChainId + '/stages', stages)
                .then(function(res) {
                    console.log(res.data);
                    stages = res.data;
                    return stages;
                })
        },

        updateStage: function(stageId, data) {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + stageId, data)
                .then(function(res) {
                    console.log(res.data);
                    return res.data;
                })
        },

        // select stage by id
        selectStage: function(stageId) {
            selectedStageId = stageId;
        },

        // deselect the current selected stage
        deselectStage: function(stageId) {
            selectedStageId = null;
        },

        // get the current selected stage
        getSelectedStage: function() {
            return stages[findStage(selectedStageId)];
        },

        getSelectedStageId: function() {
            return stages[findStage(selectedStageId)].self._id;
        },


        // TODO - remove
        setSelectedBlocks: function(blocks) {
            selectedBlocks = blocks;
        },

        // TODO - remove
        getSelectedBlocks: function() {
            return selectedBlocks;
        },

        // TODO - remove
        setSelectedBlock: function(block) {
            selectedBlock = block;
        },

        // TODO - remove
        getSelectedBlock: function() {
            return selectedBlock;
        },

        // TODO - review if needed
        // move the stage to a new (x, y) coordinate
        moveStage: function(id, x, y) {
                // if (supplyChain) {
                var index = findStage(id);
                stages[index].x = x;
                stages[index].y = y;
            // }
        },

        deleteStage: function(id) {
            var stageIndex = findStage(id);

            for (var i = 0; i < stages.length; i++) {

                var newNext = [];

                for (var j = 0; j < stages[i].next.length; j++) {
                    if (stages[i].next[j] != id) {
                        newNext.push(stages[i].next[j]);
                    }
                }

                stages[i].next = newNext;


                var newPrev = [];

                for (var j = 0; j < stages[i].prev.length; j++) {
                    if (stages[i].prev[j] != id) {
                        newPrev.push(stages[i].prev[j]);
                    }
                }

                stages[i].prev = newPrev;


            };

            var newStages = [];

            for (var i = 0; i < stages.length; i++) {
                if (stageIndex != i) {
                    newStages.push(stages[i]);
                }
            };

            stages = newStages;

        },

        // add a new stage
        addStage: function(name, prev, success) {
                // if (supplyChain) {
                var id = Date.now();
                var x;
                refreshStageFurthestRight();

                if (furthestRight == null) x = 0;
                else x = furthestRight + 150;


                var stageData = {
                    name: name
                };
                $http.post(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages', stageData).success(
                    function(stage) {

                        // TODO check prev and next for all nodes when adding, etc

                        var y = 0;

                        var lowestX = null;
                        var lowestY = null;


                        if (prev) {
                            var prevStage = stages[findStage(prev._id)];
                            console.log(prevStage.next);

                            for (var i = 0; i < prevStage.next.length; i++) {
                                var nextStage = stages[findStage(prevStage.next[i])];
                                console.log(nextStage);

                                if (lowestY == null || nextStage.y > lowestY) {
                                    console.log("lowestY" + lowestY);
                                    lowestY = nextStage.y;
                                    lowestX = nextStage.x;
                                }

                                // x = nextStage.x;
                                // y = nextStage.y - 75;
                            }
                        }

                        if (lowestX != null) x = lowestX;
                        if (lowestY != null) y = lowestY + 75;





                        console.log(stage);

                            var supplyChainStage = {};

                            supplyChainStage.self = stage;
                            supplyChainStage.x = x;
                            supplyChainStage.y = y;
                            supplyChainStage.prev = [];
                        if (prev) {
                            // TODO - prev is an object here, whereas in getDisplayData it is treated as a string
                                supplyChainStage.prev.push(prev._id);
                        }
                            supplyChainStage.next = [];
                                supplyChainStage.isHead = (supplyChainStage.prev.length == 0);
                                supplyChainStage.isTail = (supplyChainStage.next.length == 0);
                            stages.push(supplyChainStage);

                            console.log(supplyChainStage);
                        if (prev) {
                                stages[findStage(prev._id)].next.push(supplyChainStage.self._id)
                            console.log(stages[findStage(prev._id)]);

                        }




                        success();
                    }).error(function(error) {
                    console.log(error);
                });
            // }
        },

        linkStages: function(sourceId, targetId) {
            var sourceStage = stages[findStage(sourceId)];
            var targetStage = stages[findStage(targetId)];

            var isTargetInSourceNext;
            var isSourceInTargetPrev;

            for (var i = 0; i < sourceStage.next.length; i++) {
                if (sourceStage.next[i] == targetId) {
                    isTargetInSourceNext = true;
                }
            };

            for (var i = 0; i < targetStage.prev.length; i++) {
                if (targetStage.prev[i] == sourceId) {
                    isSourceInTargetPrev = true;
                }
            };

            if (!isTargetInSourceNext) {
                console.log("!isTargetInSourceNext")
                sourceStage.next.push(targetId);
            };

            if (!isSourceInTargetPrev) {
                console.log("!isSourceInTargetPrev")
                targetStage.prev.push(sourceId);
            };

            console.log(stages);
        },

        unlinkStages: function(sourceId, targetId) {
            console.log('unlinkStages');
            var sourceStage = stages[findStage(sourceId)];
            var targetStage = stages[findStage(targetId)];

            var targetInSourceNext = null;
            var sourceInTargetPrev = null;

            for (var i = 0; i < sourceStage.next.length; i++) {
                if (sourceStage.next[i] == targetId) {
                    targetInSourceNext = i;
                }
            };

            for (var i = 0; i < targetStage.prev.length; i++) {
                if (targetStage.prev[i] == sourceId) {
                    sourceInTargetPrev = i;
                }
            };

            console.log(targetInSourceNext);
            console.log(sourceInTargetPrev);


            if (targetInSourceNext != null) {
                var newSourceNext = [];

                for (var i = 0; i < sourceStage.next.length; i++) {
                    if (sourceStage.next[i] != targetId) {
                        newSourceNext.push(sourceStage.next[i]);
                    }

                    sourceStage.next = newSourceNext;
                }

                console.log("targetInSourceNext")
                    // sourceStage.next.push(targetId);
            };

            if (sourceInTargetPrev != null) {

                var newTargetPrev = [];

                for (var i = 0; i < targetStage.prev.length; i++) {
                    if (targetStage.prev[i] != sourceId) {
                        newTargetPrev.push(targetStage.prev[i]);
                    }

                    targetStage.prev = newTargetPrev;
                }


                console.log("sourceInTargetPrev")
                    // targetStage.prev.push(sourceId);
            };

            console.log(stages);
        },







        // reconstructs the graph and returns nodes and edges for graphical display
        getDisplayData: function() {
            var data = {
                nodes: [],
                edges: []
            };

            console.log(stages);

            if (stages) {
                for (var i = 0; i < stages.length; i++) {
                    var node = {};
                    node.label = stages[i].self.name;
                    node.id = stages[i].self._id;
                    node.scaling = {
                        min: 10,
                        max: 10,
                        label: {
                            min: 10,
                            max: 24
                        }
                    };
                    node.value = 25;
                    node.size = 25;
                    node.color = "#93D276"
                    node.shape = "box";
                    node.shadow = false;
                    node.x = stages[i].x;
                    node.y = stages[i].y;
                    data.nodes.push(node);
                }

                // link nodes
                for (var i = 0; i < stages.length; i++) {
                    for (var j = 0; j < stages[i].prev.length; j++) {
                        if (data.edges.indexOf({
                                from: stages[i].prev[j],
                                to: stages[i].self._id
                            }) == -1 &&
                            stages[i].prev[j] && stages[i].prev[j] != [] &&
                            stages[i].self._id && stages[i].self._id != []) {
                            data.edges.push({
                                from: stages[i].prev[j],
                                to: stages[i].self._id
                            });
                        }
                    };
                }
            }

            return data;
        }


    };
}]);


app.factory('StageService', ['$http', 'apiUrl', '$localStorage', 'FisheryService', function($http, apiUrl, $localStorage, FisheryService) {

    var baseUrl = apiUrl;

    var selectedStageId;

    var fetchNormalStages = function() {
        return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains').
        then(function(res) {
            console.log(res.data[0].stages);

            var stages = [];

            for (var i = 0; i < res.data[0].stages.length; i++) {
                console.log(res.data[0].stages[i]);
                stages.push({
                    x: res.data[0].stages[i].x,
                    y: res.data[0].stages[i].y,
                    next: res.data[0].stages[i].next,
                    prev: res.data[0].stages[i].prev,
                    _id: res.data[0].stages[i].self._id,
                    name: res.data[0].stages[i].self.name
                });
            }

            console.log(stages);
            return stages;

        }).catch(function(err) {
            console.log(err);
        });
    };

    return {

        getStages: function() {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/all');
        },

        setSelectedStageId: function(id) {
            selectedStageId = id;
        },

        fetchSelectedStage: function() {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + selectedStageId)
                .then(function(res) {
                    return res.data;
                });
        },

        getNormalStages: function() {
            console.log('StageService getNormalStages');
            return fetchNormalStages()
        },

        fetchStage: function(stageId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + stageId)
                .then(function(res) {
                    return res.data;
                });
        },


        getDisplayData: function() {
            return fetchNormalStages().then(function(stages) {

                console.log(stages);

                var data = {
                    nodes: [],
                    edges: []
                };

                for (var i = 0; i < stages.length; i++) {
                    var node = {};
                    node.label = stages[i].name;
                    node.id = stages[i]._id;
                    node.scaling = {
                        min: 10,
                        max: 10,
                        label: {
                            min: 10,
                            max: 24
                        }
                    };
                    node.value = 25;
                    node.size = 25;
                    node.color = "#93D276"
                    node.shape = "box";
                    node.shadow = false;
                    node.x = stages[i].x;
                    node.y = stages[i].y;
                    data.nodes.push(node);
                }

                // link nodes
                for (var i = 0; i < stages.length; i++) {
                    for (var j = 0; j < stages[i].prev.length; j++) {
                        if (data.edges.indexOf({
                                from: stages[i].prev[j],
                                to: stages[i].self
                            }) == -1 &&
                            stages[i].prev[j] && stages[i].prev[j] != [] &&
                            stages[i].self && stages[i].self != []) {
                            data.edges.push({
                                from: stages[i].prev[j],
                                to: stages[i].self
                            });
                        }
                    };
                }

                return data;
            })
        },
    };
}]);




// for creation of the VisDataSet
app.factory('VisDataSet', ['$http', 'apiUrl', function($http, apiUrl) {
    'use strict';
    return function(data, options) {
        // Create the new dataSets
        return new vis.DataSet(data, options);
    };
}]);
