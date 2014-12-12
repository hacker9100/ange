/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : publish_list.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('publish_edit', ['$scope', '$stateParams', '$modal', '$location', 'ngTableParams', function ($scope, $stateParams, $modal, $location, ngTableParams) {

        /********** 모달 팝업 **********/
        $scope.openModal = function (content, status, size) {
            var modalInstance = $modal.open({
                templateUrl: 'publish_modal.html',
                controller: 'publish_modal',
//                templateUrl: 'partials/cms/task_list.html',
//                controller: 'task_list',
                size: size,
                resolve: {
                    content: function () {
                        return content;
                    },
                    status: function() {
                        return status;
                    }
                }
            });

            modalInstance.result.then(function (task) {
                alert(JSON.stringify(task));
                task.DELETE_FL = '1';
                $scope.tasks.push(task);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        /********** 초기화 **********/
        // 검색
        var search = {};

        // 초기화
        $scope.init = function() {
            var PROJECT = {NO: $stateParams.id};
            search = {PROJECT: PROJECT};
            $location.search('_search', search);
        };

        /********** 이벤트 **********/
        // 등록 화면 이동
        $scope.createEPUB = function () {
//            $location.path('/task/0');
        };

        // 태스크 목록 조회
        $scope.getTaskList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 1000,          // count per page
                sorting: {
                    SECTION_NO: 'asc'     // initial sorting
                }
            }, {
                groupBy: 'SECTION_NM',
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
//                    var key = Object.keys(params.sorting())[0];
//
//                    $scope.search['SORT'] = key;
//                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('cms/task', 'list', {}, $scope.search, true)
                        .then(function(data){
                            params.total(data[0].TOTAL_COUNT);
                            $defer.resolve(data);

//                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
//                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        .catch(function(error){$defer.resolve([]);});
                }
            });
        };

        var moveIndexSection = function (origin, destination) {
            var temp = $scope.tableParams.data[destination];
            $scope.tableParams.data[destination] = $scope.tableParams.data[origin];
            $scope.tableParams.data[origin] = temp;
        };

        $scope.moveUpSection = function(idx) {
            if (idx != 0) {
                moveIndexSection(idx, idx - 1);
            }
        };

        $scope.moveDownSection = function(idx) {
            if ($scope.tableParams.data[idx + 1] != undefined) {
                moveIndexSection(idx, idx + 1);
            }
        };

        var moveIndexTask = function (parentIdx, origin, destination) {
            var temp = $scope.tableParams.data[parentIdx].data[destination];
            $scope.tableParams.data[parentIdx].data[destination] = $scope.tableParams.data[parentIdx].data[origin];
            $scope.tableParams.data[parentIdx].data[origin] = temp;
//            var temp = $scope.tasks[destination];
//            $scope.tasks[destination] = $scope.tasks[origin];
//            $scope.tasks[origin] = temp;
        };

        $scope.moveUpTask = function(parentIdx, idx) {
            if (idx != 0) {
                moveIndexTask(parentIdx, idx, idx - 1);
            }
        };

        $scope.moveDownTask = function(parentIdx, idx) {
            if ($scope.tableParams.data[parentIdx].data[idx + 1] != undefined) {
                moveIndexTask(parentIdx, idx, idx + 1);
            }
        };

        $scope.deleteItem = function(idx) {

            $scope.tasks.splice(idx, 1);
            alert(JSON.stringify($scope.tasks))
        };

        $scope.addItem = function() {
            var task = {"PROJECT_NO": "18", "PROJECT_NM": "개발서버 이미지 수정", "NO": "ADD", "SUBJECT": "이미지", "DELETE_FL": '1'};

            $scope.tasks.push(task);
        };

        $scope.addItem = function() {
            $scope.openModal(null, null, 'lg');
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .catch($scope.reportProblems);

        $scope.getTaskList();

    }]);

    controllers.controller('publish_modal', ['$scope', '$modalInstance', 'content', 'status', '$location', function ($scope, $modalInstance, content, status, $location) {
        /********** 초기화 **********/
            // 검색 조건
        $scope.search = [];
        // 카테고리 선택 항목
        $scope.CATEGORY = [];

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
            $scope.search.CATEGORY = $scope.CATEGORY;
            $location.search('_search', $scope.search);

            $scope.getTaskList();
        };

        // 태스크 목록 조회
        $scope.getTaskList = function () {
            $scope.isLoading = true;
            taskService.getTasks().then(function(results){
                $scope.tasks = results.data;

                $scope.isLoading = false;
                $location.search('_search', null);
            });
        };

        /********** 화면 초기화 **********/
        $scope.initList();
        $scope.getTaskList();

        $scope.selectTask = function (task) {
            $modalInstance.close(task);
        };

        $scope.ok = function () {
//            approvalService.createApproval($scope.approval).then(function(data){
//                $modalInstance.close($scope.approval);
//            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
});
