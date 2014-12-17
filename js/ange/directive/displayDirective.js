/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-12-15
 * Description : carousel slide two image 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('display', function($window) {
        return {
            restrict: 'A',
            scope: {
                dnDisplayMode: '='
            },
            template: '<span class="desktop"></span>',
            link: function(scope, elem, attrs) {
                var markers = elem.find('span');

                function isVisible(element) {
                    return element && element.style.display != 'none' && element.offsetWidth && element.offsetHeight;
                }

                function update() {
                    angular.forEach(markers, function(element) {
                        if (isVisible(element)) {
                            scope.dnDisplayMode = element.className;
                            return false;
                        }
                    });
                }

                var t;
                angular.element($window).bind('resize', function() {
                    clearTimeout(t);
                    t = setTimeout(function() {
                        update();
                        scope.$apply();
                    }, 300);
                });

                update();
            }
        };
    });

});