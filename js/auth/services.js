angular.module('coastlineWebApp.auth.services', ['ngStorage','coastlineConstants', 'ui.router'])


.factory('AuthService', ['$http', '$window', '$localStorage', 'apiUrl', function ($http, $window, $localStorage, apiUrl) {
    var baseUrl = apiUrl;
    var token = $localStorage.token;

    var parseJwt = function(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    }

    var login = function (data, success, error) {
        $http.post(baseUrl + '/api/login', data).success(function (res) {
          $localStorage.token = res.token;
          $localStorage.user = res.user;
          $localStorage.$save();

          success(res);

        }).error(function (err) {

          error(err);

        })
    };

    return {


      isAuthenticated: function() {
        if ($localStorage.token === undefined || $localStorage.token === null) {
          // console.log("token not present");

          return false;
        } else {
          var params = parseJwt($localStorage.token);
          // console.log("is token expired? " + Math.round(new Date().getTime() / 1000) <= params.exp);

          return Math.round(new Date().getTime() / 1000) <= params.exp;
        }
      },

      signUp: function (data, fisheryName, success, error) {
        $http.post(baseUrl + '/api/register', data).success(function (resp) {

          $http.post(baseUrl + '/api/login', {username: data.username, password: data.password}).success(function(res) {
            $localStorage.token = res.token;
            $localStorage.user = res.user;
            $localStorage.$save();
            
            success(res);


          }).error(error)
        }).error(error);
      },

      createFishery: function (data, success, error) {
          $http.post(baseUrl + '/api/fisheries', data).success(function (res) {
            $localStorage.fisheryName = res.name;
            console.log("$localStorage.fisheryName " + $localStorage.fisheryName);
            success();
          }).error(error);
      },

      login: login,

      logout: function (done) {
        delete $localStorage.token;
        delete $localStorage.user;
        $localStorage.$save();
        // console.log("token: " + $localStorage.token);
        done();
      },
      getToken: function () {
        // console.log("getting token: " + token);
        return token;
      },
      setToken: function (newToken) {
        // console.log("setting token: " + token + ", " + newToken);
        token = newToken;
        // console.log("token now: " + token);
      },


    };
  }
])

.factory('HttpInterceptorForToken', ['$rootScope', '$localStorage', '$state', function ($rootScope, $localStorage, $state) {
    return {

      request: function (config) {
        config.headers = config.headers || {};
        // console.log("attaching token: " + $localStorage.token);
        if ($localStorage.token) {
          // console.log("attaching token now");
          config.headers.Authorization = $localStorage.token;
          // config.headers.Authorization = 'Bearer ' + $localStorage.token;

          console.log("config.headers.Authorization " + config.headers.Authorization);
        }
        return config;
      },

      response: function (response) {
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
