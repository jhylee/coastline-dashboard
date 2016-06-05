var app = angular.module('coastlineWebApp.ecommerce.services', ['ui.bootstrap',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);


app.factory('EcommerceService', ['$http', '$localStorage', 'apiUrl', 'FisheryService', function($http, $localStorage, apiUrl, FisheryService) {
    'use strict';
    var baseUrl = apiUrl;
    var selectedSellingPoint;
    var _selectedBlockId;

    return {
        getEcommerceBlocks: function() {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/blocks/ecommerce').then(function(res) {
               return res.data;
            })
        },
        getBlocks: function(stageId, success, error) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/stages/' + stageId + '/blocks').success(success).error(error);
        },
        uploadImage: function(data) {
            return $http.post(baseUrl + '/api/ecommerce/image', data).then(function (res) {
               console.log(res);
               return res.data;
            });
        },
        addBlockToEcommerce: function(data, blockId) {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/blocks/' + blockId + '/ecommerce', data).then(function (res) {
               console.log(res);
               return res.data;
            });
        },
        removeBlockFromEcommerce: function() {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/blocks/' + _selectedBlockId + '/ecommerce/remove').then(function (res) {
               console.log(res);
               return res.data;
            });
        },
        getSelectedBlockId: function () {
           return _selectedBlockId;
        },
        setSelectedBlockId: function (blockId) {
           _selectedBlockId = blockId;
        }
    };
}]);
