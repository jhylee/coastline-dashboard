var app = angular.module('coastlineWebApp.orders.services', ['ui.bootstrap', 'ngStorage',
    'ui.router'
]);


app.factory('OrderData', ['$http', '$localStorage', 'apiUrl', function($http, $localStorage, apiUrl) {
    'use strict';
    var baseUrl = apiUrl;
    var selectedOrder;

    return {
        getOrders: function(success, error) {
            $http.get(baseUrl + '/api/orders').success(success).error(error);
        },
        addOrder: function(data) {
            return $http.post(baseUrl + '/api/orders/manual', data).then(function(res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                    return err;
                })

        },
        getSelectedOrder: function() {
            return selectedOrder;
        },
        setSelectedOrder: function(order) {
            selectedOrder = order;
        },
        createOrder: function (data) {
            return $http.post(baseUrl + '/api/orders/manual').then(function (res) {
                return res.data;
            });
        }

    };
}]);
