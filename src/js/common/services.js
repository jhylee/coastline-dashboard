var app = angular.module('coastlineWebApp.common.services', ['ui.bootstrap', 'ngStorage',
  'ui.router']);


app.factory('SideNavData', ['$http', '$localStorage', 'FisheryData', function($http, $localStorage, FisheryData) {

    $localStorage.view = overview;

    return {
        getView: function () {
            return view;
        },

        setView: function (newView) {
            view = newView;
        },
        getSupplyChains: function (fisheryId, success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains').success(success).error(error);
        },


    }
}]);


app.factory('FisheryData', ['$http', 'apiUrl', '$localStorage', function($http, apiUrl, $localStorage) {
    'use strict';

    var baseUrl = apiUrl;

    var fishery;


    $http.get(baseUrl + '/api/fisheries').success(function (res) {
        for (var i = 0; i < res.length; i ++) {
                $localStorage.fisheryName = res[i].name;
                $localStorage.$save();
                fishery = {name: res[i].name, _id: res[i]._id};
                // var fisheryName = $localStorage.fisheryName;
                // console.log("fisheryName " + fisheryName);
                console.log(fishery);
            // }
        }
        // success(fishery);
    }).error(function (err) {
        console.log("Error getting fishery. " + err)
    });

    return  {
        fetchFishery: function () {

            return $http.get(baseUrl + '/api/user').then(function (res) {
                console.log(res);
                return res.data.fishery;
            }).then(function (res) {
                fishery = { name: res.name, _id: res._id };
                console.log(fishery);
                return fishery;
            }).catch(function (err) {
                return err;
            });


        },
        getFishery: function () {
            return fishery;
        },
        getFisheryName: function () {
            if (fishery) {
                return fishery.name;
            };
        },
        getFisheryId: function () {
            if (fishery) {
                return fishery._id;
            };
        }
        // setFishery:
    };
}]);


app.factory('BlockData', ['$http', 'apiUrl', '$localStorage', 'FisheryData', function($http, apiUrl, $localStorage, FisheryData) {
    'use strict';

    var baseUrl = apiUrl;

    var _selectedBlockId;



    return  {
        getSelectedBlockId: function () {
            return _selectedBlockId;
        },
        setSelectedBlockId: function (selectedBlockId) {
            _selectedBlockId = selectedBlockId;
        },
        fetchHistory: function(blockId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/history/' + blockId)
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                    return err
                })
        },
        fetchSelectedBlockHistory: function() {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/history/' + _selectedBlockId)
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                    return err
                })
        },
        fetchBlock: function (blockId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/blocks/' + blockId)
                .then(function (res) {
                    return res.data;
                });
        }

    };
}]);



app.factory('SupplyChainMenu', ['$http', 'apiUrl', 'FisheryData', function($http, apiUrl, FisheryData) {
    var view = 'home';
    var baseUrl = apiUrl;

    return {
        getView: function () {
            return view;
        },
        setView: function (newView) {
            view = newView;
        },
        getSupplyChains: function (fisheryId, success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains').success(success).error(error);
        }
    }
}]);

