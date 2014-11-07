/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project_list.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project_list', ['$scope', '$stateParams', 'dataService', '$location', function ($scope, $stateParams, dataService, $location) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.search = {};

        // 목록 데이터
        $scope.listData = [];

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.initList = function() {
            for (var i = 2010; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            // 검색어
            var order = [{name: "등록자", value: "REG_NM"}, {name: "제목+내용", value: "SUBJECT"}];

            $scope.years = year;
            $scope.order = order;
            $scope.search.YEAR = nowYear+'';
            $scope.search.ORDER = order[0];
        };

        /********** 이벤트 **********/
        // 등록 버튼 클릭
        $scope.click_createNewProject = function () {
            $location.path('/project/0');
        };

        // 수정 화면 이동
        $scope.click_showEditProject = function (key) {
            $location.path('/project/'+key);
        };

        // 삭제 버튼 클릭
        $scope.click_deleteProject = function (idx) {

            var project = $scope.list[idx];

            if (project.PROJECT_ST == '2') {
                alert("완료 상태의 프로젝트는 삭제할 수 없습니다.")
            }

            // TODO: 권한 처리 넣을것
//            if () {
//                alert("삭제 권한이 없습니다.");
//            }

            // TODO: 삭제 후 처리

//            projectService.deleteProject(project.NO).then(function(data){
//                $scope.projects.splice(idx, 1);
//            });
        };

        // 검색 버튼 클릭
        $scope.click_searchProject = function () {
            $scope.getProjectList($scope.search);
        }

        // 프로젝트 목록 조회
        $scope.getProjectList = function (search) {
            $scope.isLoading = true;

            dataService.db('project').find({NO:0, SIZE:5},search,function(data, status){
                if (status != 200) {
                    alert('프로젝트 목록 조회에 실패 했습니다.');
                } else {
                    if (angular.isObject(data)) {
                        if (data.err == true) {
                            alert(data.msg);
                        } else {
                            $scope.list = data;
                        }
                    } else {
                        // TODO: 데이터가 없을 경우 처리
                        alert("프로젝트 목록 데이터가 없습니다.");
                    }
                }

                $scope.isLoading = false;
            });

//            projectService.getProjects().then(function(projects){
//                $scope.listData = projects.data;
//
//                if (projectsData != null) {
//                    $scope.totalItems = projects.data[0].TOTAL_COUNT; // 총 아이템 수
//                    $scope.currentPage = 1; // 현재 페이지
//                }
//                $scope.isLoading = false;
//                $location.search('_search', null);
//            }, function(error) {
//                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
//            });
        };

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
        $scope.$watch('isLoading', function() {
            if ($scope.listData == 'null') {
                $scope.projects = null;
            } else {
                $scope.projects = projectsData;
            }
        });

        // 페이지 이동 시 이벤트
        $scope.$watch('currentPage + itemsPerPage', function() {
            var start = $scope.currentPage % ( $scope.selectItems / $scope.itemsPerPage);

            var begin = ((start - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            if ($scope.listData != null) {
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

        $scope.setTitle = function() {
        // 페이지 타이틀
            $scope.$parent.message = 'ANGE CMS';
            $scope.$parent.pageTitle = '프로젝트 관리';
            $scope.$parent.pageDescription = '프로젝트를 생성하고 섹션을 설정합니다.';
            $scope.$parent.tailDescription = '상단의 검색영역에서 원하는 프로젝트를 필터링하거나 찾을 수 있습니다.<br />진행 중인 프로젝트를 해지하며 이전 프로젝트를 전부 조회할 수 있습니다.';
        }

        /********** 화면 초기화 **********/

        $scope.initList();
        $scope.setTitle();
        $scope.getProjectList();

    }]);
});
