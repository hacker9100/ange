/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : youtube Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('projectList', function() {
        return {
            restrict: 'ECA',
            replace: false,
            templateUrl: 'partials/cms/project_list.html',
            controller: 'project_list'
/*
            link: function (scope, element) {
                scope.$watch('value1', function (newVal) {
                    if (newVal) {
                        scope.val1 = "동적으로 할당된 값 : " + newVal;
                    }
                });
            }
 */
        };
    }).directive('projectEdit', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/project_edit.html',
            controller: 'project_edit'
        };
    }).directive('projectView', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/project_view.html',
            controller: 'project_view'
        };
    });
});
