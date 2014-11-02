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

    controllers.controller('article_confirm_modal', ['$scope', '$modalInstance', 'approvalService', 'content', 'status', function ($scope, $modalInstance, approvalService, content, status) {

        if (status == '11') {
            $scope.title = "승인 처리";
        } else {
            $scope.title = "반려 처리";
        }

        $scope.approval = {};
        $scope.approval.CONTENT_NO = content.NO;
        $scope.approval.APPROVAL_ST = status;

        $scope.ok = function () {
            approvalService.createApproval($scope.approval).then(function(data){
                $modalInstance.close($scope.approval);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

    // 사용할 서비스를 주입
    controllers.controller('article_confirm_list', ['$scope', '$stateParams', 'taskService', 'contentService', '$modal', '$location', function ($scope, $stateParams, taskService, contentService, $modal, $location) {

        $scope.openModal = function (content, status, size) {
            var modalInstance = $modal.open({
                templateUrl: 'article_confirm_modal.html',
                controller: 'article_confirm_modal',
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

            modalInstance.result.then(function (approval) {
                alert(JSON.stringify(approval))
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

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
        $scope.viewListContent = function (no) {
            $location.search({_method: 'GET'});
            $location.path('/article_confirm/view/'+no);
        };
*/

        // 승인
        $scope.approveListContent = function (idx) {

            var content = $scope.contents[idx];

            $scope.openModal(content, '11');

//            contentService.deleteContent(content.NO).then(function(data){
//                $scope.getContents();
//            });
        }

        // 반려
        $scope.returnListContent = function (idx) {

            var content = $scope.contents[idx];

            $scope.openModal(content, '12');

//            contentService.deleteContent(content.NO).then(function(data){
//                $scope.getContents();
//            });
        };

        // 목록
        $scope.getListTasks = function () {
            $scope.isLoading = true;
            $location.search('_phase', '11,12,13');
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

        // 원고 등록
        $scope.listEditContent = function (idx) {
            var task = $scope.tasks[idx];

            contentService.getContent(task.NO).then(function(content){
                $location.path('/article_confirm/'+task.NO);
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
        $scope.$parent.pageTitle = '원고 승인';
        $scope.$parent.pageDescription = '작성된 원고를 검수합니다.';
        $scope.$parent.tailDescription = '.';

        $scope.initList();
        $scope.getListTasks();

    }]);
});
