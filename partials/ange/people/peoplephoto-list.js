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
    controllers.controller('peoplephoto-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, CONSTANT) {

        $scope.tmpMenu = $stateParams.menu;
        $scope.selectIdx = 0;

        $scope.search = {};

        // 페이징
        //$scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 9;
        $scope.SEARCH_TOTAL_COUNT = 0;

        $scope.list = [];

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.list = [];
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getPeopleBoardList();
        };

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT+BODY"} , {name: "작성자", value: "NICK_NM"}];

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
            //$scope.tabs = $scope.menu.SUB_MENU_INFO;
            //$scope.tabs = null;

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
//            $scope.search.COMM_GB = 'PHOTO';
//            $scope.search.BOARD_ST = 'D';

            $scope.getItem('ange/community', 'item', $scope.menu.COMM_NO, $scope.search, true)
                .then(function(data){
                    $scope.COMM_MG_NM = data.COMM_MG_NM;

                    var file = data.FILES;

                    console.log(data.FILES);
                    for(var i in file) {

                        console.log(file[i]);
                        if (file[i].FILE_GB == 'MAIN')
                            $scope.main_img = CONSTANT.BASE_URL + file[i].PATH + file[i].FILE_ID;
//                            $scope.main_img = "http://localhost" + file[i].PATH + file[i].FILE_ID;
                    }
                })
                ['catch'](function(error){});

            $scope.search.FILE = true;
            // 게시글 전체 건수
            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;

                    $scope.PHOTO_TOTAL_COUNT = total_cnt;
                })
                ['catch'](function(error){$scope.PHOTO_TOTAL_COUNT = 0;});

//            $scope.search.TOTAL_COUNT = true;
            // 카테고리 탭 셋팅
            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){

                    for(var i in data) {

                        //console.log(data[i].TOTAL);
                        if (data[i].TOTAL != null) {

                            console.log(data[i].TOTAL.TOTAL_COUNT);
                            var file_cnt = data[i].TOTAL.TOTAL_COUNT;
                            data[i].TOTAL_COUNT = file_cnt;

                        }
                    }

                    $scope.category_list = data;
                })
                ['catch'](function(error){$scope.category_list = ""; });

            // 검색조건유지
            var getParam = function(key){
                var _parammap = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    _parammap[decode(arguments[1])] = decode(arguments[2]);
                });

                return _parammap[key];
            };

            console.log('getParam("page_no") = '+getParam("page_no"));

            if(getParam("page_no") == undefined){
                $scope.PAGE_NO = 1;
            }else{
                $scope.PAGE_NO = getParam("page_no");
                if(getParam("condition") != undefined){
                    $scope.search.CONDITION.value = getParam("condition");
                }
                $scope.search.KEYWORD = getParam("keyword");
            }
        };

        /********** 이벤트 **********/
        // 탭 클릭 이동
        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;
            if(idx == 0){
                $scope.search.CATEGORY_NO = '';

                // 페이징
                //$scope.PAGE_NO = 1;
                $scope.PAGE_SIZE = 9;
                $scope.SEARCH_TOTAL_COUNT = 0;

                // 초기화 후 조회
                $scope.list = [];
                $scope.getPeopleBoardList();
            }else{
                $scope.search.CATEGORY_NO = category_no;

                // 페이징
                //$scope.PAGE_NO = 1;
                $scope.PAGE_SIZE = 9;
                $scope.SEARCH_TOTAL_COUNT = 0;

                // 초기화 후 조회
                $scope.list = [];
                $scope.getPeopleBoardList();
            }
        };

        // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/board/view/1');
        };

        /********** 화면 초기화 **********/
        //$scope.init();

        $scope.isLoding = true;

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.COMM_NO = $scope.menu.COMM_NO;

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';
            //$scope.search.FILE = true;
            $scope.search.FILE = true;

            $scope.isLoding = true;

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    for(var i in data) {

                        var img = CONSTANT.BASE_URL + '/storage/board/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'BOARD';
                        data[i].FILE = img;
                        $scope.list.push(data[i]);

                        console.log($scope.list);
                    }

                    $scope.isLoding = false;

                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    //alert(i + " : " + data[0].CATEGORY_NM + "(" +search_total_cnt + ")");
                    var search_now_category = data[0].CATEGORY_NM;
                    $scope.SEARCH_NOW_CATEGORY = search_now_category;
                    $scope.TOTAL_PAGES = Math.ceil($scope.SEARCH_TOTAL_COUNT/$scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.list = ""; $scope.SEARCH_TOTAL_COUNT = 0; $scope.isLoding = false;});
        };

        // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (key) {

            $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
            $rootScope.CONDITION = $scope.search.CONDITION.value;
            $rootScope.KEYWORD = $scope.search.KEYWORD;

            console.log($rootScope.CONDITION);
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.list = [];
            $scope.PAGE_NO = 1;
            $scope.getPeopleBoardList();
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);

        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);
    }]);
});
