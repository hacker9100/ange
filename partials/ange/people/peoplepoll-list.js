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

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getAngePollList();
        };

        $scope.search = {};

        // 검색어 조건
        var condition = [{name: "제목+본문", value: "SUBJECT"},{name : "작성자", value : "REG_NM"}];

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

        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showEditPoll = function(item) {
            alert("1");
            $location.url('people/poll/edit/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        $scope.click_searchPoll = function(){
            $scope.getAngePollList();
        }

        // 게시판 목록 조회
        $scope.getAngePollList = function () {
/*            console.log('ddd');
            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: 20,    // count per page $scope.PAGE_SIZE
                sorting: {                  // initial sorting
                    REG_DT: 'desc'
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('ange/poll', 'list', {NO: params.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, {}, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_COUNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);
                        })
                        .catch(function(error){$scope.TOTAL_COUNT = 0; $defer.resolve([]);});
                }
            });*/

            $scope.search['SORT'] = 'REG_DT';
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
            $location.url('/people/poll/edit/'+key);
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getAngePollList();

    }]);
});
