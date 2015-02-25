/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peopleboard-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peopleboard-list', ['$scope', '$rootScope','$stateParams','$q', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $q, $location, dialogs, ngTableParams) {

        /********** 공통 controller 호출 **********/
        //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT+BODY"} , {name: "작성자", value: "NICK_NM"}];

        $scope.SEARCH_YN = 'N';

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+mm+dd;

        $scope.todayDate = today;

        //$scope.uid = $rootScope.uid;

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'BOARD';
            $scope.search.SYSTEM_GB = 'ANGE';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                .catch(function(error){});
        };

        /********** 이벤트 **********/
        // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/board/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {
/*            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC'*/

            $scope.search.FILE_EXIST = true;

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var file_cnt = data[i].FILE[0].FILE_CNT;
                            data[i].FILE_CNT = file_cnt;

                        }
                        console.log(data[i].FILE_CNT);
                    }

                    $scope.list = data;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

//        if ($stateParams.menu == 'angeroom') {
//            $scope.search['COMM_NO'] = '1';
//        } else if($stateParams.menu == 'momstalk') {
//            $scope.search['COMM_NO'] = '2';
//        } else if($stateParams.menu == 'babycare') {
//            $scope.search['COMM_NO'] = '3';
//        } else if($stateParams.menu == 'firstbirthtalk') {
//            $scope.search['COMM_NO'] = '4';
//        } else if($stateParams.menu == 'booktalk') {
//            $scope.search['COMM_NO'] = '5';
//        }
//
//        $scope.search.SYSTEM_GB = 'ANGE';
//
//        // 게시판 목록 조회
//        $scope.getPeopleBoardList = function () {
//            $scope.tableParams = new ngTableParams({
//                page: 1,                    // show first page
//                count: $scope.PAGE_SIZE     // count per page
//            }, {
//                counts: [],         // hide page counts control
//                total: 0,           // length of data
//                getData: function($defer, params) {
//                    $scope.getList('com/webboard', 'list', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
//                        .then(function(data){
//                            var total_cnt = data[0].TOTAL_COUNT;
//                            $scope.TOTAL_COUNT = total_cnt;
//
//                            params.total(total_cnt);
//                            $defer.resolve(data);
//                        })
//                        .catch(function(error){$scope.TOTAL_COUNT = 0; $defer.resolve([]);});
//                }
//            });
//        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
//            $scope.comming_soon();
//            return;

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {
//            $scope.comming_soon();
//            return;

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
            $scope.SEARCH_YN = 'Y';
        }

        // 전체검색
        $scope.click_searchAllPeopleBoard = function(){
            $scope.search.KEYWORD = '';
            $scope.getPeopleBoardList();
            $scope.SEARCH_YN = 'N';
        }

        /********** 화면 초기화 **********/

        $scope.getSession()
            .then($scope.sessionCheck)
            .catch($scope.reportProblems);


        $scope.init();
        $scope.getPeopleBoardList();

/*        $scope.test = function(session){
            console.log(session);
        }

        $scope.test();*/

        //console.log($scope.$parent.sessionInfo);
    }]);
});
