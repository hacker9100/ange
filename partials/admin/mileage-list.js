/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : mileage-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('mileage-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', '$timeout', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, $timeout) {

        /********** 초기화 **********/
        $scope.search = {};
        $scope.showEdit = false;

        // 초기화
        $scope.init = function() {
            // 검색어 조건
            var condition = [{name: "마일리지명", value: "SUBJECT"}, {name: "사유", value: "REASON"}];

            $scope.conditions = condition;
            $scope.search.CONDITION = condition[0];
        };

        /********** 이벤트 **********/
        // 마일리지 저장 버튼 클릭
        $scope.click_saveMileage = function () {

            $scope.updateItem('admin/mileage', 'item', $scope.item.NO, $scope.item, false)
                .then(function(){dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.click_cancel = function () {
            $scope.item = {};
            $scope.showEdit = false;

            $scope.click_focus('search');
        };

        // 수정 화면 이동
        $scope.click_showEditMileage = function (item) {
            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }
            $scope.item = item;
            $scope.showEdit = true;

            $timeout(function() {
                $scope.click_focus('item', 'item_name');
            }, 500);
        };

        // 편집 버튼 클릭 시 영역으로 focus 이동
        $scope.click_focus = function (id, name) {
            $('html,body').animate({scrollTop:$('#'+id).offset().top}, 100);
            $('#'+name).focus();
        }

        // 삭제 버튼 클릭
        $scope.click_deleteMileage = function (item) {
            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', '삭제 권한이 없습니다.', {size: 'md'});
                return;
            }

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

//            dialog.result.then(function(btn){
//                $scope.deleteItem('ange/community', 'item', item.NO, false)
//                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
//                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
//            }, function(btn) {
//                return;
//            });
        };

        // 검색 버튼 클릭
        $scope.click_searchMileage = function () {
            $scope.tableParams.$params.page = 1;
            $scope.tableParams.reload();
        };

        // 페이지 사이즈
        $scope.PAGE_SIZE = 10;

        // 게시판 목록 조회
        $scope.getMileageList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: $scope.PAGE_SIZE,    // count per page
                sorting: {                  // initial sorting
                    NO: 'desc'
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('admin/mileage', 'list', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_COUNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);
                        })
                        ['catch'](function(error){$scope.TOTAL_COUNT = 0; $defer.resolve([]);});
                }
            });
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getMileageList)
            ['catch']($scope.reportProblems);
    }]);
});
