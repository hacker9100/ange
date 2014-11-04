/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('task_list', ['$scope', '$stateParams', 'projectService', 'taskService', '$location', function ($scope, $stateParams, projectService, taskService, $location) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.search = [];
        // 카테고리 선택 항목
        $scope.CATEGORY = [];

        // 목록 데이터
        var tasksData = null;

        var category = [
            {"NO": 0, "CATEGORY_B": "001", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "임신준비", "CATEGORY_GB": "1", "CATEGORY_ST": "0"},
            {"NO": 1, "CATEGORY_B": "002", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "임신초기", "CATEGORY_GB": "1", "CATEGORY_ST": "0"},
            {"NO": 2, "CATEGORY_B": "003", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "임신중기", "CATEGORY_GB": "1", "CATEGORY_ST": "0"},
            {"NO": 3, "CATEGORY_B": "001", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "건강", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"NO": 4, "CATEGORY_B": "002", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "음식", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"NO": 5, "CATEGORY_B": "003", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "놀이", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"NO": 6, "CATEGORY_B": "001", "CATEGORY_M": "001", "CATEGORY_S": "", "DEPTH": "2", "CATEGORY_NM": "검사", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"NO": 7, "CATEGORY_B": "001", "CATEGORY_M": "002", "CATEGORY_S": "", "DEPTH": "2", "CATEGORY_NM": "운동", "CATEGORY_GB": "2", "CATEGORY_ST": "0"}
        ];

        $scope.$watch('CATEGORY_M', function(data) {
            var category_s = [];

            if (data != undefined) {
                for (var i in category) {
                    var item = category[i];
                    if (item.CATEGORY_B == data.CATEGORY_B && item.CATEGORY_GB == '2' && item.CATEGORY_M != "") {
                        category_s.push(item);
                    }
                }

                $scope.category_s = category_s;
            }
        });

        $scope.removeCategory = function(idx) {
            $scope.CATEGORY.splice(idx, 1);
        }

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        var project = [];

        // 초기화
        $scope.initList = function() {
            $scope.oneAtATime = true;

            for (var i = nowYear - 5; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            projectService.getProjectOptions().then(function(projects){
                project = projects.data;

                $scope.projects = projects.data;

                if ($scope.projects != null) {
                    $scope.search.PROJECT = $scope.projects[0];
                }
            });

            // 카테고리
            $scope.select_settings = {externalIdProp: '', idProp: 'NO', displayProp: 'CATEGORY_NM', dynamicTitle: false, showCheckAll: false, showUncheckAll: false};

            if (category != null) {
                var category_a = [];
                var category_b = [];

                for (var i in category) {
                    var item = category[i];

                    if (item.CATEGORY_GB == '1') {
//                    category_a.push({id: item.NO, label: item.CATEGORY_NM});
                        category_a.push(item);
                    } else if (item.CATEGORY_GB == '2' && item.CATEGORY_M == "") {
                        category_b.push(item);
                    }
                }

                $scope.category_a = category_a;
                $scope.category_b = category_b;
            }

            // 검색어
            var order = [{name: "기자", value: "EDITOR_NM"}, {name: "제목+내용", value: "SUBJECT"}];

            $scope.years = year;
            $scope.projects = project;
            $scope.order = order;
            $scope.search.YEAR = nowYear+'';
            $scope.search.PROJECT = project[0];
            $scope.search.ORDER = order[0];
        };

        /********** 목록 조회 이벤트 **********/
        // 등록 화면 이동
        $scope.createNewTask = function () {
            $location.path('/task/0');
        };

        // 수정 화면 이동
        $scope.editTask = function (no) {
            $location.path('/task/'+no);
        };

        // 이력 조회
        $scope.showHistory = function (no) {
            alert("준비중입니다.")
        };

        // 삭제
        $scope.deleteTask = function (idx) {

            var task = $scope.tasks[idx];

            if (task.PHASE == '30') {
                alert("완료 상태의 태스크는 삭제할 수 없습니다.");
                return;
            }

            taskService.deleteTask(task.NO).then(function(data){
                $scope.getListTasks();
            });
        };

        // 검색
        $scope.searchTask = function() {
//            var search = [];
//
//            search.CATEGORY = $scope.CATEGORY;
//            search.push('YEAR/'+$scope.search.YEAR);
//            search.push('PROJECT_N0/'+$scope.search.PROJECT.NO);
//            search.push($scope.search.ORDER.value+'/'+$scope.search.KEYWORD);
//            search.push('CATEGORY/'+$scope.CATEGORY);
            $scope.search.CATEGORY = $scope.CATEGORY;
            $location.search('_search', $scope.search);

            $scope.getTaskList();
        };

        // 태스크 목록 조회
        $scope.getTaskList = function () {
            $scope.isLoading = true;
            taskService.getTasks().then(function(results){
                tasksData = results.data;

                if (tasksData != null) {
                    $scope.totalItems = results.data[0].TOTAL_COUNT; // 총 아이템 수
                    $scope.currentPage = 1; // 현재 페이지
                }
                $scope.isLoading = false;
                $location.search('_search', null);
            });
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
            if (tasksData == 'null') {
                $scope.tasks = null;
            } else {
                $scope.tasks = tasksData;
            }
        });

        // 페이지 이동 시 이벤트
        $scope.$watch('currentPage + itemsPerPage', function() {
            var start = $scope.currentPage % ( $scope.selectItems / $scope.itemsPerPage);

            var begin = ((start - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            if (tasksData != null) {
                $scope.tasks = tasksData.slice(begin, end);
            }
        });

        $scope.$watch('selectItems * selectCount < itemsPerPage * currentPage', function() {
            $scope.selectCount = $scope.selectCount + 1;
        });

        /********** 화면 초기화 **********/
        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';
        $scope.$parent.pageTitle = '태스크 관리';
        $scope.$parent.pageDescription = '기사주제 설정하고 할당하여 관리합니다.';
        $scope.$parent.tailDescription = '.';

        $scope.initList();
        $scope.getTaskList();

    }]);
});
