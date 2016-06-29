angular.module('coastlineWebApp.overview.services', ['coastlineWebApp.common.services', 'ngStorage'])

.factory('OverviewService', ['$http', 'apiUrl', 'FisheryService', function($http, apiUrl, FisheryService) {

    var baseUrl = apiUrl;

    return {
         getProductData: function(success, error) {
             $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/sourcedProducts').success(function(res) {
                success(res);
             }).error(error);
         },
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
        fetchRevenueByProduct: function(filter) {
            return $http({
               "Content-Type": "application/x-www-form-urlencoded",
               url: baseUrl + '/api/analytics/revenuePerProduct',
               method: "POST",
               data: filter || {},
            }).then(function(res) {
               return res.data;
            }).catch(function(err) {
               console.log(err);
            });
        },
        fetchRevenueByMonth: function(filter) {
           return $http({
             "Content-Type": "application/x-www-form-urlencoded",
             url: baseUrl + '/api/analytics/revenuePerMonth',
             method: "POST",
             data: filter || {},
           }).then(function(res) {
             return res.data;
           }).catch(function(err) {
             console.log(err);
           });
        },
    }
}])
