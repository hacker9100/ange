/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : youtube Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('masonry', ['$parse', function($parse) {
        return {
            restrict: 'AC',
            link: function(scope, elem, attrs) {
                var container = elem[0];
                var options = angular.extend({
                    itemSelector: '.item'
                }, JSON.parse(attrs.masonry));

                var masonry = scope.masonry = new Masonry(container, options);

                var debounceTimeout = 0;
                scope.update = function() {
                    if (debounceTimeout) {
                        window.clearTimeout(debounceTimeout);
                    }
                    debounceTimeout = window.setTimeout(function() {
                        debounceTimeout = 0;

                        masonry.reloadItems();
                        masonry.layout();
    
                        elem.children(options.itemSelector).css('visibility', 'visible');
                    }, 120);
                };
                scope.update();
            }
        };
    }]).directive('masonryTile', function() {
        return {
            restrict: 'AC',
            link: function(scope, elem) {
                elem.css('visibility', 'hidden');
                var master = elem.parent('*[masonry]:first').scope(),
                    update = master.update;
                if (update) {
                    imagesLoaded( elem.get(0), update);
                    elem.ready(update);
                }
            }
        };
    });
});
