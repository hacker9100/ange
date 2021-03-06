/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-14
 * Description : adminLayout 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('adminLayout', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: true,
            replace: true,
            compile: function(element, attrs){
                var scope = element.scope();
                var path = scope.location.split('/');
//                var menu = element.scope().location.split('/');

//                if (menu[1] == 'archive' || menu[1] == 'article' || menu[1] == 'article-confirm' || menu[1] == 'edit' || menu[1] == 'edit_confirm') {
//                    if (menu[2] == 'list') {
//                        menu[1] = 'task';
//                    } else {
//                        menu[1] = 'content';
//                    }
//                }

                element.append('<admin-body menu="'+path[1]+'" type="'+path[2]+'" controller-name="'+path[1]+'-'+path[2]+'"></admin-body>');
            }
        }
    }]);
});