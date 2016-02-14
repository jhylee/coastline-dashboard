var app = angular.module('coastlineWebApp.salesManagement.services', ['ui.bootstrap', 
  'coastlineWebApp.auth.services',
  'ui.router']);


app.factory('SellingPointData', ['$http', '$localStorage', 'apiUrl', function($http, $localStorage, apiUrl) {
    'use strict';
    var baseUrl = apiUrl;
    var selectedSellingPoint;

    return  {
        getSellingPoints: function (success, error) {
            $http.get(baseUrl + '/api/fisheries/' + $localStorage.user.fishery + '/stages/selling').success(function (res) {
                console.log("getSellingPoints");
                console.log(res);
                success(res);
            }).error(error);
        },
        addSellingPoint: function (data, success, error) {
            $http.post(baseUrl + '/api/fisheries/' + $localStorage.user.fishery + '/stages', data).success(success).error(error);
        },
        updateSellingPoint: function (stageId, data, success, error) {
            $http.put(baseUrl + '/api/fisheries/' + $localStorage.user.fishery + '/stages/' + stageId, data).success(success).error(error);
        },
        setSelectedSellingPoint: function (sellingPoint) {
            selectedSellingPoint = sellingPoint;
        },
        getSelectedSellingPoint: function () {
            return selectedSellingPoint;
        },
        getBlocks: function (supplyChainId, success, error) {
            $http.get(baseUrl + '/api/fisheries/' + $localStorage.user.fishery + '/stages/selling').success(success).error(error);
        }
    };
}]);