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
    controllers.controller('order-list', ['$scope', '$stateParams', '$location', '$filter', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $stateParams, $location, $filter, dialogs, ngTableParams, CONSTANT) {

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

            var range = [{name: "선택한 회원", value: "C"}, {name: "리스트 전체", value: "A"}];
            var func = [{name: "엑셀저장", value: "excel"}];

            $scope.search.CONDITION = $scope.condition[0];
            $scope.search.ORDER_GB = $scope.order_gb[0];
//            $scope.search.ORDER_ST = $scope.order_st[0];

            $scope.search.SORT = $scope.sort[0];
            $scope.search.ORDER = $scope.order[0];

            $scope.range = range;
            $scope.function = func;
            $scope.action.CHECKED = range[0].value;
            $scope.action.FUNCTION = func[0];

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
        $scope.check_order = [];
        $scope.check_cnt = 0;
        $scope.$watch('check_order', function(newArr, oldArr) {
            if (newArr != undefined && newArr != '') {
                $scope.check_cnt = newArr.length;
            }
        }, true);

        $scope.click_selectTab = function (tabIdx) {
            $scope.tab = tabIdx;
        };

        // 목록갱신 버튼 클릭
        $scope.click_refreshList = function () {
            $scope.check_order = [];
            $scope.check_cnt = 0;
            $scope.tableParams.reload();
//            $scope.getOrderList();
        };

//        $scope.pageChanged = function() {
//            console.log('Page changed to: ' + $scope.PAGE_NO);
//            $scope.getOrderList();
//        };

        $scope.isStatus = false;
        $scope.selectOrder = '';

        // 상태 변경 기능 클릭
        $scope.click_changeStatusOrder = function (item) {
            $scope.isStatus = true;
            $scope.selectOrder = item.NO;
        };

        // 상태 변경 기능 클릭
        $scope.change_orderStatus = function (item) {
            $scope.updateItem('ange/order', 'status', item.NO, item, true)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                    $scope.isStatus = false;
                    $scope.selectOrder = '';
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 주문 목록 조회
        $scope.getOrderList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: $scope.PAGE_SIZE,    // count per page
                sorting: {                  // initial sorting
                    ORDER_DT: 'DESC'
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

//                    $scope.search['SORT'] = key;
//                    $scope.search['ORDER'] = params.sorting()[key];

                    if ($scope.search.CONDITION.index == 2) {
                        $scope.search.START_YMD = $filter('date')($scope.search.START_YMD, 'yyyy-MM-dd');
                        $scope.search.END_YMD = $filter('date')($scope.search.END_YMD, 'yyyy-MM-dd');
                    }

                    $scope.getList('ange/order', 'admin', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_CNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);
                        })
                        ['catch'](function(error){$scope.TOTAL_CNT = 0; $defer.resolve([]);});
                }
            });

//            if ($scope.search.CONDITION.index == 2) {
//                $scope.search.START_YMD = $filter('date')($scope.search.START_YMD, 'yyyy-MM-dd');
//                $scope.search.END_YMD = $filter('date')($scope.search.END_YMD, 'yyyy-MM-dd');
//            }
//
//            $scope.getList('ange/order', 'admin', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
//                .then(function(data){$scope.list = data; $scope.TOTAL_CNT = data[0].TOTAL_COUNT;})
//                ['catch'](function(error){$scope.list = []; $scope.TOTAL_CNT = 0;});
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
