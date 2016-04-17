var app = angular.module('coastlineWebApp.orders.services', ['ui.bootstrap', 'ngStorage',
    'ui.router'
]);


app.factory('OrderData', ['$http', '$window', '$localStorage', 'apiUrl', function($http, $window, $localStorage, apiUrl) {
    'use strict';
    var baseUrl = apiUrl;
    var selectedOrder;

    var _filter = null;

    return {
        getOrders: function(success, error) {
            var url = baseUrl + '/api/orders?';

            var counter = 0;

            for (var key in _filter) {
                counter += 1

                if (!_filter.hasOwnProperty(key)) continue;

                if (counter == 1) {
                    url = url + key + "=" + _filter[key]
                } else {
                    url = url + "&" + key + "=" + _filter[key]
                }
            }

            console.log(url);

            $http.get(url).success(success).error(error);
        },
        setFilter: function(filter) {
            _filter = filter;
        },
        clearFilter: function () {
            _filter = null;
        },
        isFilterCleared: function () {
            // return true;
            return (_filter == null);
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
                    'Accept': 'application/pdf'
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
