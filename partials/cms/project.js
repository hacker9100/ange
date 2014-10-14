/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers',
    './project_list',
    './project_edit',
    './project_view'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project', ['$scope', '$stateParams', '$sce', '$location', function ($scope, $stateParams, $sce, $location) {

        var search = $location.search();

        $scope.method = search._method;
        $scope.isId = $stateParams.id == 0 || $stateParams.id == undefined ? false : true;

        if (search._method == "GET") {

//            angular.element("#test").html('<div project_list></div>');

//            var html = '<div project_list></div>';

//            $scope.test = $sce.trustAsHtml(html);


            $scope.renderHtml = function(html) {
                return $sce.trustAsHtml(html);
            };

            $scope.test = '<div project-list></div>';

            $scope.list = $sce.trustAsHtml($scope.test);

        }

//        alert(localStorage.getItem('userToken'))
    }]);
});
