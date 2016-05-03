var app = angular.module('coastlineWebApp.common.services', ['ui.bootstrap', 'ngStorage',
    'ui.router'
]);


// @service SupplyChainService
// @description Used to manage SupplyChain objects.
app.factory('SupplyChainService', ['$http', 'apiUrl', '$localStorage', 'FisheryService', function($http, apiUrl, $localStorage, FisheryService) {
    var baseUrl = apiUrl;


    var _selectedStageId;
    var _selectedSellingPointId;
    var _selectedBlockId;

    var furthestRight = -150;

    var stages;
    var supplyChain;

    var toState;

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

    var findEdge = function(fromId, toId, edges) {
        for (var i = 0; i < edges.length; i++) {
            if (edges[i].fromId == fromId && edges[i].to == toId) {
                return i;
            }
        };
        return null;
    };

    var refreshStageFurthestRight = function() {
        for (var i = 0; i < stages.length; i++) {
            if (stages[i].x > furthestRight) furthestRight = stages[i].x;
        }
    };


    return {

        // SUPPLY CHAIN MANAGEMENT

        setSupplyChainId: function(supplyChainId) {
            $localStorage.selectedSupplyChainId = supplyChainId;
            $localStorage.$save();
        },

        getSupplyChainId: function() {
            return $localStorage.selectedSupplyChainId;
        },

        // TODO - deprecated
        getSupplyChain: function() {
            return $localStorage.selectedSupplyChainId;
        },

        // TODO - deprecated
        setSupplyChain: function(newSupplyChain) {
            stages = [];
                supplyChain = newSupplyChain;
        },

        fetchSupplyChain: function (supplyChainId) {
            // $localStorage.selectedSupplyChainId;
                $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + supplyChainId)
                .then(function(res) {
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

        fetchSelectedSupplyChain: function () {
            // $localStorage.selectedSupplyChainId;
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + $localStorage.selectedSupplyChainId)
                .then(function(res) {
                        supplyChain = res.data;
                        return supplyChain;
                }).catch(function(err) {
                    console.log(err);
                })
        },

        updateSelectedSupplyChain: function(data) {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + $localStorage.selectedSupplyChainId, data)
                .then(function(res) {
                    return res.data;
                }).catch(function(err) {
                    console.log(err);
                })
        },

        fetchSelectedBlockHistory: function() {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/blocks/' + _selectedBlockId)
                .then(function(res) {
                    return res.data.history;
                }).catch(function(err) {
                    console.log(err);
                    return err
                })
        },


        // STAGE MANAGEMENT
        getStages: function() {
            if (stages) {
                return stages;
            }
        },

        getStage: function(id) {
            if (stages) {
                return stages[findStage(id)];
            }
        },

        getSelectedStage: function() {
            return stages[findStage(selectedStageId)];
        },

        getSelectedStageId: function() {
            return _selectedStageId;
        },

        fetchStages: function() {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + $localStorage.selectedSupplyChainId + '/stages/normal')
                .then(function(res) {
                    stages = res.data;
                    return stages;
                })
        },

        fetchSelectedStage: function() {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + _selectedStageId)
                .then(function(res) {
                    return res.data;
                })
        },

        fetchStage: function(stageId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + stageId)
                .then(function(res) {
                    return res.data;
                })
        },

        updateStages: function() {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + $localStorage.selectedSupplyChainId + '/stages', stages)
                .then(function(res) {
                    stages = res.data;
                    return stages;
                })
        },

        updateStage: function(stageId, data) {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + stageId, data)
                .then(function(res) {
                    return res.data;
                })
        },

        selectStage: function(stageId) {
            selectedStageId = stageId;
        },

        deselectStage: function(stageId) {
            selectedStageId = null;
        },

        setSelectedStageId: function(id) {
            _selectedStageId = id;
        },

        moveStage: function(id, x, y) {
            var index = findStage(id);
            stages[index].x = x;
            stages[index].y = y;
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

        addStage: function(name, prev, success) {
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

                            for (var i = 0; i < prevStage.next.length; i++) {
                                var nextStage = stages[findStage(prevStage.next[i])];

                                if (lowestY == null || nextStage.y > lowestY) {
                                    lowestY = nextStage.y;
                                    lowestX = nextStage.x;
                                }

                                // x = nextStage.x;
                                // y = nextStage.y - 75;
                            }
                        }

                        if (lowestX != null) x = lowestX;
                        if (lowestY != null) y = lowestY + 75;






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


                        if (prev) {
                                stages[findStage(prev._id)].next.push(supplyChainStage.self._id)

                        }




                        success();
                    }).error(function(error) {
                    console.log(err);
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
                sourceStage.next.push(targetId);
            };

            if (!isSourceInTargetPrev) {
                targetStage.prev.push(sourceId);
            };

        },

        unlinkStages: function(sourceId, targetId) {
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



            if (targetInSourceNext != null) {
                var newSourceNext = [];

                for (var i = 0; i < sourceStage.next.length; i++) {
                    if (sourceStage.next[i] != targetId) {
                        newSourceNext.push(sourceStage.next[i]);
                    }

                    sourceStage.next = newSourceNext;
                }

            };

            if (sourceInTargetPrev != null) {

                var newTargetPrev = [];

                for (var i = 0; i < targetStage.prev.length; i++) {
                    if (targetStage.prev[i] != sourceId) {
                        newTargetPrev.push(targetStage.prev[i]);
                    }

                    targetStage.prev = newTargetPrev;
                }


            };

        },

        getSellingPoints: function() {
            if (supplyChain) {
                    return supplyChain.sellingPoints;
            }
        },

        // BLOCK MANAGEMENT

        getSelectedBlockId: function () {
            return _selectedBlockId;
        },

        setSelectedBlockId: function (selectedBlockId) {
            _selectedBlockId = selectedBlockId;
        },

        fetchBlock: function(blockId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/blocks/' + blockId)
                .then(function(res) {
                    return res.data;
                });
        },

        fetchSelectedBlock: function () {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/blocks/' + _selectedBlockId)
                .then(function(res) {
                    return res.data;
                });
        },

        fetchBlocksByProduct: function(productId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/products/' + productId + '/blocks')
                .then(function(res) {
                    return res.data;
                });
        },

        postSupplyChain: function(fisheryId, data) {
            return $http.post(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains', data)
                .then(function(res) {
                    return res.data;
                }).catch(function(err) {
                    console.log(err);
                })
        },

        getDisplayData: function() {
            var data = {
                nodes: [],
                edges: []
            };


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
        },

        fetchBlocksBySelectedStage: function () {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + _selectedStageId + '/blocks/nonzero')
                .then(function (res) {
                    return res.data;
                })
        }

    };
}]);


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
        return res.data.fishery;
    }).then(function(res) {
        fishery = {
            name: res.name,
            _id: res._id
        };
        return fishery;
    }).catch(function(err) {
        return err;
    });


    return {
        fetchFishery: function() {

            return $http.get(baseUrl + '/api/user').then(function(res) {
                return res.data.fishery;
            }).then(function(res) {
                fishery = {
                    name: res.name,
                    _id: res._id
                };
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


// for creation of the VisDataSet
app.factory('VisDataSet', ['$http', 'apiUrl', function($http, apiUrl) {
    'use strict';
    return function(data, options) {
        // Create the new dataSets
        return new vis.DataSet(data, options);
    };
}]);
