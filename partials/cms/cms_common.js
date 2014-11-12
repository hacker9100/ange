/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : cms_common.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('cms_common', ['$scope', '$stateParams', '$location', 'loginService', function ($scope, $stateParams, $location, loginService) {

//        alert(localStorage.getItem('userToken'))

        $scope.getSession = function() {
            return loginService.getSession();
        },
        $scope.sessionCheck = function(session) {
            if (session.data.USER_ID == undefined || session.data.USER_ID == '')
                throw( new String("세션이 만료되었습니다.") );
//            throw( new Error("세션이 만료되었습니다.") );
            return session;
        },
        $scope.reportProblems = function(error)
        {
            alert(error);
        };

        // 페이지 타이틀
        var spMenu = $location.path().split('/');

        $scope.message = 'ANGE CMS';
        if (spMenu[1] == "account") {
            $scope.pageTitle = '개인정보';
            $scope.pageDescription = '개인정보를 조회하고 수정할 수 있습니다.';
            $scope.tailDescription = '내용을 수정한 후 \"수정\"버튼을 누르면 수정이 완료됩니다.<br/>\"취소\"버튼을 누르면 원래대로 돌아갑니다.';
        } else if (spMenu[1] == "webboard") {
            $scope.pageTitle = '게시판';
            $scope.pageDescription = '공지사항을 게시합니다.';
            $scope.tailDescription = '.';
        } else if (spMenu[1] == "user") {
            $scope.pageTitle = '개인정보';
            $scope.pageDescription = '개인정보를 조회하고 수정할 수 있습니다.';
            $scope.tailDescription = '내용을 수정한 후 \"수정\"버튼을 누르면 수정이 완료됩니다.<br/>\"취소\"버튼을 누르면 원래대로 돌아갑니다.';
        }

    }]);
});
