/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : storemall-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('storeauction-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope,$rootScope, $stateParams, $location, dialogs, UPLOAD) {

        // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};

        $scope.productsList = [];
        $scope.product = {};

        $scope.selectIdx = 1;

        var d = new Date();

        // 현재 시간
        var hour = d.getHours();
//        console.log(d.getHours());
//        console.log(d.getMinutes());
//        console.log(d.getSeconds());

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

        $scope.click_selectTab = function (idx) {
            $scope.selectIdx = idx;

            $("#tabs-"+idx)[0].scrollIntoView();  // O, jQuery  이용시
        };

        // 초기화
        $scope.init = function(session) {

            $scope.community = "마일리지 경매소";
            $scope.menu = 'auction';
            $scope.TOTAL_MILEAGE = 0;
            $scope.TOTAL_PRICE = 0;


            $scope.tabs =  [{title: '상품안내'},{title: '상품후기'},{title: '관련상품'},{title: '주의사항'}];

        };

        // 상품 추가
        $scope.addProductList = function (products, item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 상품선택이 가능합니다.', {size: 'md'});
                return;
            }

            if(products.NO == null){
                $scope.productsList = [];
            }else{
                $scope.product.CNT = 1;

                // TOTAL_PRICE 경매 가격으로 으로 데이터 넣음
                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 1, "TOTAL_PRICE" : item.AUCTION_AMOUNT, "PARENT_NO" : products.PARENT_NO, "DELEIVERY_PRICE" : item.DELEIVERY_PRICE, "DELEIVERY_ST" : item.DELEIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});
                 // , "RECEIPTOR_NM" : $rootScope.user_info.USER_NM, "RECEIPT_ADDR" :$rootScope.user_info.ADDR, "RECEIPT_ADDR_DETAIL" : $rootScope.user_info.ADDR_DETAIL, "RECEIPT_PHONE" : $rootScope.user_info.PHONE_2
            }
        }

        // 체크박스일때 상품 추가
        $scope.addcheckboxProductList = function (products, item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 상품선택이 가능합니다.', {size: 'md'});
                $("#checkProduct").attr("checked",false);
                return;
            }

            if($("#checkProduct").is(":checked")){
                $scope.product.CNT = 1;
                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 1, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELEIVERY_PRICE" : item.DELEIVERY_PRICE, "DELEIVERY_ST" : item.DELEIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB, "SUM_IN_OUT" : item.SUM_IN_OUT});
            }else{
                $scope.productsList = [];
            }

        }

//        $(document).ready(function(){
//
//            $("#checkProduct").click(function(){
//                if(!$("#checkProduct").is(":checked")){
//                    $scope.addProductList($scope.item, $scope.item);
//                }else{
//                    $scope.productsList = [];
//                    //$("#checkProduct").attr("checked", false);
//                }
//
//            });
//        });

        // 상품 삭제
        $scope.click_removeProduct = function (idx) {
            $scope.productsList.splice(idx, 1);
            $("#checkProduct").attr("checked", false);
        };

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('ange/product', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        var files = data.FILES;
                        for(var i in files) {
                            if (files[i].FILE_GB == 'MAIN') {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                                var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                data.MAIN_FILE = img;
                            }
                        }

                        $scope.products = data.PRODUCTS;

                        $scope.item = data;

                        $scope.PRICE = data.PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        $scope.DELEIVERY_PRICE = data.DELEIVERY_PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        $scope.DIRECT_PRICE = data.DIRECT_PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 경매 참여
        $scope.click_auction = function (item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 경매 참여가 가능합니다.', {size: 'md'});
                return;
            }

            if(hour < 10 || 15 < hour){
                dialogs.notify('알림', '경매 참여 시간이 아닙니다.', {size: 'md'});
                return;
            }

            $scope.item.NO = item;
            $scope.insertItem('ange/auction', 'item', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 참여했습니다.', {size: 'md'});
                    $scope.getPeopleBoard();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        //찜
        $scope.click_addcart = function (){

            $scope.item.CART = $scope.productsList;

            $scope.insertItem('ange/cart', 'item', $scope.item, false)
                .then(function(){
                    alert('찜목록으로 이동합니다');
                    $location.url('store/cart/list/'+$stateParams.menu);
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        //즉시 구매
        $scope.click_adddirectcart = function (list){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 경매 참여가 가능합니다.', {size: 'md'});
                return;
            }

            if(hour < 10 || 15 < hour){
                dialogs.notify('알림', '구매 시간이 아닙니다.', {size: 'md'});
                return;
            }

            // TOTAL_PRICE 즉시 구매 가격으로 데이터 넣음
            $scope.productsList.push({"MAIN_FILE": list.MAIN_FILE, "PRODUCT_NO" : list.NO, "PRODUCT_NM" : list.PRODUCT_NM , "PRICE" : list.DIRECT_PRICE, "PRODUCT_CNT" : 1, "TOTAL_PRICE" : list.DIRECT_PRICE, "DELEIVERY_PRICE" : list.DELEIVERY_PRICE, "DELEIVERY_ST" : list.DELEIVERY_ST, "PRODUCT_GB" : list.PRODUCT_GB});

            $scope.item.CART = $scope.productsList;

            $scope.insertItem('ange/cart', 'item', $scope.item, false)
                .then(function(){
                    alert('찜목록으로 이동합니다');
                    $location.url('store/cart/list/'+$stateParams.menu);
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        // 전체 금액 계산
        $scope.addSumPrice = function(price, cnt, index){
            $scope.productsList[index].TOTAL_PRICE += price * cnt;

        }

        // 전체 합계
        $scope.total = function() {

            var total = 0;
            angular.forEach($scope.productsList, function(item) {
                total += item.PRODUCT_CNT * item.PRICE;
            })

            return total;
        }

        // 목록 버튼 클릭
        $scope.click_showPeoplePhotoList = function () {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
        }


        /********** 화면 초기화 **********/
        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getPeopleBoard)
         ['catch']($scope.reportProblems);
//        $scope.init();
//        $scope.getPeopleBoard();

    }]);
});
