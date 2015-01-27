/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : storecart-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('storecart-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.search = {};
        $scope.item = {};

       /* $('.mileagelist').removeClass('hide');
        $('.cummercelist').addClass('hide');*/

        if($rootScope.uid == '' || $rootScope.uid == null){
            $scope.mileage = false;
            $scope.cummerce = true;
        }else {
            $scope.mileage = true;
            $scope.cummerce = false;
        }

        $(function(){
            $scope.click_cartlist = function(){

                $('input[name="cartlist"]').change(function(){
                    if($(this).val() == "mileage"){
                        /*$('.mileagelist').removeClass('hide');
                        $('.cummercelist').addClass('hide');*/
                        $scope.mileage = true;
                        $scope.cummerce = false;
                    } else if ($(this).val() == "cummerce"){
                        /*$('.cummercelist').removeClass('hide');
                        $('.mileagelist').addClass('hide');*/
                        $scope.mileage = false;
                        $scope.cummerce = true;
                    }
                });
            }
        });

         // 초기화
        $scope.init = function() {

            if($rootScope.uid == '' || $rootScope.uid == null){
                $scope.step = '01';
            }else {
                $scope.step = '02';
            }
            $scope.community = "찜목록";

        };

        $scope.click_cartlist = function(){

            $('input[name="cartlist"]').change(function(){
                if($(this).val() == "mileage"){
                    /*$('.mileagelist').removeClass('hide');
                     $('.cummercelist').addClass('hide');*/
                    $scope.mileage = true;
                    $scope.cummerce = false;
                } else if ($(this).val() == "cummerce"){
                    /*$('.cummercelist').removeClass('hide');
                     $('.mileagelist').addClass('hide');*/
                    $scope.mileage = false;
                    $scope.cummerce = true;
                }
            });
        }

        // 마일리지 장바구니 리스트
        $scope.cartList = function (){

            if($rootScope.uid == null || $rootScope.uid == ''){
                $scope.list = $rootScope.cartlist;
            }else{
                $scope.search.FILE = true;

                $scope.search.PRODUCT_GB = "mileage";
                $scope.getList('ange/cart', 'list', {}, $scope.search, true)
                    .then(function(data){
                        var total_cnt = data[0].TOTAL_COUNT;
                        $scope.TOTAL_COUNT = total_cnt;

                        $scope.sum_price = 0;
                        for(var i in data) {
                            if (data[i].FILE != null) {
                                var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                                data[i].MAIN_FILE = img;

                            }
                            $scope.sum_price += parseInt(data[i].TOTAL_PRICE);
                        }
                        $scope.total_mileage = parseInt($scope.user_info.MILEAGE.REMAIN_POINT - $scope.sum_price);


                        $scope.mileagelist = data;
                    })
                    .catch(function(error){$scope.list = ""; $scope.TOTAL_COUNT = 0;});
            }
        }

        // 커머스 장바구니 리스트
        $scope.cartCummerceList = function (){

            if($rootScope.uid == null || $rootScope.uid == ''){
                $scope.list = $rootScope.cartlist;
            }else{
                $scope.search.FILE = true;

                $scope.search.PRODUCT_GB = "cummerce";

                $scope.getList('ange/cart', 'list', {}, $scope.search, true)
                    .then(function(data){
                        var total_cnt = data[0].TOTAL_COUNT;
                        $scope.TOTAL_COUNT = total_cnt;

                        $scope.sum_price = 0;
                        for(var i in data) {
                            if (data[i].FILE != null) {
                                var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                                data[i].MAIN_FILE = img;

                            }
                            $scope.sum_price += parseInt(data[i].TOTAL_PRICE);
                        }
                        $scope.total_mileage = parseInt($scope.user_info.MILEAGE.REMAIN_POINT - $scope.sum_price);


                        $scope.cummercelist = data;
                    })
                    .catch(function(error){$scope.cummercelist = ""; $scope.TOTAL_COUNT = 0;});
            }
        }

        $scope.click_sumprice = function(idx){

            $scope.sum_price = 0;
            $scope.total_mileage = 0;

            if($("input:checkbox[id='name"+idx+"']").is(":checked")){
                $scope.sum_price += parseInt($scope.list[idx].TOTAL_PRICE);
                $scope.total_mileage = parseInt($scope.user_info.MILEAGE.REMAIN_POINT - $scope.sum_price);
            }else{
                $scope.sum_price -= parseInt($scope.list[idx].TOTAL_PRICE);
                $scope.total_mileage = parseInt($scope.user_info.MILEAGE.REMAIN_POINT - $scope.sum_price);
            }
        }


        // 선택 상품 삭제
        $scope.click_removeCartProduct = function (idx){

            if($rootScope.uid != null && $rootScope.uid != ''){
                var no = $scope.list[idx].NO;
                $scope.CART_NO = no;

                $scope.deleteItem('ange/cart', 'item', $scope.CART_NO, true)
                    .then(function(){
                        $scope.list.splice(idx, 1);
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }else{
                $scope.list.splice(idx, 1);
            }
/*            var dialog = dialogs.confirm('알림', '선택 상품을 삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('ange/cart', 'item', $scope.CART_NO, true)
                    .then(function(){
                        $scope.list.splice(idx, 1);
                        $scope.cartList();
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });*/
        }

        // 커머스 상품 주문
        $scope.click_cummerce_reg = function (list , idx){

            $rootScope.orderlist = [];

            $rootScope.orderlist.push(list[idx]);

            console.log($rootScope.orderlist);

            $scope.step = '02';
            $scope.orderlist();
        }

        // 선택 상품 주문
        $scope.click_select_reg = function(list){

            var idx = 0;
            var count = $("input:checkbox[name='name']:checked").length;


            if(count == 0){
                dialogs.notify('알림', '상품을 선택해 주세요', {size: 'md'});
                return;
            }

            if($scope.product_gb == 'mileage'){
                if(count > 2){
                    dialogs.notify('알림', '마일리지 몰에서는 2개까지 구매가 가능합니다', {size: 'md'});
                    return;
                }

                if($scope.total_mileage < 0){
                    dialogs.notify('알림', '잔여 마일리지가 부족합니다', {size: 'md'});
                    return;
                }
            }

            $rootScope.orderlist = [];
            for(var i =0; i<list.length; i++){

                if($("input:checkbox[id='name"+i+"']").is(":checked")){
                    idx = i;
                    $rootScope.orderlist.push(list[idx]);
                }
            }


            $scope.step = '02';
            $scope.orderlist();
        }

        // 전체 상품 주문
        $scope.click_reg = function (list){

            $rootScope.orderlist = list;

            var cnt = list.length;
            if($scope.product_gb == 'mileage'){
                if(cnt > 2){
                    dialogs.notify('알림', '마일리지 몰에서는 2개까지 구매가 가능합니다', {size: 'md'});
                    return;
                }

                if($scope.total_mileage < 0){
                    dialogs.notify('알림', '잔여 마일리지가 부족합니다', {size: 'md'});
                    return;
                }
            }

            $scope.step = '02';
            $scope.orderlist();
        }

        // 주문리스트
        $scope.orderlist = function (){

            console.log($rootScope.user_info);
            console.log($rootScope.uid);

            $scope.list = $rootScope.orderlist;

            if($rootScope.uid != '' && $rootScope.uid != null){
                $scope.item.USER_ID = $rootScope.user_info.USER_ID;
                $scope.item.RECEIPTOR_NM = $rootScope.user_info.USER_NM;
                $scope.item.RECEIPT_PHONE = $rootScope.user_info.PHONE_2;
                $scope.item.RECEIPT_ADDR = $rootScope.user_info.ADDR;
                $scope.item.RECEIPT_ADDR_DETAIL = $rootScope.user_info.ADDR_DETAIL;

                $scope.item.RECEIPTOR_NM1 = $rootScope.user_info.USER_NM;
                $scope.item.RECEIPT_PHONE1 = $rootScope.user_info.PHONE_2;
                $scope.item.RECEIPT_ADDR1 = $rootScope.user_info.ADDR;
                $scope.item.RECEIPT_ADDR_DETAIL1 = $rootScope.user_info.ADDR_DETAIL;
            }


            $scope.TOTAL_SUM_PRICE = 0;
            $scope.TOTAL_DELEIVERY_PRICE = 0;
            $scope.TOTAL_PRICE = 0;
            for(var i=0; i<$scope.list.length; i++){

                $scope.TOTAL_SUM_PRICE += parseInt($scope.list[i].TOTAL_PRICE);
                $scope.TOTAL_DELEIVERY_PRICE = parseInt($scope.list[i].DELEIVERY_PRICE);
                $scope.DELEIVERY_ST = $scope.list[i].DELEIVERY_ST;
            }

            if($scope.DELEIVERY_ST == 1){
                $scope.TOTAL_PRICE = parseInt($scope.TOTAL_SUM_PRICE);
            }else if($scope.DELEIVERY_ST == 2){
                $scope.TOTAL_PRICE = parseInt($scope.TOTAL_SUM_PRICE) + parseInt($scope.TOTAL_DELEIVERY_PRICE);
            }
        }

        // 이전페이지
        $scope.prev_step = function (){
            $scope.step = 1;
        }

        // 사용자 기존 정보 or 새주소
        $scope.click_basic = function(val){
            if(val == 'Y'){
                $scope.item.USER_ID = $rootScope.user_info.USER_ID;
                $scope.item.RECEIPTOR_NM = $rootScope.user_info.USER_NM;
                $scope.item.RECEIPT_PHONE = $rootScope.user_info.PHONE_2;
                $scope.item.RECEIPT_ADDR = $rootScope.user_info.ADDR;
                $scope.item.RECEIPT_ADDR_DETAIL = $rootScope.user_info.ADDR_DETAIL;

                $scope.item.RECEIPTOR_NM1 = $rootScope.user_info.USER_NM;
                $scope.item.RECEIPT_PHONE1 = $rootScope.user_info.PHONE_2;
                $scope.item.RECEIPT_ADDR1 = $rootScope.user_info.ADDR;
                $scope.item.RECEIPT_ADDR_DETAIL1 = $rootScope.user_info.ADDR_DETAIL;
            }else if(val == 'N'){
                $scope.item.USER_ID = '';
                $scope.item.RECEIPTOR_NM = '';
                $scope.item.RECEIPT_PHONE = '';
                $scope.item.RECEIPT_ADDR = '';
                $scope.item.RECEIPT_ADDR_DETAIL = '';
            }
        }

        $scope.click_order = function (){

            $scope.item.ORDER = $scope.list;

            $scope.insertItem('ange/order', 'item', $scope.item, false)
                .then(function(){
                    $scope.step = 3;
                    $scope.orderlist();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        /********** 이벤트 **********/

        $scope.init();
        $scope.cartList();
        $scope.cartCummerceList();

    }]);
});
