/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : series-main.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('series-main', ['$scope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $stateParams, $location, dialogs, ngTableParams) {

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};
        $scope.search = {};

        // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/
        // 시리즈 삭제 버튼 클릭
        $scope.click_deleteSeries = function (parentIdx, idx) {
            var series = $scope.tableParams.data[parentIdx].data[idx];

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('cms/series', 'item', series.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'}); $scope.tableParams.data[parentIdx].data.splice(idx, 1);})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        };

        // 검색 버튼 클릭
        $scope.click_searchSeries = function () {
            $scope.tableParams.reload();
//            $scope.getSeriesList($scope.search);
        }

        // 시리즈 목록 조회
        $scope.getSeriesList = function () {
//            $scope.getList('cms/series', 'list', {}, search, true)
//                .then(function(data){$scope.list = data;})
//                ['catch'](function(error){$scope.list = []});

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 1000,          // count per page
                sorting: {
                    SERIES_NM: 'asc'     // initial sorting
                }
            }, {
                groupBy: 'SERIES_GB',
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('cms/series', 'list', {}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_COUNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);

//                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
//                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        ['catch'](function(error){$defer.resolve([]);});
                }
            });
        };

        // 시리즈 저장 버튼 클릭
        $scope.click_saveSeries = function () {
            if ($scope.key == '') {
                $scope.insertItem('cms/series', 'item', $scope.item, false)
                    .then(function(){dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('cms/series', 'item', $scope.key, $scope.item, false)
                    .then(function(){dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

            $scope.click_cancel();
        };

        // 시리즈 편집 클릭
        $scope.click_getSeries = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('cms/series', 'item', $scope.key, {}, false)
                    .then(function(data) {$scope.item = data; $scope.click_focus();})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 시리즈 상태변경 버튼 클릭
        $scope.click_updateStatus = function (item) {
            item.SERIES_ST = (item.SERIES_ST == "1" ? "0" : "1");

            $scope.updateItem('cms/series', 'item', item.NO, item, false)
                .then(function(){dialogs.notify('알림', '시리즈 상태가 변경되었습니다.', {size: 'md'}); /*$scope.tableParams.reload(); $scope.getCmsUserList();*/})
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'}); $scope.tableParams.reload();});
        };

        // 섹션 등록 버튼 클릭 시 등록하는 영역으로 focus 이동
        $scope.click_focus = function () {
            $('html,body').animate({scrollTop:$('#item').offset().top}, 100);
            $('#item_gb').focus();
        }

        // 취소 클릭
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = {};
            $scope.item.SERIES_GB = '1';
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getSeriesList)
            ['catch']($scope.reportProblems);

    }]);
});
