/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : content_edit.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('content_edit', ['$scope', '$stateParams', '$location', '$modal', '$q', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, $modal, $q, dialogs, UPLOAD) {

        $scope.click_showPreview = function() {
            $scope.openModal2($scope.item.BODY, 'lg');
        };

        $scope.openModal2 = function (content, size) {
            var dlg = dialogs.create('preview_modal.html',
                function($scope, $modalInstance, data) {
                    $scope.content = data;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };
                },content,{size:size,keyboard: true,backdrop: false});
            dlg.result.then(function(){

            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        $scope.click_selectTemplet = function (item) {
            switch (item) {
                case '2E' :
                    var temp =
                        '<div class="row"> ' +
                            '<div class="col-md-2" style="width:700px; height:500px; border:1px dashed; "> 여기는 사진 영역 </div>' +
                            '<div class= "col-md-2" style="width:700px; height:300px; border:1px dashed; "></div>' +
                        '</div>';
                    $scope.item.BODY += temp;
                    break;
                case '2F' :

                    break;
            }
        };

        /********** 모달 팝업 **********/
/*
        $scope.openModal2 = function (content, size) {
            var modalInstance = $modal.open({
                templateUrl: 'preview_modal.html',
                controller: function($scope, $modalInstance, content) {
                    alert(content);
                    $scope.content = content;

                    $scope.ok = function () {
                        $modalInstance.close();
                    };
                },
//                templateUrl: 'partials/cms/task_list.html',
//                controller: 'task_list',
                size: size,
                resolve: {
                    content: function () {
                        return content;
                    }
                }
            });

            modalInstance.result.then(function () {
                alert(JSON.stringify());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
*/

        /* 파일 업로드 설정 */
        var url = '/serverscript/upload/';
        $scope.options = { url: url, autoUpload: true };

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
            $location.path('/content/'+$stateParams.menu+'/list');
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
                    .then(function(){$location.url('/content/'+$stateParams.menu+'/list');})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('content', $scope.item.NO, $scope.item, false)
                    .then(function(){$location.url('/content/'+$stateParams.menu+'/list');})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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

//            console.log($scope.task)
            if ($scope.task.PHASE == '0') {
                alert("원고를 등록해 주세요.");
                return;
            }

            var phase = '';
            if ($scope.task.PHASE == '11' || $scope.task.PHASE == '12') {
                phase = '11';
            } else {
                phase = '21';
            }

            $scope.updateStatus('content', $scope.item.NO, phase, false)
                .then(function(){$location.url('/content/'+$stateParams.menu+'/list');})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

//            $location.search('_phase', '11');
//            taskService.updateStatusTask($scope.task.NO, $scope.task).then(function(data){
//                $location.search('_phase', null);
//                $scope.moveList();
//            });
        };

        // 반려 버튼 클릭
        $scope.click_returnContent = function () {
            var status = '';
            if ($scope.task.PHASE == '11') {
                status = '11';
            } else {
                status = '21';
            }

            $scope.openModal($scope.item, status);
        };

        // 승인 버튼 클릭
        $scope.click_approveContent = function () {
            var status = '';
            if ($scope.task.PHASE == '11') {
                status = '12';
            } else {
                status = '22';
            }

            $scope.openModal($scope.item, status);
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
//                alert(JSON.stringify(approval))
            }, function () {
                console.log("결재 오류");
            });
        }

        /********** 화면 초기화 **********/
        if ($stateParams.menu == 'article' || $stateParams.menu == 'edit') {
            $scope.isCommit = true;
            $scope.isApproval = false;
        } else if ($stateParams.menu == 'article_confirm' || $stateParams.menu == 'edit_confirm') {
            $scope.isCommit = false;
            $scope.isApproval = true;
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
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
                        $location.url('/content/'+$stateParams.menu+'/list');
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
