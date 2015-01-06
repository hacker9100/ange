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
    controllers.controller('board-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams) {

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

            if ($stateParams.menu == 'angeroom') {
                $scope.community = "앙쥬맘 수다방";
            } else if($stateParams.menu == 'momstalk') {
                $scope.community = "예비맘 출산맘";
            } else if($stateParams.menu == 'babycare') {
                $scope.community = "육아방";
            } else if($stateParams.menu == 'firstbirthtalk') {
                $scope.community = "돌잔치 톡톡톡";
            } else if($stateParams.menu == 'booktalk') {
                $scope.community = "책수다";
            }
        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/board/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
        $scope.init();

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            if ($stateParams.menu == 'angeroom') {
                $scope.search['COMM_NO'] = '1';
            } else if($stateParams.menu == 'momstalk') {
                $scope.search['COMM_NO'] = '2';
            } else if($stateParams.menu == 'babycare') {
                $scope.search['COMM_NO'] = '3';
            } else if($stateParams.menu == 'firstbirthtalk') {
                $scope.search['COMM_NO'] = '4';
            } else if($stateParams.menu == 'booktalk') {
                $scope.search['COMM_NO'] = '5';
            }

            $scope.search.SYSTEM_GB = 'ANGE';
/*            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC'*/

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

            if ($stateParams.menu == 'angeroom') {
                $location.url('/people/angeroom/view/'+key);
            } else if($stateParams.menu == 'momstalk') {
                $location.url('/people/momstalk/view/'+key);
            } else if($stateParams.menu == 'babycare') {
                $location.url('/people/babycare/view/'+key);
            } else if($stateParams.menu == 'firstbirthtalk') {
                $location.url('/people/firstbirthtalk/view/'+key);
            } else if($stateParams.menu == 'booktalk') {
                $location.url('/people/booktalk/view/'+key);
            }

        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($stateParams.menu == 'angeroom') {
                $location.url('/people/angeroom/edit/0');
            } else if($stateParams.menu == 'momstalk') {
                $location.url('/people/momstalk/edit/0');
            } else if($stateParams.menu == 'babycare') {
                $location.url('/people/babycare/edit/0');
            } else if($stateParams.menu == 'firstbirthtalk') {
                $location.url('/people/firstbirthtalk/edit/0');
            } else if($stateParams.menu == 'booktalk') {
                $location.url('/people/booktalk/edit/0');
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
