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
    controllers.controller('task_edit', ['$scope', '$stateParams', 'projectService', 'taskService', '$location', function ($scope, $stateParams, projectService, taskService, $location) {

        // 페이지 타이틀
        $scope.message = 'ANGE CMS';

        if ($scope.method != 'GET'){
            if ( $stateParams.id != 0) {
                $scope.pageTitle = '태스크 수정';
                $scope.pageDescription = '태스크를 수정합니다.';
            } else {
                $scope.pageTitle = '태스크 등록';
                $scope.pageDescription = '태스크를 등록합니다.';
            }
        }

        projectService.getProjectOptions().then(function(projects){
            $scope.projects = projects.data;

            if ($scope.projects != null) {
                $scope.task.PROJECT = $scope.projects[0];
            }
        });

        var category = [
            {"CATEGORY_B": "001", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "임신준비", "CATEGORY_GB": "1", "CATEGORY_ST": "0"},
            {"CATEGORY_B": "002", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "임신초기", "CATEGORY_GB": "1", "CATEGORY_ST": "0"},
            {"CATEGORY_B": "003", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "임신중기", "CATEGORY_GB": "1", "CATEGORY_ST": "0"},
            {"CATEGORY_B": "001", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "건강", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"CATEGORY_B": "002", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "음식", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"CATEGORY_B": "003", "CATEGORY_M": "", "CATEGORY_S": "", "DEPTH": "1", "CATEGORY_NM": "놀이", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"CATEGORY_B": "001", "CATEGORY_M": "001", "CATEGORY_S": "", "DEPTH": "2", "CATEGORY_NM": "검사", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"CATEGORY_B": "001", "CATEGORY_M": "002", "CATEGORY_S": "", "DEPTH": "2", "CATEGORY_NM": "운동", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
        ];

        var category_a = [];
        var category_b = [];

        if (category != null) {
            for (var i in category) {
                var item = category[i];

                if (item.CATEGORY_GB == '1') {
                    category_a.push(item);
                } else if (item.CATEGORY_GB == '2' && item.CATEGORY_M != "") {
                    category_b.push(item);
                }
            }

            $scope.category_a = category_a;
            $scope.category_b = category_b;
        }

        $scope.$watch('CATEGORY_M', function(data) {
           alert(JSON.stringify(data))
        });

        // ui bootstrap 달력
        $scope.today = function() {
            $scope.rt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.rt = null;
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
        $scope.ckeditor = '\n';
        $scope.isReadOnly = false;
//        $scope.project = { "BODY": '<p>Hello</p>\n' };

        $scope.getA = function() {
            alert($scope.task.BODY);
        }

        $scope.setA = function() {
            var img = '<img alt="" src="/app/upload/userfiles/images/Jellyfish.jpg" style="height:768px; width:1024px" />';
            var test = $scope.task.BODY;
            $scope.task.BODY = img;
        }

        // 버튼 이벤트
        // 목록
        $scope.getTasks = function () {
            $location.search({_method: 'GET'});
            $location.path('/task/list');
        };

        // 등록/수정
        $scope.saveTask = function () {
            var id = ($stateParams.id) ? parseInt($stateParams.id) : 0;

            if (id <= 0) {
                taskService.createTask($scope.task).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/task/list');
                });
            }
            else {
                taskService.updateTask(id, $scope.task).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/task/list');
                });
            }
        };

        $scope.isLoading = false;

        // 조회
        if ($scope.method != 'GET' && $stateParams.id != 0) {
            taskService.getTask($stateParams.id).then(function(task){
                $scope.task = task.data[0];

                for (var i = 0; i < $scope.projects.length; i++) {
                    var project_nm = $scope.projects[i].SUBJECT;
                    if (project_nm == task.data[0].PROJECT_NM)
                        $scope.task.PROJECT = $scope.projects[i];
                }
            });
        }
    }]);
});
