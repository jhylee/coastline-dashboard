angular.module('coastlineWebApp.settings.services', ['coastlineWebApp.common.services', 'ngStorage'])

.factory('SettingsService', ['$http', 'apiUrl', 'FisheryService', function($http, apiUrl, FisheryService) {

    var baseUrl = apiUrl;

    return {
        fetchUser: function () {
            return $http.get(baseUrl + '/api/user')
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                })
        },
        fetchUsers: function () {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/users')
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                })
        },
        fetchFishery: function () {
            return $http.get(baseUrl + '/api/user')
                .then(function (res) {
                    return res.data.fishery;
                }).catch(function (err) {
                    console.log(err);
                })
        },
        updateFishery: function (data) {
            return $http.put(baseUrl + '/api/fisheries', data)
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                })
        },
        updateUser: function (data) {
            return $http.put(baseUrl + '/api/users', data)
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                })
        },
        inviteUser: function (data) {
            return $http.post(baseUrl + '/api/invite', data)
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                })
        }
    }
}])
