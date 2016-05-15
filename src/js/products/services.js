var app = angular.module('coastlineWebApp.products.services', ['ui.bootstrap',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);

app.factory('ProductData', ['$http', '$localStorage', 'apiUrl', 'FisheryService', function($http, $localStorage, apiUrl, FisheryService) {
    'use strict';
    var fishery = {
        name: $localStorage.fisheryName,
        _id: FisheryService.getFisheryId()
    };
    var fisheryName;
    var baseUrl = apiUrl;
    var selectedProductId;

    return {
        getSourcedProductData: function(success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/sourcedProducts').success(function(res) {
                success(res);
            }).error(error);
        },
        getFinishedProductData: function(success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/finishedProducts').success(function(res) {
                success(res);
            }).error(error);
        },
        addProduct: function(data, success, error) {
            return $http.post(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/products', data).success(success).error(error);
        },
        addSourcedProduct: function(data, success, error) {
            return $http.post(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/sourcedProducts/group', data).success(success).error(error);
        },
        updateProduct: function(data, productId, success, error) {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/products/' + productId, data).success(success).error(error);
        },
        deleteProduct: function(productId) {
            return $http.delete(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/products/' + productId)
                .then(function(res) {
                    return res.data;
                }).catch(function(err) {
                    console.log(err);
                })
        },
        getSelectedProductId: function() {
            return selectedProductId;
        },
        setSelectedProductId: function(productId) {
            selectedProductId = productId;
        }

    };
}]);
