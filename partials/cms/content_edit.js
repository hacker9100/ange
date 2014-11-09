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
    controllers.controller('article_edit', ['$scope', '$stateParams', 'dataService', '$q', '$location', function ($scope, $stateParams, dataService, $q, $location) {

        var uploadUrl = 'http://localhost/serverscript/upload/../../upload/files/';

        /********** 초기화 **********/
        // 첨부 파일
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

        /********** 이벤트 **********/
        // 태스크 목록 이동
        $scope.showTaskList = function () {
            $location.path('/article');
        };

        // 태스크 조회
        $scope.getTask = function () {
            var deferred = $q.defer();
            $q.all([
                    taskService.getTask($stateParams.id),
                    contentService.getContent($stateParams.id)
                ])
//                .then( $q.spread( function( task, content )
                .then( function(results) {
                    deferred.resolve(results);
                    $scope.task      = results[0].data;
                    $scope.content   = results[1].data;

                    // 파일 순서 : 1. 원본, 2. 썸네일, 3. 중간사이즈
                    var files = results[1].data.FILES;

                    if (files.length > 0) {
                        for (var i =0; i < files.length; i++) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":uploadUrl+files[i].FILE_NM,"thumbnailUrl":uploadUrl+"thumbnail/"+files[i].FILE_NM,"mediumUrl":uploadUrl+"medium/"+files[i].FILE_NM,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }
                    }

                    $location.search('_modify', '0');
                    contentService.updateStatusContent(results[1].data.NO).then(function(data){
                        $location.search('_modify', null);
                    }, function(error) {
                        alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
                    });
                },function(error) {
                    deferred.reject(error);
                    alert(JSON.stringify(error));
                });

            return deferred.promise;
        };

        // 원고 등록/수정
        $scope.saveContent = function () {
            $scope.task.PHASE = '0,10';
            $scope.content.TASK = $scope.task;
            $scope.content.FILES = $scope.queue;

            if ( $scope.content.NO ) {
                dataService.db('content').insert($scope.content,function(data, status){
                    if (status != 200) {
                        alert('원고 등록에 실패 했습니다.');
                    } else {
                        if (!data.err) {
                            $location.url('/content/'+$stateParams.menu);
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            } else {
                dataService.db('content').update($scope.content.NO,$scope.content,function(data, status){
                    if (status != 200) {
                        alert('원고 수정에 실패 했습니다.');
                    } else {
                        if (!data.err) {
                            $location.url('/content/'+$stateParams.menu);
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            }

//            $location.search('_modify', '1');
//            contentService.updateStatusContent($scope.content.NO).then(function(data){
//                $location.search('_modify', null);
//
//                $location.path('/article');
//            });
        };

        // 원고 승인 요청
        $scope.commitContent = function () {

//            if ($scope.task.PHASE == '0') {
//                alert("원고를 등록해 주세요.");
//                return;
//            }

//            $location.search('_phase', '11');
//            taskService.updateStatusTask($scope.task.NO, $scope.task).then(function(data){
//                $location.search('_phase', null);
//                $scope.moveList();
//            });
        };

//        var fileInfo = [{"name":"Hydrangeas.jpg","size":595284,"url":"http://localhost/serverscript/upload/../../upload/files/Hydrangeas.jpg","thumbnailUrl":"http://localhost/serverscript/upload/../../upload/files/thumbnail/Hydrangeas.jpg","deleteUrl":"http://localhost/serverscript/upload/?file=Hydrangeas.jpg","deleteType":"DELETE"},{"name":"Lighthouse.jpg","size":561276,"url":"http://localhost/serverscript/upload/../../upload/files/Lighthouse.jpg","thumbnailUrl":"http://localhost/serverscript/upload/../../upload/files/thumbnail/Lighthouse.jpg","deleteUrl":"http://localhost/serverscript/upload/?file=Lighthouse.jpg","deleteType":"DELETE"}];
//        $scope.queue = fileInfo;

        $scope.initUpdate = function() {
            if ( $stateParams.id != 0) {
                $scope.getTask();
            }
        }

        /********** 화면 초기화 **********/
        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';
        if ( $stateParams.id != 0) {
            $scope.$parent.pageTitle = '원고 수정';
            $scope.$parent.pageDescription = '원고를 수정합니다.';
        } else {
            $scope.$parent.pageTitle = '원고 등록';
            $scope.$parent.pageDescription = '원고를 등록합니다.';
        }

        $scope.$parent.getSession()
            .then($scope.$parent.sessionCheck)
            .then($scope.initEdit)
            .then($scope.initUpdate)
            .catch($scope.$parent.reportProblems);

    }]);
});
