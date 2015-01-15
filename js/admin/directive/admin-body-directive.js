/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-14
 * Description : adminBody 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('adminBody', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: true,
//            replace: true,
            templateUrl: function(element, attr) {
                var menu = element.scope().location.split('/');

                if (menu[1] == 'save') {
                    menu[1] = 'user';
                }

//                if (menu[1] == 'archive' || menu[1] == 'article' || menu[1] == 'article-confirm' || menu[1] == 'edit' || menu[1] == 'edit-confirm') {
//                    if (menu[2] == 'list') {
//                        menu[1] = 'task';
//                    } else {
//                        menu[1] = 'content';
//                    }
//                }
                return '/partials/admin/'+menu[1]+'-'+menu[2]+'.html';
            }
        }
    }]);
});