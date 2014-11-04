/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : permission Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('permissionEdit', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/permission.html',
            controller: 'permission_edit'
        };
    });
});
