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

        /* 페이지 타이틀 */
        if ($scope.method == 'GET' && $stateParams.id == undefined) {
            $scope.message = 'ANGE CMS';

            $scope.pageTitle = '프로젝트 관리';
            $scope.pageDescription = '프로젝트를 생성하고 섹션을 설정합니다.';
            $scope.tailDescription = '상단의 검색영역에서 원하는 프로젝트를 필터링하거나 찾을 수 있습니다.<br />진행 중인 프로젝트를 해지하며 이전 프로젝트를 전부 조회할 수 있습니다.';
        }

        /* 상단 검색 초기화 */
        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        for (var i = nowYear - 5; i < nowYear + 5; i++) {
            year.push(i+'');
        }

        // 검색어
        var order = [{name: "기자", value: "0"}, {name: "편집자", value: "1"}, {name: "제목+내용", value: "2"}];

        $scope.search = { years: year, YEAR: nowYear+'', order: order, ORDER: order[0] };

        /* 목록 조회 이벤트 */
        var projectsData = null;

        // 등록 화면 이동
        $scope.createNewProject = function () {
            $location.search({_method: 'POST'});
            $location.path('/project/edit/0');
        };

        // 수정 화면 이동
        $scope.editProject = function (no) {
            $location.search({_method: 'PUT'});
            $location.path('/project/edit/'+no);
        };

        // 조회 화면 이동
        $scope.viewListProject = function (no) {
            $location.search({_method: 'GET'});
            $location.path('/project/view/'+no);
        };

        // 삭제
        $scope.deleteListProject = function (idx) {

            var project = $scope.projects[idx];

            if (project.PROJECT_ST == '2') {
                alert("완료 상태의 프로젝트는 삭제할 수 없습니다.")
            }

            projectService.deleteProject(project.NO).then(function(data){
                $scope.projects.splice(idx, 1);
            });
        };

        // 목록
        $scope.isLoading = true;
        $scope.getProjects = function () {
            projectService.getProjects().then(function(projects){
                projectsData = projects.data;

                if (projectsData != null) {
                    $scope.totalItems = projects.data[0].TOTAL_COUNT; // 총 아이템 수
                    $scope.currentPage = 1; // 현재 페이지
                }
                $scope.isLoading = false;
            });
        };

        $scope.getProjects();

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
/*
                var i = 0;
                for (i = begin; i <= end; i++) {
                    $scope.$watch('projects', function() {
                        alert($scope.projects[i].NO)
                        $scope.projects[i].ST_NM = 'TEST';
                    });
                }
*/
            }
        });

        $scope.$watch('selectItems * selectCount < itemsPerPage * currentPage', function() {
            $scope.selectCount = $scope.selectCount + 1;
        });
    }]);
});
