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
    controllers.controller('article_list', ['$scope', '$stateParams', 'contentService', '$location', function ($scope, $stateParams, contentService, $location) {

        // 페이지 타이틀
        if ($scope.method == 'GET' && $stateParams.id == undefined) {
            $scope.message = 'ANGE CMS';

            $scope.pageTitle = '원고 관리';
            $scope.pageDescription = '태스크 내용을 확인하여 원고를 작성하고 관리합니다.';
        }

        var contentsData = null;

        // 등록 화면 이동
        $scope.createNewContent = function () {
            $location.search({_method: 'POST'});
            $location.path('/article/edit/0');
        };

        // 수정 화면 이동
        $scope.editContent = function (no) {
            $location.search({_method: 'PUT'});
            $location.path('/article/edit/'+no);
        };

        // 조회 화면 이동
        $scope.viewContent = function (no) {
            $location.search({_method: 'GET'});
            $location.path('/article/view/'+no);
        };

        // 삭제
        $scope.deleteContent = function (idx) {

            var content = $scope.contents[idx];

            contentService.deleteContent(content.NO).then(function(data){
                $scope.contents.splice(idx, 1);
            });
        };

        // 목록
//        $activityIndicator.startAnimating();
        $scope.isLoading = true;
        contentService.getContents().then(function(contents){

            contentsData = contents.data;

            if (contentsData != null) {
                $scope.totalItems = contents.data[0].TOTAL_COUNT; // 총 아이템 수
                $scope.currentPage = 1; // 현재 페이지
            }
//            $activityIndicator.stopAnimating();
            $scope.isLoading = false;
        });

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
