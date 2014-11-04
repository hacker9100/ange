/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : projectEdit.html 화면 콘트롤러
 */
'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project_edit', ['$scope', '$rootScope', '$stateParams', 'projectService', '$location', function ($scope, $rootScope, $stateParams, projectService, $location) {

        var uploadUrl = 'http://localhost/serverscript/upload/../../upload/files/';

        /* 파일 업로드 설정 */
        var url = '/serverscript/upload/';
        $scope.options = { url: url, autoUpload: true, dropZone: angular.element('#dropzone') };

//        $scope.file = {"name":"Koala.jpg","size":595284,"url":"http://localhost/app/serverscript/upload/../../upload/files/Koala.jpg","thumbnailUrl":"http://localhost/app/serverscript/upload/../../upload/files/thumbnail/Koala.jpg","deleteUrl":"http://localhost/app/serverscript/upload/?file=Koala.jpg","deleteType":"DELETE"};

        // 파일 업로드 후 파일 정보가 변경되면 화면에 썸네일을 로딩
        $scope.$watch('newFile', function(data){
            $scope.file = data[0];
        });

        /********** 초기화 **********/
        // 프로젝트 모델
        $scope.project = {};

        // 날짜 콤보박스
        var year = [];
        var month = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.initEdit = function() {
            for (var i = 2010; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            for (var i = 1; i < 13; i++) {
                month.push(i+'');
            }

            $scope.years = year;
            $scope.project.YEAR = nowYear+'';
        }

        /********** 이벤트 **********/
        // 프로젝트 목록 이동
        $scope.showProjectList = function () {
            $location.path('/project');
        };

        // 프로젝트 조회
        $scope.getProject = function () {
            projectService.getProject($stateParams.id).then(function(project){
                $scope.project = project.data;

                // 파일 순서 : 1. 원본, 2. 썸네일, 3. 중간사이즈
                var file = project.data.FILE;
                if (file.length > 0) {
                    $scope.file = {"name":file[0].FILE_NM,"size":file[0].FILE_SIZE,"url":uploadUrl+file[0].FILE_NM,"thumbnailUrl":uploadUrl+"thumbnail/"+file[0].FILE_NM,"mediumUrl":uploadUrl+"medium/"+file[0].FILE_NM,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[0].FILE_NM,"deleteType":"DELETE"};
                }
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
        };

        // 프로젝트 등록/수정
        $scope.saveProject = function () {
            var id = ($stateParams.id) ? parseInt($stateParams.id) : 0;

            $scope.project.FILE = $scope.file;

            if (id <= 0) {
                projectService.createProject($scope.project).then(function(data){
                    $location.path('/project');
                }, function(error) {
                    alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
                });
            } else {
                projectService.updateProject(id, $scope.project).then(function(data){
                    $location.path('/project');
                }, function(error) {
                    alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
                });
            }
        };

        // 페이지 타이틀
        $scope.setTitle = function() {
            $scope.$parent.message = 'ANGE CMS';
            if ( $stateParams.id != 0) {
                $scope.$parent.pageTitle = '프로젝트 수정';
                $scope.$parent.pageDescription = '프로젝트를 수정합니다.';

                $scope.getProject();
            } else {
                $scope.$parent.pageTitle = '프로젝트 등록';
                $scope.$parent.pageDescription = '프로젝트를 등록합니다.';
            }
        }

        /********** 화면 초기화 **********/
        $scope.initEdit();
        $scope.setTitle();

    }]);
});
