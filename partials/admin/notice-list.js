/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : notice-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('notice-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, CONSTANT) {

        /********** 초기화 **********/
        $scope.search = {SYSTEM_GB: 'ANGE', BOARD_GB: 'NOTICE', COMM_NO_IN: CONSTANT.COMM_NO_NOTICE };

        // 초기화
        $scope.init = function() {
            // 검색어 조건
            var condition = [{name: "등록자", value: "REG_NM"}, {name: "제목+내용", value: "SUBJECT"}];

            $scope.conditions = condition;
            $scope.search.CONDITION = condition[0];
        };

        /********** 이벤트 **********/
        // 등록 버튼 클릭
        $scope.click_showCreateNewNotice = function () {
            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', "등록 권한이 없습니다.", {size: 'md'});
                return;
            }

            $location.url('/notice/edit/0');
        };

        // 조회 화면 이동
        $scope.click_showViewNotice = function (key) {
            $location.url('/notice/view/'+key);
        };

        // 수정 화면 이동
        $scope.click_showEditNotice = function (item) {
            if ($rootScope.role != 'ANGE_ADMIN' && $rootScope.uid != item.REG_UID) {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $location.path('/notice/edit/'+item.NO);
        };

        // 삭제 버튼 클릭
        $scope.click_deleteNotice = function (item) {
            if ($rootScope.role != 'ANGE_ADMIN' && $rootScope.uid != item.REG_UID) {
                dialogs.notify('알림', '삭제 권한이 없습니다.', {size: 'md'});
                return;
            }

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, false)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        };

        // 검색 버튼 클릭
        $scope.click_searchNotice = function () {
            $scope.tableParams.$params.page = 1;
            $scope.tableParams.reload();
        };

        // 페이지 사이즈
        $scope.PAGE_SIZE = 10;

        // 게시판 목록 조회
        $scope.getNoticeList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: $scope.PAGE_SIZE,    // count per page
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

                    $scope.getList('com/webboard', 'list', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_COUNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);

//                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
//                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        .catch(function(error){$scope.TOTAL_COUNT = 0; $defer.resolve([]);});
                }
            });

//            $scope.isLoading = true;
//            $scope.getList('com/webboard', 'list', {NO:0, SIZE:20}, $scope.search, true)
//                .then(function(data){$scope.listData = data; $scope.totalItems = data[0].TOTAL_COUNT;})
//                .catch(function(error){$scope.list = []; console.log(error);})
//                .finally(function(){$scope.isLoading = false;});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getNoticeList)
            .catch($scope.reportProblems);
    }]);
});
