var app = angular.module('coastlineWebApp.overview.controllers', ['ui.bootstrap',
    'coastlineWebApp.overview.services',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.common.services',
    'ui.router'
]);



app.controller('OverviewCtrl', ['$scope', 'AuthService', '$state', 'FisheryService', 'OverviewService',
    function($scope, AuthService, $state, FisheryService, OverviewService) {

        OverviewService.fetchUpcomingOrders().then(function (data) {
            $scope.upcomingOrders = data;
            console.log(data);
        });

        OverviewService.fetchOverdueOrders().then(function (data) {
            $scope.overdueOrders = data;
            console.log(data);
        });

    }
]);
