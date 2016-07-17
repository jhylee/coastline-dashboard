angular.module('coastlineWebApp.auth.services', ['ngStorage', 'coastlineConstants', 'ui.router'])


.factory('AuthService', ['$http', '$window', '$localStorage', 'apiUrl', 'FisheryService', '$state', function($http, $window, $localStorage, apiUrl, FisheryService, $state) {
    var baseUrl = apiUrl;
    var token = $localStorage.token;

    var parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    }

    var login = function(data, success, error) {
        return $http.post(baseUrl + '/api/login', data).then(function(res) {
            $localStorage.token = res.data.token;
            $localStorage.user = res.data.user;
            $localStorage.$save();

            FisheryService.fetchFishery().then(function(res) {
                $state.go('dashboard.default.overview');
            })


            return res.data;
        }).catch(function(err) {
            return err;
        })
    };

    return {


        isAuthenticated: function() {
            if ($localStorage.token === undefined || $localStorage.token === null) {

                return false;

            } else {
                var params = parseJwt($localStorage.token);

                return Math.round(new Date().getTime() / 1000) <= params.exp;
            }
        },

        signUp: function(data, success, error) {
            $http.post(baseUrl + '/api/register', data).success(function(resp) {

                $http.post(baseUrl + '/api/login', {
                    username: data.username,
                    password: data.password
                }).success(function(res) {
                    $localStorage.token = res.token;
                    $localStorage.user = res.user;
                    $localStorage.$save();

                    success(res);


                }).error(error)
            }).error(error);
        },


        sendResetLink: function(data) {
            return $http.post(baseUrl + '/api/password/reset/send', data).then(function(res) {
                return res.data;
            }).catch(function (err) {
                console.log(err);
                return err;
            });
        },

        createFishery: function(data, success, error) {
            $http.post(baseUrl + '/api/fisheries', data).success(function(res) {
                $localStorage.user.fishery = res.name;

                FisheryService.fetchFishery().then(function() {
                    $state.go('dashboard.default.overview');
                });

                success();
            }).error(error);
        },

        login: login,

        logout: function(done) {
            delete $localStorage.token;
            delete $localStorage.user;
            $localStorage.$save();
            done();
        },
        getToken: function() {
            return token;
        },
        setToken: function(newToken) {
            token = newToken;
        },
        user: $localStorage.user,

    };
}])

.factory('HttpInterceptorForToken', ['$rootScope', '$localStorage', '$state', function($rootScope, $localStorage, $state) {
    return {

        request: function(config) {
            config.headers = config.headers || {};
            if ($localStorage.token) {
                config.headers.Authorization = $localStorage.token;

            }
            return config;
        },

        response: function(response) {
            if (response == null) {
                $state.go("login");
            }

            if (response.status === 401) {
                // delete $localStorage.token;
                // $localStorage.$save();
                // $state.go("login");
            }
            return response || $q.when(response);
        }

    };
}]);
