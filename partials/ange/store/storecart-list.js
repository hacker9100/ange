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
        $scope.sumitem = {};

       /* $('.mileagelist').removeClass('hide');
        $('.cummercelist').addClass('hide');*/

        $scope.mileage = true;
        $scope.cummerce = false;

        $(document).ready(function() {

            $("input:radio:first").prop("checked", true).trigger("click");
            $(".product_gb").click(function() {

                if($(this).val() == "mileage"){
                    $scope.mileage = true;
                    $scope.cummerce = false;
                } else if ($(this).val() == "cummerce"){
                    $scope.mileage = false;
                    $scope.cummerce = true;
                }

                //alert("clicked");
//                $('input[name="cartlist"]').change(function(){
//                    if($(this).val() == "mileage"){
//                        $scope.mileage = true;
//                        $scope.cummerce = false;
//                    } else if ($(this).val() == "cummerce"){
//                        $scope.mileage = false;
//                        $scope.cummerce = true;
//                    }
//                });

            });
        });

        $(function(){
            $scope.click_cartlist = function(){
                //alert('');

                $('input[name="cartlist"]').change(function(){
                    if($(this).val() == "mileage"){
                        $scope.mileage = true;
                        $scope.cummerce = false;
                    } else if ($(this).val() == "cummerce"){
                        $scope.mileage = false;
                        $scope.cummerce = true;
                    }
                });
            }

            $(':radio[name="cartlist"]').click(function(){
                //alert('aaaaa');
                var gubun = $(':radio[name="cartlist"]:checked').val();
                if(gubun == 'mileage'){
                    $scope.mileage = true;
                    $scope.cummerce = false;
                }else{
                    $scope.mileage = false;
                    $scope.cummerce = true;
                }
            });
        });

        $scope.click_cartlist = function(){
            //alert('aaaaa');

            $('input[name="cartlist"]').change(function(){
                if($(this).val() == "mileage"){
                    $scope.mileage = true;
                    $scope.cummerce = false;
                } else if ($(this).val() == "cummerce"){
                    $scope.mileage = false;
                    $scope.cummerce = true;
                }
            });
        }

        $scope.click_mileageall = function(){
            //클릭되었으면
            if($("#checkmileageall").is(":checked")){
                //alert();
                $(".checkmileage").prop("checked",true);
            }else{ //클릭이 안되있으면
                $(".checkmileage").prop("checked",true);
            }
        }

         // 초기화
        $scope.init = function() {

            $scope.item.CART = $scope.productsList;

            $scope.step = '01';
            $scope.community = "장바구니";

            $rootScope.info = {};

            // 마일리지몰 수량수정
            if($rootScope.mileagecartlist != ''){

                $scope.sumitem.CART = $rootScope.mileagecartlist;

                $scope.insertItem('ange/order', 'sumitem', $scope.sumitem, false)
                    .then(function(){
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

            // 커머스 수량수정
            if($rootScope.cummercecartlist != ''){

                $scope.sumitem.CART = $rootScope.cummercecartlist;

                $scope.insertItem('ange/order', 'sumitem', $scope.sumitem, false)
                    .then(function(){
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

        };

        // 우편번호 검색
        $scope.click_openDaumPostcode = function () {

            new daum.Postcode({
                oncomplete: function(data) {
                    var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');

                    // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                    // 우편번호와 주소 정보를 해당 필드에 넣고, 커서를 상세주소 필드로 이동한다.
                    $scope.item.RECEIPT_ZIP_CODE1 = document.getElementById('receipt_post_1').value = data.postcode1;
                    $scope.item.RECEIPT_ZIP_CODE2 = document.getElementById('receipt_post_2').value = data.postcode2;
                    $scope.item.RECEIPT_ADDR = document.getElementById('receipt_addr').value = addr;
//                        $scope.user.ADDR = document.getElementById('addr').value = data.address;

                    //전체 주소에서 연결 번지 및 ()로 묶여 있는 부가정보를 제거하고자 할 경우,
                    //아래와 같은 정규식을 사용해도 된다. 정규식은 개발자의 목적에 맞게 수정해서 사용 가능하다.
                    //var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');
                    //document.getElementById('addr').value = addr;

                    document.getElementById('receipt_addr_detail').focus();
                }
            }).open();
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
            $scope.search.FILE = true;

            $scope.search.PRODUCT_GB = "mileage";

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
                    //$scope.total_mileage = parseInt($scope.user_info.MILEAGE.REMAIN_POINT - $scope.sum_price);
                    $scope.total_mileage2 = parseInt($rootScope.mileage - $scope.sum_price);
                    console.log('$scope.total_mileage2 = '+$scope.total_mileage2);

                    $scope.mileagelist = data;
                })
                ['catch'](function(error){$scope.mileagelist = ""; $scope.TOTAL_COUNT = 0;});

//            if($rootScope.mileagecartlist != ''){
//
//                //$scope.TOTAL_COUNT = $scope.mileagecartlist.length;
//
//                for(var i in $rootScope.mileagecartlist) {
//                    if ($rootScope.mileagecartlist[i].FILE != null) {
//                        var img = UPLOAD.BASE_URL + $rootScope.mileagecartlist[i].FILE[0].PATH + 'thumbnail/' + $rootScope.mileagecartlist[i].FILE[0].FILE_ID;
//                        $rootScope.mileagecartlist[i].MAIN_FILE = img;
//
//                    }
//                    $scope.sum_price += parseInt($rootScope.mileagecartlist[i].TOTAL_PRICE);
//                }
//                $scope.mileagelist = $rootScope.mileagecartlist;
//
//            }else{
//                $scope.mileagelist = "";
//                //$scope.TOTAL_COUNT = 0;
//            }
        }

        // 커머스 장바구니 리스트
        $scope.cartCummerceList = function (){

            $scope.search.FILE = true;
            $scope.search.PRODUCT_GB = "cummerce";

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
                    //$scope.total_mileage = parseInt($rootScope.mileage - $scope.sum_price);


                    $scope.cummercelist = data;
                })
                ['catch'](function(error){$scope.cummercelist = ""; $scope.TOTAL_COUNT = 0;});

//            if($rootScope.cummercecartlist != ''){
//
//                //$scope.TOTAL_COUNT = $scope.cummercelist.length;
//
//                for(var i in $rootScope.cummercecartlist) {
//                    if ($rootScope.cummercecartlist[i].FILE != null) {
//                        var img = UPLOAD.BASE_URL + $rootScope.cummercecartlist[i].FILE[0].PATH + 'thumbnail/' + $rootScope.cummercecartlist[i].FILE[0].FILE_ID;
//                        $rootScope.cummercecartlist[i].MAIN_FILE = img;
//
//                    }
//                    $scope.sum_price += parseInt($rootScope.cummercecartlist[i].TOTAL_PRICE);
//                }
//                $scope.cummercelist = $rootScope.cummercecartlist;
//
//            }else{
//                $scope.cummercelist = "";
//                //$scope.TOTAL_COUNT = 0;
//            }

        }

        $scope.click_sumprice = function(product_gb, idx){

            $scope.sum_price = 0;
            $scope.total_mileage = 0;

            $scope.mileage_gb = product_gb;

//            if($("input:checkbox[id='name"+idx+"']").is(":checked")){
//                $scope.mileage_open = 'Y';
//                $scope.sum_price += parseInt($scope.mileagelist[idx].TOTAL_PRICE);
//            }else{
//                $scope.mileage_open = 'N';
//                $scope.sum_price -= parseInt($scope.mileagelist[idx].TOTAL_PRICE);
//                //$scope.total_mileage = parseInt($rootScope.mileage - $scope.sum_price);
//            }

            $("input[name='name[]']:checked").each(function(index) {
                $scope.mileage_open = 'Y';
                $scope.sum_price += parseInt($scope.mileagelist[index].TOTAL_PRICE);
            });

            if($scope.sum_price == 0){
                $scope.mileage_open = 'N';
            }

            console.log($scope.sum_price);
            $scope.total_mileage = parseInt($rootScope.mileage - $scope.sum_price);

        }


        // 선택 상품 삭제
        $scope.click_removeCartProduct = function (product_gb, list, idx){

            var no = list[idx].NO;
            $scope.CART_NO = no;

            var no = list[idx].NO;
            $scope.CART_NO = no;

            var dialog = dialogs.confirm('알림', '선택 상품을 삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('ange/cart', 'item', $scope.CART_NO, true)
                    .then(function(){
                        if(product_gb == 'mileage'){
                            $scope.mileagelist.splice(idx, 1);
                        }else if(product_gb == 'cummerce'){
                            $scope.cummercelist.splice(idx, 1);
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });

//            if(product_gb == 'mileage'){
//                $scope.mileagelist.splice(idx, 1);
//            }else if(product_gb == 'cummerce'){
//                $scope.cummercelist.splice(idx, 1);
//            }
        }

        // 커머스 상품 선택해서 주문
        $scope.click_cummerce_reg = function (list , idx){

            $rootScope.orderlist = [];
            $rootScope.orderlist.push(list[idx]);

            $scope.step = '02';
            $scope.orderlist();
        }

        // 선택 상품 주문
        $scope.click_select_reg = function(list, mileage_gb){

            var idx = 0;
            var count = $("input:checkbox[name='name[]']:checked").length;

            if(count == 0){
                dialogs.notify('알림', '상품을 선택해 주세요', {size: 'md'});
                return;
            }

            if(mileage_gb == 'MILEAGE'){
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
            $scope.createProductCode();
            $scope.orderlist();
        }

        // 전체 상품 주문
        $scope.click_reg = function (list,mileage_gb){

            $rootScope.orderlist = list;

            console.log('mileage_gb = '+mileage_gb);
            if(mileage_gb == 'MILEAGE'){
                if($scope.total_mileage2 < 0){
                    dialogs.notify('알림', '잔여 마일리지가 부족합니다', {size: 'md'});
                    return;
                }
            }

            $scope.step = '02';
            $scope.createProductCode();
            $scope.orderlist();
        }

        // 주문코드 생성
        $scope.createProductCode = function (){

            // 상품 코드 생성
            $scope.getItem('ange/order', 'productcode', {}, {}, false)
                .then(function(data) {
                    $scope.item.PRODUCT_CODE = data.PRODUCT_CODE;
                    $rootScope.PRODUCT_CODE = data.PRODUCT_CODE;
                })
                ['catch'](function(error){alert(error)});
        }

        // 주문리스트
        $scope.orderlist = function (){

            $scope.list = $rootScope.orderlist;

            console.log($rootScope.orderlist);
            if($rootScope.uid != '' && $rootScope.uid != null){

                $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                    .then(function(data){

                        $rootScope.info = data;

                        $scope.item.ZIP_CODE1 = data.ZIP_CODE.substr(0,3);
                        $scope.item.ZIP_CODE2 = data.ZIP_CODE.substr(3,3);

                        $scope.item.RECEIPTOR_NM1 = data.USER_NM;
                        $scope.item.RECEIPT_PHONE1 = data.PHONE_2;
                        $scope.item.RECEIPT_ADDR1 = data.ADDR;
                        $scope.item.RECEIPT_ADDR_DETAIL1 = data.ADDR_DETAIL;

                        $scope.item.RECEIPT_ZIP_CODE1 = $scope.item.ZIP_CODE1;
                        $scope.item.RECEIPT_ZIP_CODE2 = $scope.item.ZIP_CODE2;

                        $scope.item.USER_ID = data.USER_ID;
                        $scope.item.RECEIPTOR_NM = data.USER_NM;
                        $scope.item.RECEIPT_PHONE = data.PHONE_2;
                        $scope.item.RECEIPT_ADDR = data.ADDR;
                        $scope.item.RECEIPT_ADDR_DETAIL = data.ADDR_DETAIL;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});


            }

            $scope.TOTAL_SUM_PRICE = 0;
            $scope.TOTAL_DELEIVERY_PRICE = 0;
            $rootScope.TOTAL_PRICE = 0;
            for(var i=0; i<$scope.list.length; i++){

                console.log($scope.list[i].TOTAL_PRICE);
                if($scope.list[i].PRODUCT_GB == 'MILEAGE' || $scope.list[i].PRODUCT_GB == 'CUMMERCE' ){
                    $scope.TOTAL_SUM_PRICE += parseInt($scope.list[i].TOTAL_PRICE);

                    console.log('aaa = '+$scope.TOTAL_SUM_PRICE);
                }else if($scope.list[i].PRODUCT_GB == 'AUCTION'){
                    $scope.TOTAL_SUM_PRICE += parseInt($scope.list[i].DIRECT_PRICE);
                }
                $scope.TOTAL_DELEIVERY_PRICE = parseInt($scope.list[i].DELEIVERY_PRICE);
                $scope.DELEIVERY_ST = $scope.list[i].DELEIVERY_ST;
            }

            if($scope.DELEIVERY_ST == 1){
                $rootScope.TOTAL_PRICE = parseInt($scope.TOTAL_SUM_PRICE);
            }else if($scope.DELEIVERY_ST == 2){
                $rootScope.TOTAL_PRICE = parseInt($scope.TOTAL_SUM_PRICE) + parseInt($scope.TOTAL_DELEIVERY_PRICE);
            }
        }

        // 이전페이지
        $scope.prev_step = function (){
            $scope.step = 1;
        }

        // 사용자 기존 정보 or 새주소
        $scope.click_basic = function(val){
            if(val == 'Y'){
                $scope.item.USER_ID = $rootScope.info.USER_ID;
                $scope.item.RECEIPTOR_NM = $rootScope.info.USER_NM;
                $scope.item.RECEIPT_PHONE = $rootScope.info.PHONE_2;
                $scope.item.RECEIPT_ADDR = $rootScope.info.ADDR;
                $scope.item.RECEIPT_ADDR_DETAIL = $rootScope.info.ADDR_DETAIL;

                $scope.item.RECEIPTOR_NM1 = $rootScope.info.USER_NM;
                $scope.item.RECEIPT_PHONE1 = $rootScope.info.PHONE_2;
                $scope.item.RECEIPT_ZIP_CODE1 = $rootScope.info.ZIP_CODE.substr(0,3);
                $scope.item.RECEIPT_ZIP_CODE2 = $rootScope.info.ZIP_CODE.substr(3,3);
                $scope.item.RECEIPT_ADDR1 = $rootScope.info.ADDR;
                $scope.item.RECEIPT_ADDR_DETAIL1 = $rootScope.info.ADDR_DETAIL;
            }else if(val == 'N'){
                $scope.item.USER_ID = '';
                $scope.item.RECEIPTOR_NM = '';
                $scope.item.RECEIPT_PHONE = '';
                $scope.item.RECEIPT_ZIP_CODE1 = '';
                $scope.item.RECEIPT_ZIP_CODE2 = '';
                $scope.item.RECEIPT_ADDR = '';
                $scope.item.RECEIPT_ADDR_DETAIL = '';
            }
        }

        $scope.click_mileagehome = function(){
            $location.url('/store/mileagemall/list');
        }

        $scope.click_cummercehome = function (){
            $location.url('/store/cummerce/list');
        }

        // 주문하기
        $scope.click_order = function (){
            $scope.item.ORDER = $scope.list;

            console.log($scope.item);

            var total_price = 0;
            if($scope.item.ORDER[0].DELEIVERY_ST == 2){
                total_price = parseInt($scope.item.ORDER[0].DELEIVERY_PRICE) + parseInt($scope.item.ORDER[0].TOTAL_PRICE);
            }else{
                total_price = parseInt($scope.item.ORDER[0].TOTAL_PRICE);
            }


//            var pay_gb = '';
//
//            if($scope.item.PAY_GB == "CREDIT"){
//                pay_gb = 11;
//            }else if($scope.item.PAY_GB == "NOBANKBOOK"){
//                pay_gb = 22;
//            }
//            // /easypay70_plugin_php_window/web/normal/order.php
//            // /easypay70_plugin_php_window/web/easypay_request.php
//            var popUrl = "http://localhost/easypay70_plugin_php_window/web/normal/order.php?EP_tr_cd?=00101000&EP_user_id="+$scope.item.USER_ID+"&EP_user_nm="+$scope.item.RECEIPTOR_NM+"&EP_order_no="+$scope.item.ORDER[0].PRODUCT_NO+"&EP_product_nm="+$scope.item.ORDER[0].PRODUCT_NM+
//                           "&EP_product_amt="+total_price+"&EP_user_mail="+$rootScope.user_info.EMAIL+"&EP_user_phone1="+$rootScope.user_info.PHONE_1+"&EP_user_phone2="+$scope.item.RECEIPT_PHONE+"&EP_user_addr="+$scope.item.RECEIPT_ADDR+"&EP_pay_type="+pay_gb;
//                	//팝업창에 출력될 페이지 URL
////
//////            var popUrl = "http://localhost/easypay70_plugin_php_window/web/easypay_request.php?EP_user_id="+$scope.item.USER_ID+"&EP_user_nm="+$scope.item.RECEIPTOR_NM+"&EP_order_no="+$scope.item.ORDER[0].PRODUCT_NO+"&EP_product_nm="+$scope.item.ORDER[0].PRODUCT_NM+
//////                "&EP_product_amt="+total_price+"&EP_user_mail="+$rootScope.user_info.EMAIL+"&EP_user_phone1="+$rootScope.user_info.PHONE_1+"&EP_user_phone2="+$scope.item.RECEIPT_PHONE+"&EP_user_addr="+$scope.item.RECEIPT_ADDR+"&EP_pay_type="+pay_gb;
////
//            var popOption = "width=950, height=900, resizable=no, scrollbars=no, status=no;";    //팝업창 옵션(optoin)
//            window.open(popUrl+"","",popOption);

            // 상품 주문 등록
            $scope.insertItem('ange/order', 'item', $scope.item, false)
                .then(function(data){
                    $scope.step = 3;
                    $rootScope.REQUEST_NOTE = $scope.item.REQUEST_NOTE;

                    /*$('input:radio[name=pay_info_gb]:input[value="NOBANKBOOK"]').prop("checked", true);*/

                    if($scope.item.PAY_GB == 'CREDIT'){
                        $("#pay_info_gb1").attr("checked",true);
                        $("#pay_info_gb2").attr("checked",false);
                    } else if($scope.item.pay_gb == 'NOBANKBOOK'){
                        $("#pay_info_gb1").attr("checked",false);
                        $("#pay_info_gb2").attr("checked",true);
                    }

                    $scope.PAY_INFO = $scope.item.PAY_GB;

                    $rootScope.mileage = data.mileage;
                    $scope.orderlist();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    $scope.item = {};

                    $scope.user_info = function () {
                        $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                            .then(function(data){

//                                $scope.item.USER_ID = data.USER_ID;
//                                $scope.item.USER_NM = data.USER_NM;
//                                $scope.item.NICK_NM = data.NICK_NM;
//                                $scope.item.ADDR = data.ADDR;
//                                $scope.item.ADDR_DETAIL = data.ADDR_DETAIL;
//                                $scope.item.REG_DT = data.REG_DT;
//                                $scope.item.REG_DT = data.REG_DT;
//                                $scope.item.PHONE_1 = data.PHONE_1;
//                                $scope.item.PHONE_2 = data.PHONE_2;
//                                $scope.item.BLOG_URL = data.BLOG_URL;

                                $scope.item = data;

                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }



                    $(document).ready(function(){
                        $('#birth_dt').css('display', 'none');

                        $("#preg_Y").click(function(){
                            if(!$("#preg_Y").is(":checked")){
                                $scope.item.PREGNENT_FL = "Y";
                                $('#birth_dt').css('display', 'block');
                            }
                        });

                        $("#preg_N").click(function(){
                            if(!$("#preg_N").is(":checked")){
                                $scope.item.PREGNENT_FL = "N";
                                $('#birth_dt').css('display', 'none');
                            }
                        });
                    });

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'CMS';
                        $scope.item.USER_NM = $scope.name;
                        $scope.item.NICK_NM = $scope.nick;

                        if($("#preg_Y").is(":checked")){
                            $scope.item.PREGNENT_FL = "Y";
                        }else{
                            $scope.item.PREGNENT_FL = "N";
                        }

                        if($("#preg_N").is(":checked")){
                            $scope.item.PREGNENT_FL = "N";
                        }else{
                            $scope.item.PREGNENT_FL = "Y";
                        }

                        $scope.updateItem('com/user', 'item',$scope.uid, $scope.item, false)
                            .then(function(data){

                                dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                    $scope.user_info();

                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){
                $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                    .then(function(data){

                        $rootScope.info = data;

                        $scope.item.USER_ID = data.USER_ID;
                        $scope.item.RECEIPTOR_NM = data.USER_NM;
                        $scope.item.RECEIPT_PHONE = data.PHONE_2;
                        $scope.item.RECEIPT_ADDR = data.ADDR;
                        $scope.item.RECEIPT_ADDR_DETAIL = data.ADDR_DETAIL;

                        $scope.item.RECEIPTOR_NM1 = data.USER_NM;
                        $scope.item.RECEIPT_PHONE1 = data.PHONE_2;
                        $scope.item.RECEIPT_ADDR1 = data.ADDR;
                        $scope.item.RECEIPT_ADDR_DETAIL1 = data.ADDR_DETAIL;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        // 나의 주문현황으로 이동
        $scope.click_myorder = function () {
            $location.url('/myange/orderlist');
        }

        // 계속 쇼핑하기 이동
        $scope.click_storeMall = function () {
            if($scope.product_gb == 'cummerce'){
                $location.url('/store/cummerce/list');
            } else {
                $location.url('/store/mileagemall/list');
            }
        }

        // 스토어 메인으로 이동
        $scope.click_storemain = function () {
            $location.url('/store/home');
        }

        /********** 이벤트 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.cartList)
            .then($scope.cartCummerceList)
            ['catch']($scope.reportProblems);

//        $scope.init();
//
//        $scope.cartList();
//        $scope.cartCummerceList();
    }]);
});