// for management of the supply chain builder
app.factory('SupplyChainData', ['$http', 'apiUrl', 'Fishery', '$localStorage', 'FisheryData', function($http, apiUrl, Fishery, $localStorage, FisheryData) {
    'use strict';

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

    // HELPER FUNCTIONS

    // find a stage by id
    var findStage = function (stageId) {
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
    var findEdge = function (fromId, toId, edges) {
        for (var i = 0; i < edges.length; i++) {
            if (edges[i].fromId == fromId && edges[i].to == toId) {
                return i;
            }
        };
        return null;
    };

    // get the stage furthest right
    var refreshStageFurthestRight = function () {
        if (supplyChain) {
            for (var i = 0; i < stages.length; i ++) {
                if (stages[i].x > furthestRight) furthestRight = stages[i].x;
            }
        }
    };

    // public methods
    return {

        clearStages: function () {
            stages = [];
        },

        setToState: function (state) {
            toState = state;
        },

        getToState: function () {
            return toState;
        },

        chargeLeaveTicket: function () {
            canLeave = true;
        },

        getLeaveTicket: function () {
            var bool = canLeave;
            canLeave = false;
            return bool;
        },

        getSupplyChains: function (success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains').success(success).error(error);
        },

        // get all stages
        getStages: function () {
            if (stages) {
                return stages;
            }
        },

        fetchStages: function () {
            console.log(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains/' + supplyChain._id + '/stages/normal');
            return $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains/' + supplyChain._id + '/stages/normal')
                .then(function (res) {
                    console.log(res.data);
                    stages = res.data;
                    return stages;
                })
        },

        getSellingPoints: function () {
            if (supplyChain) {
                return supplyChain.sellingPoints;
            }
        },

        postSupplyChain: function(fisheryId, data, success, error) {
            $http.post(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains', data).success(success).error(error);
        },

        // get stage by id
        getStage: function (id) {
            if (stages) {
                return stages[findStage(id)];
            }
        },


        updateStages: function () {
            console.log(stages);
            return $http.put(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains/' + supplyChain._id + '/stages', stages)
                .then(function (res) {
                    console.log(res.data);
                    stages = res.data;
                    return stages;
                })
        },

        updateStage: function (stageId, data) {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/stages/' + stageId, data)
                .then(function (res) {
                    console.log(res.data);


                    // $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains/' + supplyChain._id + '/stages/normal')
                    //     .then(function (res) {
                    //         console.log(res.data);
                    //         stages = res.data;
                    //         return stages;
                    //     })

                    return res.data;
                })
        },

        // select stage by id
        selectStage: function (stageId) {
            selectedStageId = stageId;
        },

        // deselect the current selected stage
        deselectStage: function (stageId) {
            selectedStageId = null;
        },

        // get the current selected stage
        getSelectedStage: function () {
            return supplyChain.stages[findStage(selectedStageId)];
        },

        getSelectedStageId: function () {
            return stages[findStage(selectedStageId)].self._id;
        },

        setSelectedBlocks: function (blocks) {
            selectedBlocks = blocks;
        },

        getSelectedBlocks: function () {
            return selectedBlocks;
        },

        setSelectedBlock: function (block) {
            selectedBlock = block;
        },

        getSelectedBlock: function () {
            return selectedBlock;
        },

        // move the stage to a new (x, y) coordinate
        moveStage: function (id, x, y) {
            if (supplyChain) {
                var index = findStage(id);
                stages[index].x = x;
                stages[index].y = y;
            }
        },

        setSupplyChain: function (newSupplyChain) {
            stages = [];
            supplyChain = newSupplyChain;
        },

        deleteStage: function (id) {
            var stageIndex = findStage(id);

            for (var i = 0; i < stages.length; i ++) {

                var newNext = [];

                for (var j = 0; j < stages[i].next.length; j ++) {
                    if (stages[i].next[j] != id) {
                        newNext.push(stages[i].next[j]);
                    }
                }

                stages[i].next = newNext;


                var newPrev = [];

                for (var j = 0; j < stages[i].prev.length; j ++) {
                    if (stages[i].prev[j] != id) {
                        newPrev.push(stages[i].prev[j]);
                    }
                }

                stages[i].prev = newPrev;


            };

            var newStages = [];

            for (var i = 0; i < stages.length; i ++) {
                if (stageIndex != i) {
                    newStages.push(stages[i]);
                }
            };

            stages = newStages;

        },

        // add a new stage
        addStage: function (name, prev, success) {
            if (supplyChain) {
                var id = Date.now();
                var x;
                refreshStageFurthestRight();

                if (furthestRight == null) x = 0;
                else x = furthestRight + 150;


                var stageData = {name: name};
                $http.post(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/stages', stageData).success(
                    function (stage) {

                        // TODO check prev and next for all nodes when adding, etc

                        var y = 0;

                        var lowestX = null;
                        var lowestY = null;


                        if (prev) {
                            var prevStage = stages[findStage(prev._id)];
                            console.log(prevStage.next);

                            for (var i = 0; i < prevStage.next.length; i ++) {
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
                    }).error(function (error) {
                        console.log(error);
                    });
            }
        },

        linkStages: function (sourceId, targetId) {
            var sourceStage = stages[findStage(sourceId)];
            var targetStage = stages[findStage(targetId)];

            var isTargetInSourceNext;
            var isSourceInTargetPrev;

            for (var i = 0; i < sourceStage.next.length; i ++) {
                if (sourceStage.next[i] == targetId) {
                    isTargetInSourceNext = true;
                }
            };

            for (var i = 0; i < targetStage.prev.length; i ++) {
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

        unlinkStages: function (sourceId, targetId) {
            console.log('unlinkStages');
            var sourceStage = stages[findStage(sourceId)];
            var targetStage = stages[findStage(targetId)];

            var targetInSourceNext = null;
            var sourceInTargetPrev = null;

            for (var i = 0; i < sourceStage.next.length; i ++) {
                if (sourceStage.next[i] == targetId) {
                    targetInSourceNext = i;
                }
            };

            for (var i = 0; i < targetStage.prev.length; i ++) {
                if (targetStage.prev[i] == sourceId) {
                    sourceInTargetPrev = i;
                }
            };

            console.log(targetInSourceNext);
            console.log(sourceInTargetPrev);


            if (targetInSourceNext != null) {
                var newSourceNext = [];

                for (var i = 0; i < sourceStage.next.length; i ++){
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

                for (var i = 0; i < targetStage.prev.length; i ++){
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

        getSupplyChain: function () {
            if (supplyChain) {
                return supplyChain;
            }
        },

        getSupplyChainId: function () {
            if (supplyChain) {
                return supplyChain._id;
            }
        },

        // reconstructs the graph and returns nodes and edges for graphical display
        getDisplayData: function () {
            var data = {
                nodes: [],
                edges: []
            };

            console.log(stages);

            if (stages) {
                for (var i = 0; i < stages.length; i ++) {
                    var node = {};
                    node.label = stages[i].self.name;
                    node.id = stages[i].self._id;
                    node.scaling = { min: 10, max: 10, label: { min: 10, max: 24} };
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
                for (var i = 0; i < stages.length; i ++) {
                    for (var j = 0; j < stages[i].prev.length; j ++) {
                        if (data.edges.indexOf({from: stages[i].prev[j], to: stages[i].self._id}) == -1 &&
                            stages[i].prev[j] && stages[i].prev[j] != [] &&
                            stages[i].self._id && stages[i].self._id != []) {
                                data.edges.push({from: stages[i].prev[j], to: stages[i].self._id});
                        }
                    };
                }
            }

            return data;
        }



        // // reconstructs the graph and returns nodes and edges for graphical display
        // getDisplayData: function () {
        //     var data = {
        //         nodes: [],
        //         edges: []
        //     };
        //
        //     if (supplyChain) {
        //         for (var i = 0; i < supplyChain.stages.length; i ++) {
        //             var node = {};
        //             node.label = supplyChain.stages[i].name;
        //             node.id = supplyChain.stages[i].self;
        //             node.scaling = { min: 10, max: 10, label: { min: 10, max: 24} };
        //             node.value = 25;
        //             node.size = 25;
        //             node.color = "#93D276"
        //             node.shape = "box";
        //             node.shadow = false;
        //             node.x = supplyChain.stages[i].x;
        //             node.y = supplyChain.stages[i].y;
        //             data.nodes.push(node);
        //         }
        //
        //         // link nodes
        //         for (var i = 0; i < supplyChain.stages.length; i ++) {
        //             for (var j = 0; j < supplyChain.stages[i].prev.length; j ++) {
        //                 if (data.edges.indexOf({from: supplyChain.stages[i].prev[j], to: supplyChain.stages[i].self}) == -1 &&
        //                     supplyChain.stages[i].prev[j] && supplyChain.stages[i].prev[j] != [] &&
        //                     supplyChain.stages[i].self && supplyChain.stages[i].self != []) {
        //                         data.edges.push({from: supplyChain.stages[i].prev[j], to: supplyChain.stages[i].self});
        //                 }
        //             };
        //         }
        //     }
        //
        //     return data;
        // },
    };
}]);


app.factory('StageData', ['$http', 'apiUrl', 'Fishery', '$localStorage', 'FisheryData', function($http, apiUrl, Fishery, $localStorage, FisheryData) {

    var baseUrl = apiUrl;

    var selectedStage;

    var fetchNormalStages = function () {
        return $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains').
            then(function (res) {
                console.log(res.data[0].stages);

                var stages = [];

                for (var i = 0; i < res.data[0].stages.length; i ++) {
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

            }).catch(function (err) {
                console.log(err);
            });
    };

    return {

        getStages: function () {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/stages/all');
        },

        getNormalStages: function () {
            console.log('StageData getNormalStages');
            return fetchNormalStages()
        },

        fetchStage: function (stageId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/stages/' + stageId)
                .then(function (res) {
                    return res.data;
                });
        },

        getSellingPoints: function (success, error) {
            console.log('StageData getSellingPoints');
            $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/stages/selling').success(success).error(error);
        },// reconstructs the graph and returns nodes and edges for graphical display


        getDisplayData: function () {
            return fetchNormalStages().then(function (stages) {

                    console.log(stages);

                    var data = {
                        nodes: [],
                        edges: []
                    };

                    for (var i = 0; i < stages.length; i ++) {
                        var node = {};
                        node.label = stages[i].name;
                        node.id = stages[i]._id;
                        node.scaling = { min: 10, max: 10, label: { min: 10, max: 24} };
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
                    for (var i = 0; i < stages.length; i ++) {
                        for (var j = 0; j < stages[i].prev.length; j ++) {
                            if (data.edges.indexOf({from: stages[i].prev[j], to: stages[i].self}) == -1 &&
                                stages[i].prev[j] && stages[i].prev[j] != [] &&
                                stages[i].self && stages[i].self != []) {
                                    data.edges.push({from: stages[i].prev[j], to: stages[i].self});
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
