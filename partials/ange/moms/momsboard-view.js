/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peopleboard-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsboard-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};


        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'BOARD';

        $scope.replyList = [];

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $(document).ready(function(){

        });

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'experiencewinner') {
                $scope.item.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'eventwinner') {
                $scope.item.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'supporterboard') {
                $scope.item.EVENT_GB = "SUPPORTER";
            }

        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            $location.url('/moms/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

            $location.url('/moms/'+$stateParams.menu+'/list/');
        };


        // 게시판 조회
        $scope.getPeopleBoard = function () {

            $scope.search.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                $scope.getList('ange/winner', 'winnerlist', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                    .then(function(data){
                        var total_cnt = data[0].TOTAL_COUNT;
                        $scope.TOTAL_COUNT = total_cnt;

                        $scope.item.SUBJECT = data[0].SUBJECT;
                        /*$scope.total(total_cnt);*/
                        $scope.list = data;

                    })
                    ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
            }
        };



        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/moms/'+$stateParams.menu+'/view/'+key);
        };

        // 이전글
        $scope.getPreBoard = function (){

            if ($stateParams.menu == 'experiencewinner') {
                $scope.search.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'eventwinner') {
                $scope.search.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'supporterboard') {
                $scope.search.EVENT_GB = "SUPPORTER";
            }

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_PRE = true;

            if ($stateParams.id != 0) {
                return $scope.getList('ange/winner', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    ['catch'](function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

            if ($stateParams.menu == 'experiencewinner') {
                $scope.search.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'eventwinner') {
                $scope.search.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'supporterboard') {
                $scope.search.EVENT_GB = "SUPPORTER";
            }

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_NEXT = true;

            if ($stateParams.id != 0) {
                return $scope.getList('ange/winner', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    ['catch'](function(error){$scope.nextBoardView = "";})
            }
        }

        $scope.click_showPeopleBoardDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('ange/winner', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $location.url('/moms/'+$stateParams.menu+'/list/');
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }


        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/

        $scope.getSession()
            .then($scope.sessionCheck)
            ['catch']($scope.reportProblems);

        $scope.init();
        $scope.getPeopleBoard();
        $scope.getPreBoard();
        $scope.getNextBoard();

    }]);
});
