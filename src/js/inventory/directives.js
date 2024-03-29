angular.module('coastlineWebApp.inventory.directives', [])



/**
 * Directive for network chart.
 */
.directive('visNetworkTrack', function() {
    return {
        restrict: 'EA',
        transclude: false,
        scope: {
            data: '=',
            options: '=',
            events: '='
        },
        link: function(scope, element, attr) {
            var networkEvents = [
                'click', // X
                'doubleclick',
                'oncontext',
                'hold',
                'release',
                'selectNode', // X
                'selectEdge', // X
                'deselectNode',
                'deselectEdge',
                'dragStart',
                'dragging',
                'dragEnd',
                'hoverNode',
                'blurNode',
                'zoom',
                'showPopup',
                'hidePopup',
                'startStabilizing',
                'stabilizationProgress',
                'stabilizationIterationsDone',
                'stabilized',
                'resize',
                'initRedraw',
                'beforeDrawing',
                'afterDrawing',
                'animationFinished'

            ];

            var network = null;

            scope.$watch('data', function() {
                // Sanity check
                if (scope.data == null) {
                    return;
                }

                // If we've actually changed the data set, then recreate the graph
                // We can always update the data by adding more data to the existing data set
                if (network != null) {
                    network.destroy();
                }

                // Create the graph2d object
                network = new vis.Network(element[0], scope.data, scope.options);

                // Attach an event handler if defined
                angular.forEach(scope.events, function(callback, event) {
                    if (networkEvents.indexOf(String(event)) >= 0) {
                        network.on(event, callback);
                    }
                });

                // onLoad callback
                if (scope.events != null && scope.events.onload != null &&
                    angular.isFunction(scope.events.onload)) {
                    scope.events.onload(graph);
                }
            });

            scope.$watchCollection('options', function(options) {
                if (network == null) {
                    return;
                }
                network.setOptions(options);
            });
        }
    };
})
