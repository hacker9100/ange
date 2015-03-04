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
    controllers.controller('infodeskboard-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        /********** 공통 controller 호출 **********/
            //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

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

        $scope.selectIdx = 0;
        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {


            //console.log($scope.menu.COMM_NO);

            if ($stateParams.menu == 'notice') {
                $scope.community = "공지사항";
                $scope.infomenu = "notice";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 51;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'system') {
                $scope.community = "시스템공지";
                $scope.infomenu = "system";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 52;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'faq') {
                $scope.community = "자주묻는질문";
                $scope.infomenu = "faq";
                $scope.search.COMM_NO = 53;
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_GB = 'FAQ';
            } else if($stateParams.menu == 'qna') {
                $scope.community = "문의/게시판";
                $scope.infomenu = "qna";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 54;
                $scope.search.COMM_GB = 'QNA';
            } else if($stateParams.menu == 'myqna') {
                $scope.community = "내 질문과 답변";
                $scope.infomenu = "myqna";
                $scope.search.MY_QNA = "Y";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 54;
                $scope.search.COMM_GB = 'QNA';
            }

            $scope.search.SYSTEM_GB = 'ANGE';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});

            if($stateParams.menu == 'faq'){
                $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                    .then(function(data){
                        $scope.tabs = data;

                    })
                    ['catch'](function(error){ $scope.tabs = "";});
            }
        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('infodesk/board/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
        // 탭 클릭 이동
        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;

            if(idx == 0){
                $scope.search.CATEGORY_NO = '';
                $scope.getPeopleBoardList();
            }else{
                $scope.search.CATEGORY_NO = category_no;
                $scope.getPeopleBoardList();
            }

        };

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {


            if ($stateParams.menu == 'notice') {
                $location.url('/infodesk/notice/view/'+key);
            } else if($stateParams.menu == 'system') {
                $location.url('/infodesk/system/view/'+key);
            }else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/view/'+key);
            }  else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/view/'+key);
            }

        };

        // 조회 화면 이동
        $scope.click_showViewQnaPeopleBoard = function (password, key, regid) {


            if(password == 0){
                $location.url('/infodesk/qna/view/'+key);
            }else{

                if($scope.uid == regid || $scope.role == $scope.VIEW_ROLE){
                    if($stateParams.menu == 'qna') {
                        $location.url('/infodesk/qna/view/'+key);
                    }
                }else{
                    dialogs.notify('알림', '비밀글입니다. 작성자와 관리자만 볼 수 있습니다.', {size: 'md'});
                }
            }

        }

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }

            if ($stateParams.menu == 'notice') {

                if ($rootScope.uid == '' || $rootScope.uid == null || $rootScope.role != $scope.VIEW_ROLE) {
                    dialogs.notify('알림', '관리자만 게시물을 등록 할 수 있습니다.', {size: 'md'});
                    return;
                }
                $location.url('/infodesk/notice/edit/0');
            } else if($stateParams.menu == 'system') {
                if ($rootScope.uid == '' || $rootScope.uid == null|| $rootScope.role != $scope.VIEW_ROLE) {
                    dialogs.notify('알림', '관리자만 게시물을 등록 할 수 있습니다.', {size: 'md'});
                    return;
                }
                $location.url('/infodesk/system/edit/0');
            } else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/edit/0');
            }  else if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/edit/0');
            } else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/edit/0');
            }
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
        }

        // 페이징
        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        /********** 화면 초기화 **********/

        $scope.getSession()
            .then($scope.sessionCheck)
            ['catch']($scope.reportProblems);


        $scope.init();
        $scope.getPeopleBoardList();

        /*        $scope.test = function(session){
         console.log(session);
         }

         $scope.test();*/

        //console.log($scope.$parent.sessionInfo);
    }]);
});
