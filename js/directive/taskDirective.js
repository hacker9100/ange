/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-10-12
 * Description : task Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('taskList', function() {
        return {
            restrict: 'ECA',
            replace: false,
            templateUrl: 'partials/cms/task_list.html',
            controller: 'task_list'
        };
    }).directive('taskEdit', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/task_edit.html',
            controller: 'task_edit'
        };
    }).directive('taskView', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/task_view.html',
            controller: 'task_view'
        };
    });
});
