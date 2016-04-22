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
        }
    }
}])
