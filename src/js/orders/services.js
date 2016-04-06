var app = angular.module('coastlineWebApp.orders.services', ['ui.bootstrap', 'ngStorage',
    'ui.router'
]);


app.factory('OrderData', ['$http', '$window', '$localStorage', 'apiUrl', function($http, $window, $localStorage, apiUrl) {
    'use strict';
    var baseUrl = apiUrl;
    var selectedOrder;

    return {
        getOrders: function(success, error) {
            $http.get(baseUrl + '/api/orders').success(success).error(error);
        },
        fetchOrderPDF: function(orderId) {
            // var anchor = angular.element('<a/>');
            // anchor.attr({
            //     href: baseUrl + '/api/orders/' + orderId + '/pdf',
            //     target: '_blank',
            //     download: 'order.xlsx'
            // })[0].click();

            return $http({
                url: baseUrl + '/api/orders/' + orderId + '/pdf',
                method: 'GET',
                responseType: 'arraybuffer',
                // data: json, //this is your json data string
                headers: {
                    // 'Content-type': 'application/json',
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            }).then(function(res) {
                console.log('here');

                return res.data;
            })
            //
            // return $http.get(baseUrl + '/api/orders/' + orderId + '/pdf').then(function(res) {
            //
            //     return res.data;
            // })

        },
        addOrder: function(data) {
            return $http.post(baseUrl + '/api/orders/manual', data).then(function(res) {
                return res.data;
            }).catch(function(err) {
                console.log(err);
                return err;
            })

        },
        deleteOrder: function(orderId) {
            return $http.delete(baseUrl + '/api/orders/' + orderId).then(function(res) {
                return res.data;
            }).catch(function(err) {
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
        createOrder: function(data) {
            return $http.post(baseUrl + '/api/orders/manual').then(function(res) {
                return res.data;
            });
        }

    };
}]);
