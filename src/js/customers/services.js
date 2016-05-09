angular.module('coastlineWebApp.customers.services', ['ngStorage', 'coastlineWebApp.common.services'])

.factory('CustomerService', ['$http', 'apiUrl', 'FisheryService', function($http, apiUrl, FisheryService) {
    var view = 'menu';
    var baseUrl = apiUrl

    return {
        addCustomer: function (data) {
            return $http.post(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + 'customers', data).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            })
        },
        editCustomer: function (data, customerId) {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/customers/' + customerId, data).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            })
        },
        deleteCustomer: function () {
            // return $http.delete(baseUrl + '/api/orders/manual', data).then(function(res) {
            //     return res.data;
            // }).catch(function(err) {
            //     return err;
            // })
        }
    }
}])
