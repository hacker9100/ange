/**
 * Author : Sung-hwan Kim
 * Date   : 2014-01-10
 * Description : moduleReply 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('moduleReply', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: true,
//            replace: true,
//            controller: "@",
//            name: "controllerName",
            templateUrl: '/partials/ange/com/module-reply.html',
            controller: 'module-reply',
            link: function (scope, element, attr) {
//                alert("1");
            }
        }
    }]);
});