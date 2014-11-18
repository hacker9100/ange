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
    controllers.controller('content_edit', ['$scope', '$stateParams', '$location', '$controller', '$modal', '$q', 'UPLOAD', function ($scope, $stateParams, $location, $controller, $modal, $q, UPLOAD) {

        /* 파일 업로드 설정 */
        var url = '/serverscript/upload/';
        $scope.options = { url: url, autoUpload: true };

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

        /********** 초기화 **********/
        // 첨부 파일
        $scope.queue = [];

        // 초기화
        $scope.init = function() {

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

        // 태스크/콘텐츠 조회
        $scope.getTask = function () {
            var deferred = $q.defer();
            $q.all([
                    $scope.getItem('task', $stateParams.id, {}, false).then(function(data){$scope.task = data;}),
                    $scope.getItem('content', $stateParams.id, {}, false).then(function(data){
                        $scope.item = data;

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }
                    })
                ])
                .then( function(results) {
                    deferred.resolve();
                },function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        // 콘텐츠 저장 버튼 클릭
        $scope.click_saveContent = function () {
            $scope.item.TASK = $scope.task;
            $scope.item.FILES = $scope.queue;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = "";
            }

            if ( $scope.item.NO == undefined ) {
                if ($stateParams.menu == 'article') {
                    $scope.item.PHASE = '10';
                }

                $scope.insertItem('content', $scope.item, false)
                    .then(function(){$location.url('/content/'+$stateParams.menu);})
                    .catch(function(error){alert(error)});
            } else {
                $scope.updateItem('content', $scope.item.NO, $scope.item, false)
                    .then(function(){$location.url('/content/'+$stateParams.menu);})
                    .catch(function(error){alert(error)});
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

            dataService.updateStatus('content',$scope.item.NO,'11',function(data, status){
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
            $scope.openModal($scope.item, '11');
        };

        // 승인 버튼 클릭
        $scope.click_approveContent = function () {
            $scope.openModal($scope.item, '12');
        }

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
        if ($stateParams.menu == 'article') {
            $scope.isCommit = true;
            $scope.isApproval = false;
        } else if ($stateParams.menu == 'article_confirm') {
            $scope.isCommit = false;
            $scope.isApproval = true;
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.initUpdate)
            .catch($scope.reportProblems);

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
