/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-10-12
 * Description : article confirm Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('articleConfirmList', function() {
        return {
            restrict: 'ECA',
            replace: false,
            templateUrl: 'partials/cms/article_confirm_list.html',
            controller: 'article_confirm_list'
        };
    }).directive('articleConfirmEdit', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/article_confirm_edit.html',
            controller: 'article_confirm_edit'
        };
    }).directive('articleConfirmView', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/article_confirm_view.html',
            controller: 'article_confirm_view'
        };
    });
});
