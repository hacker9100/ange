/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project_list', ['$scope', '$stateParams', 'projectService', '$location', function ($scope, $stateParams, projectService, $location) {

//        alert(localStorage.getItem('userToken'))

        // 페이지 타이틀
        if ($scope.method == 'GET' && $stateParams.id == undefined) {
            $scope.message = 'ANGE CMS';

            $scope.pageTitle = '프로젝트 관리';
            $scope.pageDescription = '프로젝트를 생성하고 섹션을 설정합니다.';
        }

        var projectsData = null;

        // 등록 화면 이동
        $scope.createNewProject = function () {
//            $location.path('/project/edit/0');
            $location.search({_method: 'POST'});
            $location.path('/project/edit/0');
        };

        // 수정 화면 이동
        $scope.editProject = function (no) {
            $location.search({_method: 'PUT'});
            $location.path('/project/edit/'+no);
//            $location.path('/project/edit/'+no);
        };

        // 조회 화면 이동
        $scope.viewProject = function (no) {
            $location.search({_method: 'GET'});
            $location.path('/project/view/'+no);
//            $location.path('/project/view/'+no);
        };

        // 삭제
        $scope.deleteProject = function (idx) {

            var project = $scope.projects[idx];

            projectService.deleteProject(project.NO).then(function(data){
                $scope.projects.splice(idx, 1);
            });
        };

        // 목록
//        $activityIndicator.startAnimating();
        $scope.isLoading = true;
        projectService.getProjects().then(function(projects){
            projectsData = projects.data;

            if (projectsData != null) {
                $scope.totalItems = projects.data[0].TOTAL_COUNT; // 총 아이템 수
                $scope.currentPage = 1; // 현재 페이지
            }
//            $activityIndicator.stopAnimating();
            $scope.isLoading = false;
        });

        // 페이징 처리
        $scope.selectItems = 200; // 한번에 조회하는 아이템 수
        $scope.selectCount = 1; // 현재 조회한 카운트 수
        $scope.itemsPerPage = 10; // 화면에 보이는 아이템 수(default 10)
        $scope.maxSize = 5; // 총 페이지 제한

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        // 페이지 이동 시 이벤트
        $scope.$watch('currentPage + itemsPerPage', function() {
            var start = $scope.currentPage % ( $scope.selectItems / $scope.itemsPerPage);

            var begin = ((start - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            if (projectsData != null) {
                $scope.projects = projectsData.slice(begin, end);
            }
        });

        $scope.$watch('selectItems * selectCount < itemsPerPage * currentPage', function() {
            $scope.selectCount = $scope.selectCount + 1;
        });
    }]);
});
