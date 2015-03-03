/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-26
 * Description : order-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('order-list', ['$scope', '$stateParams', '$location', '$filter', 'dialogs', 'CONSTANT', function ($scope, $stateParams, $location, $filter, dialogs, CONSTANT) {

        /********** 초기화 **********/
        // 탭 초기화
        $scope.tab = 0;

        // 검색 조건
        $scope.search = {};

        // 목록 데이터
        $scope.list = [];

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_CNT = 0;

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.init = function() {
            $scope.condition = [{name: "아이디", value: "USER_ID", index: 1}, {name: "주문일", value: "PAY_DT", index: 2}];
            $scope.order_gb = [{name: "마일리지", value: "MILEAGE", index: 0}, {name: "커머스", value: "CUMMERCE", index: 1}, {name: "네이밍", value: "NAMING", index: 2}];
            $scope.order_st = [{name: "결제완료", value: "0", index: 0}, {name: "주문접수", value: "1", index: 1}, {name: "상품준비중", value: "2", index: 2}, {name: "배송중", value: "3", index: 3}, {name: "배송완료", value: "4", index: 4}, {name: "주문취소", value: "5", index: 5}, {name: "환불/교환", value: "6", index: 6}];

            $scope.sort = [{name: "주문일", value: "ORDER_DT", index: 0}, {name: "결제일", value: "PAY_DT", index: 1}];
            $scope.order = [{name: "내림차순", value: "DESC", index: 0}, {name: "오름차순", value: "ASC", index: 1}];

            $scope.search.CONDITION = $scope.condition[0];
            $scope.search.ORDER_GB = $scope.order_gb[0];
//            $scope.search.ORDER_ST = $scope.order_st[0];

            $scope.search.SORT = $scope.sort[0];
            $scope.search.ORDER = $scope.order[0];

            // ui bootstrap 달력
            $scope.format = 'yyyy-MM-dd';

            $scope.today = function() {
                $scope.search.START_YMD = new Date();
                $scope.search.END_YMD = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.search.START_YMD = null;
                $scope.search.END_YMD = null;
            };

            $scope.open = function($event, opened) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope[opened] = true;
            };
        };

        /********** 이벤트 **********/
        $scope.click_selectTab = function (tabIdx) {
            $scope.tab = tabIdx;
        };

        // 목록갱신 버튼 클릭
        $scope.click_refreshList = function () {
            $scope.getOrderList();
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getOrderList();
        };

        // 주문 목록 조회
        $scope.getOrderList = function () {
            if ($scope.search.CONDITION.index == 2) {
                $scope.search.START_YMD = $filter('date')($scope.search.START_YMD, 'yyyy-MM-dd');
                $scope.search.END_YMD = $filter('date')($scope.search.END_YMD, 'yyyy-MM-dd');
            }

            $scope.getList('ange/order', 'admin', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){$scope.list = data; $scope.TOTAL_CNT = data[0].TOTAL_COUNT;})
                ['catch'](function(error){$scope.list = []; $scope.TOTAL_CNT = 0;});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
//            .then($scope.permissionCheck)
            ['catch']($scope.reportProblems);

        $scope.init();
        $scope.getOrderList();
//        $scope.getMenuList1();
//        $scope.getMenuList2();
    }]);
});
