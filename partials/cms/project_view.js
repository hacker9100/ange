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
    controllers.controller('project_view', ['$scope', '$stateParams', 'projectService', '$state', '$location', function ($scope, $stateParams, projectService, $state, $location) {

        if ($scope.method == 'GET' && $stateParams.id != undefined){
            $scope.message = 'ANGE CMS';

            $scope.pageTitle = '프로젝트 조회';
            $scope.pageDescription = '프로젝트를 조회합니다.';
        }

        // 버튼 이벤트
        // 목록
        $scope.getProjects = function () {
            $location.search({_method: 'GET'});
            $location.path('/project/list');
        };

        // 수정
        $scope.editProject = function (no) {
            $location.search({_method: 'PUT'});
            $location.path('/project/edit/'+no);
        };

        // 삭제
        $scope.deleteProject = function (projectNo) {
            projectService.deleteProject(projectNo).then(function(data){
                $location.search({_method: 'GET'});
                $location.path('/project/list');
            });
        };

        // 조회
        if ($scope.method == 'GET' && $stateParams.id != undefined) {
            projectService.getProject($stateParams.id).then(function(project){
                $scope.project = project.data[0];
            });
        };
    }]);
});
