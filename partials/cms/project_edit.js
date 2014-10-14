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
    controllers.controller('project_edit', ['$scope', '$stateParams', 'projectService', '$location', function ($scope, $stateParams, projectService, $location) {

        // 페이지 타이틀
        $scope.message = 'ANGE CMS';

        if ($scope.method != 'GET'){
            if ( $stateParams.id != 0) {
                $scope.pageTitle = '프로젝트 수정';
                $scope.pageDescription = '프로젝트를 수정합니다.';
            } else {
                $scope.pageTitle = '프로젝트 등록';
                $scope.pageDescription = '프로젝트를 등록합니다.';
            }
        }

        // 날짜 콤보박스
        var year = [];
        var month = [];
        var now = new Date();
        var nowYear = now.getFullYear();
        var nowMonth = now.getMonth();

        for (var i = nowYear - 5; i < nowYear + 5; i++) {
            year.push(i+'');
        }

        for (var i = 1; i < 13; i++) {
            month.push(i+'');
        }

        $scope.project = { years: year, months: month, YEAR: nowYear+'', MONTH: (nowMonth+1)+'' };

        // ui bootstrap 달력
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
//        $scope.ckeditor = '<p>Hello</p>\n';
//        $scope.project = { "BODY": '<p>Hello</p>\n' };

        // 버튼 이벤트
        // 목록
        $scope.getProjects = function () {
            $location.search({_method: 'GET'});
            $location.path('/project/list');
        };

        // 등록/수정
        $scope.saveProject = function () {
            var id = ($stateParams.id) ? parseInt($stateParams.id) : 0;

            if (id <= 0) {
                projectService.createProject($scope.project).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/project/list');
                });
            }
            else {
                projectService.updateProject(id, $scope.project).then(function(data){
                    alert(JSON.stringify(data))
                    $location.search({_method: 'GET'});
                    $location.path('/project/list');
                });
            }
        };

        // 조회
        if ($scope.method != 'GET' && $stateParams.id != 0) {
            projectService.getProject($stateParams.id).then(function(project){
                $scope.project = project.data[0];

                $scope.project.years = year;
                $scope.project.months = month;
            });
        }
    }]);
});
