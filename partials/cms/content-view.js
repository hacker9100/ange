/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : content-view.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('content-view', ['$scope', '$sce', '$rootScope', '$stateParams', '$location', '$q', 'dialogs', 'UPLOAD', function ($scope, $sce, $rootScope, $stateParams, $location, $q, dialogs, UPLOAD) {

        /********** 초기화 **********/
        // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};

        // 초기화
        $scope.init = function(session) {
            // TODO: 수정 버튼은 권한 체크후 수정 권한이 있을 경우만 보임
        };

        /********** 이벤트 **********/
        // 수정 버튼 클릭
        $scope.click_showContentEdit = function (item) {
            if (!($rootScope.role == 'CMS_ADMIN' || $rootScope.role == 'MANAGER' || $rootScope.role == 'MAGAZINE') && $rootScope.uid != item.EDITOR_ID) {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $location.url('/'+$stateParams.menu+'/edit/'+$stateParams.id);
        };

        // 태스크 목록 이동
        $scope.click_showContentList = function () {
            $location.path('/'+$stateParams.menu+'/list');
        };

        // 이력조회 버튼 클릭
        $scope.click_showGetHistory = function (key) {
            $scope.openHistoryModal({TASK_NO : key}, 'lg');
        };

        $scope.openHistoryModal = function (item, size) {
            var dlg = dialogs.create('/partials/cms/popup/history.html',
                ['$scope', '$modalInstance', 'data', function($scope, $modalInstance, data) {
                    $scope.getList('cms/history', 'list', {}, item, true).then(function(data){$scope.list = data;})
                        .catch(function(error){console.log(error);});

                    $scope.list = data;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };
                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 태스크 조회
        $scope.getTask = function () {
            var deferred = $q.defer();
            $scope.getItem('cms/task', 'item', $stateParams.id, {}, false)
                .then(function(data){$scope.task = data; deferred.resolve();})
                .catch(function(error){console.log(error); deferred.reject(error);});

            return deferred.promise;
//            var deferred = $q.defer();
//            $q.all([
//                    $scope.getItem('cms/task', 'item', $stateParams.id, {}, false).then(function(data){console.log(data); $scope.task = data;}),
//                    $scope.getItem('cms/content', 'item', $stateParams.id, {}, false).then(function(data){
//                        $scope.item = data;
//                        var body = data.BODY.replace(/border:1px dashed;/g, '');
//
//                        $scope.item.BODY = $sce.trustAsHtml(body);
//
//                        var files = data.FILES;
//                        for(var i in files) {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
//                        }
//                    })
//                ])
//                .then( function(results) {
//                    deferred.resolve();
//                },function(error) {
//                    deferred.reject(error);
//                });
//
//            return deferred.promise;
        };

        // 콘텐츠 조회
        $scope.getContent = function () {
            var search = {};
            if ($stateParams.menu.indexOf('article') > -1 && $scope.task.PHASE >= 20) {
                search = {CURRENT_FL: 'N'};
            }

            $scope.getItem('cms/content', 'item', $stateParams.id, search, false)
                .then(function(data){
                    $scope.item = data;
                    var body = data.BODY.replace(/border:1px dashed;/g, '');

                    $scope.item.BODY = $sce.trustAsHtml(body);

                    var files = data.FILES;
                    for(var i in files) {
                        $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                    }
                })
                .catch(function(error){console.log(error)});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getTask)
            .then($scope.getContent)
            .catch($scope.reportProblems);

    }]);
});
