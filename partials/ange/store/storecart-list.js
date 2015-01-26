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

         // 초기화
        $scope.init = function(session) {
            $scope.community = "장바구니";

            if($stateParams.id = 'mileagemall' || $stateParams.id == 'auction'){
                $scope.product_gb = 'mileage';
            }else{
                $scope.product_gb = 'cummerce';
            }
        };

        // 장바구니 리스트
        $scope.cartList = function (){
            $scope.search.FILE = true;

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


                    $scope.list = data;
                })
                .catch(function(error){$scope.list = ""; $scope.TOTAL_COUNT = 0;});

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

            var no = $scope.list[idx].NO;
            $scope.CART_NO = no;

            $scope.deleteItem('ange/cart', 'item', $scope.CART_NO, true)
                .then(function(){
                    $scope.list.splice(idx, 1);
                    $scope.cartList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

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

        // 전체 상품 주문
        $scope.click_reg = function (list){

            $rootScope.orderlist = [];

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

            $rootScope.orderlist = list;
            $location.url('store/order/list/'+$rootScope.orderlist);
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
                    console.log(i);
                    console.log(list[idx]);

                    $rootScope.orderlist.push(list[idx]);
                }
            }

            $location.url('store/order/list/'+$rootScope.orderlist);
        }
        /********** 이벤트 **********/

        $scope.init();
        $scope.cartList();
    }]);
});
