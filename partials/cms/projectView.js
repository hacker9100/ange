/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : webboardView.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('projectView', ['$scope', '$stateParams', 'projectService', '$location', function ($scope, $stateParams, projectService, $location) {

		$scope.message = "ANGE CMS";

		$scope.pageTitle = "프로젝트 조회";
		$scope.pageDescription = "프로젝트를 조회합니다.";

        // 버튼 이벤트
        // 목록
        $scope.getProjects = function () {
            $location.path('/project');
        };

        // 수정
        $scope.editProject = function (no) {
            $location.path('/project/edit/'+no);
        };

        // 조회
        projectService.getProject($stateParams.id).then(function(project){
            $scope.project = project.data[0];
        });

        // 삭제
        $scope.deleteProject = function (projectNo) {
            projectService.deleteProject(projectNo).then(function(data){
                $location.path('/project');
            });
        };
    }]);
});
