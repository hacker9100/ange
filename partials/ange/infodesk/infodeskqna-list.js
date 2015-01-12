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
    controllers.controller('infodeskqna-list', ['$scope', '$rootScope','$stateParams','$q', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $q, $location, dialogs, ngTableParams) {

        /********** 공통 controller 호출 **********/
            //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 20;


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



        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            if($stateParams.menu == 'qna') {
                $scope.community = "문의/게시판";
                $scope.menu = "qna";
                $scope.search.COMM_NO = '17';
            } else if($stateParams.menu == 'myqna') {
                $scope.community_request = "내 질문과 답변";
                $scope.menu = "myqna";

                $scope.search.COMM_NO = '17';
                $scope.search.REG_UID = $scope.uid;
            }
        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('infodesk/board/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
        //$scope.init();

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {


            if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/view/'+key);
            }  else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/view/'+key);
            }

        };

        // 조회 화면 이동
        $scope.click_showViewQnaPeopleBoard = function (key, regid) {

            console.log(regid);
            console.log($scope.uid);

            if($scope.uid == regid || $scope.role == $scope.VIEW_ROLE){
                if($stateParams.menu == 'qna') {
                    $location.url('/infodesk/qna/view/'+key);
                }
            }else if($scope.uid != regid){
                dialogs.notify('알림', '비밀글입니다. 작성자와 관리자만 볼 수 있습니다.', {size: 'md'});
            }
        }

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/edit/0');
            } else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/edit/0');
            }
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
        }

        /********** 화면 초기화 **********/

        $scope.getSession()
            .then($scope.sessionCheck)
            .catch($scope.reportProblems);


        $scope.init();
        $scope.getPeopleBoardList();

        /*        $scope.test = function(session){
         console.log(session);
         }

         $scope.test();*/

        //console.log($scope.$parent.sessionInfo);
    }]);
});
