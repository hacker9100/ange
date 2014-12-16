/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : dashboard_main.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('dashboard_main', ['$scope', '$rootScope', '$location', 'dialogs', 'COMMON', function ($scope, $rootScope, $location, dialogs, COMMON) {

        /********** 초기화 **********/
        // 초기화
        $scope.init = function() {
            $scope.oneAtATime = true;

            $scope.PAGE_NO = 0;
            $scope.PAGE_SIZE = COMMON.DASHBOARD_PAGE_SIZE;
        };

        /********** 이벤트 **********/
        // 태스크 목록 이동
        $scope.click_showTaskList = function () {
            $location.url('/task/list');
        };

        // 태스크 조회 화면 이동
        $scope.click_showTaskView = function (key) {
            $location.url('/task/view/'+key);
        };

        // 콘텐츠 조회 화면 이동
        $scope.click_showViewContent = function (item) {
            var list = 'edit';
            if (item.PHASE == '10' || item.PHASE == '11') {
                list = 'article';
            } else if (item.PHASE == '20' || item.PHASE == '21') {
                list = 'edit';
            }

            $location.url('/'+list+'/view/'+item.NO);
        };

        // 이력조회 버튼 클릭
        $scope.click_showGetHistory = function (key) {
            $scope.openModal({TASK_NO : key}, 'lg');
        };

        $scope.openModal = function (item, size) {
            var dlg = dialogs.create('/partials/cms/popup/history.html',
                function($scope, $modalInstance, data) {
                    $scope.getList('cms/history', 'list', {}, item, true).then(function(data){$scope.list = data;})
                        .catch(function(error){console.log(error);});

                    $scope.list = data;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };
                }, item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 태스크 목록 조회
        $scope.getTaskList = function () {
            var search = {};
            if ($rootScope.role != 'CMS_ADMIN' && $rootScope.role != 'MANAGER') {
                search = {EDITOR_ID: $rootScope.uid};
            }

            $scope.isLoading = true;
            $scope.getList('cms/task', 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, search, true)
                .then(function(data){$scope.list = data})
                .catch(function(error){$scope.list = []; console.log(error);})
                .finally(function(){$scope.isLoading = false;});
        };

        // 페이지 타이틀
        $scope.setTitle = function(session) {
            $scope.$parent.$parent.pageDescription = $rootScope.name + " 님의 대시보드입니다.";
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.setTitle)
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getTaskList();

	}]);
});
