/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-10-12
 * Description : youtube Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('editList', function() {
        return {
            restrict: 'ECA',
            replace: false,
            templateUrl: 'partials/cms/edit_list.html',
            controller: 'edit_list'
        };
    }).directive('editEdit', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/edit_edit.html',
            controller: 'edit_edit'
        };
    }).directive('editView', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/edit_view.html',
            controller: 'edit_view'
        };
    });
});
