var app = angular.module('coastlineWebApp.inventory.services', ['ui.bootstrap', 'ngStorage',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'coastlineConstants',
    'ui.router'
]);

app.factory('TrackInventoryMenuNavigation', ['$http', 'apiUrl', '$localStorage', 'FisheryService', function($http, apiUrl, $localStorage, FisheryService) {
    var view = 'menu';
    var baseUrl = apiUrl;

    return {
        getView: function() {
            return view;
        },
        setView: function(newView) {
            view = newView;
        },
        getSupplyChains: function(success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains').success(success).error(error);
        }
    }
}]);

app.factory('InventoryData', ['$http', 'apiUrl', '$localStorage', 'FisheryService', function($http, apiUrl, $localStorage, FisheryService) {
    var baseUrl = apiUrl;

    return {
        getBlocks: function(supplyChainId, stageId, success, error) {
            console.log(supplyChainId);
            $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + stageId + '/blocks').success(success).error(error);
        },
        addBlock: function(supplyChainId, data, success, error) {
            $http.post(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + supplyChainId + '/blocks', data).success(success).error(error);
        },
        updateBlock: function(supplyChainId, blockId, data, success, error) {
            $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + supplyChainId + '/blocks/' + blockId, data).success(success).error(error);
        },
        moveBlock(supplyChainId, blockId, data, success, error) {
            $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + supplyChainId + '/blocks/' + blockId + '/move', data).success(success).error(error);
        },
        splitBlock(supplyChainId, blockId, data, success, error) {
            $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + supplyChainId + '/blocks/' + blockId + '/split', data).success(success).error(error);
        },
        deleteBlock(supplyChainId, blockId, success, error) {
            $http.delete(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/blocks/' + blockId).success(success).error(error);
        },
        getSellingPoints: function(success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/selling').success(success).error(error);
        }
    }
}]);


app.factory('TrackInventoryManager', ['$http', 'apiUrl', '$localStorage', 'FisheryService', function($http, apiUrl, $localStorage, FisheryService) {
    var view = 'menu';
    var baseUrl = apiUrl;
    var _supplyChain;


    return {
        getSupplyChain: function() {
            return _supplyChain;
        },
        setSupplyChain: function(supplyChain) {
            _supplyChain = supplyChain;
        },
        getSupplyChains: function(success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains').success(success).error(error);
        },

        // reconstructs the graph and returns nodes and edges for graphical display
        getDisplayData: function() {
            console.log("_supplyChain");
            console.log(_supplyChain);
            var data = {
                nodes: [],
                edges: []
            };

            if (_supplyChain) {
                for (var i = 0; i < _supplyChain.stages.length; i++) {
                    var node = {};
                    node.label = _supplyChain.stages[i].name;
                    node.id = _supplyChain.stages[i].self;
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
                    node.x = _supplyChain.stages[i].x;
                    node.y = _supplyChain.stages[i].y;
                    data.nodes.push(node);
                }

                // link nodes
                for (var i = 0; i < _supplyChain.stages.length; i++) {
                    for (var j = 0; j < _supplyChain.stages[i].prev.length; j++) {
                        if (data.edges.indexOf({
                                from: _supplyChain.stages[i].prev[j],
                                to: _supplyChain.stages[i].self
                            }) == -1 &&
                            _supplyChain.stages[i].prev[j] && _supplyChain.stages[i].prev[j] != [] &&
                            _supplyChain.stages[i].self && _supplyChain.stages[i].self != []) {
                            data.edges.push({
                                from: _supplyChain.stages[i].prev[j],
                                to: _supplyChain.stages[i].self
                            });
                        }
                    };
                }
            }

            return data;
        },
    }
}]);
