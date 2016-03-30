var app = angular.module('coastlineWebApp', ['ui.router',
    'ngStorage',
    'ng-file-model',
    'ngNotify',
    'coastlineWebApp.auth.controllers',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.dashboard.controllers',
    'coastlineWebApp.dashboard.services',
    'coastlineWebApp.inventory.controllers',
    'coastlineWebApp.inventory.directives',
    'coastlineWebApp.inventory.services',
    'coastlineWebApp.orders.controllers',
    'coastlineWebApp.orders.services',
    'coastlineWebApp.products.controllers',
    'coastlineWebApp.products.services',
    'coastlineWebApp.salesManagement.controllers',
    'coastlineWebApp.salesManagement.services',
    'coastlineWebApp.redirect.controllers',
    'coastlineWebApp.redirect.services',
    'coastlineWebApp.supplyChain.controllers',
    'coastlineWebApp.common.controllers',
    'coastlineWebApp.common.directives',
    'coastlineWebApp.common.services',
]);


app.config(function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider

        .state('login', {
        url: '/login',
        templateUrl: '/views/login.html'
    })

    .state('fishery-setup', {
        url: '/fishery-setup',
        templateUrl: '/views/fishery-setup.html'
    })

    .state('sign-up', {
        url: '/sign-up',
        templateUrl: '/views/sign-up.html'
    })

    .state('dashboard', {
        url: '/auth',
        templateUrl: '/views/dashboard.html'
    })

    .state('dashboard.help', {
        url: '/help',
        templateUrl: '/views/dashboard.help.html'
    })

    .state('dashboard.settings', {
        url: '/settings',
        templateUrl: '/views/dashboard.settings.html'
    })

    .state('dashboard.default', {
        url: '/home',
        templateUrl: '/views/dashboard.default.html'
    })

    .state('dashboard.default.overview', {
        url: '/overview',
        templateUrl: '/views/dashboard.default.overview.html'
    })

    .state('dashboard.default.products', {
        url: '/products',
        templateUrl: '/views/dashboard.default.products.html'
    })

    .state('dashboard.default.supply-chain', {
        url: '/supply-chain',
        templateUrl: '/views/dashboard.default.supply-chain.html'
    })

    .state('dashboard.default.sales-management', {
        url: '/sales-management',
        templateUrl: '/views/dashboard.default.sales-management.html'
    })

    .state('dashboard.default.sales-management.menu', {
        url: '/menu',
        templateUrl: '/views/dashboard.default.sales-management.menu.html'
    })

    .state('dashboard.default.sales-management.track', {
        url: '/track',
        templateUrl: '/views/dashboard.default.sales-management.track.html'
    })

    .state('dashboard.default.supply-chain.menu', {
        url: '/supply-chain.menu',
        templateUrl: '/views/dashboard.default.supply-chain.menu.html'
    })

    .state('dashboard.default.supply-chain.builder', {
        url: '/supply-chain.builder',
        templateUrl: '/views/dashboard.default.supply-chain.builder.html'
    })

    .state('dashboard.default.supply-chain.create', {
        url: '/supply-chain.create',
        templateUrl: '/views/dashboard.default.supply-chain.create.html'
    })

    .state('dashboard.default.inventory', {
        url: '/inventory',
        templateUrl: '/views/dashboard.default.inventory.html'
    })

    .state('dashboard.default.inventory.menu', {
        url: '/menu',
        templateUrl: '/views/dashboard.default.inventory.menu.html'
    })

    .state('dashboard.default.inventory.track', {
        url: '/inventory.track',
        templateUrl: '/views/dashboard.default.inventory.track.html'
    })


    .state('dashboard.default.orders', {
        url: '/orders',
        templateUrl: '/views/dashboard.default.orders.html'
    })




    .state('redirect', {
        url: '/redirect',
        views: {
            'nav-top': {
                templateUrl: '/views/login/nav-top.html'
            },
            'nav-side': {
                templateUrl: '/views/login/nav-side.html'
            },
            'body': {
                templateUrl: '/views/redirect/redirect.html'
            },
            'footer': {
                templateUrl: '/views/login/footer.html'
            },
        }
    })



    $httpProvider.interceptors.push('HttpInterceptorForToken');

});

app.run(function($rootScope, $state, $location, AuthService, RedirectService, SupplyChainData) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {

        var shouldLogin = toState.data !== undefined && toState.data.requireLogin && !AuthService.isAuthenticated();

        // NOT authenticated - wants any private stuff
        if (shouldLogin) {


            if (toState.name === 'login') {
                return;
            }

            RedirectService.setRedirectState("login");

            event.preventDefault();

            $state.go("redirect");



            return;
        }
        // else {
        //     if (fromState.name == 'dashboard.default.supply-chain.builder') {
        //         if (SupplyChainData.getLeaveTicket()) {
        //             console.log('yes');
        //
        //         } else {
        //             console.log('no');
        //
        //             event.preventDefault();
        //             SupplyChainData.setToState(toState.name);
        //             $rootScope.$broadcast('leaving-supply-chain-builder');
        //         }
        //     }
        // }


        // authenticated (previously) comming not to root main
        if (AuthService.isAuthenticated()) {
            // var shouldGoToMain = fromState.name === "" && toState.name !== "dashboard";
            var goToDashboard = (toState.name == "redirect");

            if (goToDashboard) {
                RedirectService.setRedirectState("dashboard.default.overview");
            }
            return;
        }
    });
});

angular.module('coastlineConstants', [])
    .constant('apiUrl', '@@apiUrl')
    .constant('Views', {
        HOME: 0,
        ORDERS: 1,
        PRODUCTS: 2,
        ADD_PRODUCT: 3,
        ORDER_DETAIL: 4
    });
