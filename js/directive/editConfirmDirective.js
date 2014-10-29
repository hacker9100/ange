/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-10-12
 * Description : edit confirm Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('editConfirmList', function() {
        return {
            restrict: 'ECA',
            replace: false,
            templateUrl: 'partials/cms/edit_confirm_list.html',
            controller: 'edit_confirm_list'
        };
    }).directive('editConfirmEdit', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/edit_confirm_edit.html',
            controller: 'edit_confirm_edit'
        };
    }).directive('editConfirmView', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/edit_confirm_view.html',
            controller: 'edit_confirm_view'
        };
    });
});
