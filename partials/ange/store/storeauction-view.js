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
            if(products.NO == null){
                $scope.productsList = [];
            }else{
                $scope.product.CNT = 1;
                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "CNT" : 1, "SUM_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELEIVERY_PRICE" : item.DELEIVERY_PRICE, "DELEIVERY_ST" : item.DELEIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});


                // , "RECEIPTOR_NM" : $rootScope.user_info.USER_NM, "RECEIPT_ADDR" :$rootScope.user_info.ADDR, "RECEIPT_ADDR_DETAIL" : $rootScope.user_info.ADDR_DETAIL, "RECEIPT_PHONE" : $rootScope.user_info.PHONE_2
            }
        }

        $(document).ready(function(){

            $("#checkProduct").click(function(){
                if(!$("#checkProduct").is(":checked")){
                    $scope.addProductList($scope.item, $scope.item);
                }else{
                    $scope.productsList = [];
                    //$("#checkProduct").attr("checked", false);
                }

            });

        });


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
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                                var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                data.MAIN_FILE = img;
                            }
                        }

                        $scope.products = data.PRODUCTS;

                        console.log($scope.products);

                        $scope.item = data;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 장바구니추가
        $scope.click_addcart = function (){

            $scope.item.CART = $scope.productsList;
            $scope.item.CART.USER_ID = $rootScope.uid;

            $scope.insertItem('ange/cart', 'item', $scope.item, false)
                .then(function(){
                    /*dialogs.notify('알림', '장바구니에 등록되었습니다. 계속 쇼핑 하시겠습니까?', {size: 'md'});
                    $scope.openViewScrapModal($scope.item.CART, 'lg');*/
                    alert('장바구니에 등록되었습니다');

                    $location.url('store/cart/list/'+$stateParams.menu);
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 임시 장바구니 모달 팝업창 --> 삭제예정
        $scope.openViewScrapModal = function (item, size) {
            var dlg = dialogs.create('storemall_cart.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));


                    $scope.list = item;

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                    $scope.orderlist = [];

                    $scope.click_removeCartProduct = function (idx){
                        $scope.list.splice(idx, 1);
                    }


                    $scope.sum_price = 0;

                    for(var i =0;i <item.length; i++){
                        $scope.sum_price += item[i].SUM_PRICE;
                        $scope.PRODUCT_GB = item[i].PRODUCT_GB;
                    }

                    console.log($scope.user_info.MILEAGE);

                    $scope.total_mileage = parseInt($scope.user_info.MILEAGE.REMAIN_POINT - $scope.sum_price);

                    // 선택 상품 주문
                    $scope.click_select_reg = function(list){

                        var idx = 0;

                        var count = $("input:checkbox[name='name']:checked").length;
                        console.log(count);

                        for(var i =0; i<list.length; i++){

                            if($("#name"+i).is(":checked")){

                                idx = i;
                                console.log(i);
                                $scope.orderlist.push(list[idx]);
                            }

                        }
                        $scope.openOrderModal($scope.orderlist, 'lg');
                    }

                    // 전체 상품 주문
                    $scope.click_reg = function (list){

                        $scope.openOrderModal($scope.list, 'lg');
                        $modalInstance.close();
                    }

                    $scope.openOrderModal = function (item, size){

                        var dlg = dialogs.create('storemall_order.html',
                            ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {
                                /********** 공통 controller 호출 **********/
                                angular.extend(this, $controller('ange-common', {$scope: $scope}));

                                $scope.item = {};

                                if($scope.uid != '' && $scope.uid != null){
                                    $scope.item.USER_ID = $scope.user_info.USER_ID;
                                    $scope.item.RECEIPTOR_NM = $scope.user_info.USER_NM;
                                    $scope.item.RECEIPT_PHONE = $scope.user_info.PHONE_2;
                                    $scope.item.RECEIPT_ADDR = $scope.user_info.ADDR;
                                    $scope.item.RECEIPT_ADDR_DETAIL = $scope.user_info.ADDR_DETAIL;
                                }

                                $scope.list = item;

                                console.log($scope.list);

                                $scope.TOTAL_SUM_PRICE = 0;
                                $scope.TOTAL_DELEIVERY_PRICE = 0;
                                for(var i=0; i<item.length; i++){

                                    $scope.TOTAL_SUM_PRICE += item[i].SUM_PRICE;
                                    $scope.TOTAL_DELEIVERY_PRICE = item[i].DELEIVERY_PRICE;
                                    $scope.DELEIVERY_ST = item[i].DELEIVERY_ST;
                                }

                                if($scope.DELEIVERY_ST == 1){
                                    $scope.item.SUM_PRICE = parseInt($scope.TOTAL_SUM_PRICE);
                                }else if($scope.DELEIVERY_ST == 2){
                                    $scope.item.SUM_PRICE = parseInt($scope.TOTAL_SUM_PRICE) + parseInt($scope.TOTAL_DELEIVERY_PRICE);
                                }

                                $scope.click_basic = function(val){
                                    if(val == 'Y'){
                                        $scope.item.USER_ID = $scope.user_info.USER_ID;
                                        $scope.item.RECEIPTOR_NM = $scope.user_info.USER_NM;
                                        $scope.item.RECEIPT_PHONE = $scope.user_info.PHONE_2;
                                        $scope.item.RECEIPT_ADDR = $scope.user_info.ADDR;
                                        $scope.item.RECEIPT_ADDR_DETAIL = $scope.user_info.ADDR_DETAIL;
                                    }else if('N'){
                                        $scope.item = {};
                                    }
                                }

                                $scope.item.ORDER = $scope.list;

                                $scope.click_order = function (){

                                    $scope.item.ORDER_GB = 'AUCTION';

                                    $scope.insertItem('ange/order', 'item', $scope.item, false)
                                        .then(function(){dialogs.notify('알림', '주문이 완료되었습니다. 나의 주문 내역에서 확인하실 수 있습니다', {size: 'md'});})
                                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                                }

                                $scope.click_cancel = function () {
                                    $modalInstance.close();
                                };

                            }], item, {size:size,keyboard: true}, $scope);
                        dlg.result.then(function(){

                        },function(){

                        });
                    };


                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        $scope.addSumPrice = function(price, cnt, index){

            $scope.productsList[index].SUM_PRICE = price * cnt;
        }

        // 주문
        $scope.click_addOrder = function(){

            $scope.item.ORDER = $scope.productsList;

            console.log($scope.item.ORDER);
            /*            $scope.insertItem('ange/order', 'item', $scope.item, false)
             .then(function(){dialogs.notify('알림', '주문이 완료되었습니다. 나의 주문 내역에서 확인하실 수 있습니다', {size: 'md'});})
             .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});*/

            $scope.openOrderModal($scope.item.ORDER, 'lg');
        }

        // 주문팝업 삭제예정
        $scope.openOrderModal = function (item, size){

            var dlg = dialogs.create('storemall_order.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};

                    if($scope.uid != '' && $scope.uid != null){
                        $scope.item.USER_ID = $scope.user_info.USER_ID;
                        $scope.item.RECEIPTOR_NM = $scope.user_info.USER_NM;
                        $scope.item.RECEIPT_PHONE = $scope.user_info.PHONE_2;
                        $scope.item.RECEIPT_ADDR = $scope.user_info.ADDR;
                        $scope.item.RECEIPT_ADDR_DETAIL = $scope.user_info.ADDR_DETAIL;
                    }

                    $scope.list = item;

                    $scope.TOTAL_SUM_PRICE = 0;
                    $scope.TOTAL_DELEIVERY_PRICE = 0;
                    for(var i=0; i<item.length; i++){

                        $scope.TOTAL_SUM_PRICE += item[i].SUM_PRICE;
                        $scope.TOTAL_DELEIVERY_PRICE = item[i].DELEIVERY_PRICE;
                        $scope.DELEIVERY_ST = item[i].DELEIVERY_ST;
                    }

                    if($scope.DELEIVERY_ST == 1){
                        $scope.item.SUM_PRICE = parseInt($scope.TOTAL_SUM_PRICE);
                    }else if($scope.DELEIVERY_ST == 2){
                        $scope.item.SUM_PRICE = parseInt($scope.TOTAL_SUM_PRICE) + parseInt($scope.TOTAL_DELEIVERY_PRICE);
                    }


                    $scope.click_basic = function(val){
                        if(val == 'Y'){
                            $scope.item.USER_ID = $scope.user_info.USER_ID;
                            $scope.item.RECEIPTOR_NM = $scope.user_info.USER_NM;
                            $scope.item.RECEIPT_PHONE = $scope.user_info.PHONE_2;
                            $scope.item.RECEIPT_ADDR = $scope.user_info.ADDR;
                            $scope.item.RECEIPT_ADDR_DETAIL = $scope.user_info.ADDR_DETAIL;
                        }else if('N'){
                            $scope.item = {};
                        }
                    }

                    $scope.item.ORDER = $scope.list;

                    $scope.click_order = function (){

                        $scope.item.ORDER_GB = 'AUCTION'

                        $scope.insertItem('ange/order', 'item', $scope.item, false)
                            .then(function(){
                                dialogs.notify('알림', '주문이 완료되었습니다. 나의 주문 내역에서 확인하실 수 있습니다', {size: 'md'});
                                $modalInstance.close();
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 목록 버튼 클릭
        $scope.click_showPeoplePhotoList = function () {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
        }


        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         .catch($scope.reportProblems);*/
        $scope.init();
        $scope.getPeopleBoard();
        //s$scope.addSumPrice($scope.item.PRICE, 1 , 0);

    }]);
});
