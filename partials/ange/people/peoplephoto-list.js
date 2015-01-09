/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peoplephoto-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peoplephoto-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.selectIdx = 0;

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

        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

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

            for (var i in $rootScope.ange_menu) {
                if ($rootScope.ange_menu[i].MENU_URL == $location.url()) {
                    $scope.tabs = $rootScope.ange_menu[i].SUB_MENU_INFO;
                }
            }

            if ($stateParams.menu == 'angemodel') {
                $scope.search['COMM_NO'] = '6';
            } else if($stateParams.menu == 'recipearcade') {
                $scope.search['COMM_NO'] = '7';
            } else if($stateParams.menu == 'peopletaste') {
                $scope.search['COMM_NO'] = '8';
            }

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;

                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;
                })
                .catch(function(error){$scope.list = ""; $scope.TOTAL_COUNT = 0;});
        };

        /********** 이벤트 **********/
        // 탭 클릭 이동
        $scope.click_selectTab = function (idx) {
            $scope.selectIdx = idx;

            //$scope.search.PHOTO_NO = idx;

            if ($stateParams.menu == 'angemodel') {
                $scope.search.PHOTO_GB= 'angemodel';
            } else if($stateParams.menu == 'recipearcade') {
                $scope.search.PHOTO_GB = 'recipearcade';
            } else if($stateParams.menu == 'peopletaste') {
                $scope.search.PHOTO_GB = 'peopletaste';
            }

            if(idx == 0){
                $scope.search.PHOTO_TYPE = 'ALL';
                $scope.selectPhoto = 'ALL';
            }else{
                $scope.selectPhoto = '0'+(idx).toString();
                $scope.search.PHOTO_TYPE = $scope.selectPhoto;
            }

            $scope.getPeopleBoardList();
        };

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
            $scope.search.ORDER = 'DESC';
            $scope.search.FILE = true;

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;
                        }
                    }

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;
                })
                .catch(function(error){$scope.list = ""; $scope.SEARCH_TOTAL_COUNT = 0});
        };

        // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (key) {

            if ($stateParams.menu == 'angemodel') {
                $location.url('/people/angemodel/view/'+key);
            } else if($stateParams.menu == 'recipearcade') {
                $location.url('/people/recipearcade/view/'+key);
            } else if($stateParams.menu == 'peopletaste') {
                $location.url('/people/peopletaste/view/'+key);
            }
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($stateParams.menu == 'angemodel') {
                $location.url('/people/angemodel/edit/0');
            } else if($stateParams.menu == 'recipearcade') {
                $location.url('/people/recipearcade/edit/0');
            } else if($stateParams.menu == 'peopletaste') {
                $location.url('/people/peopletaste/edit/0');
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
