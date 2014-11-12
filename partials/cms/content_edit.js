/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : content_edit.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('content_edit', ['$scope', '$stateParams', 'dataService', '$modal', '$q', '$location', function ($scope, $stateParams, dataService, $modal, $q, $location) {

        var uploadUrl = 'http://localhost/serverscript/upload/../../upload/files/';

        /* 파일 업로드 설정 */
        var url = '/serverscript/upload/';
        $scope.options = { url: url, autoUpload: true };

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
        $scope.click_showContentList = function () {
            $location.path('/content/'+$stateParams.menu);
        };

        $scope.dataTask = function(data, status) {
            if (status != 200) {
                alert('태스크 조회에 실패 했습니다.');
            } else {
                if (angular.isObject(data)) {
                    if (!data.err) {
                        $scope.task = data;
                    } else {
                        alert(data.msg);
                    }
                } else {
                    // TODO: 데이터가 없을 경우 처리
                    alert("태스크 데이터가 없습니다.");
                }
            }
        };

        $scope.dataContent = function(data, status) {
            if (status != 200) {
                alert('콘텐츠 조회에 실패 했습니다.');
            } else {
                if (angular.isObject(data)) {
                    if (!data.err) {
                        $scope.content = data;

                        // 파일 순서 : 1. 원본, 2. 썸네일, 3. 중간사이즈
                        var files = data.FILES;

                        if (files.length > 0) {
                            for (var i =0; i < files.length; i++) {
                                $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":uploadUrl+files[i].FILE_NM,"thumbnailUrl":uploadUrl+"thumbnail/"+files[i].FILE_NM,"mediumUrl":uploadUrl+"medium/"+files[i].FILE_NM,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                            }
                        }
                    } else {
                        alert(data.msg);
                    }
                } else {
                    // TODO: 데이터가 없을 경우 처리
//                    alert("콘텐츠 데이터가 없습니다.");
                }
            }
        };


        // 태스크/콘텐츠 조회
        $scope.getTask = function () {
            var deferred = $q.defer();

            $q.all([
                    dataService.db('task').findOne($stateParams.id,{},function(data, status){ $scope.dataTask(data, status) }),
                    dataService.db('content').findOne($stateParams.id,{},function(data, status){ $scope.dataContent(data, status) })
                ])
                .then( function(results) {
                    deferred.resolve();
                },function(error) {
                    deferred.reject(error);
                });

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

            return deferred.promise;
        };

        // 콘텐츠 저장 버튼 클릭
        $scope.click_saveContent = function () {
            $scope.content.TASK = $scope.task;
            $scope.content.FILES = $scope.queue;

            if ( $scope.content.NO == undefined ) {
                if ($stateParams.menu == 'article') {
                    $scope.content.PHASE = '10';
                }

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

        // 원고 승인 요청 버튼 클릭
        $scope.click_commitContent = function () {

            if ($scope.task.PHASE == '0') {
                alert("원고를 등록해 주세요.");
                return;
            }

            dataService.updateStatus('content',$scope.content.NO,'11',function(data, status){
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

//            $location.search('_phase', '11');
//            taskService.updateStatusTask($scope.task.NO, $scope.task).then(function(data){
//                $location.search('_phase', null);
//                $scope.moveList();
//            });
        };

        // 반려 버튼 클릭
        $scope.click_returnContent = function () {
            $scope.openModal($scope.content, '11');
        };

        // 승인 버튼 클릭
        $scope.click_approveContent = function () {
            $scope.openModal($scope.content, '12');
        }

//        var fileInfo = [{"name":"Hydrangeas.jpg","size":595284,"url":"http://localhost/serverscript/upload/../../upload/files/Hydrangeas.jpg","thumbnailUrl":"http://localhost/serverscript/upload/../../upload/files/thumbnail/Hydrangeas.jpg","deleteUrl":"http://localhost/serverscript/upload/?file=Hydrangeas.jpg","deleteType":"DELETE"},{"name":"Lighthouse.jpg","size":561276,"url":"http://localhost/serverscript/upload/../../upload/files/Lighthouse.jpg","thumbnailUrl":"http://localhost/serverscript/upload/../../upload/files/thumbnail/Lighthouse.jpg","deleteUrl":"http://localhost/serverscript/upload/?file=Lighthouse.jpg","deleteType":"DELETE"}];
//        $scope.queue = fileInfo;

        $scope.initUpdate = function() {
            if ( $stateParams.id != 0) {
                $scope.getTask();
            }
        }

        $scope.openModal = function (content, status, size) {
            var modalInstance = $modal.open({
                templateUrl: 'content_approval_modal.html',
                controller: 'content_approval_modal',
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

        if ($stateParams.menu == 'article') {
            $scope.isCommit = true;
            $scope.isApproval = false;
        } else if ($stateParams.menu == 'article_confirm') {
            $scope.isCommit = false;
            $scope.isApproval = true;
        }

        $scope.$parent.getSession()
            .then($scope.$parent.sessionCheck)
            .then($scope.initEdit)
            .then($scope.initUpdate)
            .catch($scope.$parent.reportProblems);

    }]);

    controllers.controller('content_approval_modal', ['$scope', '$stateParams', '$modalInstance', 'dataService', 'content', 'status', '$location', function ($scope, $stateParams, $modalInstance, dataService, content, status, $location) {

        if (status == '11') {
            $scope.title = "승인 처리";
        } else {
            $scope.title = "반려 처리";
        }

        $scope.approval = {};
        $scope.approval.TASK_NO = content.TASK_NO;
        $scope.approval.CONTENT_NO = content.NO;
        $scope.approval.APPROVAL_ST = status;

        $scope.click_ok = function () {
            dataService.db('approval').insert($scope.approval,function(data, status){
                if (status != 200) {
                    alert('결재에 실패 했습니다.');
                } else {
                    if (!data.err) {
                        $location.url('/content/'+$stateParams.menu);
                        $modalInstance.dismiss();
                    } else {
                        alert(data.msg);
                    }
                }
            });

//            approvalService.createApproval($scope.approval).then(function(data){
//                $modalInstance.close($scope.approval);
//            });
        };

        $scope.click_cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
});
