var app = angular.module('coastlineWebApp.salesManagement.services', ['ui.bootstrap',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);


app.factory('SellingPointData', ['$http', '$localStorage', 'apiUrl', 'FisheryData', function($http, $localStorage, apiUrl, FisheryData) {
    'use strict';
    var baseUrl = apiUrl;
    var selectedSellingPoint;

    return {
        getSellingPoints: function(success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/stages/selling').success(function(res) {
                console.log("getSellingPoints");
                console.log(res);
                success(res);
            }).error(error);
        },
        addSellingPoint: function(data, success, error) {
            $http.post(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/stages', data).success(success).error(error);
        },
        updateSellingPoint: function(stageId, data, success, error) {
            $http.put(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/stages/' + stageId, data).success(success).error(error);
        },
        setSelectedSellingPoint: function(sellingPoint) {
            selectedSellingPoint = sellingPoint;
        },
        getSelectedSellingPoint: function() {
            return selectedSellingPoint;
        },
        getBlocks: function(supplyChainId, stageId, success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/supplyChains/' + supplyChainId + '/sellingPoints/' + stageId + '/blocks').success(success).error(error);
        }
    };
}]);
