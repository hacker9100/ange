/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peoplepoll-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("peoplepoll-list", ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams) {

        $(function(){
            $("#poll_st").click(function(){
                // 진행중 체크박스
                if($("#poll_st").is(":checked")){ // 진행중 체크했을때
                    $scope.search['POLL_ST'] = 0;
                    $scope.getAngePollList();
                }else{
                    $scope.search['POLL_ST'] = ''; // 안했을때
                    $scope.getAngePollList();
                }
            });
        });

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 20;
        $scope.TOTAL_COUNT = 0;

        $scope.SEARCH_YN = 'N';

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getAngePollList();
        };

        $scope.search = {};

        // 검색어 조건
        var condition = [{name: "제목", value: "ada_title"}];
//        ,{name : "작성자", value : "REG_NM"}

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        if(mm < 10){
            mm = '0'+mm;
        }

        if(dd < 10){
            dd = '0'+dd;
        }

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        /********** 초기화 **********/
        // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showEditPoll = function(item) {
            alert("1");
            $location.url('people/poll/edit/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        // 검색
        $scope.click_searchPoll = function(){
            $scope.getAngePollList();
            $scope.SEARCH_YN = 'Y';
        }

        // 전체검색
        $scope.click_searchAllPeopleBoard = function(){
            $scope.search.KEYWORD = '';
            $scope.getAngePollList();
            $scope.SEARCH_YN = 'N';
        }

        // 게시판 목록 조회
        $scope.getAngePollList = function () {
            $scope.search['SORT'] = 'ada_date_regi';
            $scope.search['ORDER'] = 'DESC';

            $scope.getList('ange/poll', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;
                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewAngePoll = function (key) {
            /*$location.url('/people/poll/edit/'+key);*/

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 설문조사 참여가 가능합니다.', {size: 'md'});
                return;
            }

            $location.url('/people/poll/edit/'+key);
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getAngePollList();

    }]);
});
