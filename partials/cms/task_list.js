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
    controllers.controller('task_list', ['$scope', '$stateParams', 'taskService', '$location', function ($scope, $stateParams, taskService, $location) {

        // 페이지 타이틀
        if ($scope.method == 'GET' && $stateParams.id == undefined) {
            $scope.message = 'ANGE CMS';

            $scope.pageTitle = '태스크 관리';
            $scope.pageDescription = '기사주제 설정하고 할당하여 관리합니다.';
        }

        var tasksData = null;

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

        if ($scope.method == 'GET' && $stateParams.id == undefined) {
            $scope.getTasks();
        }

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
    }]);
});
