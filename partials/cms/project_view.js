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
    controllers.controller('project_view', ['$scope', '$stateParams', '$location', '$controller', 'UPLOAD', function ($scope, $stateParams, $location, $controller, UPLOAD) {

        var uploadUrl = 'http://localhost/serverscript/upload/../../upload/files/';

        /* 파일 업로드 설정 */
        var url = '/serverscript/upload/';
        $scope.options = { url: url, autoUpload: true, dropZone: angular.element('#dropzone') };

//        $scope.file = {"name":"Koala.jpg","size":595284,"url":"http://localhost/app/serverscript/upload/../../upload/files/Koala.jpg","thumbnailUrl":"http://localhost/app/serverscript/upload/../../upload/files/thumbnail/Koala.jpg","deleteUrl":"http://localhost/app/serverscript/upload/?file=Koala.jpg","deleteType":"DELETE"};

        // 파일 업로드 후 파일 정보가 변경되면 화면에 썸네일을 로딩
        $scope.$watch('newFile', function(data){
            $scope.file = data[0];
        });

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

        /********** 초기화 **********/
        // 프로젝트 모델
        $scope.item = {};

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.init = function(session) {

        };

        /********** 이벤트 **********/
        // 수정 버튼 클릭
        $scope.click_showProjectEdit = function (key) {
            $location.url('/project/edit/'+key);
        };

        // 목록 버튼 클릭
        $scope.click_showProjectList = function () {
            $location.url('/project');
        };

        // 프로젝트 조회
        $scope.getProject = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('project', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;

                        var file = data.FILE;
                        for(var i in file) {
                            $scope.file = {"name":file.FILE_NM,"size":file[0].FILE_SIZE,"url":UPLOAD.UPLOAD_URL+file[0].PATH+file[0].FILE_ID,"thumbnailUrl":UPLOAD.UPLOAD_URL+file[0].PATH+"thumbnail/"+file[0].FILE_ID,"mediumUrl":UPLOAD.UPLOAD_URL+file[0].PATH+"medium/"+file[0].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[0].FILE_NM,"deleteType":"DELETE"};
                        }
                    })
                    .catch(function(error){throw('프로젝트:'+error);});
            }
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getProject)
            .catch($scope.reportProblems);

    }]);
});
