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
        }


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
            console.log(fishery);
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
    // var stages = [];

    // stage currently selected on display
    var selectedStageId = null;

    var supplyChain;

    var selectedBlocks;
    var selectedBlock;

    // HELPER FUNCTIONS

    // find a stage by id
    var findStage = function (stageId) {
        if (supplyChain) {
            for (var i = 0; i < supplyChain.stages.length; i++) {
                if (supplyChain.stages[i].self == stageId) {
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
            for (var i = 0; i < supplyChain.stages.length; i ++) {
                if (supplyChain.stages[i].x > furthestRight) furthestRight = supplyChain.stages[i].x;
            }
        }
    };

    // public methods
    return {

        getSupplyChains: function (success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains').success(success).error(error);
        },


        getSupplyChain: function () {
            if (supplyChain) {
                return supplyChain;
            }
        },

        setSupplyChain: function (newSupplyChain) {
            supplyChain = newSupplyChain;
        },


        getSupplyChainId: function () {
            if (supplyChain) {
                return supplyChain._id;
            }
        },


        // get all stages
        getStages: function () {
            if (supplyChain) {
                return supplyChain.stages;
            }
        },

        fetchStages: function () {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains/' + supplyChain._id + '/stages/normal')
                .then(function (res) {
                    console.log(res.data);
                    return res.data;
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

        saveSupplyChain: function (success, error) {
            // Fishery.getFishery(function (fishery) {
                $http.put(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplychains/' + supplyChain._id, supplyChain).success(
                    function (res) {
                        supplyChain = res;

                        // TODO - make a backend route to easily get the name of the stage
                        for (var i = 0; i < supplyChain.stages.length; i ++) {

                            $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/stages/' + supplyChain.stages[i].self).success(function (stage) {
                                var index = findStage(stage._id);
                                if (index != null) {
                                    supplyChain.stages[index].name = stage.name;
                                }
                                success(res);

                            }).error(function (err) {
                                console.log(err)
                            });
                        };
                    }).error(function (err) {
                        console.log(err);
                        error(err);
                    });
            // })

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
            return supplyChain.stages[findStage(selectedStageId)].self;
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
                supplyChain.stages[index].x = x;
                supplyChain.stages[index].y = y;
            }
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
                        stage.x = x;
                        stage.y = 0;
                        stage.self = stage._id;
                        stage.prev = [];
                        if (prev) {
                            stage.prev.push(prev);
                        }
                        stage.next = [];
                        stage.isHead = (stage.prev.length == 0);
                        stage.isTail = (stage.next.length == 0);
                        supplyChain.stages.push(stage);
                        success();
                    }).error(function (error) {
                        console.log(error);
                    });
            }
        },




        // reconstructs the graph and returns nodes and edges for graphical display
        getDisplayData: function () {
            var data = {
                nodes: [],
                edges: []
            };

            if (supplyChain) {
                for (var i = 0; i < supplyChain.stages.length; i ++) {
                    var node = {};
                    node.label = supplyChain.stages[i].name;
                    node.id = supplyChain.stages[i].self;
                    node.scaling = { min: 10, max: 10, label: { min: 10, max: 24} };
                    node.value = 25;
                    node.size = 25;
                    node.color = "#93D276"
                    node.shape = "box";
                    node.shadow = false;
                    node.x = supplyChain.stages[i].x;
                    node.y = supplyChain.stages[i].y;
                    data.nodes.push(node);
                }

                // link nodes
                for (var i = 0; i < supplyChain.stages.length; i ++) {
                    for (var j = 0; j < supplyChain.stages[i].prev.length; j ++) {
                        if (data.edges.indexOf({from: supplyChain.stages[i].prev[j], to: supplyChain.stages[i].self}) == -1 &&
                            supplyChain.stages[i].prev[j] && supplyChain.stages[i].prev[j] != [] &&
                            supplyChain.stages[i].self && supplyChain.stages[i].self != []) {
                                data.edges.push({from: supplyChain.stages[i].prev[j], to: supplyChain.stages[i].self});
                        }
                    };
                }
            }

            return data;
        },
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