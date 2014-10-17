/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers',
    './article_confirm_list',
    './article_confirm_edit',
    './article_confirm_view'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('article_confirm', ['$scope', '$stateParams', '$location', function ($scope, $stateParams, $location) {

        // ng-class를 이용해 style을 동적으로 할달
        $scope.customClass = function() {
            var className = '';

            className = 'panel-heading';

            return className;
        };

        // list, edit, view을 화면 조건에 따라 변경
        var search = $location.search();

        $scope.method = search._method;
        $scope.isId = $stateParams.id == 0 || $stateParams.id == undefined ? false : true;

    }]);
});
