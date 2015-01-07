/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsreivew-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsreivew-edit', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'experiencereview') {
                $scope.community = "리뷰";
            } else if ($stateParams.menu == 'productreview') {
                $scope.community = "상품 후기";
            } else if ($stateParams.menu == 'angereview') {
                $scope.community = "앙쥬 후기";
            } else if ($stateParams.menu == 'samplereview') {
                $scope.community = "샘플팩 후기";
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.community = "앙쥬 샘플팩 후기";
            }
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
/*        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            .catch($scope.reportProblems);*/
        $scope.init();

    }]);
});
