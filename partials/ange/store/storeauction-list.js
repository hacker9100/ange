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
    controllers.controller('storeauction-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.selectIdx = 0;

        $scope.search = {};
        $scope.item= {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.productsList = [];

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
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


        $scope.community = "마일리지 경매소";
        $scope.search.PRODUCT_GB = 'AUCTION';
        $scope.menu = 'auction';

        // 초기화
        $scope.init = function(session) {

            $scope.selectIdx = 'ALL';
/*         if($rootScope.uid == '' || $rootScope.uid == null){
             dialogs.notify('알림', '로그인 후 이용 가능합니다.', {size: 'md'});
             $location.url('/store/home');
         }*/


        $scope.getList('ange/product', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
            .then(function(data){
                var total_cnt = data[0].TOTAL_COUNT;

                $scope.TOTAL_COUNT = total_cnt;

                /*$scope.total(total_cnt);*/
                $scope.list = data;
            })
            .catch(function(error){$scope.list = ""; $scope.TOTAL_COUNT = 0;});
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

        /********** 이벤트 **********/
        $scope.click_showStoreAuctionList = function(){
            $scope.search.FILE = true;
            $scope.search.ORDER_YN = 'N';

            $scope.getList('ange/product', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
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
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        // 지난 공구 게시판 목록
        $scope.click_showPeopleBoardList = function () {

            $scope.search.FILE = true;
            $scope.search.ORDER_YN = 'Y';

            $scope.getList('ange/product', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
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
                    $scope.prevlist = data;
                })
                .catch(function(error){$scope.prevlist = ""; $scope.SEARCH_TOTAL_COUNT = 0;});

        };

        /********** 이벤트 **********/
            // 탭 클릭 이동
        $scope.click_selectTab = function (idx) {
            $scope.selectIdx = idx;

            if ($stateParams.menu == 'auction') {
                $scope.search.PRODUCT_GB = 'AUCTION';
            }

            if(idx == 0){
                $scope.search.PRODUCT_TYPE = 'ALL';
                $scope.selectPhoto = 'ALL';
            }else{
                $scope.search.PRODUCT_TYPE = $scope.selectIdx;
            }

            $scope.click_showPeopleBoardList();
        };

        // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (key) {

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.click_showPeopleBoardList();
        }


        // 경매 참여
        $scope.click_auction = function (item){

            $scope.item.NO = item;

            $scope.insertItem('ange/auction', 'item', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 참여했습니다.', {size: 'md'});

                    $scope.click_showStoreAuctionList();
                    $scope.click_showPeopleBoardList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        //즉시 구매
        $scope.click_addcart = function (list){

            if($rootScope.uid == '' || $rootScope.uid == null){

                //$rootScope.cartlist = list;
                $scope.productsList.push({"MAIN_FILE": list[0].MAIN_FILE, "PRODUCT_NO" : list[0].NO, "PRODUCT_NM" : list[0].PRODUCT_NM , "PRICE" : list[0].DIRECT_PRICE, "PRODUCT_CNT" : 1, "TOTAL_PRICE" : list[0].DIRECT_PRICE, "DELEIVERY_PRICE" : list[0].DELEIVERY_PRICE, "DELEIVERY_ST" : list[0].DELEIVERY_ST, "PRODUCT_GB" : list[0].PRODUCT_GB});
                $rootScope.cartlist = $scope.productsList;
                alert('장바구니에 등록되었습니다');

                $location.url('store/cart/list/'+$rootScope.cartlist);
            }else{

                console.log(list[0].NO);
                $scope.productsList.push({"MAIN_FILE": list[0].MAIN_FILE, "PRODUCT_NO" : list[0].NO, "PRODUCT_NM" : list[0].PRODUCT_NM , "PRICE" : list[0].DIRECT_PRICE, "PRODUCT_CNT" : 1, "TOTAL_PRICE" : list[0].DIRECT_PRICE, "DELEIVERY_PRICE" : list[0].DELEIVERY_PRICE, "DELEIVERY_ST" : list[0].DELEIVERY_ST, "PRODUCT_GB" : list[0].PRODUCT_GB});

                $scope.item.CART = $scope.productsList;

                $scope.insertItem('ange/cart', 'item', $scope.item, false)
                    .then(function(){
                        //dialogs.notify('알림', '장바구니에 등록되었습니다. 계속 쇼핑 하시겠습니까?', {size: 'md'});
                        //$scope.openViewScrapModal($scope.item.CART, 'lg');

                        alert('장바구니에 등록되었습니다');

                        $location.url('store/cart/list/'+$stateParams.menu);
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        }

        $scope.init();
        $scope.click_showStoreAuctionList();
        $scope.click_showPeopleBoardList();

    }]);
});
