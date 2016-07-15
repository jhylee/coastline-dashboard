var app = angular.module('coastlineWebApp.common.controllers', ['ui.bootstrap', 'ngStorage',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('SideNavCtrl', ['$scope', '$http', '$state', 'apiUrl', 'TutorialService', function($scope, $http, $state, apiUrl, TutorialService) {
    'use strict';

    var logRes = function(res) {
    }


    $scope.tutorial = TutorialService;
    $scope.state = $state;


}]);
