var app = angular.module('coastlineWebApp.products.services', ['ui.bootstrap',
  'coastlineWebApp.auth.services',
  'coastlineWebApp.common.services',
  'ui.router']);

app.factory('Products', ['$http', '$localStorage', 'apiUrl', 'FisheryData', function($http, $localStorage, apiUrl, FisheryData) {
    'use strict';
    var fishery = {name: $localStorage.fisheryName, _id: FisheryData.getFisheryId()};
    var fisheryName;
    var baseUrl = apiUrl;

    return  {
        getProducts: function (success, error) {
            $http.get(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/products').success(function (res) {
                console.log(res);
                success(res);
            }).error(error);
        },
        addProduct: function (data, success, error) {
        	$http.post(baseUrl + '/api/fisheries/' + FisheryData.getFisheryId() + '/products', data).success(success).error(error);

        }
    };
}]);
