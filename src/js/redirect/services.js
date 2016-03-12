angular.module('coastlineWebApp.redirect.services', ['ngStorage','coastlineConstants'])


.factory('RedirectService', ['$http', '$window', '$localStorage', 'apiUrl', function ($http, $window, $localStorage, apiUrl) {
    var baseUrl = apiUrl;
    var token = $localStorage.token;


    var redirectState = "login";

    return {

      //TODO ==================================== TODO

      getRedirectState: function () {
        return redirectState;
      },

      setRedirectState: function (state) {
        redirectState = state;
      },




    };
  }
])

.factory('HttpInterceptorForToken', ['$rootScope', '$localStorage', function ($rootScope, $localStorage) {
    return {
      // request : function(config) {
      //     console.log("intercepting");
      //     var access_token = $localStorage.token;
      //
      //     if (access_token !== null && access_token !== undefined && access_token !== "") {
      //         config.headers.Authorization = "Bearer " + access_token;
      //     }
      //     return config;
      // },
      //
      // responseError : function(response) {
      //     if (response.status === 401) {
      //         $rootScope.$broadcast('unauthorized');
      //     }
      //     return response;
      // },

      request: function (config) {
        if (config.ignoreInterceptor) {
          return config;
        }

        config.headers = config.headers || {};
        if ($localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $localStorage.token;
        }
        return config;
      },

      response: function (response) {
        if (response.status === 401) {
          // handle the case where the user is not authenticated
        }
        return response || $q.when(response);
      }

    };
}]);
