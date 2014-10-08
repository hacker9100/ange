/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : youtube Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';
/*
    directives.directive('child1', function($sce) {
        return {
            restrict: 'EA',
            scope: { code:'=' },
            replace: true,
            templateUrl: 'partials/directive_child1.html',
            controller: 'directiveCtrl2',
            link: function (scope, element) {
                scope.$watch('value1', function (newVal) {
                    if (newVal) {
                        scope.val1 = "동적으로 할당된 값 : " + newVal;
                    }
                });
            }
        };
    });

    directives.directive('child2', function($sce) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'partials/directive_child2.html',
            controller: 'directiveCtrl3',
            link: function (scope, element) {
                    scope.$watch('value2', function (newVal) {
                        if (newVal) {
                            scope.val2 = "동적으로 할당된 값 : " + newVal;
                        }
                    });
            }
        };
    });
*/
/*
    // Loading Indicator
    directives.directive('butterbar', ['$rootScope', function($rootScope) {
        return {
            link : function(scope, element, attrs) {
                $rootScope.$on('$routeUpdate', function() {
                    element.addClass('hide');
                });

                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide');
                });

                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide');
                });
            }
        };
    }]);
*/
});
