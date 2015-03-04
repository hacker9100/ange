/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peopleboard-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peoplediscusstitle-list', ['$scope', '$rootScope','$stateParams','$q', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $q, $location, dialogs, ngTableParams) {

        /********** 공통 controller 호출 **********/
            //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        // 검색어 조건
        var condition = [{name: "제목", value: "SUBJECT"} ,{name: "내용", value: "BODY"}, {name: "작성자", value: "NICK_NM"}];

        //$scope.SEARCH_YN = 'N';

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        if(mm < 10){
            mm = '0'+mm;
        }

        if(dd < 10){
            dd = '0'+dd;
        }

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        //$scope.uid = $rootScope.uid;

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            console.log($scope.menu.COMM_NO);

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'TALK';
            console.log('온라인토론');
//            $scope.search.BOARD_GB = 'TALK';
            $scope.search.PARENT_NO = '0';
//            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NO';
            $scope.search.ORDER = 'DESC';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
        };

        /********** 이벤트 **********/

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {


            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    $scope.list = data;

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            $location.url('/'+$stateParams.channel+'/discuss/list/'+key);
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
        }


        /********** 화면 초기화 **********/

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);

        console.log($rootScope.uid);

    }]);
});
