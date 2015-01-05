/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : board-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('photo-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams) {

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 20;

        $scope.search = {};

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "등록자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;


    /*    *//********** 초기화 **********//*
            // 검색 조건
        $(document).ready(function() {
            $(window).scroll(function() {

                $timeout(function(){
                    //$scope.images;
                    $scope.isLoading = false;
                },3000);

                $timeout(function() {
                    $scope.isLoading = true;
                });

                if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                    var scope = angular.element($("#listr")).scope();
                    scope.$apply(function(){
                        scope.count = scope.count + 8;
                    });
                }
            });
        });
        */
        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            if ($stateParams.menu == 'angemodel') {
                $scope.community = "앙쥬모델 선발대회";
            } else if($stateParams.menu == 'recipearcade') {
                $scope.community = "레시피 아케이드";
                } else if($stateParams.menu == 'peopletaste') {
                $scope.community = "피플 맛집";
            }
        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/board/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
        //$scope.init();

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            if ($stateParams.menu == 'angemodel') {
                $scope.search['COMM_NO'] = '6';
            } else if($stateParams.menu == 'recipearcade') {
                $scope.search['COMM_NO'] = '7';
            } else if($stateParams.menu == 'peopletaste') {
                $scope.search['COMM_NO'] = '8';
            }

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC'

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.item = data;
                })
                .catch(function(error){$scope.item = ""});
        };

        // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (key) {

            if ($stateParams.menu == 'angemodel') {
                $location.url('/people/angemodel/view/'+key);
            } else if($stateParams.menu == 'recipearcade') {
                $location.url('/people/recipearcade/view/'+key);
            } else if($stateParams.menu == 'recipearcade') {
                $location.url('/people/recipearcade/view/'+key);
            }
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($stateParams.menu == 'angemodel') {
                $location.url('/people/angemodel/edit/0');
            } else if($stateParams.menu == 'recipearcade') {
                $location.url('/people/recipearcade/edit/0');
            } else if($stateParams.menu == 'recipearcade') {
                $location.url('/people/recipearcade/edit/0');
            }
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
        }

        $scope.init();
        $scope.getPeopleBoardList();

    }]);
});
