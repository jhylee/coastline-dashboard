var app = angular.module('coastlineWebApp.orders.services', ['ui.bootstrap', 'ngStorage',
  'ui.router']);


  app.factory('OrderData', ['$http', '$localStorage', 'apiUrl', function($http, $localStorage, apiUrl) {
      'use strict';
      var baseUrl = apiUrl;
      var selectedOrder;

      return  {
          getOrders: function (success, error) {
              $http.get(baseUrl + '/api/orders').success(success).error(error);
          },
          getSelectedOrder: function () {
            return selectedOrder;
          },
          setSelectedOrder: function (order) {
            selectedOrder = order;
          }
      };
  }]);
