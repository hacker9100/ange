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
    controllers.controller('article_edit', ['$scope', '$stateParams', 'loginService', 'taskService', 'contentService', '$q', '$location', function ($scope, $stateParams, loginService, taskService, contentService, $q, $location) {

        var uploadUrl = 'http://localhost/serverscript/upload/../../upload/files/';

        /********** 초기화 **********/
        $scope.queue = [];

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
            $location.path('/article');
        };

        // 조회
        $scope.getSession = function() {
            return loginService.getSession();
        },
        $scope.sessionCheck = function(session) {

            if (session.data.USER_ID == undefined || session.data.USER_ID == '')
                throw( new String("세션이 만료되었습니다.") );
//            throw( new Error("세션이 만료되었습니다.") );
            return loginService.getSession();
        },
        $scope.reportProblems = function(error)
        {
            alert("1"+error);
        };

        $scope.getTask = function () {
            var deferred = $q.defer();
            $q.all([
                    taskService.getTask($stateParams.id),
                    contentService.getContent($stateParams.id)
                ])
//                .then( $q.spread( function( task, content )
                .then( function(results) {
                    deferred.resolve(results);
                    alert(JSON.stringify(results[0].data));
                    $scope.task      = results[0].data;
                    $scope.content   = results[1].data;

//                    // Let's force an error to demonstrate the reportProblem() works!
//                    throw( new Error("Just to prove catch() works! ") );
                },function(error) {
                    deferred.reject(error);
                    alert(JSON.stringify(error));
                });

            return deferred.promise;

        };


/*
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
*/

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

                $location.path('/article');
            });
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
        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';

        if ( $scope.method == 'PUT') {
            $scope.$parent.pageTitle = '원고 수정';
            $scope.$parent.pageDescription = '원고를 수정합니다.';
        } else {
            $scope.$parent.pageTitle = '원고 등록';
            $scope.$parent.pageDescription = '원고를 등록합니다.';
        }

//        $scope.initEdit();
//        $scope.getTask();
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.initEdit)
            .then($scope.getTask)
            .catch($scope.reportProblems);

    }]);
});
