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
    controllers.controller('dashboard', ['$scope', '$rootScope', 'loginService', 'dataService', '$location', function ($scope, $rootScope, loginService, dataService, $location) {

        /********** 초기화 **********/
        // 초기화
        $scope.initList = function() {
            $scope.PAGE_NO = 0;
            $scope.PAGE_SIZE = 5;
        };

        /********** 이벤트 **********/
        // 태스크 선택
        $scope.click_showTaskEdit = function (key) {
            $location.url('/task/'+key);
        };

        // 프로젝트 목록 이동
        $scope.click_showProjectList = function () {
            $location.url('/project');
        };

        // 게시판 목록 이동
        $scope.click_showWebboardList = function () {
            $location.url('/webboard');
        };

        // 태스크 목록 이동
        $scope.click_showTaskList = function () {
            $location.url('/task');
        };

        // 공지사항 포틀릿 조회
        $scope.getNoticePortlet = function () {
            $scope.isLoading = true;

            dataService.db('webboard').find({NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE},{HEAD: 'NOTICE'},function(data, status){
                if (status != 200) {
                    alert('조회에 실패 했습니다.');
                } else {
                    if (angular.isObject(data)) {
                        $scope.notices = data;
                    } else {
                        // TODO: 데이터가 없을 경우 처리
                        alert("조회 데이터가 없습니다.");
                    }
                }

                $scope.isLoading = false;
            });
        }

        // 프로젝트 포틀릿 조회
        $scope.getProjectPortlet = function () {
            $scope.isLoading = true;

            dataService.db('project').find({NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE},{},function(data, status){
                if (status != 200) {
                    alert('조회에 실패 했습니다.');
                } else {
                    if (angular.isObject(data)) {
                        $scope.projects = data;
                    } else {
                        // TODO: 데이터가 없을 경우 처리
                        alert("조회 데이터가 없습니다.");
                    }
                }

                $scope.isLoading = false;
            });

//            projectService.getProjects().then(function(projects){
//                $scope.projects = projects.data;
//                $scope.isLoading = false;
//            }, function(error) {
//                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
//            });
        };

        // 태스크 목록 조회
        $scope.getTaskList = function () {
            $scope.isLoading = true;

            dataService.db('task').find({NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE},{},function(data, status){
                if (status != 200) {
                    alert('조회에 실패 했습니다.');
                } else {
                    if (angular.isObject(data)) {
                        $scope.tasks = data;
                    } else {
                        // TODO: 데이터가 없을 경우 처리
                        alert("조회 데이터가 없습니다.");
                    }
                }

                $scope.isLoading = false;
            });

//            taskService.getTasks().then(function(tasks){
//                $scope.tasks = tasks.data;
//                $scope.isLoading = false;
//            }, function(error) {
//                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
//            });
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
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.setTitle)
            .catch($scope.reportProblems);

        $scope.initList();
        $scope.getNoticePortlet();
        $scope.getProjectPortlet();
        $scope.getTaskList();

//            .then($scope.getProjectPortlet)
//            .then($scope.getTaskList)
//            .catch($scope.reportProblems);

	}]);
});
