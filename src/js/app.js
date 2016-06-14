var app = angular.module('coastlineWebApp', ['ui.router',
    'ngStorage',
    'ng-file-model',
    'ngNotify',
    'coastlineWebApp.auth.controllers',
    'coastlineWebApp.auth.services',
    'coastlineWebApp.settings.controllers',
    'coastlineWebApp.settings.services',
    'coastlineWebApp.dashboard.controllers',
    'coastlineWebApp.dashboard.services',
    'coastlineWebApp.inventory.controllers',
    'coastlineWebApp.inventory.directives',
    'coastlineWebApp.inventory.services',
    'coastlineWebApp.orders.controllers',
    'coastlineWebApp.orders.services',
    'coastlineWebApp.customers.controllers',
    'coastlineWebApp.customers.services',
    'coastlineWebApp.overview.controllers',
    'coastlineWebApp.overview.services',
    'coastlineWebApp.products.controllers',
    'coastlineWebApp.products.services',
    'coastlineWebApp.ecommerce.controllers',
    'coastlineWebApp.ecommerce.services',
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

    .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: '/views/forgot-password.html'
    })

    .state('sign-up', {
        url: '/sign-up',
        templateUrl: '/views/sign-up.html'
    })

    .state('sign-up-code', {
        url: '/sign-up-code',
        templateUrl: '/views/sign-up-code.html'
    })

    .state('dashboard', {
        url: '/auth',
        templateUrl: '/views/dashboard.html'
    })

    .state('dashboard.help', {
        url: '/help',
        templateUrl: '/views/dashboard.help.html'
    })

    .state('dashboard.help.customer', {
        url: '/customer',
        templateUrl: '/views/dashboard.help.customer.html'
    })

    .state('dashboard.help.inventory', {
            url: '/inventory',
            templateUrl: '/views/dashboard.help.inventory.html'
        })
        .state('dashboard.help.orders-invoices', {
            url: '/order-invoice',
            templateUrl: '/views/dashboard.help.orders-invoices.html'
        })
        .state('dashboard.help.product', {
            url: '/product',
            templateUrl: '/views/dashboard.help.product.html'
        })
        .state('dashboard.help.supply-chain', {
            url: '/supply-chain',
            templateUrl: '/views/dashboard.help.supply-chain.html'
        })
        .state('dashboard.help.overview', {
            url: '/overview',
            templateUrl: '/views/dashboard.help.overview.html'
        })
        .state('dashboard.help.catch-history', {
            url: '/history',
            templateUrl: '/views/dashboard.help.catch-history.html'
        })



    .state('dashboard.settings', {
        url: '/settings',
        templateUrl: '/views/dashboard.settings.html'
    })

    .state('dashboard.settings.general', {
        url: '/settings.general',
        templateUrl: '/views/dashboard.settings.general.html'
    })

    .state('dashboard.settings.fishery', {
        url: '/settings.fishery',
        templateUrl: '/views/dashboard.settings.fishery.html'
    })

    .state('dashboard.settings.users', {
        url: '/settings.users',
        templateUrl: '/views/dashboard.settings.users.html'
    })

    .state('dashboard.settings.security', {
        url: '/settings.security',
        templateUrl: '/views/dashboard.settings.security.html'
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

    .state('dashboard.default.ecommerce', {
        url: '/ecommerce',
        templateUrl: '/views/dashboard.default.ecommerce.html'
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

    .state('dashboard.default.orders.invoice', {
        url: '/invoice',
        templateUrl: '/views/dashboard.default.orders.invoice.html'
    })

    .state('dashboard.default.orders.menu', {
        url: '/menu',
        templateUrl: '/views/dashboard.default.orders.menu.html'
    })

    .state('dashboard.default.customers', {
        url: '/customers',
        templateUrl: '/views/dashboard.default.customers.html'
    })

    .state('dashboard.default.customers.profile', {
        url: '/profile',
        templateUrl: '/views/dashboard.default.customers.profile.html'
    })

    .state('dashboard.default.customers.menu', {
        url: '/menu',
        templateUrl: '/views/dashboard.default.customers.menu.html'
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

app.run(function($rootScope, $state, $location, AuthService, RedirectService, SupplyChainService) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {

        var shouldLogin = toState.data !== undefined && toState.data.requireLogin && !AuthService.isAuthenticated();

        // NOT authenticated - wants any private stuff
        if (shouldLogin) {


            if (toState.name === 'login') {
                return;
            } else if (toState.name === 'sign-up-code') {
                RedirectService.setRedirectState("sign-up-code");
            } else {
                RedirectService.setRedirectState("login");
            }

            event.preventDefault();

            $state.go("redirect");



            return;
        }

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
    })
    .constant('states', {
        STATES: [{
                name: 'Not Applicable',
                abbreviation: 'N/A'
            }, {
                name: "Alabama",
                abbreviation: "AL"
            }, {
                name: "Alaska",
                abbreviation: "AK"
            }, {
                name: "Alberta",
                abbreviation: "AB"
            }, {
                name: "American Samoa",
                abbreviation: "AS"
            }, {
                name: "Arizona",
                abbreviation: "AZ"
            }, {
                name: "Arkansas",
                abbreviation: "AR"
            }, {
                name: "British Columbia",
                abbreviation: "BC"
            }, {
                name: "California",
                abbreviation: "CA"
            }, {
                name: "Colorado",
                abbreviation: "CO"
            }, {
                name: "Connecticut",
                abbreviation: "CT"
            }, {
                name: "Delaware",
                abbreviation: "DE"
            }, {
                name: "District Of Columbia",
                abbreviation: "DC"
            }, {
                name: "Federated States Of Micronesia",
                abbreviation: "FM"
            }, {
                name: "Florida",
                abbreviation: "FL"
            }, {
                name: "Georgia",
                abbreviation: "GA"
            }, {
                name: "Guam",
                abbreviation: "GU"
            }, {
                name: "Hawaii",
                abbreviation: "HI"
            }, {
                name: "Idaho",
                abbreviation: "ID"
            }, {
                name: "Illinois",
                abbreviation: "IL"
            }, {
                name: "Indiana",
                abbreviation: "IN"
            }, {
                name: "Iowa",
                abbreviation: "IA"
            }, {
                name: "Kansas",
                abbreviation: "KS"
            }, {
                name: "Kentucky",
                abbreviation: "KY"
            }, {
                name: "Louisiana",
                abbreviation: "LA"
            }, {
                name: "Maine",
                abbreviation: "ME"
            }, {
                name: "Manitoba",
                abbreviation: "MB"
            }, {
                name: "Marshall Islands",
                abbreviation: "MH"
            }, {
                name: "Maryland",
                abbreviation: "MD"
            }, {
                name: "Massachusetts",
                abbreviation: "MA"
            }, {
                name: "Michigan",
                abbreviation: "MI"
            }, {
                name: "Minnesota",
                abbreviation: "MN"
            }, {
                name: "Mississippi",
                abbreviation: "MS"
            }, {
                name: "Missouri",
                abbreviation: "MO"
            }, {
                name: "Montana",
                abbreviation: "MT"
            }, {
                name: "Nebraska",
                abbreviation: "NE"
            }, {
                name: "Nevada",
                abbreviation: "NV"
            }, {
                name: "New Brunswick",
                abbreviation: "NB"
            }, {
                name: "New Hampshire",
                abbreviation: "NH"
            }, {
                name: "New Jersey",
                abbreviation: "NJ"
            }, {
                name: "New Mexico",
                abbreviation: "NM"
            }, {
                name: "New York",
                abbreviation: "NY"
            }, {
                name: "Newfoundland and Labrador",
                abbreviation: "NL"
            }, {
                name: "North Carolina",
                abbreviation: "NC"
            }, {
                name: "North Dakota",
                abbreviation: "ND"
            }, {
                name: "Northern Mariana Islands",
                abbreviation: "MP"
            }, {
                name: "Nova Scotia",
                abbreviation: "NS"
            }, {
                name: "Northwest Territories",
                abbreviation: "NT"
            }, {
                name: "Nunavut",
                abbreviation: "NU"
            }, {
                name: "Ohio",
                abbreviation: "OH"
            }, {
                name: "Oklahoma",
                abbreviation: "OK"
            }, {
                name: "Ontario",
                abbreviation: "ON"
            }, {
                name: "Oregon",
                abbreviation: "OR"
            }, {
                name: "Palau",
                abbreviation: "PW"
            }, {
                name: "Pennsylvania",
                abbreviation: "PA"
            }, {
                name: "Prince Edward Island",
                abbreviation: "PE"
            }, {
                name: "Puerto Rico",
                abbreviation: "PR"
            }, {
                name: "Quebec",
                abbreviation: "QC"
            }, {
                name: "Rhode Island",
                abbreviation: "RI"
            }, {
                name: "Saskatchewan",
                abbreviation: "SK"
            }, {
                name: "South Carolina",
                abbreviation: "SC"
            }, {
                name: "South Dakota",
                abbreviation: "SD"
            }, {
                name: "Tennessee",
                abbreviation: "TN"
            }, {
                name: "Texas",
                abbreviation: "TX"
            }, {
                name: "Utah",
                abbreviation: "UT"
            }, {
                name: "Vermont",
                abbreviation: "VT"
            }, {
                name: "Virgin Islands",
                abbreviation: "VI"
            }, {
                name: "Virginia",
                abbreviation: "VA"
            }, {
                name: "Washington",
                abbreviation: "WA"
            }, {
                name: "West Virginia",
                abbreviation: "WV"
            }, {
                name: "Wisconsin",
                abbreviation: "WI"
            }, {
                name: "Wyoming",
                abbreviation: "WY"
            }, {
                name: "Yukon",
                abbreviation: "YT"
            }

        ]
    })


.constant('countries', {
    COUNTRIES: [{
        name: 'Argentina',
        code: 'AR'
    }, {
        name: 'Australia',
        code: 'AU'
    }, {
        name: 'Belgium',
        code: 'BE'
    }, {
        name: 'Brazil',
        code: 'BR'
    }, {
        name: 'Canada',
        code: 'CA'
    }, {
        name: 'Chile',
        code: 'CL'
    }, {
        name: 'China',
        code: 'CN'
    }, {
        name: 'Denmark',
        code: 'DK'
    }, {
        name: 'Finland',
        code: 'FI'
    }, {
        name: 'France',
        code: 'FR'
    }, {
        name: 'Germany',
        code: 'DE'
    }, {
        name: 'Iceland',
        code: 'IS'
    }, {
        name: 'India',
        code: 'IN'
    }, {
        name: 'Indonesia',
        code: 'ID'
    }, {
        name: 'Ireland',
        code: 'IE'
    }, {
        name: 'Italy',
        code: 'IT'
    }, {
        name: 'Japan',
        code: 'JP'
    }, {
        name: 'Korea, Republic of',
        code: 'KR'
    }, {
        name: 'Malaysia',
        code: 'MY'
    }, {
        name: 'Mexico',
        code: 'MX'
    }, {
        name: 'Netherlands',
        code: 'NL'
    }, {
        name: 'New Zealand',
        code: 'NZ'
    }, {
        name: 'Norway',
        code: 'NO'
    }, {
        name: 'Philippines',
        code: 'PH'
    }, {
        name: 'Poland',
        code: 'PL'
    }, {
        name: 'Portugal',
        code: 'PT'
    }, {
        name: 'Russia',
        code: 'RU'
    }, {
        name: 'Singapore',
        code: 'SG'
    }, {
        name: 'South Africa',
        code: 'ZA'
    }, {
        name: 'Spain',
        code: 'ES'
    }, {
        name: 'Sweden',
        code: 'SE'
    }, {
        name: 'Switzerland',
        code: 'CH'
    }, {
        name: 'Taiwan',
        code: 'TW'
    }, {
        name: 'Thailand',
        code: 'TH'
    }, {
        name: 'Turkey',
        code: 'TR'
    }, {
        name: 'United Kingdom',
        code: 'GB'
    }, {
        name: 'United States',
        code: 'US'
    }, {
        name: 'Vietnam',
        code: 'VN'
    }]

});
