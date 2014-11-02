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
    controllers.controller('edit_list', ['$scope', '$stateParams', 'taskService', 'contentService', '$location', function ($scope, $stateParams, taskService, contentService, $location) {

        /********** 초기화 **********/
        // 목록 데이터
        var tasksData = null;

        // 초기화
        $scope.initList = function() {
            $scope.oneAtATime = true;
        }

        /********** 목록 조회 이벤트 **********/
/*
        // 조회 화면 이동
        $scope.viewContent = function (no) {
            $location.search({_method: 'GET'});
            $location.path('/edit/view/'+no);
        };
*/

        // 원고 편집
        $scope.listEditContent = function (idx) {

            $location.search({_method: 'POST'});

            var task = $scope.tasks[idx];

            contentService.getContent(task.NO).then(function(content){
                if (content.data.NO != undefined) {
                    task.NO = 0;
                }

                $location.path('/edit/'+task.NO);
            });
        };

        // 목록
        $scope.getListTasks = function () {
            $scope.isLoading = true;
            $location.search('_phase', '20,21,22,23');
            taskService.getTasks().then(function(tasks){

                tasksData = tasks.data;

                if (tasksData != null) {
                    $scope.totalItems = tasks.data[0].TOTAL_COUNT; // 총 아이템 수
                    $scope.currentPage = 1; // 현재 페이지
                }
                $scope.isLoading = false;
                $location.search('_phase', null);
            });
        };

        // 편집 승인 요청
        $scope.commitListContent = function (idx) {
            var content = $scope.contents[idx];

            $location.search('_phase', '21');
            contentService.updateStatusContent(content.NO, content).then(function(data){
                $scope.getContents();
                $location.search('_phase', null);
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

        /********** 화면 초기화 **********/
        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';
        $scope.$parent.pageTitle = '편집';
        $scope.$parent.pageDescription = '승인완료된 원고를 편집하여 기사를 완성합니다.';
        $scope.$parent.tailDescription = 'To edit settings, press <kbd><kbd>ctrl</kbd>+!<kbd>s</kbd></kbd>';

        $scope.initList();
        $scope.getListTasks();

    }]);
});
