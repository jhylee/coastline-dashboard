angular.module('coastlineWebApp.settings.services', ['coastlineWebApp.common.services', 'ngStorage'])

.factory('SettingsService', ['$http', 'apiUrl', 'FisheryService', function($http, apiUrl, FisheryService) {

    var baseUrl = apiUrl;

    return {
        // fetchUsers: function () {
        //     return $http.get(baseUrl + '/api/fisheries')
        //         .then(function (res) {
        //             // return res.data.
        //         })
        // }
    }
}])
