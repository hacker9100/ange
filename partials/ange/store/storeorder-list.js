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
    controllers.controller('storeorder-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.search = {};
        $scope.item = {};

        /* $('.mileagelist').removeClass('hide');
         $('.cummercelist').addClass('hide');*/

        $scope.mileage = true;
        $scope.cummerce = false;

        $(function(){
            $scope.click_cartlist = function(){

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
        });

        // 초기화
        $scope.init = function() {

            $scope.community = "찜목록";
            $rootScope.info = {};
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


                    console.log(data);
                    $scope.mileagelist = data;
                })
                .catch(function(error){$scope.mileagelist = ""; $scope.TOTAL_COUNT = 0;});
        }

        // 커머스 장바구니 리스트
        $scope.cartCummerceList = function (){

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

        // 선택 상품 삭제
        $scope.click_removeCartProduct = function (product_gb, list, idx){

            var no = list[idx].NO;
            $scope.CART_NO = no;

            $scope.deleteItem('ange/cart', 'item', $scope.CART_NO, true)
                .then(function(){
                    if(product_gb == 'mileage'){
                        $scope.mileagelist.splice(idx, 1);
                    }else if(product_gb == 'cummerce'){
                        $scope.cummercelist.splice(idx, 1);
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 커머스 상품 장바구니 이동
        $scope.click_cummerce_reg = function (list , idx){

            $rootScope.cummercecartlist = [];
            $rootScope.cummercecartlist.push(list[idx]);

            //console.log($rootScope.cummercecartlist);

            $location.url('/store/cart/list?'+$rootScope.cummercecartlist);

        }

        // 마일리지 상품 장바구니 이동
        $scope.click_mileage_reg = function (list , idx){

            $rootScope.mileagecartlist = [];
            $rootScope.mileagecartlist.push(list[idx]);

            //console.log($rootScope.mileagecartlist);

            $location.url('/store/cart/list?'+$rootScope.mileagecartlist);

        }

        // 마일리지 몰 리스트 이동
        $scope.click_mileagehome = function(){
            $location.url('/store/mileagemall/list');
        }

        // 커머스 리스트 이동
        $scope.click_cummercehome = function (){
            $location.url('/store/cummerce/list');
        }

        /********** 이벤트 **********/

        $scope.init();

        $scope.cartList();
        $scope.cartCummerceList();
    }]);
});
