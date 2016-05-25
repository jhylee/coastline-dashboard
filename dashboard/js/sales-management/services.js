var app = angular.module('coastlineWebApp.salesManagement.services', ['ui.bootstrap',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);


app.factory('SellingPointData', ['$http', '$localStorage', 'apiUrl', 'FisheryService', function($http, $localStorage, apiUrl, FisheryService) {
    'use strict';
    var baseUrl = apiUrl;
    var selectedSellingPoint;

    return {
        getSellingPoints: function(success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/selling').success(function(res) {
                success(res);
            }).error(error);
        },
        addSellingPoint: function(data, success, error) {
            $http.post(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages', data).success(success).error(error);
        },
        updateSellingPoint: function(stageId, data, success, error) {
            $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + stageId, data).success(success).error(error);
        },
        setSelectedSellingPoint: function(sellingPoint) {
            selectedSellingPoint = sellingPoint;
        },
        getSelectedSellingPoint: function() {
            return selectedSellingPoint;
        },
        getSelectedSellingPointId: function() {
            if (selectedSellingPoint) return selectedSellingPoint._id;
        },
        getBlocks: function(supplyChainId, stageId, success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/sellingPoints/' + stageId + '/blocks/nonzero').success(success).error(error);
        }
    };
}]);
