/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('archive_list', ['$scope', '$stateParams', 'contentService', '$location', function ($scope, $stateParams, contentService, $location) {

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        for (var i = nowYear - 5; i < nowYear + 5; i++) {
            year.push(i+'');
        }

        var order = [{name: "기자", value: "0"}, {name: "편집자", value: "1"}, {name: "제목+내용", value: "2"}];

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

        $scope.search = { years: year, YEAR: nowYear+'', order: order, ORDER: order[0] };

        var contentsData = null;

        // 등록 화면 이동
        $scope.createNewContent = function () {
            $location.search({_method: 'POST'});
            $location.path('/task/edit/0');
        };

        // 수정 화면 이동
        $scope.editContent = function (no) {
            $location.search({_method: 'PUT'});
            $location.path('/task/edit/'+no);
        };

        // 조회 화면 이동
        $scope.viewContent = function (no) {
            $location.search({_method: 'GET'});
            $location.path('/task/view/'+no);
        };

        // 삭제
        $scope.deleteContent = function (idx) {

            var content = $scope.contents[idx];

            contentService.deleteContent(content.NO).then(function(data){
                $scope.contents.splice(idx, 1);
            });
        };

        // 목록
//        $scope.isLoading = true;
//        contentService.getContents().then(function(contents){
//
//            contentsData = contents.data;
//
//            if (contentsData != null) {
//                $scope.totalItems = contents.data[0].TOTAL_COUNT; // 총 아이템 수
//                $scope.currentPage = 1; // 현재 페이지
//            }
//            $scope.isLoading = false;
//        });

        // 페이징 처리
        $scope.selectItems = 200; // 한번에 조회하는 아이템 수
        $scope.selectCount = 1; // 현재 조회한 카운트 수
        $scope.itemsPerPage = 10; // 화면에 보이는 아이템 수(default 10)
        $scope.maxSize = 5; // 총 페이지 제한

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

            if (contentsData != null) {
                $scope.contents = contentsData.slice(begin, end);
            }
        });

        $scope.$watch('selectItems * selectCount < itemsPerPage * currentPage', function() {
            $scope.selectCount = $scope.selectCount + 1;
        });
    }]);
});
