var app = angular.module('coastlineWebApp.products.services', ['ui.bootstrap',
  'coastlineWebApp.auth.services',
  'coastlineWebApp.common.services',
  'ui.router']);

app.factory('Products', ['$http', '$localStorage', 'apiUrl', 'FisheryData', function($http, $localStorage, apiUrl, FisheryData) {
    'use strict';
    var fishery = {name: $localStorage.fisheryName, _id: FisheryData.getFisheryId()};
    var fisheryName;
    var baseUrl = apiUrl;
    var selectedProductId;

    return  {
        getProducts: function (success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/products').success(function (res) {
                console.log(res);
                success(res);
            }).error(error);
        },
        addProduct: function (data, success, error) {
        	return $http.post(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/products', data).success(success).error(error);
        },
        updateProduct: function (data, productId, success, error) {
        	return $http.put(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/products/' + productId, data).success(success).error(error);
        },
        deleteProduct: function (productId) {
            return $http.delete(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/products/' + productId)
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                })
        },
        getSelectedProductId: function () {
            return selectedProductId;
        },
        setSelectedProductId: function (productId) {
            selectedProductId = productId;
        }

    };
}]);
