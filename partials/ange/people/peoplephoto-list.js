/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peoplephoto-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peoplephoto-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.selectIdx = 0;

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        $scope.search = {};


        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "작성자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

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

            // TODO: CATEGORY에서 조회할것
            $scope.tabs = $scope.menu.SUB_MENU_INFO;
            //$scope.tabs = null;

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'PHOTO';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                .catch(function(error){});

            // 게시글 전체 건수
            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;

                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;
                })
                .catch(function(error){$scope.list = ""; $scope.TOTAL_COUNT = 0;});

            // 카테고리 탭 셋팅
            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){
                    $scope.category_list = data;
                })
                .catch(function(error){$scope.category_list = ""; });
        };

        /********** 이벤트 **********/
        // 탭 클릭 이동
        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;
            if(idx == 0){
                $scope.search.CATEGORY_NO = '';
            }else{
               $scope.search.CATEGORY_NO = category_no;
            }

            $scope.getPeopleBoardList();
        };

        // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/board/view/1');
        };

        /********** 화면 초기화 **********/
        //$scope.init();

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.COMM_NO = $scope.menu.COMM_NO;

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC';
            //$scope.search.FILE = true;
            $scope.search.FILE = "Y";

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;
                })
                .catch(function(error){$scope.list = ""; $scope.SEARCH_TOTAL_COUNT = 0});
        };

        // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (key) {

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

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

        $scope.init();
        $scope.getPeopleBoardList();

    }]);
});
