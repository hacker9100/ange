/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-26
 * Description : comp-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('comp-list', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, CONSTANT, UPLOAD) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        // 초기화
        $scope.init = function() {
            $scope.condition = [{name: "이벤트명", value: "SUBJECT", index: 1}, {name: "회사명", value: "COMPANY_NM", index: 2}];
            $scope.event_gb = [{name: "이벤트", value: "EVENT", index: 0}, {name: "체험단", value: "EXPERIENCE", index: 1}];

            $scope.search.CONDITION = $scope.condition[0];
            $scope.search.EVENT_GB = $scope.event_gb[0];
        };

        /********** 이벤트 **********/
            // 목록갱신 버튼 클릭
        $scope.click_refreshList = function () {
            $scope.getEventList();
        };

        // 등록 버튼 클릭
        $scope.click_createEvent = function() {
            $location.url('/event/edit/0');
        };

        // 수정 화면 이동
        $scope.click_editEvent = function (item) {
            $location.url('/event/edit/'+item.NO);
        };

        $scope.click_deleteEvent = function (item) {
            $scope.deleteItem('ange/event', 'item', item.NO, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                    $scope.getEventList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 체험단/이벤트 목록 조회
        $scope.getEventList = function () {
            $scope.getList('ange/event', 'list', {}, $scope.search, true)
                .then(function(data){
                    $scope.list0 = data;

//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
                })
                .catch(function(error){alert(error)});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
//            .then($scope.permissionCheck)
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getEventList();
    }]);
});
