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

        /********** 초기화 **********/
        // 초기화
        $scope.initView = function() {

        };

        /********** 조회 이벤트 **********/
        // 목록
        $scope.getTasks = function () {
            $location.search({_method: 'GET'});
            $location.path('/task/list');
        };

        // 조회
        $scope.getTask = function () {
            taskService.getTask($stateParams.id).then(function(task){
                $scope.task = task.data[0];
            });
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

        // 본문 HTML 랜더링
        $scope.renderHtml = function(html) {
            return $sce.trustAsHtml(html);
        };

        /********** 화면 초기화 **********/
        if ($scope.method == 'GET' && $stateParams.id != undefined) {
            // 페이지 타이틀
            $scope.message = 'ANGE CMS';
            $scope.pageTitle = '태스크 조회';
            $scope.pageDescription = '태스크를 조회합니다.';

            $scope.initView();
            $scope.getTask();
        }

    }]);
});
