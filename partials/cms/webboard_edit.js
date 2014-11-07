/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : webboard_edit.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('webboard_edit', ['$scope', '$stateParams', 'loginService', 'dataService', '$q', '$location', function ($scope, $stateParams, loginService, dataService, $q, $location) {

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

        /********** 이벤트 **********/
        // 게시판 목록 이동
        $scope.click_showCmsBoardList = function () {
            $location.url('/webboard');
        };

        // 게시판 조회
        $scope.getCmsBoard = function () {
            if ($stateParams.id != 0) {
                dataService.db('webboard').findOne($stateParams.id,{},function(data, status){
                    if (status != 200) {
                        alert('조회에 실패 했습니다.');
                    } else {
                        if (angular.isObject(data)) {
                            $scope.item = data;
                        } else {
                            if (data.err == true) {
                                alert(data.msg);
                            } else {
                                // TODO: 데이터가 없을 경우 처리
                                alert("조회 데이터가 없습니다.");
                            }
                        }
                    }
                });
            }

//            var deferred = $q.defer();
//            $q.all([
//                    taskService.getTask($stateParams.id),
//                    contentService.getContent($stateParams.id)
//                ])
////                .then( $q.spread( function( task, content )
//                .then( function(results) {
//                    deferred.resolve(results);
//                    $scope.task      = results[0].data;
//                    $scope.content   = results[1].data;
//
//                    // 파일 순서 : 1. 원본, 2. 썸네일, 3. 중간사이즈
//                    var files = results[1].data.FILES;
//
//                    if (files.length > 0) {
//                        for (var i =0; i < files.length; i++) {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":uploadUrl+files[i].FILE_NM,"thumbnailUrl":uploadUrl+"thumbnail/"+files[i].FILE_NM,"mediumUrl":uploadUrl+"medium/"+files[i].FILE_NM,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
//                        }
//                    }
//
//                    $location.search('_modify', '0');
//                    contentService.updateStatusContent(results[1].data.NO).then(function(data){
//                        $location.search('_modify', null);
//                    }, function(error) {
//                        alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
//                    });
//                },function(error) {
//                    deferred.reject(error);
//                    alert(JSON.stringify(error));
//                });
//
//            return deferred.promise;
        };

        // 게사판 저장 버튼 클릭
        $scope.click_saveCmsBoard = function () {
            $scope.item.FILES = $scope.queue;

            if ($stateParams.id == 0) {
                dataService.db('webboard').insert($scope.item,function(data, status){
                    if (status != 200) {
                        alert('등록에 실패 했습니다.');
                    } else {
                        if (data.err == false) {
                            $location.url('/webboard');
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            } else {
                dataService.db('webboard').update($stateParams.id,$scope.item,function(data, status){
                    if (status != 200) {
                        alert('수정에 실패 했습니다.');
                    } else {
                        if (data.err == false) {
                            $location.url('/webboard');
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            }

//            if ( $scope.content.NO ) {
//                contentService.createContent($scope.content).then(function(data){
//                });
//            }
//            else {
//                contentService.updateContent($scope.content.NO, $scope.content).then(function(data){
//                });
//            }
//
//            $location.search('_modify', '1');
//            contentService.updateStatusContent($scope.content.NO).then(function(data){
//                $location.search('_modify', null);
//
//                $location.path('/article');
//            });
        };

//        var fileInfo = [{"name":"Hydrangeas.jpg","size":595284,"url":"http://localhost/serverscript/upload/../../upload/files/Hydrangeas.jpg","thumbnailUrl":"http://localhost/serverscript/upload/../../upload/files/thumbnail/Hydrangeas.jpg","deleteUrl":"http://localhost/serverscript/upload/?file=Hydrangeas.jpg","deleteType":"DELETE"},{"name":"Lighthouse.jpg","size":561276,"url":"http://localhost/serverscript/upload/../../upload/files/Lighthouse.jpg","thumbnailUrl":"http://localhost/serverscript/upload/../../upload/files/thumbnail/Lighthouse.jpg","deleteUrl":"http://localhost/serverscript/upload/?file=Lighthouse.jpg","deleteType":"DELETE"}];
//        $scope.queue = fileInfo;

        /********** 화면 초기화 **********/
        $scope.$parent.message = 'ANGE CMS';
        if ( $stateParams.id != 0) {
            $scope.$parent.pageTitle = '게시판 수정';
            $scope.$parent.pageDescription = '게시판을 수정합니다.';
        } else {
            $scope.$parent.pageTitle = '게시판 등록';
            $scope.$parent.pageDescription = '게시판을 등록합니다.';
        }

        $scope.$parent.getSession()
            .then($scope.$parent.sessionCheck)
            .then($scope.initEdit)
            .then($scope.getCmsBoard)
            .catch($scope.$parent.reportProblems);

    }]);
});
