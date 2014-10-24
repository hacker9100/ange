/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : article_confirm_edit.html 화면 콘트롤러
 */
'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('article_confirm_edit', ['$scope', '$stateParams', 'taskService', 'contentService', 'approvalService', '$location', function ($scope, $stateParams, taskService, contentService, approvalService, $location) {

        /********** 초기화 **********/
            // 초기화
        $scope.initEdit = function() {

        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
        $scope.ckeditor = '<p>\n<p>';
//        $scope.content = { "BODY": '<p>Hello</p>\n' };

        /********** 등록,수정 이벤트 **********/
        // 목록
        $scope.moveList = function () {
            $location.search({_method: 'GET'});
            $location.path('/article_confirm/list');
        };

        // 조회
        $scope.getTask = function () {
            taskService.getTask($stateParams.id).then(function(task){
                $scope.task = task.data;
            });

            if ( $scope.method == 'PUT') {
                contentService.getContent($stateParams.id).then(function(content){
                    if (content.data.NO != undefined) {
                        $scope.content = content.data;
                    }
                });
            }
        };

        // 등록/수정
        $scope.saveContent = function () {
            $scope.task.PHASE = '0,10';
            $scope.content.TASK = $scope.task;

            if ( $scope.method == 'POST') {
                contentService.createContent($scope.content).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/article_confirm/list');
                });
            }
            else {
                contentService.updateContent($scope.content.NO, $scope.content).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/article_confirm/list');
                });
            }
        };

        // 승인
        $scope.approveContent = function () {

            $scope.approval = {};
            $scope.approval.TASK_NO = $scope.task.NO;
            $scope.approval.APPROVAL_ST = '11';

            approvalService.createApproval($scope.approval).then(function(data){
                $scope.moveList();
            });
        }

        // 반려
        $scope.returnContent = function () {

            $scope.approval = {};
            $scope.approval.TASK_NO = $scope.task.NO;
            $scope.approval.APPROVAL_ST = '12';

            approvalService.createApproval($scope.approval).then(function(data){
                $scope.moveList();
            });
        };

        var fileInfo = [{"name":"Hydrangeas.jpg","size":595284,"url":"http://localhost/app/serverscript/upload/../../upload/files/test1/Hydrangeas.jpg","thumbnailUrl":"http://localhost/app/serverscript/upload/../../upload/files/test1/thumbnail/Hydrangeas.jpg","deleteUrl":"http://localhost/app/serverscript/upload/?file=Hydrangeas.jpg","deleteType":"DELETE"},{"name":"Lighthouse.jpg","size":561276,"url":"http://localhost/app/serverscript/upload/../../upload/files/test1/Lighthouse.jpg","thumbnailUrl":"http://localhost/app/serverscript/upload/../../upload/files/test1/thumbnail/Lighthouse.jpg","deleteUrl":"http://localhost/app/serverscript/upload/?file=Lighthouse.jpg","deleteType":"DELETE"}];
        $scope.queue = fileInfo;

        /********** 화면 초기화 **********/
        if ($scope.method != 'GET') {

            // 페이지 타이틀
            $scope.message = 'ANGE CMS';

            if ( $scope.method == 'PUT') {
                $scope.pageTitle = '원고 수정';
                $scope.pageDescription = '원고를 수정합니다.';
            } else {
                $scope.pageTitle = '원고 등록';
                $scope.pageDescription = '원고를 등록합니다.';
            }

            $scope.initEdit();
            $scope.getTask();
        }
    }]);
});
