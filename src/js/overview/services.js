angular.module('coastlineWebApp.overview.services', ['coastlineWebApp.common.services', 'ngStorage'])

.factory('OverviewService', ['$http', 'apiUrl', 'FisheryService', function($http, apiUrl, FisheryService) {

    var baseUrl = apiUrl;

    return {
        fetchOverdueOrders: function () {
            return $http.get(baseUrl + '/api/orders/overdue')
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                })
        },
        fetchUpcomingOrders: function () {
            return $http.get(baseUrl + '/api/orders/oneweek')
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                })
        },
        fetchAnalytics: function() {
           return $http.post(baseUrl + '/api/analytics/test', {blockId:"57659f5c6ceb36e99d163c7f"})
               .then(function (res) {
                   return res.data;
               }).catch(function (err) {
                   console.log(err);
               })
        },
    }
}])
