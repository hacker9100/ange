/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-10-12
 * Description : user Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('userList', function() {
        return {
            restrict: 'ECA',
            replace: false,
            templateUrl: 'partials/cms/user_list.html',
            controller: 'user_list'
        };
    }).directive('userEdit', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/user_edit.html',
            controller: 'user_edit'
        };
    });
});
