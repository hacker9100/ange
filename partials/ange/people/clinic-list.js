/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : clinic-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('clinic-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams) {

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



        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            if ($stateParams.menu == 'childdevelop') {
                $scope.community = "아동발달 전문가";
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.community = "한방소아과 전문가";
            } else if($stateParams.menu == 'obstetrics') {
                $scope.community = "산부인과 전문가";
            } else if($stateParams.menu == 'momshealth') {
                $scope.community = "엄마건강 전문가";
            } else if($stateParams.menu == 'financial') {
                $scope.community = "재테크 상담";
            }
        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/clinic/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
        //$scope.init();

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            if ($stateParams.menu == 'childdevelop') {
                $scope.search['COMM_NO'] = '9';
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.search['COMM_NO'] = '10';
            } else if($stateParams.menu == 'obstetrics') {
                $scope.search['COMM_NO'] = '11';
            } else if($stateParams.menu == 'momshealth') {
                $scope.search['COMM_NO'] = '12';
            } else if($stateParams.menu == 'financial') {
                $scope.search['COMM_NO'] = '13';
            }

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC'

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            if ($stateParams.menu == 'childdevelop') {
                $location.url('/people/childdevelop/view/'+key);
            } else if($stateParams.menu == 'chlidoriental') {
                $location.url('/people/chlidoriental/view/'+key);
            } else if($stateParams.menu == 'obstetrics') {
                $location.url('/people/obstetrics/view/'+key);
            } else if($stateParams.menu == 'momshealth') {
                $location.url('/people/momshealth/view/'+key);
            } else if($stateParams.menu == 'financial') {
                $location.url('/people/financial/view/'+key);
            }

        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleClinic = function () {

            if ($stateParams.menu == 'childdevelop') {
                $location.url('/people/childdevelop/edit/0');
            } else if($stateParams.menu == 'chlidoriental') {
                $location.url('/people/chlidoriental/edit/0');
            } else if($stateParams.menu == 'obstetrics') {
                $location.url('/people/obstetrics/edit/0');
            } else if($stateParams.menu == 'momshealth') {
                $location.url('/people/momshealth/edit/0');
            } else if($stateParams.menu == 'financial') {
                $location.url('/people/financial/edit/0');
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
