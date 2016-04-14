var app = angular.module('coastlineWebApp.common.controllers', ['ui.bootstrap', 'ngStorage',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('SideNavCtrl', ['$scope', '$http', '$state', 'apiUrl', function($scope, $http, $state, apiUrl) {
    'use strict';

    var logRes = function(res) {
        console.log("logRes");
        console.log(res);
    }

    // StageService.getStages().then(logRes)
    //                      .catch(logRes);
    //
    //   StageService.getNormalStages().then(function (res) {
    //     console.log(res);
    //   });

    // StageService.getSellingPoints(function (res) {
    //   console.log(res);
    // });

    // StageService.getDisplayData().then(function (data) {
    //     console.log(data);
    // });

    $scope.state = $state;


}]);
