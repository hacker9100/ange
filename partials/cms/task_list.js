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

        $scope.CATEGORY = [];

        $scope.$watch('CATEGORY_M', function(data) {
            var category_s = [];

            for (var i in category) {
                var item = category[i];

                if (item.CATEGORY_B == data.CATEGORY_B && item.CATEGORY_GB == '2' && item.CATEGORY_M != "") {
                    category_s.push(item);
                }
            }

            $scope.category_s = category_s;
        });

        $scope.removeCategory = function(idx) {
            $scope.CATEGORY.splice(idx, 1);
        }

        /* 초기화 */
        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        var project = [];

        // 목록 데이터
        var tasksData = null;

        // 초기화
        $scope.initList = function() {
            for (var i = nowYear - 5; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            projectService.getProjectOptions().then(function(projects){
                project = projects.data;

//                $scope.search.projects = projects.data;
//
//                if ($scope.projects != null) {
//                    $scope.search.PROJECT = $scope.projects[0];
//                }

                $scope.initSearch();
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
        };

        $scope.initSearch = function() {
            // 검색어
            var order = [{name: "기자", value: "0"}, {name: "편집자", value: "1"}, {name: "제목+내용", value: "2"}];

            $scope.search = { years: year, YEAR: nowYear+'', order: order, ORDER: order[0], projects: project, PROJECT: project[0] };
        };

        $scope.searchTask = function(search) {
            search.CATEGORY = $scope.CATEGORY;
            alert(JSON.stringify(search));
        };

        /* 목록 조회 이벤트 */
        // 등록 화면 이동
        $scope.createNewTask = function () {
            $location.search({_method: 'POST'});
            $location.path('/task/edit/0');
        };

        // 조회 화면 이동
        $scope.viewListTask = function (no) {
            $location.search({_method: 'GET'});
            $location.path('/task/view/'+no);
        };

        // 수정
        $scope.editTask = function (no) {
            $location.search({_method: 'PUT'});
            $location.path('/task/edit/'+no);
        };

        // 삭제
        $scope.deleteListTask = function (idx) {

            var task = $scope.Tasks[idx];

            if (task.PHASE == '5') {
                alert("완료 상태의 태스크는 삭제할 수 없습니다.");
                return;
            }

            taskService.deleteTask(task.NO).then(function(data){
                $scope.getTasks();
            });
        };

        // 목록
        $scope.getTasks = function () {
            $scope.isLoading = true;
            taskService.getTasks().then(function(tasks){

                tasksData = tasks.data;

                if (tasksData != null) {
                    $scope.totalItems = tasks.data[0].TOTAL_COUNT; // 총 아이템 수
                    $scope.currentPage = 1; // 현재 페이지
                }
                $scope.isLoading = false;
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

        /* 화면 초기화 */
        if ($scope.method == 'GET' && $stateParams.id == undefined) {
            // 페이지 타이틀
            $scope.message = 'ANGE CMS';
            $scope.pageTitle = '태스크 관리';
            $scope.pageDescription = '기사주제 설정하고 할당하여 관리합니다.';
            $scope.tailDescription = '.';

            $scope.initList();
            $scope.getTasks();
        }

    }]);
});
