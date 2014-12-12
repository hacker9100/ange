/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project_view.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project_view', ['$scope', '$rootScope', '$stateParams', '$location', '$q', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, $q, dialogs, UPLOAD) {

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
            $location.url('/project/list');
        };

        // 프로젝트 조회
        $scope.getProject = function () {
            if ($stateParams.id != 0) {
                var deferred = $q.defer();
                $q.all([
                        $scope.getItem('cms/project', 'item', $stateParams.id, {}, false)
                        .then(function(data){
                            $scope.item = data;

                            var file = data.FILE;
                            for(var i in file) {
                                $scope.file = {"name":file.FILE_NM,"size":file[0].FILE_SIZE,"url":UPLOAD.BASE_URL+file[0].PATH+file[0].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+file[0].PATH+"thumbnail/"+file[0].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+file[0].PATH+"medium/"+file[0].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[0].FILE_NM,"deleteType":"DELETE"};
                            }
                        }),
                        $scope.getList('cms/task', 'list', {}, {PROJECT : {NO: $stateParams.id }}, false).then(function(data){$scope.list = data;})
                    ])
                    .then( function(results) {
                        deferred.resolve();
                    },function(error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getProject)
            .catch($scope.reportProblems);

    }]);
});
