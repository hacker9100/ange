/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project_list.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project_list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', function ($scope, $rootScope, $stateParams, $location, dialogs) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.search = {};

        // 목록 데이터
        $scope.listData = [];

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.init = function() {
            for (var i = 2010; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            // 검색어
            var order = [{name: "등록자", value: "REG_NM"}, {name: "제목+내용", value: "SUBJECT"}];

            $scope.years = year;
            $scope.order = order;
            $scope.search.YEAR = nowYear+'';
            $scope.search.ORDER = order[0];
        };

        /********** 이벤트 **********/
        // 등록 버튼 클릭
        $scope.click_createNewProject = function () {
            $location.path('/project/edit/0');
        };

        // 조회 화면 이동
        $scope.click_showViewProject = function (key) {
            $location.url('/project/view/'+key);
        };

        // 수정 화면 이동
        $scope.click_showEditProject = function (item) {
            if (!($rootScope.role == 'CMS_ADMIN' || $rootScope.role == 'MANAGER') && $rootScope.uid != item.REG_UID) {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $location.path('/project/edit/'+item.NO);
        };

        // 삭제 버튼 클릭
        $scope.click_deleteProject = function (item) {
            if (item.PROJECT_ST == '3') {
                dialogs.notify('오류', '완료 상태의 프로젝트는 삭제할 수 없습니다.', {size: 'md'});
                return;
            }

            if ($rootScope.role != 'ADMIN' && $rootScope.role != 'MANAGER' && $rootScope.uid != item.REG_UID) {
                dialogs.notify('오류', '삭제 권한이 없습니다.', {size: 'md'});
                return;
            }

            $scope.deleteItem('project', item.NO, false)
                .then(function(){$scope.getProjectList($scope.search)})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 검색 버튼 클릭
        $scope.click_searchProject = function () {
            $scope.getProjectList($scope.search);
        }

        // 프로젝트 목록 조회
        $scope.getProjectList = function (search) {
            $scope.isLoading = true;
            $scope.getList('project', {NO:0, SIZE:5}, search, true)
                .then(function(data){$scope.list = data;})
                .catch(function(error){$scope.list = []; console.log(error);})
                .finally(function(){$scope.isLoading = false;});
        };

        // 페이징 처리
        $scope.selectItems = 200; // 한번에 조회하는 아이템 수
        $scope.selectCount = 1; // 현재 조회한 카운트 수
        $scope.itemsPerPage = 10; // 화면에 보이는 아이템 수(default 10)
        $scope.maxSize = 5; // 총 페이지 제한

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        // 페이지 이동 시 이벤트
        $scope.$watch('isLoading', function() {
            if ($scope.listData == 'null') {
                $scope.projects = null;
            } else {
                $scope.projects = projectsData;
            }
        });

        // 페이지 이동 시 이벤트
        $scope.$watch('currentPage + itemsPerPage', function() {
            var start = $scope.currentPage % ( $scope.selectItems / $scope.itemsPerPage);

            var begin = ((start - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            if ($scope.listData != null) {
                $scope.projects = projectsData.slice(begin, end);
/*
                var i = 0;
                for (i = begin; i <= end; i++) {
                    $scope.$watch('projects', function() {
                        alert($scope.projects[i].NO)
                        $scope.projects[i].ST_NM = 'TEST';
                    });
                }
*/
            }
        });

        $scope.$watch('selectItems * selectCount < itemsPerPage * currentPage', function() {
            $scope.selectCount = $scope.selectCount + 1;
        });

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getProjectList();

    }]);
});
