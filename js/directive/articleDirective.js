/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-10-12
 * Description : article Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('articleList', function() {
        return {
            restrict: 'ECA',
            replace: false,
            templateUrl: 'partials/cms/article_list.html',
            controller: 'article_list'
        };
    }).directive('articleEdit', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/article_edit.html',
            controller: 'article_edit'
        };
    }).directive('articleView', function() {
        return {
            restrict: 'EA',
            replace: false,
            templateUrl: 'partials/cms/article_view.html',
            controller: 'article_view'
        };
    });
});
