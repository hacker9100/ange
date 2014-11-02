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

        var category = [
            {"NO": "0", "CATEGORY_B": "001", "CATEGORY_M": "", "CATEGORY_S": "", "CATEGORY_NM": "임신준비", "CATEGORY_GB": "1", "CATEGORY_ST": "0"},
            {"NO": "1", "CATEGORY_B": "002", "CATEGORY_M": "", "CATEGORY_S": "", "CATEGORY_NM": "임신초기", "CATEGORY_GB": "1", "CATEGORY_ST": "0"},
            {"NO": "2", "CATEGORY_B": "003", "CATEGORY_M": "", "CATEGORY_S": "", "CATEGORY_NM": "임신중기", "CATEGORY_GB": "1", "CATEGORY_ST": "0"},
            {"NO": "3", "CATEGORY_B": "001", "CATEGORY_M": "", "CATEGORY_S": "", "CATEGORY_NM": "건강", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"NO": "4", "CATEGORY_B": "002", "CATEGORY_M": "", "CATEGORY_S": "", "CATEGORY_NM": "음식", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"NO": "5", "CATEGORY_B": "003", "CATEGORY_M": "", "CATEGORY_S": "", "CATEGORY_NM": "놀이", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"NO": "6", "CATEGORY_B": "001", "CATEGORY_M": "001", "CATEGORY_S": "", "CATEGORY_NM": "검사", "CATEGORY_GB": "2", "CATEGORY_ST": "0"},
            {"NO": "7", "CATEGORY_B": "001", "CATEGORY_M": "002", "CATEGORY_S": "", "CATEGORY_NM": "운동", "CATEGORY_GB": "2", "CATEGORY_ST": "0"}
        ];

        $scope.select_settings = {externalIdProp: '', idProp: 'NO', displayProp: 'CATEGORY_NM', dynamicTitle: false, showCheckAll: false, showUncheckAll: false};

        $scope.CATEGORY = [];

        $scope.$watch('CATEGORY_M', function(data) {
            var category_s = [];

            for (var i in category) {
                var item = category[i];

                if (item.CATEGORY_B == data.CATEGORY_B && item.CATEGORY_GB == '2' && item.CATEGORY_M != "") {
                    category_s.push(item);
                }
            }

            $scope.category_s = category_s;
        });

        $scope.removeCategory = function(idx) {
            $scope.CATEGORY.splice(idx, 1);
        }

        /********** 초기화 **********/
        $scope.task = {};

        // 초기화
        $scope.initEdit = function() {
            projectService.getProjectOptions().then(function(projects){
                $scope.projects = projects.data;

                if ($scope.projects != null) {
                    $scope.task.PROJECT = $scope.projects[0];
                }
            });

            if (category != null) {
                var category_a = [];
                var category_b = [];

                for (var i in category) {
                    var item = category[i];

                    if (item.CATEGORY_GB == '1') {
//                    category_a.push({id: item.NO, label: item.CATEGORY_NM});
                        category_a.push(item);
                    } else if (item.CATEGORY_GB == '2' && item.CATEGORY_M == "") {
                        category_b.push(item);
                    }
                }

                $scope.category_a = category_a;
                $scope.category_b = category_b;
            }
        };

        // ui bootstrap 달력
        $scope.today = function() {
            $scope.task.CLOSE_YMD = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.task.CLOSE_YMD = null;
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        /***************************************************************************************************/
//        $scope.getA = function() {
//            alert($scope.task.BODY);
//        }
//
//        $scope.setA = function() {
//            var img = '<img alt="" src="/app/upload/userfiles/images/Jellyfish.jpg" style="height:768px; width:1024px" />';
//            var test = $scope.task.BODY;
//            $scope.task.BODY = img;
//        }
        /***************************************************************************************************/

        /********** 등록,수정 이벤트 **********/
        // 목록
        $scope.moveList = function () {
            $location.path('/task');
        };

        // 조회
        $scope.getTask = function () {
            taskService.getTask($stateParams.id).then(function(task){
                $scope.task = task.data;
                $scope.CATEGORY = angular.fromJson(task.data.CATEGORY);

                for (var i = 0; i < $scope.projects.length; i++) {
                    var project_nm = $scope.projects[i].SUBJECT;
                    if (project_nm == task.data.PROJECT_NM)
                        $scope.task.PROJECT = $scope.projects[i];
                }
            });
        };

        // 등록/수정
        $scope.saveTask = function () {
            var id = ($stateParams.id) ? parseInt($stateParams.id) : 0;

            $scope.task.CATEGORY = $scope.CATEGORY;
            if (id <= 0) {
                taskService.createTask($scope.task).then(function(data){
                    $location.path('/task');
                });
            }
            else {
                taskService.updateTask(id, $scope.task).then(function(data){
                    $location.path('/task');
                });
            }
        };

        /********** 화면 초기화 **********/
        $scope.initEdit();

        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';

        if ( $stateParams.id != 0) {
            $scope.$parent.pageTitle = '태스크 수정';
            $scope.$parent.pageDescription = '태스크를 수정합니다.';

            $scope.getTask();
        } else {
            $scope.$parent.pageTitle = '태스크 등록';
            $scope.$parent.pageDescription = '태스크를 등록합니다.';
        }

    }]);
});
