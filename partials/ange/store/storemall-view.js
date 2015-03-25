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
    controllers.controller('storemall-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', 'CONSTANT', function ($scope,$rootScope, $stateParams, $location, dialogs, UPLOAD,CONSTANT) {

        // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};

        $scope.productsList = [];
        $scope.product = {};

        $scope.selectIdx = 1;

        // 페이징
        $scope.reviewList = [];
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 5;
        $scope.TOTAL_COUNT = 0;

        $scope.search = {};

        //$("#checkProduct").attr("checked", false);
        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

//            $("ul.nav-tabs li").click(function () {
//
//                $("ul.tabs li").removeClass("active");
//                $(this).addClass("active");
//                $(".tab_content").hide();
//                var activeTab = $(this).attr("rel");
//                $("#" + activeTab).fadeIn();
//            });

        });

        // 탭 선택시 해당 화면으로 포커스 이동
        $scope.click_selectTab = function (idx) {
            $scope.selectIdx = idx;

            $("#tabs-"+idx)[0].scrollIntoView();  // O, jQuery  이용시
        };

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'mileagemall') {
                $scope.community = "마일리지몰";
                $scope.menu = 'mileage';
                $scope.TOTAL_MILEAGE = 0;
                $scope.TOTAL_PRICE = 0;
            } else if ($stateParams.menu == 'cummerce') {
                $scope.community = "앙쥬커머스";
                $scope.menu = 'cummerce';
                $scope.TOTAL_MILEAGE = 0;
                $scope.TOTAL_PRICE = 0;
            }

            // 리뷰 리스트
            $scope.search.TARGET_GB = 'STORE';
            $scope.search.TARGET_NO = $stateParams.id;

        };

        // 리뷰 리스트
        $scope.getReviewList = function (){
            $scope.search.FILE = true;

            $scope.getList('ange/review', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, false)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    for(var i in data) {
                        // /storage/review/

                        var img = UPLOAD.BASE_URL + '/storage/review/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'REVIEW';
                        data[i].FILE = img;

                        var source = data[i].BODY;
                        var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

                        source = source.replace(pattern, '');
                        source = source.replace(/&nbsp;/ig, '');
                        source = source.trim();

                        data[i].BODY = source;

                        $scope.reviewList.push(data[i]);
                    }
                })
                ['catch'](function(error){$scope.reviewList = ""; $scope.TOTAL_COUNT=0;});
        }

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);

            // 페이징
//            $scope.PAGE_NO = 1;
//            $scope.PAGE_SIZE = 10;
//            $scope.TOTAL_COUNT = 0;

            $scope.reviewList = [];
            $scope.getReviewList();

        };

        $scope.$watch('product.CNT', function() {
            if ($scope.product.CNT != undefined) {
                if ($stateParams.menu == 'mileagemall') {

                    $scope.TOTAL_MILEAGE = 0;
                    $scope.TOTAL_PRICE = 0;
                } else if ($stateParams.menu == 'cummerce') {
                    $scope.TOTAL_PRICE = 0;
                    $scope.TOTAL_MILEAGE = 0;
                }
            } else {
                if ($stateParams.menu == 'mileagemall') {
                    $scope.TOTAL_MILEAGE = 0;
                } else if ($stateParams.menu == 'cummerce') {
                    $scope.TOTAL_PRICE = 0;
                }
            }
        });

        // 상품 추가
        $scope.addProductList = function (products, item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 상품선택이 가능합니다.', {size: 'md'});
                //$("#checkProduct").attr("checked",false);
                return;
            }

            if(products.NO == null){
                $scope.productsList = [];
            }else{
                $scope.product.CNT = 1;
                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 0, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELEIVERY_PRICE" : item.DELEIVERY_PRICE, "DELEIVERY_ST" : item.DELEIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});
                //, "SUM_IN_OUT" : item.SUM_IN_OUT}


                // , "RECEIPTOR_NM" : $rootScope.user_info.USER_NM, "RECEIPT_ADDR" :$rootScope.user_info.ADDR, "RECEIPT_ADDR_DETAIL" : $rootScope.user_info.ADDR_DETAIL, "RECEIPT_PHONE" : $rootScope.user_info.PHONE_2
            }
        }

        // 체크박스 상품 추가
        $scope.addcheckboxProductList = function (products, item){

            //alert('');
            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 상품선택이 가능합니다.', {size: 'md'});
                $("#checkProduct").attr("checked",false);
                return;
            }

            $scope.product.CNT = 1;
            $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 0, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELEIVERY_PRICE" : item.DELEIVERY_PRICE, "DELEIVERY_ST" : item.DELEIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});

//            if($scope.checkboxproduct == 'Y'){
//                $scope.product.CNT = 1;
//                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 0, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELEIVERY_PRICE" : item.DELEIVERY_PRICE, "DELEIVERY_ST" : item.DELEIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});
//            }else{
//                $scope.productsList = [];
//            }

