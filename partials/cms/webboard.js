/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : webboard.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('webboard', ['$scope', 'webboardService', '$location', function ($scope, webboardService, $location) {

//        alert(localStorage.getItem('userToken'))

		$scope.message = "ANGE CMS";

		$scope.pageTitle = "게시판";
		$scope.pageDescription = "CMS 전용 게시판입니다.";

        var boardsData = null;

        // callback for ng-click 'editContent':
        $scope.editBoard = function (no) {
            $location.path('/webboard/edit/'+no);
        };

        $scope.viewBoard = function (no) {
            $location.path('/webboard/view/'+no);
        };

        // callback for ng-click 'deleteContent':
        $scope.deleteBoard = function (idx) {

            var board = $scope.boards[idx];

            webboardService.deleteBoard(board.NO).then(function(data){
                $scope.boards.splice(idx, 1);
            });
        };

        // callback for ng-click 'createContent':
        $scope.createNewBoard = function () {
            $location.path('/webboard/edit/0');
        };

        webboardService.getBoards().then(function(boards){
            boardsData = boards.data;

            // 페이징 처리
            $scope.selectItems = 200; // 한번에 조회하는 아이템 수
            $scope.selectCount = 1; // 현재 조회한 카운트 수
            $scope.itemsPerPage = 10; // 화면에 보이는 아이템 수(default 10)
            $scope.maxSize = 5; // 총 페이지 제한

            if (boardsData != null) {
                $scope.totalItems = boards.data[0].TOTAL_COUNT; // 총 아이템 수
                $scope.currentPage = 1; // 현재 페이지
            }
        });

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        // 페이지 이동 시 이벤트
        $scope.$watch('currentPage + itemsPerPage', function() {
            var start = $scope.currentPage % ( $scope.selectItems / $scope.itemsPerPage);

            var begin = ((start - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            if (boardsData != null) {
                $scope.boards = boardsData.slice(begin, end);
            }
        });

        $scope.$watch('selectItems * selectCount < itemsPerPage * currentPage', function() {
            $scope.selectCount = $scope.selectCount + 1;
        });
    }]);
});
