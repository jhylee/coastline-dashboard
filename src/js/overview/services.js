angular.module('coastlineWebApp.overview.services', ['coastlineWebApp.common.services', 'ngStorage'])

.factory('OverviewService', ['$http', 'apiUrl', 'FisheryService', function($http, apiUrl, FisheryService) {

    var baseUrl = apiUrl;

    return {
        fetchOverdueOrders: function () {
            return $http.get(baseUrl + '/api/orders/overdue')
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                })
        },
        fetchUpcomingOrders: function () {
            return $http.get(baseUrl + '/api/orders/oneweek')
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                })
        },
        fetchAnalytics: function() {
           return $http.get(baseUrl + '/api/analytics')
               .then(function (res) {
                   return res.data;
               }).catch(function (err) {
                   console.log(err);
               })
        },
    }
}])

app.directive('mattgraph', function() {
   var directive = {};
   directive.restrict = 'E';
   directive.template = '<canvas></canvas><div></div>';
   directive.scope = {
      properties: "=name",
   };
   directive.link = function($scope, element, attributes) {
      var canvas = element[0].children[0];
      var div = element[0].children[1];
      var context = canvas.getContext("2d");
      canvas.width = attributes.width;
      canvas.height = attributes.height;
      canvas.onmousemove = function(event) {
         context.clearRect(0, 0, canvas.width, canvas.height);
         canvas.draw(event.layerX, event.layerY);
      };
      canvas.draw = function() {};

      $scope.properties.fetch().then(function(data) {
         if (attributes.type == "pie") {
            canvas.draw = function(mx, my) {
               div.innerHTML = "";

               var cx = canvas.width/2;
               var cy = canvas.height/2;
               var smallest = canvas.width > canvas.height ? canvas.height : canvas.width;
               var margin = Math.floor(smallest/30);
               var radius = smallest/2 - margin*2;
               var ratio = 0;
               var angleTotal = 0;

               var angleMouse = Math.atan2(my - cy, mx - cx);
               if (angleMouse < 0) angleMouse = Math.PI*2 + angleMouse;

               for (var i = 0, len = data.data.length; i < len; ++i)
                  ratio += data.data[i];

               for (var i = 0, len = data.data.length; i < len; ++i) {
                  var name = data.names[i];
                  var color = Math.floor((Math.pow(16, 3)*(i + 1)/(data.data.length + 1))).toString(16);
                  while (color.length < 3)
                     color = "0" + color;

                  color = "#" + color;

                  var value = data.data[i];
                  var angle = value*Math.PI*2/ratio;
                  var sx = Math.cos(angleTotal + angle/2)*radius/2 + cx;
                  var sy = Math.sin(angleTotal + angle/2)*radius/2 + cy;

                  div.innerHTML += "<div>" + name + ": " + value + "</div>";

                  context.beginPath();
                  context.moveTo(cx, cy);

                  if (angleMouse >= angleTotal &&
                      angleMouse < angleTotal + angle &&
                      Math.sqrt(Math.pow(cx - mx, 2) + Math.pow(cy - my, 2)) < radius) {

                     context.arc(cx, cy, radius + margin/2, angleTotal, angleTotal + angle);
                     context.fillStyle = color;
                     context.fill();

                     context.fillStyle = "#000";
                     context.textAlign = "center";
                     context.fillText(Math.floor(value*100/ratio) + "%", sx, sy + 4);
                  }
                  else {
                     context.arc(cx, cy, radius, angleTotal, angleTotal + angle);
                     context.fillStyle = color;
                     context.fill();
                  }

                  angleTotal += angle;
               }
            }
         }

         canvas.draw(0, 0);
      });
   };

   return directive;
});
