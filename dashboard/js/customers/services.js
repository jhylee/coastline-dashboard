angular.module('coastlineWebApp.customers.services', ['ngStorage', 'coastlineWebApp.common.services'])

.factory('CustomerService', ['$http', 'apiUrl', 'FisheryService', function($http, apiUrl, FisheryService) {
    var view = 'menu';
    var baseUrl = apiUrl;
    var _selectedCustomerId;

    return {
        setSelectedCustomerId: function (customerId) {
            _selectedCustomerId = customerId;
        },
        addCustomer: function (data) {
            return $http.post(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/customers', data).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            })
        },
        editCustomer: function (data) {
            return $http.put(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/customers/' + _selectedCustomerId, data).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            })
        },
        deleteCustomer: function () {
            return $http.delete(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/customers/' + _selectedCustomerId).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            })
        },
        getCustomers: function (startIndex, endIndex) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/customers?startIndex=' + startIndex + "&endIndex=" + endIndex).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            })
        },
        getCustomersLength: function () {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/customers/length').then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            })
        },
        getSelectedCustomer: function () {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/customers/' + _selectedCustomerId).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            })
        },
        getCustomer: function (customerId) {
            return $http.get(baseUrl + '/api/fisheries/' + FisheryService.getFisheryId() + '/customers/' + customerId).then(function(res) {
                return res.data;
            }).catch(function(err) {
                return err;
            })
        }
    }
}])