//            if($("#checkProduct").is(":checked")){
//                $scope.product.CNT = 1;
//                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 0, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELEIVERY_PRICE" : item.DELEIVERY_PRICE, "DELEIVERY_ST" : item.DELEIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});
//                //, "SUM_IN_OUT" : item.SUM_IN_OUT
//            }else{
//                $scope.productsList = [];
//            }

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
//
//        });

        // 상품 삭제
        $scope.click_removeProduct = function (idx) {
            $scope.productsList.splice(idx, 1);

            if ($stateParams.menu == 'mileagemall') {
                $scope.TOTAL_MILEAGE -= $scope.item.PRICE;
                $scope.TOTAL_PRICE = 0;
            } else if ($stateParams.menu == 'cummerce') {
                $scope.TOTAL_PRICE -= $scope.item.PRICE;
                $scope.TOTAL_MILEAGE = 0;
            }

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

                                //files[i].PATH
                                var img = UPLOAD.BASE_URL + '/storage/product/' + 'thumbnail/' + files[i].FILE_ID;
                                data.MAIN_FILE = img;
                            }
                        }

                        $scope.products = data.PRODUCTS;
                        $scope.item = data;

                        if($scope.products == null){
                            $scope.checkboxproduct = 'Y';
                            $scope.addcheckboxProductList($scope.item, $scope.item);
                        }

                        $scope.PRICE = data.PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                        $scope.DELEIVERY_PRICE = data.DELEIVERY_PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 장바구니추가
        $scope.click_addcart = function (cnt){

            if($stateParams.menu == 'mileagemall'){
                if($scope.total() > $rootScope.mileage){
                    dialogs.notify('알림', '잔여 마일리지가 부족합니다', {size: 'md'});
                    return;
                }
            }

            if(cnt < 0){
                dialogs.notify('알림', '품절된 상품입니다', {size: 'md'});
                return;
            }

            $scope.item.CART = $scope.productsList;

            $scope.insertItem('ange/cart', 'item', $scope.item, false)
                .then(function(){

                    if (confirm("찜목록에 등록되었습니다. 찜목록으로 이동하시겠습니까?") == true){    //확인
                        $location.url('store/order/list');
                    }else{   //취소
                        return;
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 전체 금액 계산
        $scope.addSumPrice = function(price, cnt, index){
            if(cnt > 2){
                dialogs.notify('알림', '마일리지 몰에서는 2개까지 구매가 가능합니다', {size: 'md'});
                $scope.productsList[index].PRODUCT_CNT = 0;
                return;
            }

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


        // 주문
        $scope.click_addOrder = function(){

            $rootScope.orderlist = [];
            $rootScope.orderlist = $scope.productsList;

            var cnt = $scope.productsList.length;


            console.log($rootScope.orderlist)
            if($stateParams.menu == 'mileagemall'){
                if(cnt > 2){
                    dialogs.notify('알림', '마일리지 몰에서는 2개까지 구매가 가능합니다', {size: 'md'});
                    return;
                }

                if($scope.TOTAL_MILEAGE > $rootScope.mileage){
                    dialogs.notify('알림', '잔여 마일리지가 부족합니다', {size: 'md'});
                    return;
                }
            }

            $location.url('store/order/list/'+$rootScope.orderlist);
        }

        // 목록 버튼 클릭
        $scope.click_showPeoplePhotoList = function () {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
        }

        // 후기 작성 화면이동
        $scope.click_review = function (){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }

            $location.url('/moms/storereview/edit/0');
        }

        // 조회 화면 이동
        $scope.click_showViewReview = function (key) {

            $location.url('/moms/productreview/view/'+key);

        };

        // 다음 슬라이드
        $scope.click_slickPrev = function() {
            angular.element('#product').slickPrev();
        };

        // 이전 슬라이드
        $scope.click_slickNext = function() {
            angular.element('#product').slickNext();
        };

        // 선택
        $scope.click_showView = function (item) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+item.NO);
        };

        // 슬라이드 이미지 조회
        $scope.getProductList = function (api) {
            $scope.getList('ange/product', 'list', {NO:0, SIZE:9}, {FILE: true, PRODUCT_GB: 'MILEAGE', NOT_PRODUCT_NO: $stateParams.id}, true)
                .then(function(data){
                    for (var i in data) {
                        data[i].PRODUCT_FILE = CONSTANT.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].URL = $scope.option.url+"/view/"+data[i].NO;
                    }

                    $scope.list = data;
                })
                ['catch'](function(error){$scope.list = []});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoard)
            .then($scope.getReviewList)
            .then($scope.getProductList)
            ['catch']($scope.reportProblems);
//        $scope.init();
//        $scope.getPeopleBoard();
//        $scope.getReviewList();
//        $scope.getProductList();
        //s$scope.addSumPrice($scope.item.PRICE, 1 , 0);

    }]);
});
