angular.module('coastlineWebApp.dashboard.services', ['ngStorage'])

.factory('NavTop', ['$http', 'apiUrl', function($http, apiUrl) {
    var view = 'menu';
    var baseUrl = apiUrl

    return {
        getFisheryName: function(success, error) {
            $http.get(baseUrl + '/api/fisheries').success(success).error(error);
        }
    }
}])

.factory('Fishery', ['$http', '$localStorage', 'apiUrl', function($http, $localStorage, apiUrl) {
    'use strict';
    // var fishery = {name: $localStorage.fisheryName, _id: $localStorage.user.fishery};
    var fisheryName;
    var baseUrl = apiUrl;

    return  {
        getFishery: function (success) {
            $http.get(baseUrl + '/api/fisheries').success(function (res) {
                for (var i = 0; i < res.length; i ++) {
                    if (res[i]._id == $localStorage.user.fishery) {
                        $localStorage.fisheryName = res[i].name;
                        $localStorage.$save();
                        fishery = {name: res[i].name, _id: res[i]._id};
                        fisheryName = $localStorage.fisheryName;
                        console.log("fisheryName " + fisheryName);
                    }
                }
                success(fishery);
            }).error(function (err) {
                console.log("Error getting fishery. " + err)
            });
        }
    };
}])
