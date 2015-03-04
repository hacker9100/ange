/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : task-view.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('task-view', ['$scope', '$rootScope', '$stateParams', 'dataService', '$q', '$location', 'dialogs', function ($scope, $rootScope, $stateParams, dataService, $q, $location, dialogs) {

        /********** 초기화 **********/
        // 태스크 모델 초기화
        $scope.item = {};

        // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/
        // 태스크 목록 버튼 클릭
        $scope.click_showTaskList = function () {
            $location.path('/task/list');
        };

        // 태스크 수정 버튼 클릭
        $scope.click_showTaskEdit = function (key) {
            if (!($rootScope.role == 'CMS_ADMIN' || $rootScope.role == 'MANAGER') && $rootScope.uid != item.REG_UID) {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $location.url('/task/edit/'+key);
        };

        // 태스크 조회
        $scope.getTask = function () {
            $scope.getItem('cms/task', 'item', $stateParams.id, {}, true)
                .then(function(data){
                    $scope.item = data;
                    $scope.CATEGORY = angular.fromJson(data.CATEGORY);

                    angular.forEach($scope.projects,function(value, idx){
                        if(value.NO == data.PROJECT_NO);
                        $scope.item.PROJECT = $scope.projects[idx];
                        return;
                    });
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getTask)
            ['catch']($scope.reportProblems);

    }]);
});
