/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : article_edit.html 화면 콘트롤러
 */
'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('article_edit', ['$scope', '$stateParams', 'taskService', 'contentService', '$location', function ($scope, $stateParams, taskService, contentService, $location) {

        /********** 초기화 **********/
        // 초기화
        $scope.initEdit = function() {
            $scope.queue = [];
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
            $location.path('/article/list');
        };

        // 조회
        $scope.getTask = function () {
            taskService.getTask($stateParams.id).then(function(task){
                $scope.task = task.data;
            });

            if ( $scope.method == 'PUT') {
                contentService.getContent($stateParams.id).then(function(content){
                    alert(content.data)
                    if (content.data.NO != undefined) {
                        $scope.content = content.data;
                        alert("11");

                        // 파일 순서 : 1. 원본, 2. 썸네일, 3. 중간사이즈
                        var files = content.data.FILES;

                        if (files.length > 0) {
                            for (var i =0; i < files.length; i++) {
                                $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":"http://localhost/serverscript/upload/../../upload/files/"+files[i].FILE_NM,"thumbnailUrl":"http://localhost/serverscript/upload/../../upload/files/thumbnail/"+files[i].FILE_NM,"mediumUrl":"http://localhost/serverscript/upload/../../upload/files/medium/"+files[i].FILE_NM,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
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

            alert(JSON.stringify($scope.queue));

            if ( $scope.method == 'POST') {
                contentService.createContent($scope.content).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/article/list');
                });
            }
            else {
                contentService.updateContent($scope.content.NO, $scope.content).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/article/list');
                });
            }
        };

        // 원고 승인 요청
        $scope.commitContent = function () {

//            if ($scope.task.PHASE == '0') {
//                alert("원고를 등록해 주세요.");
//                return;
//            }

            $location.search('_phase', '11');
            taskService.updateStatusTask($scope.task.NO, $scope.task).then(function(data){
                $location.search('_phase', null);
                $scope.moveList();
            });
        };

//        var fileInfo = [{"name":"Hydrangeas.jpg","size":595284,"url":"http://localhost/serverscript/upload/../../upload/files/Hydrangeas.jpg","thumbnailUrl":"http://localhost/serverscript/upload/../../upload/files/thumbnail/Hydrangeas.jpg","deleteUrl":"http://localhost/serverscript/upload/?file=Hydrangeas.jpg","deleteType":"DELETE"},{"name":"Lighthouse.jpg","size":561276,"url":"http://localhost/serverscript/upload/../../upload/files/Lighthouse.jpg","thumbnailUrl":"http://localhost/serverscript/upload/../../upload/files/thumbnail/Lighthouse.jpg","deleteUrl":"http://localhost/serverscript/upload/?file=Lighthouse.jpg","deleteType":"DELETE"}];
//        $scope.queue = fileInfo;

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
