/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsboard-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsboard-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        // 검색어 조건
        var condition = [{name: "제목", value: "SUBJECT"} , {name: "내용", value: "BODY"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        //$scope.uid = $rootScope.uid;

        // 초기화
        $scope.init = function(session) {
            $scope.search.COMM_NO = $scope.menu.COMM_NO;

//            $scope.search.BOARD_GB = "WINNER";
//            if ($stateParams.menu == 'experiencewinner') {
//                $scope.search.EVENT_GB = "EVENT";
//            } else if ($stateParams.menu == 'eventwinner') {
//                $scope.search.EVENT_GB = "EVENT";
//            } else if ($stateParams.menu == 'postwinner') {
//                $scope.search.EVENT_GB = "POSTCARD";
//            }
        };

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.isLoding = true;
            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.isLoding = false;
                })
                ['catch'](function(error){
                    $scope.TOTAL_COUNT = 0; $scope.list = "";
                    $scope.isLoding = false;
                });
        };

        $scope.click_showViewPeopleBoard = function(key){
            $location.url('/moms/'+$stateParams.menu+'/view/'+key);
        }

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {
//            $scope.comming_soon();
//            return;

            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', '관리자만 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        $scope.click_searchPeopleBoard = function (){
            $scope.getPeopleBoardList();
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);
    }]);
});
