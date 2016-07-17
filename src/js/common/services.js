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

// managing tutorial steps
app.factory('TutorialService', ['$http', '$state', 'apiUrl', '$localStorage', 'FisheryService', 'AuthService', function($http, $state, apiUrl, $localStorage, FisheryService, AuthService) {
   var steps = [
      {
         name: "introduction",
         description: "Introduction",
         state: "dashboard.default.overview",
         dialog: [
            { text: "Welcome to your new Coastline account!" },
            { text: "Let's get your account set up through the \"Settings\" tab!" },
         ],
      },
      {
         name: "general",
         description: "General",
         state: "dashboard.settings.general",
         dialog: [
            { text: "Fill in your name and phone # (optional)." , pointer: "inputs"},
         ],
      },
      {
         name: "fishery",
         description: "Fishery",
         state: "dashboard.settings.fishery",
         dialog: [
            { text: "Here is your Fishery settings page. Add your invoice logo, disclaimer, tax #, etc." , pointer: "logo"},
            { text: "You can also customize your web URL for your online seafood shop." , pointer: "url"},
         ],
      },
      {
         name: "users",
         description: "Users",
         state: "dashboard.settings.users",
         dialog: [
            { text: "From the users settings page, optionally add admin/staff users to your fishery.", pointer: "invite" },
         ],
      },
      {
         name: "security",
         description: "Security",
         state: "dashboard.settings.security",
         dialog: [
            { text: "From the security page, you can change your account password." , pointer: "password" },
         ],
      },
      {
         name: "ecommerce",
         description: "E-Commerce",
         state: "dashboard.settings.ecommerce",
         dialog: [
            { text: "Set up Stripe to enable credit card payments on your E-commerce platform.", pointer: "stripe" },
            { text: "Now that your account is set up, let's explore the platform." },
         ],
      },
      {
         name: "products",
         description: "Products",
         state: "dashboard.default.products",
         dialog: [
           { text: "This is your Products page!" },
            { text: "Click Add to create the products you offer.", pointer: "add" },
            { text: "Fill in product details then click Submit.", action: "add-product" },
            { text: "Click Edit to edit the products you offer.", pointer: "edit" },
            { text: "Click Delete to delete any products you no longer offer.", pointer: "delete" },

         ],
      },
      {
         name: "supplyChain",
         description: "Supply Chain",
         state: "dashboard.default.supply-chain.menu",
         dialog: [
           { text: "This is your Supply Chain page!" },
            { text: "Click Edit to edit your existing supply chain." , pointer: "edit"},
            { text: "Click Delete to delete a specific supply chain." , pointer: "delete"},
            { text: "Now let's click Add to set up your custom business supply chain." , pointer: "add"},
         ],
      },
      {
         name: "supplyChain2",
         description: "Supply Chain Add",
         state: "dashboard.default.supply-chain.create",
         dialog: [
           { text: "Give your supply chain a name and click Submit." , pointer: "name"},
         ],
      },
      {
         name: "supplyChain3",
         description: "Supply Chain Add",
         state: "dashboard.default.supply-chain.builder",
         dialog: [
           { text: "Click Add to set up your stages." , pointer: "add"},
           { text: "In the Add popup, fill in the name and previous stage and click Ok." , pointer: "add-modal", action: "add-modal"},
           { text: "Click a specific stage and click Edit to change the stage." , pointer: "edit"},
           { text: "Click Link/Unlink to remove lines between stages." , pointer: "link"},
           { text: "Click a specific stage and click Delete to change the stage." , pointer: "delete"},
         ],
      },
      {
         name: "inventory",
         description: "Inventory",
         state: "dashboard.default.inventory.menu",
         dialog: [
           { text: "This is your Inventory page!" },
           { text: "You must first add a supply chain to view your inventory." },
           { text: "Click View Details for the supply chain you would like to monitor." , pointer: "inventory" },
         ],
      },
      {
         name: "inventory2",
         description: "Inventory2",
         state: "dashboard.default.inventory.track",
         dialog: [
           { text: "Click a specific stage and click View/Edit Inventory to track and move inventory.", pointer:"view" },
                 { text: "Click Add to create an inventory batch from the products you offer.", pointer:"add" },
                 { text: "Click a line item and click Batch Detail to review the batch history.", pointer:"review" },
                 { text: "Click Move to move the batch across your supply chain stages.", pointer:"move" },
                 { text: "Click Close to dismiss the modal.", pointer:"close" },
         ],
      },
      {
         name: "customers",
         description: "Customers",
         state: "dashboard.default.customers.menu",
         dialog: [
           { text: "This is your Customers page!" },
           { text: "Click Add to create a customer profile and store their information."  , pointer: "add" },
           //{ text: "Fill in all required information and click Submit."  , pointer: "submit" },
           { text: "Click View/Edit to review or edit an existing customer profile."  , pointer: "edit" },
           { text: "Click Delete to delete an existing customer profile."  , pointer: "delete" },
         ],
      },
      {
         name: "orders",
         description: "Orders",
         state: "dashboard.default.orders.menu",
         dialog: [
            { text: "This is your Orders page!" },
            { text: "Click Add to create a manual order."  , pointer: "add" },
            { text: "It's handy to have a few customer profiles set before making an order." },
            { text: "Within Add Orders, choose Existing Customers to pull up customer profiles.", pointer:"profiles"},
            { text: "Choose an existing customer, submit and the order will populate.", pointer:"customer-chosen"},
            { text: "Remember to fill out the Payment Info tab!", pointer:"customer-pay"},
            { text: "Click Submit, Cancel (bottom of form) or outside the popup to close the modal.", pointer:"close"},


            { text: "Click View/Edit to review or edit an existing order." , pointer: "edit" },
            { text: "Click PDF to print a specific order."  , pointer: "pdf" },
            { text: "Click Filter to search for specific invoices.", pointer: "filter" },
            { text: "Click Excel to export the orders currently displayed on your screen.", pointer: "excel" },
         ],
      },
      {
         name: "ecommerce2",
         description: "E-Commerce",
         state: "dashboard.default.ecommerce",
         dialog: [
           { text: "This is your E-Commerce page!" },
            { text: "Click Add to list products on your E-commerce shop.", pointer: "add" },
            { text: "First enter the supply chain and stage you want to sell from."},
            { text: "Next choose your desired batch to sell along with a picture and logo."},
            { text: "Click Submit to upload it to your e-commerce site.", pointer: "submit"},
            { text: "This product is now available for purchase at the URL you defined in settings!"},


            { text: "Click Delete to unlist specific products from your E-commerce shop.", pointer: "delete" },
            { text: "Remember to set your desired Shop URL in your Fishery settings!"},
         ],
      },
      {
         name: "overview",
         description: "Overview",
         state: "dashboard.default.overview",
         dialog: [
           { text: "Last but not least, this is your Overview page!" },
            { text: "Here, you can review the revenue per product and month." },
            { text: "Click Filter to get analytics by product or by specific periods.", pointer: "filter" },
            { text: "Keep in mind that analytics will appear blank when there aren't any orders." },
            { text: "From this page, you can also review upcoming and overdue payments.", pointer: "view-details"},

         ],
      },
      {
         name: "finished",
         description: "Finished",
         state: "dashboard.default.overview",
         dialog: [
            { text: "You've succesfully completed the Coastline tutorial! " },
            { text: "Click the Help button on the top-right of your more tutorials." },
            { text: "If you have any questions or need help, contact us at hello@coastlinemarket.com!" },


         ],
      },
   ];

   var localState = {
      step: {
         ref: 0,
         dialog: 0,
      },
      history: [],
      cancelled: true,
      action: false,
   };

   var state = {
      description: "",
      dialog: "",
   };

   updateState();

   return {
      state: state,
      back: back,
      forward: forward,
      pointer: pointer,
      action: action,
      update: updateState,
      show: show,
   };

   function back() {
      if (--localState.step.dialog < 0) {
         if (--localState.step.ref < 0) {
            localState.step.ref = 0;
            localState.step.dialog = 0;
         }
         else {
            localState.step.dialog = steps[localState.step.ref].dialog.length - 1;
         }
      }

      updateState();
   }

   function forward() {
      if (++localState.step.dialog > steps[localState.step.ref].dialog.length - 1) {
         if (++localState.step.ref > steps.length - 1) {
            localState.step.ref = steps.length - 1;
            localState.step.dialog = steps[localState.step.ref].dialog.length - 1;

            cancel();
         }
         else {
            localState.step.dialog = 0;
         }
      }

      updateState();
   }

   function updateState() {
      if (AuthService.user && AuthService.user.trial.state == "cancelled") {
         //localState.cancelled = false;
         state.dialog = "Your trial has expired. To continue you must set up a shop then re-login.";
      }
      else {
         $http
         .post(apiUrl + '/api/trial/tutorial', { step: localState.step.ref })
         .success(function(response) {
            console.log("step", response.step);
            if (response.step == -1) {
               localState.cancelled = true;
            }
            else {
               localState.cancelled = false;
               localState.step.ref = response.step;

               var step = steps[localState.step.ref];
               state.description = step.description;
               state.dialog = step.dialog[localState.step.dialog].text;
               $state.go(step.state);
            }
         });
      }

      localState.action = false;
   }

   function pointer(string) {
      return string == steps[localState.step.ref].dialog[localState.step.dialog].pointer;
   }

   function action(string, func, params) {
      if (string == steps[localState.step.ref].dialog[localState.step.dialog].action && localState.action == false) {
         localState.action = true;
         return func(params || undefined);
      }
      else {
         return undefined;
      }
   }

   function cancel() {
      localState.cancelled = true;
      localState.step.ref = -1;
   }

   function show() {
      return localState.cancelled == false;
   }
}]);
