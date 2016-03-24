angular.module('coastlineWebApp.redirect.controllers', ['ui.router', 'ngStorage', 'coastlineWebApp.redirect.services'])

.controller('redirectCtrl', ['$rootScope', '$scope', '$state', '$location', '$localStorage', 'RedirectService', function($rootScope, $scope, $state, $location, $localStorage, RedirectService) {

    $state.go(RedirectService.getRedirectState());

}]);
