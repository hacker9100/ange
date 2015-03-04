/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-26
 * Description : notify_list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('notify-list', ['$scope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $stateParams, $location, dialogs, ngTableParams, CONSTANT) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        // 초기화
        $scope.init = function() {
            $scope.condition = [{name: "닉네임", value: "TARGET_NICK", index: 1}, {name: "아이디", value: "TARGET_UID", index: 2}];

            $scope.search.CONDITION = $scope.condition[0];
        };

        /********** 이벤트 **********/
        // 수정 화면 이동
        $scope.click_editEvent = function (item) {
            $location.url('/event/edit/'+item.NO);
        };

        // 신고 내용 제거
        $scope.click_removeNotify = function (item) {
            $scope.deleteItem('admin/user_list', 'item', item.NO, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 제외되었습니다.', {size: 'md'});
                    $scope.tableParams.reload();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 검색 버튼 클릭
        $scope.click_searchNotifyList = function () {
            $scope.tableParams.$params.page = 1;
            $scope.tableParams.reload();
        };

        // 신고 목록 조회
        $scope.getNotifyList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: $scope.PAGE_SIZE,    // count per page
                sorting: {                  // initial sorting
                    REG_YMD: 'desc'
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('ange/notify', 'list', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_COUNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);
                        })
                        ['catch'](function(error){$scope.TOTAL_COUNT = 0; $defer.resolve([]);});
                }
            });


//            $scope.getList('admin/user_list', 'notify_list', {}, $scope.search, true)
//                .then(function(data){
//                    $scope.list = data;
//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
//                })
//                ['catch'](function(error){$scope.list = []});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
//            .then($scope.permissionCheck)
            ['catch']($scope.reportProblems);

        $scope.init();
        $scope.getNotifyList();
    }]);
});
