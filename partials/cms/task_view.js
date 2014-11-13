/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : task_view.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('task_view', ['$scope', '$stateParams', 'dataService', '$q', '$location', '$controller', function ($scope, $stateParams, dataService, $q, $location, $controller) {

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

        /********** 초기화 **********/
        // 태스크 모델 초기화
        $scope.item = {};

        // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/
        // 태스크 목록 버튼 클릭
        $scope.click_showTaskList = function () {
            $location.path('/task');
        };

        // 태스크 수정 버튼 클릭
        $scope.click_showTaskEdit = function (key) {
            $location.url('/task/edit/'+key);
        };

        // 태스크 조회
        $scope.getTask = function () {
            $scope.getItem('task', $stateParams.id, {}, true)
                .then(function(data){
                    $scope.item = data;
                    $scope.CATEGORY = angular.fromJson(data.CATEGORY);

                    angular.forEach($scope.projects,function(value, idx){
                        if(value.NO == data.PROJECT_NO);
                        $scope.item.PROJECT = $scope.projects[idx];
                        return;
                    });
                })
                .catch(function(error){throw('태스크:'+error);});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getTask)
            .catch($scope.reportProblems);

    }]);
});
