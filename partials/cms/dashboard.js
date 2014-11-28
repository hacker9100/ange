/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : dashboard.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('dashboard', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {

        /********** 초기화 **********/
        // 초기화
        $scope.init = function() {
            $scope.oneAtATime = true;

            $scope.PAGE_NO = 0;
            $scope.PAGE_SIZE = 5;
        };

//        $scope.list1 = {api: 'webboard', title: '공지사항', css: 'list-group-item list-group-item-labeling-green'};
//        $scope.list2 = {api: 'project', title: '프로젝트', css: 'list-group-item list-group-item-labeling-blue'};

        /********** 이벤트 **********/
        // 태스크 목록 이동
        $scope.click_showTaskList = function () {
            $location.url('/task');
        };

        // 태스크 선택
        $scope.click_showTaskView = function (key) {
            $location.url('/task/view/'+key);
        };

        // 태스크 목록 조회
        $scope.getTaskList = function () {
            var search = {};
            if ($rootScope.role != 'CMS_ADMIN' && $rootScope.role != 'MANAGER') {
                search = {EDITOR_ID: $rootScope.uid};
            }

            $scope.isLoading = true;
            $scope.getList('task', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, search, true)
                .then(function(data){$scope.tasks = data})
                .catch(function(error){$scope.tasks = []; console.log(error);})
                .finally(function(){$scope.isLoading = false;});
        };

        // 페이지 타이틀
        $scope.setTitle = function(session) {
            $scope.$parent.pageDescription = session.USER_NM + " 님의 대시보드입니다.";
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
