/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project_view.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project_view', ['$scope', '$stateParams', '$location', '$controller', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, $controller, dialogs, UPLOAD) {

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        /********** 초기화 **********/
        // 프로젝트 모델
        $scope.item = {};

        // 초기화
        $scope.init = function(session) {

        };

        /********** 이벤트 **********/
        // 수정 버튼 클릭
        $scope.click_showProjectEdit = function (item) {
            if (!($rootScope.role == 'CMS_ADMIN' || $rootScope.role == 'MANAGER') && $rootScope.uid != item.REG_UID) {
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
                return $scope.getItem('project', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;

                        var file = data.FILE;
                        for(var i in file) {
                            $scope.file = {"name":file.FILE_NM,"size":file[0].FILE_SIZE,"url":UPLOAD.BASE_URL+file[0].PATH+file[0].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+file[0].PATH+"thumbnail/"+file[0].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+file[0].PATH+"medium/"+file[0].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[0].FILE_NM,"deleteType":"DELETE"};
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
