/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project-view.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project-view', ['$scope', '$rootScope', '$stateParams', '$location', '$q', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, $q, dialogs, UPLOAD) {

        /********** 초기화 **********/
        // 프로젝트 모델
        $scope.item = {};

        // 초기화
        $scope.init = function(session) {

        };

        /********** 이벤트 **********/
        // 수정 버튼 클릭
        $scope.click_showProjectEdit = function (item) {
            if (!($rootScope.role == 'CMS_ADMIN' || $rootScope.role == 'MANAGER') && $rootScope.uid != item.REG_UID || item.PROJECT_ST == '3') {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $location.url('/project/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showProjectList = function () {
//            $location.url('/project/list');
            history.back();
        };

        // 태스크 조회 화면 이동
        $scope.click_showTaskView = function (key) {
            $location.url('/task/view/'+key);
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

        // 프로젝트 조회
        $scope.getProject = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('cms/project', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;

                        var file = data.FILE;
                        for(var i in file) {
                            $scope.file = {"name":file.FILE_NM,"size":file[0].FILE_SIZE,"url":UPLOAD.BASE_URL+file[0].PATH+file[0].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+file[0].PATH+"thumbnail/"+file[0].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+file[0].PATH+"medium/"+file[0].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[0].FILE_NM,"deleteType":"DELETE"};
                        }
                    })
                    .catch(function(error){console.log(error);});

//                var deferred = $q.defer();
//                $q.all([
//                        $scope.getItem('cms/project', 'item', $stateParams.id, {}, false)
//                        .then(function(data){
//                            $scope.item = data;
//
//                            var file = data.FILE;
//                            for(var i in file) {
//                                $scope.file = {"name":file.FILE_NM,"size":file[0].FILE_SIZE,"url":UPLOAD.BASE_URL+file[0].PATH+file[0].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+file[0].PATH+"thumbnail/"+file[0].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+file[0].PATH+"medium/"+file[0].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[0].FILE_NM,"deleteType":"DELETE"};
//                            }
//                        }),
//                        $scope.getList('cms/task', 'list', {}, {PROJECT : {NO: $stateParams.id }}, false).then(function(data){$scope.list = data;})
//                    ])
//                    .then( function(results) {
//                        deferred.resolve();
//                    },function(error) {
//                        deferred.reject(error);
//                    });
//                return deferred.promise;
            }
        };

        // 태스크 조회
        $scope.getTaskList = function () {
            $scope.getList('cms/task', 'list', {}, {PROJECT : {NO: $stateParams.id }}, false)
                .then(function(data){$scope.TOTAL_COUNT = data[0].TOTAL_COUNT; $scope.list = data; console.log(data)})
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = [];})
        }

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getProject)
            .then($scope.getTaskList)
            .catch($scope.reportProblems);

    }]);
});
