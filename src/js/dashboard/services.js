angular.module('coastlineWebApp.dashboard.services', ['ngStorage'])

.factory('NavTop', ['$http', 'apiUrl', function($http, apiUrl) {
    var view = 'menu';
    var baseUrl = apiUrl

    return {
        getFisheryName: function(success, error) {
            $http.get(baseUrl + '/api/fisheries').success(success).error(error);
        }
    }
}]);
