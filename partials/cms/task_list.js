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
        var tasksData = [];

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
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
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
            $location.url('/task/0');
        };

        // 수정 화면 이동
        $scope.editTask = function (no) {
            $location.url('/task/'+no);
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
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
        };

        $scope.tasks = [];
        $scope.pageNo = 0;
        $scope.pageSize = 4;
        $scope.perCnt = 0;
        $scope.perSize = 2;
        $scope.totalCnt = 0;

        // 검색
        $scope.searchTask = function() {
            $scope.pageNo = 0;
            tasksData = [];
            $scope.tasks = [];
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

            $location.search('_page', $scope.pageNo)
            $location.search('_size', $scope.pageSize);

            taskService.getTasks().then(function(results){
                $scope.totalCnt = results.data[0].TOTAL_COUNT;
                angular.forEach(results.data, function(model) {
                    tasksData.push(model);
                });

//                tasksData.push(results.data);
                if ($scope.tasks.length == 0) {
                    $scope.tasks = tasksData.slice($scope.perCnt, $scope.perSize);
//                    $scope.tasks = results.data;
                } else {
//                    angular.forEach(results.data, function(model) {
//                        $scope.tasks.push(model);
//                    });
                }

//                if (tasksData != null) {
//                    $scope.totalItems = results.data[0].TOTAL_COUNT; // 총 아이템 수
//                    $scope.currentPage = 1; // 현재 페이지
//                }
                $scope.isLoading = false;
//                for (var prop in $location.search())
//                    $location.search(prop, null);
            });
        };

        $scope.$watch('perCnt', function() {
            if ( $scope.perCnt >= $scope.tasks.length) {
                angular.forEach(tasksData.slice($scope.perCnt, $scope.perCnt + $scope.perSize), function(model) {
                    $scope.tasks.push(model);
                });
            }
        });

//        $scope.$watch('totalCnt', function() {
//
//        });

        $scope.select = function () {
            $scope.perCnt += $scope.perSize;

            alert($scope.totalCnt + ", " + $scope.perCnt);


            if ($scope.perCnt >= $scope.totalCnt) return;

            if ($scope.perCnt + $scope.perSize >= tasksData.length) {
                $scope.pageNo++;
                $scope.getTaskList();
            }
//            $scope.getTaskList();
//            $scope.tasks.push(tasksData[1]);
        };

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
