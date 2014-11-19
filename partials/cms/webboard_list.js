/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : webboard_list.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('webboard_list', ['$scope', '$rootScope', '$stateParams', '$location', '$controller', function ($scope, $rootScope, $stateParams, $location, $controller) {

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

        /********** 초기화 **********/
        $scope.search = {};

        // 목록 데이터
        $scope.listData = [];

        // 초기화
        $scope.init = function(session) {
            // 검색어 조건
            var order = [{name: "등록자", value: "REG_NM"}, {name: "제목+내용", value: "SUBJECT"}];

            $scope.order = order;
            $scope.search.ORDER = order[0];
        };

        /********** 이벤트 **********/
        // 등록 버튼 클릭
        $scope.click_showCreateNewCmsBoard = function () {
            $location.url('/webboard/edit/0');
        };

        // 조회 화면 이동
        $scope.click_showViewCmsBoard = function (key) {
            $location.url('/webboard/view/'+key);
        };

        // 수정 화면 이동
        $scope.click_showEditCmsBoard = function (item) {
            if ($rootScope.role != 'ADMIN' && $rootScope.role != 'MANAGER' && $rootScope.uid != item.REG_UID) {
                alert("수정 권한이 없습니다.");
                return;
            }

            $location.path('/webboard/edit/'+item.NO);
        };

        // 삭제 버튼 클릭
        $scope.click_deleteCmsBoard = function (item) {
            if ($rootScope.role != 'ADMIN' && $rootScope.role != 'MANAGER' && $rootScope.uid != item.REG_UID) {
                alert("삭제 권한이 없습니다.");
                return;
            }

            $scope.deleteItem('webboard', item.NO, false)
                .then(function(){$scope.getCmsBoardList($scope.search)})
                .catch(function(error){alert(error)});
        };

        // 검색 버튼 클릭
        $scope.click_searchCmsBoard = function () {
            $scope.getCmsBoardList($scope.search);
        };

        // 프로젝트 목록 조회
        $scope.getCmsBoardList = function (search) {
            $scope.getList('webboard', {NO:0, SIZE:4}, search, true)
                .then(function(data){$scope.list = data})
                .catch(function(error){$scope.list = [];  alert(error)});
        };

        // 페이징 처리
        $scope.selectItems = 200; // 한번에 조회하는 아이템 수
        $scope.selectCount = 1; // 현재 조회한 카운트 수
        $scope.itemsPerPage = 10; // 화면에 보이는 아이템 수(default 10)
        $scope.maxSize = 5; // 총 페이지 제한

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.change_pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        // 페이지 이동 시 이벤트
        $scope.$watch('isLoading', function() {
            if ($scope.projectsData == 'null') {
                $scope.projects = null;
            } else {
                $scope.projects = $scope.projectsData;
            }
        });

        // 페이지 이동 시 이벤트
        $scope.$watch('currentPage + itemsPerPage', function() {
            var start = $scope.currentPage % ( $scope.selectItems / $scope.itemsPerPage);

            var begin = ((start - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            if ($scope.projectsData != null) {
                $scope.projects = $scope.projectsData.slice(begin, end);
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

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoardList)
            .catch($scope.reportProblems);
    }]);
});
