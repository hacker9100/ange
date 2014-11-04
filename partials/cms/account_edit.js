/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : account_edit.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('account_edit', ['$scope', '$rootScope', '$stateParams', 'userService', '$location', function ($scope, $rootScope, $stateParams, userService, $location) {

        /********** 초기화 **********/
        $scope.initEdit = function() {

        };

        /********** 이벤트 **********/
        // 등록/수정
        $scope.saveCmsUser = function () {
            userService.updateCmsUser($rootScope.uid, $scope.user).then(function(data){
                alert("정상적으로 수정했습니다.");
            });
        };

        // 로그인 사용자 조회
        $scope.getCmsUser = function (session) {
            if (session.data.USER_ID != '') {
                userService.getCmsUser(session.data.USER_ID).then(function(user){
                    if (user.data.USER_ID == undefined) {
                        alert("조회 정보가 없습니다.");
                    } else {
                        $scope.user = user.data;
                    }
                }, function(error) {
                    alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
                });
            } else {
                alert("조회 정보가 없습니다.");
            }
        };

        // 취소
        $scope.cancel = function () {
            $scope.$parent.getSession()
                .then($scope.$parent.sessionCheck)
                .then($scope.getCmsUser)
                .catch($scope.$parent.reportProblems);
        };

        // 페이지 타이틀
        $scope.setTitle = function() {
            $scope.$parent.message = 'ANGE CMS';
            $scope.$parent.pageTitle = '개인정보';
            $scope.$parent.pageDescription = '개인정보를 조회하고 수정할 수 있습니다.';
            $scope.$parent.tailDescription = '내용을 수정한 후 \"수정\"버튼을 누르면 수정이 완료됩니다.<br/>\"취소\"버튼을 누르면 원래대로 돌아갑니다.';
        };

        /********** 화면 초기화 **********/
        $scope.initEdit();
        $scope.setTitle();
        $scope.$parent.getSession()
            .then($scope.$parent.sessionCheck)
            .then($scope.getCmsUser)
            .catch($scope.$parent.reportProblems);

    }]);
});
