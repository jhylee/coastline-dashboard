var app = angular.module('coastlineWebApp.common.controllers', ['ui.bootstrap', 'ngStorage',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('SideNavCtrl', ['$scope', '$http', '$state', 'apiUrl', 'StageData', function($scope, $http, $state, apiUrl, StageData) {
    'use strict';

    var logRes = function(res) {
        console.log("logRes");
        console.log(res);
    }

    // StageData.getStages().then(logRes)
    //                      .catch(logRes);
    //
    //   StageData.getNormalStages().then(function (res) {
    //     console.log(res);
    //   });

    // StageData.getSellingPoints(function (res) {
    //   console.log(res);
    // });

    // StageData.getDisplayData().then(function (data) {
    //     console.log(data);
    // });

    $scope.state = $state;


}]);
