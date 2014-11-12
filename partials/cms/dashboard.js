/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : dashboard.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('dashboard', ['$scope', '$rootScope', '$location', '$controller', 'dataService', function ($scope, $rootScope, $location, $controller, dataService) {

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

        /********** 초기화 **********/
        // 초기화
        $scope.init = function() {
            $scope.oneAtATime = true;

            $scope.PAGE_NO = 0;
            $scope.PAGE_SIZE = 5;
        };

        /********** 이벤트 **********/
        // 프로젝트 목록 이동
        $scope.click_showProjectList = function () {
            $location.url('/project');
        };

        // 프로젝트 선택
        $scope.click_showProjectView = function (key) {
            $location.url('/project/view/'+key);
        };

        // 게시판 목록 이동
        $scope.click_showWebboardList = function () {
            $location.url('/webboard');
        };

        // 게시판 목록 이동
        $scope.click_showWebboardView = function (key) {
            $location.url('/webboard/view/'+key);
        };

        // 태스크 목록 이동
        $scope.click_showTaskList = function () {
            $location.url('/task');
        };

        // 태스크 선택
        $scope.click_showTaskView = function (key) {
            $location.url('/task/view/'+key);
        };

        // 공지사항 포틀릿 조회
        $scope.getNoticePortlet = function () {
            $scope.getList('webboard', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {HEAD: 'NOTICE'}, true)
                .then(function(data){$scope.notices = data})
                .catch(function(error){$scope.notices = [];  alert(error)});
        }

        // 프로젝트 포틀릿 조회
        $scope.getProjectPortlet = function () {
            $scope.isLoading = true;

            $scope.getList('project', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {}, true)
                .then(function(data){$scope.projects = data})
                .catch(function(error){$scope.projects = [];  alert(error)});
        };

        // 태스크 목록 조회
        $scope.getTaskList = function () {
            $scope.isLoading = true;

            var search = {};
            if ($rootScope.role != 'ADMIN' && $rootScope.role != 'MANAGER') {
                search = {EDITOR_ID: $rootScope.uid};
            }

            $scope.getList('task', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, search, true)
                .then(function(data){$scope.tasks = data})
                .catch(function(error){$scope.tasks = [];  alert(error)});
        };

        // 페이지 타이틀
        $scope.setTitle = function(session) {
            $scope.message = "ANGE CMS";
            $scope.pageTitle = "마이페이지";
            $scope.pageDescription = session.USER_NM + " 님의 대시보드입니다.";
            $scope.tailDescription = '.';
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.setTitle)
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getNoticePortlet();
        $scope.getProjectPortlet();
        $scope.getTaskList();

//            .then($scope.getProjectPortlet)
//            .then($scope.getTaskList)
//            .catch($scope.reportProblems);

	}]);
});
