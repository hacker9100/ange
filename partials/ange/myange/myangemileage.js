/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangemileage.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangemileage', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT) {

        // 초기화
        $scope.init = function(session) {
            $scope.community = "마일리지";
        };

        $scope.search = {};

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;


        var year = [];
        //var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        //var month = [];

        for (var i = nowYear; i >= 2010; i--) {
            year.push(i+'');
        }

        $scope.search_year = year;

        var date = new Date();

        var month = [];

        var thisyear = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var lastdd = new Date(thisyear, mm ,0);
        var lastday = lastdd.getDate();

        for (var i = 1; i <= 12; i++) {

            if(i < 10){
                i = '0'+i;
            }
            month.push(i+'');
        }

        $scope.month = month;

        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        $scope.init = function(){
            $scope.search.YEAR = nowYear + '';
            $scope.search.REG_UID = $rootScope.uid;
            $scope.search.STATUS = true;

            $scope.getList('ange/mileage', 'mymileagepoint', {NO: $scope.PAGE_NO- 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    if(data[0].SUM_POINT == null){
                        $scope.SUM_POINT = 0;
                    }else{
                        var sum_point = data[0].SUM_POINT;
                        $scope.SUM_POINT = sum_point;
                    }

                    if(data[0].USE_POINT == null){
                        $scope.USE_POINT = 0;
                    }else{
                        var use_point = data[0].USE_POINT;
                        $scope.USE_POINT = use_point;
                    }

                    if(data[0].REMAIN_POINT == null){
                        $scope.REMAIN_POINT = 0;
                    }else{
                        var remain_point = data[0].REMAIN_POINT;
                        $scope.REMAIN_POINT = remain_point;
                    }

                })
                ['catch'](function(error){$scope.SUM_POINT = 0; $scope.USE_POINT = 0; $scope.REMAIN_POINT = 0;});
        }

        $scope.isLoding = false;

        // 일반 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.BOARD_GB = 'BOARD';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC'

            $scope.isLoding = true;
            $scope.getList('ange/mileage', 'list', {NO: $scope.PAGE_NO- 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    var point = data[0].POINT;
                    $scope.POINT = point;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.isLoding = false;
                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);
                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0;
                    $scope.list = "";
                    $scope.isLoding = false;
                });
        };

        // 연도 선택
        $scope.change_year = function(year){

            $scope.search.YEAR = year;
            $scope.getPeopleBoardList();
        }

        // 월 선택
        $scope.change_month = function(month){

            $scope.search.MONTH = month;

            $scope.getPeopleBoardList();
//            $scope.getPeopleReplyList();
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);

//        $scope.init();
//        $scope.getPeopleBoardList();
    }]);
});
