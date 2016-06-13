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

        fetchSupplyChain: function(supplyChainId) {
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

        fetchSelectedSupplyChain: function() {
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

        deleteSelectedSupplyChain: function() {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/supplychains/' + $localStorage.selectedSupplyChainId, {
                    isDeleted: true
                })
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

        addStage: function(success, name, prev, isSellingPoint, sellingTargets) {
            var id = Date.now();
            var x;
            refreshStageFurthestRight();

            if (furthestRight == null) x = 0;
            else x = furthestRight + 150;


            var stageData = {
                name: name,
                isSellingPoint: isSellingPoint
                    // sellingTargets: sellingTargets || []
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

            console.log("sourceStage before:");
            console.log(sourceStage);
            console.log("targetStage before:");
            console.log(targetStage);

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

            console.log("sourceStage after:");
            console.log(sourceStage);
            console.log("targetStage after:");
            console.log(targetStage);

        },

        unlinkStages: function(sourceId, targetId) {




            var sourceStage = stages[findStage(sourceId)];
            var targetStage = stages[findStage(targetId)];

            console.log("sourceStage before:");
            console.log(sourceStage);
            console.log("targetStage before:");
            console.log(targetStage);

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

            console.log("sourceStage after:");
            console.log(sourceStage);
            console.log("targetStage after:");
            console.log(targetStage);

        },

        getSellingPoints: function() {
            if (supplyChain) {
                return supplyChain.sellingPoints;
            }
        },

        // BLOCK MANAGEMENT

        getSelectedBlockId: function() {
            return _selectedBlockId;
        },

        setSelectedBlockId: function(selectedBlockId) {
            _selectedBlockId = selectedBlockId;
        },

        fetchBlock: function(blockId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/blocks/' + blockId)
                .then(function(res) {
                    return res.data;
                });
        },

        fetchSelectedBlock: function() {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/blocks/' + _selectedBlockId)
                .then(function(res) {
                    return res.data;
                });
        },

        fetchBlocksByProduct: function(sourcedProductId, finishedProductId) {
            var productId;
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/products/' + productId + '/blocks?sourcedProductId=' + sourcedProductId + '&finishedProductId=' + finishedProductId)
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
                    // node.scaling = {
                    //     min: 10,
                    //     max: 10,
                    //     label: {
                    //         min: 10,
                    //         max: 24
                    //     }
                    // };
                    // node.value = 25;
                    // node.size = 25;
                    // node.color = "#4D6673"
                    // node.font = {color: "#FFF", size: "11"};
                    // node.shape = "box";
                    // node.shadow = false;
                    node.x = stages[i].x;
                    node.y = stages[i].y;
                    data.nodes.push(node);

                    if (stages[i].self.isSellingPoint) {
                        node.color = "#348A35";
                        console.log("here");
                    }
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

        fetchBlocksBySelectedStage: function(isNotEcommerce) {
            var url = baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + _selectedStageId + '/blocks/nonzero';
            if (isNotEcommerce == true) url += '?isNotEcommerce=true';
            return $http.get(url)
                .then(function(res) {
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

app.factory('FieldSelectorService', ['$http', 'apiUrl', function($http, apiUrl) {
    'use strict'

    var countries = [{
        name: 'Argentina',
        code: 'AR'
    }, {
        name: 'Australia',
        code: 'AU'
    }, {
        name: 'Belgium',
        code: 'BE'
    }, {
        name: 'Brazil',
        code: 'BR'
    }, {
        name: 'Canada',
        code: 'CA'
    }, {
        name: 'Chile',
        code: 'CL'
    }, {
        name: 'China',
        code: 'CN'
    }, {
        name: 'Denmark',
        code: 'DK'
    }, {
        name: 'Finland',
        code: 'FI'
    }, {
        name: 'France',
        code: 'FR'
    }, {
        name: 'Germany',
        code: 'DE'
    }, {
        name: 'Iceland',
        code: 'IS'
    }, {
        name: 'India',
        code: 'IN'
    }, {
        name: 'Indonesia',
        code: 'ID'
    }, {
        name: 'Ireland',
        code: 'IE'
    }, {
        name: 'Italy',
        code: 'IT'
    }, {
        name: 'Japan',
        code: 'JP'
    }, {
        name: 'Korea, Republic of',
        code: 'KR'
    }, {
        name: 'Malaysia',
        code: 'MY'
    }, {
        name: 'Mexico',
        code: 'MX'
    }, {
        name: 'Netherlands',
        code: 'NL'
    }, {
        name: 'New Zealand',
        code: 'NZ'
    }, {
        name: 'Norway',
        code: 'NO'
    }, {
        name: 'Philippines',
        code: 'PH'
    }, {
        name: 'Poland',
        code: 'PL'
    }, {
        name: 'Portugal',
        code: 'PT'
    }, {
        name: 'Russia',
        code: 'RU'
    }, {
        name: 'Singapore',
        code: 'SG'
    }, {
        name: 'South Africa',
        code: 'ZA'
    }, {
        name: 'Spain',
        code: 'ES'
    }, {
        name: 'Sweden',
        code: 'SE'
    }, {
        name: 'Switzerland',
        code: 'CH'
    }, {
        name: 'Taiwan',
        code: 'TW'
    }, {
        name: 'Thailand',
        code: 'TH'
    }, {
        name: 'Turkey',
        code: 'TR'
    }, {
        name: 'United Kingdom',
        code: 'GB'
    }, {
        name: 'United States',
        code: 'US'
    }, {
        name: 'Vietnam',
        code: 'VN'
    }];

    var states = [{
            name: 'Not Applicable',
            abbreviation: 'N/A'
        }, {
            name: "Alabama",
            abbreviation: "AL"
        }, {
            name: "Alaska",
            abbreviation: "AK"
        }, {
            name: "Alberta",
            abbreviation: "AB"
        }, {
            name: "American Samoa",
            abbreviation: "AS"
        }, {
            name: "Arizona",
            abbreviation: "AZ"
        }, {
            name: "Arkansas",
            abbreviation: "AR"
        }, {
            name: "British Columbia",
            abbreviation: "BC"
        }, {
            name: "California",
            abbreviation: "CA"
        }, {
            name: "Colorado",
            abbreviation: "CO"
        }, {
            name: "Connecticut",
            abbreviation: "CT"
        }, {
            name: "Delaware",
            abbreviation: "DE"
        }, {
            name: "District Of Columbia",
            abbreviation: "DC"
        }, {
            name: "Federated States Of Micronesia",
            abbreviation: "FM"
        }, {
            name: "Florida",
            abbreviation: "FL"
        }, {
            name: "Georgia",
            abbreviation: "GA"
        }, {
            name: "Guam",
            abbreviation: "GU"
        }, {
            name: "Hawaii",
            abbreviation: "HI"
        }, {
            name: "Idaho",
            abbreviation: "ID"
        }, {
            name: "Illinois",
            abbreviation: "IL"
        }, {
            name: "Indiana",
            abbreviation: "IN"
        }, {
            name: "Iowa",
            abbreviation: "IA"
        }, {
            name: "Kansas",
            abbreviation: "KS"
        }, {
            name: "Kentucky",
            abbreviation: "KY"
        }, {
            name: "Louisiana",
            abbreviation: "LA"
        }, {
            name: "Maine",
            abbreviation: "ME"
        }, {
            name: "Manitoba",
            abbreviation: "MB"
        }, {
            name: "Marshall Islands",
            abbreviation: "MH"
        }, {
            name: "Maryland",
            abbreviation: "MD"
        }, {
            name: "Massachusetts",
            abbreviation: "MA"
        }, {
            name: "Michigan",
            abbreviation: "MI"
        }, {
            name: "Minnesota",
            abbreviation: "MN"
        }, {
            name: "Mississippi",
            abbreviation: "MS"
        }, {
            name: "Missouri",
            abbreviation: "MO"
        }, {
            name: "Montana",
            abbreviation: "MT"
        }, {
            name: "Nebraska",
            abbreviation: "NE"
        }, {
            name: "Nevada",
            abbreviation: "NV"
        }, {
            name: "New Brunswick",
            abbreviation: "NB"
        }, {
            name: "New Hampshire",
            abbreviation: "NH"
        }, {
            name: "New Jersey",
            abbreviation: "NJ"
        }, {
            name: "New Mexico",
            abbreviation: "NM"
        }, {
            name: "New York",
            abbreviation: "NY"
        }, {
            name: "Newfoundland and Labrador",
            abbreviation: "NL"
        }, {
            name: "North Carolina",
            abbreviation: "NC"
        }, {
            name: "North Dakota",
            abbreviation: "ND"
        }, {
            name: "Northern Mariana Islands",
            abbreviation: "MP"
        }, {
            name: "Nova Scotia",
            abbreviation: "NS"
        }, {
            name: "Northwest Territories",
            abbreviation: "NT"
        }, {
            name: "Nunavut",
            abbreviation: "NU"
        }, {
            name: "Ohio",
            abbreviation: "OH"
        }, {
            name: "Oklahoma",
            abbreviation: "OK"
        }, {
            name: "Ontario",
            abbreviation: "ON"
        }, {
            name: "Oregon",
            abbreviation: "OR"
        }, {
            name: "Palau",
            abbreviation: "PW"
        }, {
            name: "Pennsylvania",
            abbreviation: "PA"
        }, {
            name: "Prince Edward Island",
            abbreviation: "PE"
        }, {
            name: "Puerto Rico",
            abbreviation: "PR"
        }, {
            name: "Quebec",
            abbreviation: "QC"
        }, {
            name: "Rhode Island",
            abbreviation: "RI"
        }, {
            name: "Saskatchewan",
            abbreviation: "SK"
        }, {
            name: "South Carolina",
            abbreviation: "SC"
        }, {
            name: "South Dakota",
            abbreviation: "SD"
        }, {
            name: "Tennessee",
            abbreviation: "TN"
        }, {
            name: "Texas",
            abbreviation: "TX"
        }, {
            name: "Utah",
            abbreviation: "UT"
        }, {
            name: "Vermont",
            abbreviation: "VT"
        }, {
            name: "Virgin Islands",
            abbreviation: "VI"
        }, {
            name: "Virginia",
            abbreviation: "VA"
        }, {
            name: "Washington",
            abbreviation: "WA"
        }, {
            name: "West Virginia",
            abbreviation: "WV"
        }, {
            name: "Wisconsin",
            abbreviation: "WI"
        }, {
            name: "Wyoming",
            abbreviation: "WY"
        }, {
            name: "Yukon",
            abbreviation: "YT"
        }

    ];

    return {
        getStates: function() {
            return states;
        },
        getCountries: function() {
            return countries;
        },
        setStates: function(value) {
            states = value;
        },
        setCountries: function(value) {
            countries = value;
        }

    }

}]);
