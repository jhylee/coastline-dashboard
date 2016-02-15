var app = angular.module('coastlineWebApp.products.services', ['ui.bootstrap',
  'coastlineWebApp.auth.services',
  'ui.router']);

app.factory('Products', ['$http', '$localStorage', 'apiUrl', function($http, $localStorage, apiUrl) {
    'use strict';
    var fishery = {name: $localStorage.fisheryName, _id: $localStorage.user.fishery};
    var fisheryName;
    var baseUrl = apiUrl;

    return  {
        getProducts: function (success, error) {
            $http.get(baseUrl + '/api/fisheries/' + $localStorage.user.fishery + '/products').success(function (res) {
                console.log(res);
                success(res);
            }).error(error);
        },
        addProduct: function (data, success, error) {
        	$http.post(baseUrl + '/api/fisheries/' + $localStorage.user.fishery + '/products', data).success(success).error(error);

        }
    };
}]);
