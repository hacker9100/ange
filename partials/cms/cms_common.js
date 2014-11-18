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

//        $scope.getSession = function() {
//            return loginService.getSession();
//        },
//        $scope.sessionCheck = function(session) {
//            if (session.data.USER_ID == undefined || session.data.USER_ID == '')
//                throw( new String("세션이 만료되었습니다.") );
////            throw( new Error("세션이 만료되었습니다.") );
//            return session;
//        },
//        $scope.reportProblems = function(error)
//        {
//            alert(error);
//        };

        /********** 페이지 타이틀 **********/
        var spMenu = $location.path().split('/');

        $scope.message = 'ANGE CMS';
        if (spMenu[1] == "account") {
            $scope.pageTitle = '개인정보';
            $scope.pageDescription = '개인정보를 조회하고 수정할 수 있습니다.';
            $scope.tailDescription = '내용을 수정한 후 \"수정\"버튼을 누르면 수정이 완료됩니다.<br/>\"취소\"버튼을 누르면 원래대로 돌아갑니다.';
        } if (spMenu[1] == "archive") {
            $scope.pageTitle = '아카이브';
            $scope.pageDescription = '지난 기사자료를 조회할 수 있습니다.';
            $scope.tailDescription = '.';
        } else if (spMenu[1] == "project") {
            $scope.pageTitle = '프로젝트 관리';
            $scope.pageDescription = '프로젝트를 생성하고 섹션을 설정합니다.';
            $scope.tailDescription = '상단의 검색영역에서 원하는 프로젝트를 필터링하거나 찾을 수 있습니다.<br />진행 중인 프로젝트를 해지하며 이전 프로젝트를 전부 조회할 수 있습니다.';
        } else if (spMenu[1] == 'task') {
            $scope.pageTitle = '태스크 관리';
            $scope.pageDescription = '기사주제 설정하고 할당하여 관리합니다.';
            $scope.tailDescription = '.';
        } else if (spMenu[1] == 'content') {
            if (spMenu[2] == 'article') {
                $scope.pageTitle = '원고 관리';
                $scope.pageDescription = '태스크 내용을 확인하여 원고를 작성하고 관리합니다.';
                $scope.tailDescription = '.';
            } else if (spMenu[2] == 'article_confirm') {
                $scope.pageTitle = '원고 승인';
                $scope.pageDescription = '태스크 내용을 확인하여 원고를 작성하고 관리합니다.';
                $scope.tailDescription = '.';
            } else if (spMenu[2] == 'edit') {
                $scope.pageTitle = '편집';
                $scope.pageDescription = '승인완료된 원고를 편집하여 기사를 완성합니다.';
                $scope.tailDescription = '.';
            } else if (spMenu[2] == 'edit_confirm') {
                $scope.pageTitle = '편집 승인';
                $scope.pageDescription = '편집된 원고를 확인하고 승인관리합니다.';
                $scope.tailDescription = '.';
            }
        } else if (spMenu[1] == "webboard") {
            $scope.pageTitle = '게시판';
            $scope.pageDescription = '공지사항을 게시합니다.';
            $scope.tailDescription = '.';
        } else if (spMenu[1] == "user") {
            $scope.pageTitle = '사용자 관리';
            $scope.pageDescription = 'CMS 사용자를 관리합니다.';
            $scope.tailDescription = '.';
        } else if (spMenu[1] == "permission") {
            $scope.pageTitle = '권한 관리';
            $scope.pageDescription = 'CMS 사용 권한을 관리합니다.';
            $scope.tailDescription = '.';
        } else if (spMenu[1] == "category") {
            $scope.pageTitle = '카테고리 관리';
            $scope.pageDescription = 'CMS 사용하는 카테고리를 관리합니다.';
            $scope.tailDescription = '.';
        } else if (spMenu[1] == "series") {
            $scope.pageTitle = '시리즈 관리';
            $scope.pageDescription = 'CMS 시리즈를 관리합니다.';
            $scope.tailDescription = '.';
        } else if (spMenu[1] == "contact") {
            $scope.pageTitle = '주소록';
            $scope.pageDescription = 'CMS 시리즈를 관리합니다.';
            $scope.tailDescription = '.';
        }

    }]);
});
