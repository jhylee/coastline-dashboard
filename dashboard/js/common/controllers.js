var app = angular.module('coastlineWebApp.common.controllers', ['ui.bootstrap', 'ngStorage',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('SideNavCtrl', ['$scope', '$http', '$state', 'apiUrl', function($scope, $http, $state, apiUrl) {
    'use strict';

    var logRes = function(res) {
    }


    $scope.state = $state;


}]);
