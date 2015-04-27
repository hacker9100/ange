/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : storemall-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('storemall-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD, CONSTANT) {

        $scope.selectIdx = 0;

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 9;
        $scope.TOTAL_COUNT = 0;

        $scope.list = [];

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.list = [];
            $scope.click_showPeopleBoardList();
        };

        // 검색어 조건
        var condition = [{name: "상품명", value: "PRODUCT_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        if ($stateParams.menu == 'mileagemall') {
            $scope.community = "마일리지몰";
            $scope.search.PRODUCT_GB = 'MILEAGE';
            $scope.search.SOLD_OUT = 'N';
            $scope.menu = 'mileagemall';
        } else {
            $scope.community = "앙쥬커머스";
            $scope.search.PRODUCT_GB = 'CUMMERCE';
            $scope.search.SOLD_OUT = 'N';
            $scope.menu = 'cummerce';
        }


        // 초기화
        $scope.init = function(session) {

            //$scope.selectIdx = 'ALL';
            $scope.SEARCH_NOW_CATEGORY = '전체';

            $scope.getList('ange/product', 'list', {}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;

                    $scope.TOTAL_COUNT = total_cnt;
                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0;});

            $scope.search.COMM_NO = 'STORE';

            if($stateParams.menu == 'mileagemall'){
                $scope.search.PARENT_NO = 1;
            }else{
                $scope.search.PARENT_NO = 2;
            }

            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){
                    $scope.category_list = data;
                })
                ['catch'](function(error){$scope.category_list = ""; });
        };

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

        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;
            if(idx == 0){
                $scope.search.CATEGORY_NO = '';

                // 페이징
                $scope.PAGE_NO = 1;
                $scope.PAGE_SIZE = 9;
                $scope.SEARCH_TOTAL_COUNT = 0;

                // 초기화 후 조회
                $scope.list = [];
                $scope.click_showPeopleBoardList();

                $scope.SEARCH_NOW_CATEGORY = '전체';

            }else{
                $scope.search.CATEGORY_NO = category_no;

                // 페이징
                $scope.PAGE_NO = 1;
                $scope.PAGE_SIZE = 9;
                $scope.SEARCH_TOTAL_COUNT = 0;

                // 초기화 후 조회
                $scope.list = [];
                $scope.click_showPeopleBoardList();

                $scope.SEARCH_NOW_CATEGORY = category.CATEGORY_NM;
            }
        };

        $scope.click_selectCategory = function(idx, category) {
            $scope.category[idx] = category;
            console.log($scope.category[idx]);
            $scope.list = [];
            $scope.click_showPeopleBoardList();
        };

        /********** 이벤트 **********/
            // 게시판 목록 이동
        $scope.click_showPeopleBoardList = function () {

            $scope.search.CATEGORY = [];

            if ($scope.category != '') {
                console.log($scope.category)
                for (var i in $scope.category) {
                    if ($scope.category[i] != null) $scope.search.CATEGORY.push($scope.category[i]);
                }
            }

            $scope.search.FILE = true;
            $scope.getList('ange/product', 'list', {}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    for(var i in data) {

                        data[i].PRICE  = data[i].PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        var img = CONSTANT.BASE_URL + '/storage/product/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'PRODUCT';
                        data[i].FILE = img;

                        $scope.list.push(data[i]);
                    }
                })
                ['catch'](function(error){$scope.list = ""; $scope.SEARCH_TOTAL_COUNT = 0;});

        };

        /********** 이벤트 **********/
            // 탭 클릭 이동
//        $scope.click_selectTab = function (idx) {
//            $scope.selectIdx = idx;
//
//            if ($stateParams.menu == 'mileagemall') {
//                $scope.search.PRODUCT_GB = 'MILEAGE';
//            } else if ($stateParams.menu == 'cummerce') {
//                $scope.search.PRODUCT_GB = 'CUMMERCE';
//            }
//
//            if(idx == 0){
//                $scope.search.PRODUCT_TYPE = 'ALL';
//                $scope.selectPhoto = 'ALL';
//            }else{
//                $scope.search.PRODUCT_TYPE = $scope.selectIdx;
//            }
//
//            $scope.PAGE_NO = 1;
//            $scope.PAGE_SIZE = 9;
//            $scope.SEARCH_TOTAL_COUNT = 0;
//
//            $scope.list = [];
//            $scope.click_showPeopleBoardList();
//        };

        // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (item) {
//            if (item.SUM_IN_CNT <= item.SUM_OUT_CNT) {
//                dialogs.notify('알림', '품절된 상품입니다.', {size: 'md'});
//                return;
//            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+item.NO);
        };
        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.list = [];
            $scope.click_showPeopleBoardList();
        }

        // 후기 작성 화면이동
        $scope.click_review = function (){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/moms/storereview/edit/0');
        }

//        $scope.init();
//        $scope.click_showPeopleBoardList();

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.click_showPeopleBoardList)
            ['catch']($scope.reportProblems);


    }]);
});
