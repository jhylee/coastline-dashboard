var app = angular.module('coastlineWebApp', ['ui.router',
  'ngStorage',
  'coastlineWebApp.auth.controllers',
  'coastlineWebApp.auth.services',
  'coastlineWebApp.dashboard.controllers',
  'coastlineWebApp.dashboard.services',
  'coastlineWebApp.redirect.controllers',
  'coastlineWebApp.redirect.services',
  'coastlineWebApp.dashboard.controllers',
  'coastlineWebApp.dashboard.services',
  'coastlineWebApp.products.controllers',
  'coastlineWebApp.products.services',
  'coastlineWebApp.trackInventory.controllers',
  'coastlineWebApp.trackInventory.services'
]);


app.config(function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/redirect');
  //$locationProvider.html5Mode(true);

  $stateProvider

  .state('create-supply-chain', {
    url: '/create-supply-chain',
    //  templateUrl: '/views/dashboard.html',
    data: {
      requireLogin: true
    },
    views: {
      'nav-top': {
        templateUrl: '/views/create-supply-chain/nav-top.html'
      },
      'nav-side': {
        templateUrl: '/views/create-supply-chain/nav-side.html'
      },
      'body': {
        templateUrl: '/views/create-supply-chain/body.html'
      },
      'footer': {
        templateUrl: '/views/create-supply-chain/footer.html'
      },
    }
  })

  .state('dashboard', {
    url: '/dashboard',
    //  templateUrl: '/views/dashboard.html',
    data: {
      requireLogin: true
    },
    views: {
      'nav-top': {
        templateUrl: '/views/dashboard/nav-top.html'
      },
      'nav-side': {
        templateUrl: '/views/dashboard/nav-side.html'
      },
      'body': {
        templateUrl: '/views/dashboard/body.html'
      },
      'footer': {
        templateUrl: '/views/dashboard/footer.html'
      },
    }
  })

  .state('fishery-setup', {
    url: '/fishery-setup',
    //  templateUrl: '/views/dashboard.html',
    data: {
      requireLogin: true
    },
    views: {
      'nav-top': {
        templateUrl: '/views/fishery-setup/nav-top.html'
      },
      'nav-side': {
        templateUrl: '/views/fishery-setup/nav-side.html'
      },
      'body': {
        templateUrl: '/views/fishery-setup/body.html'
      },
      'footer': {
        templateUrl: '/views/fishery-setup/footer.html'
      },
    }
  })


  .state('login', {
    url: '/login',

    views: {

      'nav-top': {
        templateUrl: '/views/login/nav-top.html'
      },
      'nav-side': {
        templateUrl: '/views/login/nav-side.html'
      },
      'body': {
        templateUrl: '/views/login/body.html'
      },
      'footer': {
        templateUrl: '/views/login/footer.html'
      },

    }

  })

  .state('sign-up', {
    url: '/sign-up',

    views: {

      'nav-top': {
        templateUrl: '/views/sign-up/nav-top.html'
      },
      'nav-side': {
        templateUrl: '/views/sign-up/nav-side.html'
      },
      'body': {
        templateUrl: '/views/sign-up/body.html'
      },
      'footer': {
        templateUrl: '/views/sign-up/footer.html'
      },

    }

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


  //  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
  //    return {
  //      'request': function (config) {
  //        config.headers = config.headers || {};
  //        if ($localStorage.token) {
  //          config.headers.Authorization = 'Bearer ' + $localStorage.token;
  //        }
  //        return config;
  //      },
  //      'responseError': function (response) {
  //        if (response.status === 401 || response.status === 403) {
  //          $location.path('/signin');
  //        }
  //        return $q.reject(response);
  //      }
  //    }
  //    }]);


});

app.run(function($rootScope, $state, $location, AuthService, RedirectService) {

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


    // authenticated (previously) comming not to root main
    if (AuthService.isAuthenticated()) {
      // var shouldGoToMain = fromState.name === "" && toState.name !== "dashboard";
      var goToDashboard = (toState.name == "redirect");

      if (goToDashboard) {
        RedirectService.setRedirectState("dashboard");
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