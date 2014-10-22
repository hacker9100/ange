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
    controllers.controller('task_view', ['$scope', '$stateParams', 'taskService', '$sce', '$location', function ($scope, $stateParams, taskService, $sce, $location) {

        if ($scope.method == 'GET' && $stateParams.id != undefined){
            $scope.message = 'ANGE CMS';

            $scope.pageTitle = '태스크 조회';
            $scope.pageDescription = '태스크를 조회합니다.';
        }

        $scope.renderHtml = function(html) {
            return $sce.trustAsHtml(html);
        }

        // 버튼 이벤트
        // 목록
        $scope.getTasks = function () {
            $location.search({_method: 'GET'});
            $location.path('/task/list');
        };

        // 수정
        $scope.editTask = function (no) {
            $location.search({_method: 'PUT'});
            $location.path('/task/edit/'+no);
        };

        // 삭제
        $scope.deleteTask = function (taskNo) {
            taskService.deleteTask(taskNo).then(function(data){
                $location.search({_method: 'GET'});
                $location.path('/task/list');
            });
        };

        // 조회
        if ($scope.method == 'GET' && $stateParams.id != undefined) {
            taskService.getTask($stateParams.id).then(function(task){
                $scope.task = task.data[0];
            });
        };
    }]);
});
