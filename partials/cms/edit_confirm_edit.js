/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : edit_confirm_edit.html 화면 콘트롤러
 */
'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('edit_confirm_edit', ['$scope', '$stateParams', 'taskService', 'contentService', 'approvalService', '$location', function ($scope, $stateParams, taskService, contentService, approvalService, $location) {

        var uploadUrl = 'http://localhost/serverscript/upload/../../upload/files/';

        /********** 초기화 **********/
        $scope.content = [];

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
                        $location.search('_modify', '0');
                        contentService.updateStatusContent(content.data.NO).then(function(data){
                            $location.search('_modify', null);
                        });

                        $scope.content = content.data;

                        // 파일 순서 : 1. 원본, 2. 썸네일, 3. 중간사이즈
                        var files = content.data.FILES;

                        if (files.length > 0) {
                            for (var i =0; i < files.length; i++) {
                                $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":uploadUrl+files[i].FILE_NM,"thumbnailUrl":uploadUrl+"thumbnail/"+files[i].FILE_NM,"mediumUrl":uploadUrl+"medium/"+files[i].FILE_NM,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                            }
                        }
                    }
                });
            }
        };

        // 등록/수정
        $scope.saveContent = function () {
            $scope.task.PHASE = '0,10';
            $scope.content.TASK = $scope.task;
            $scope.content.FILES = $scope.queue;

            if ( $scope.method == 'POST') {
                contentService.createContent($scope.content).then(function(data){
                });
            }
            else {
                contentService.updateContent($scope.content.NO, $scope.content).then(function(data){
                });
            }

            $location.search('_modify', '1');
            contentService.updateStatusContent($scope.content.NO).then(function(data){
                $location.search('_modify', null);

                $location.search({_method: 'GET'});
                $location.path('/article_confirm/list');
            });
        };

        // 승인
        $scope.approveContent = function () {

            $scope.approval = {};
            $scope.approval.TASK_NO = $scope.task.NO;
            $scope.approval.APPROVAL_ST = '21';
            $scope.approval.NOTE = $scope.content.NOTE;

            approvalService.createApproval($scope.approval).then(function(data){
                $scope.moveList();
            });
        }

        // 반려
        $scope.returnContent = function () {

            $scope.approval = {};
            $scope.approval.TASK_NO = $scope.task.NO;
            $scope.approval.APPROVAL_ST = '22';
            $scope.approval.NOTE = $scope.content.NOTE;

            approvalService.createApproval($scope.approval).then(function(data){
                $scope.moveList();
            });
        };

        /********** 화면 초기화 **********/
        if ($scope.method != 'GET') {

            // 페이지 타이틀
            $scope.message = 'ANGE CMS';
            $scope.pageTitle = '편집 승인';
            $scope.pageDescription = '편집된 원고를 확인하고 승인관리합니다.';

            $scope.initEdit();
            $scope.getTask();
        }
    }]);
});
