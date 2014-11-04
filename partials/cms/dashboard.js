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
    controllers.controller('dashboard', ['$scope', '$rootScope', 'loginService', 'projectService', 'taskService', '$location', function ($scope, $rootScope, loginService, projectService, taskService, $location) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.search = [];

        // 초기화
        $scope.initList = function() {
            $scope.search.PAGE_NO = 0;
            $scope.search.PAGE_SIZE = 5;

            $location.search('_search', $scope.search);
        };

        /********** 이벤트 **********/
        // 수정 화면 이동
        $scope.showTaskEdit = function (no) {
            $location.path('/task/'+no);
        };

        // 프로젝트 목록 이동
        $scope.showProjectList = function () {
            $location.path('/project');
        };

        // 공지사항 포틀릿 조회


        // 프로젝트 포틀릿 조회
        $scope.getProjectPortlet = function () {
            $scope.isLoading = true;
            projectService.getProjects().then(function(projects){
                $scope.projects = projects.data;
                $scope.isLoading = false;
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
        };

        // 태스크 목록 조회
        $scope.getTaskList = function () {
            $scope.isLoading = true;
            taskService.getTasks().then(function(tasks){
                $scope.tasks = tasks.data;
                $scope.isLoading = false;
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
        };

        $scope.getSession = function() {
            return loginService.getSession();
        },
        $scope.sessionCheck = function(session) {
            if (session.data.USER_ID == undefined || session.data.USER_ID == '')
                throw( new String("세션이 만료되었습니다.") );
            return session;
        },
        $scope.reportProblems = function(error)
        {
            alert(error);
        };

        // 페이지 타이틀
        $scope.setTitle = function(session) {
            $scope.message = "ANGE CMS";
            $scope.pageTitle = "마이페이지";
            $scope.pageDescription = session.data.USER_NM + " 님의 대시보드입니다.";
            $scope.tailDescription = '.';
        };

        /********** 화면 초기화 **********/
        $scope.initList();
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.setTitle)
            .then($scope.getProjectPortlet)
            .then($scope.getTaskList)
            .catch($scope.reportProblems);

	}]);
});
