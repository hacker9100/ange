/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : series_main.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('series_main', ['$scope', '$stateParams', '$location', 'dialogs', function ($scope, $stateParams, $location, dialogs) {

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};
        $scope.search = {};

        // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/
        // 시리즈 삭제 버튼 클릭
        $scope.click_deleteSeries = function (idx) {
            var series = $scope.list[idx];

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('cms/series', 'item', series.NO, true)
                    .then(function(){alert('정상적으로 삭제되었습니다.'); $scope.list.splice(idx, 1);})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        };

        // 검색 버튼 클릭
        $scope.click_searchSeries = function () {
            $scope.getSeriesList($scope.search);
        }

        // 시리즈 목록 조회
        $scope.getSeriesList = function (search) {
            $scope.getList('cms/series', 'list', {}, search, true)
                .then(function(data){$scope.list = data;})
                .catch(function(error){$scope.list = []});
        };

        // 시리즈 저장 버튼 클릭
        $scope.click_saveSeries = function () {
            if ($scope.key == '') {
                $scope.insertItem('cms/series', 'item', $scope.item, false)
                    .then(function(){$scope.getSeriesList();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('cms/series', 'item', $scope.key, $scope.item, false)
                    .then(function(){$scope.getSeriesList();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

            $scope.key = '';
        };

        // 시리즈 편집 클릭
        $scope.click_getSeries = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('cms/series', 'item', $scope.key, {}, false)
                    .then(function(data) {$scope.item = data; $('#item_gb').focus();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 시리즈 상태변경 버튼 클릭
        $scope.click_updateStatus = function (idx) {
            var series = $scope.list[idx];
            series.SERIES_ST = (series.SERIES_ST == "1" ? "0" : "1");

            $scope.updateItem('cms/series', 'item', series.NO, series, false)
                .then(function(){dialogs.notify('알림', '시리즈 상태가 변경되었습니다.', {size: 'md'}); $scope.getSeriesList(); /*$scope.tableParams.reload(); $scope.getCmsUserList();*/})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

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
            .catch($scope.reportProblems);

    }]);
});
