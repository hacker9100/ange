/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : storeorder-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('storeorder-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.item = {};
        // 초기화

        console.log('id = '+$stateParams.id);


        console.log($scope.list = $rootScope.orderlist);

        $scope.init = function(session) {

            $scope.community = "주문하기";

            console.log($rootScope.user_info);
            console.log($rootScope.uid);

            $scope.list = $rootScope.orderlist;

            if($rootScope.uid != '' && $rootScope.uid != null){
                $scope.item.USER_ID = $rootScope.user_info.USER_ID;
                $scope.item.RECEIPTOR_NM = $rootScope.user_info.USER_NM;
                $scope.item.RECEIPT_PHONE = $rootScope.user_info.PHONE_2;
                $scope.item.RECEIPT_ADDR = $rootScope.user_info.ADDR;
                $scope.item.RECEIPT_ADDR_DETAIL = $rootScope.user_info.ADDR_DETAIL;
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

        // 기본주소 / 새주소
        $scope.click_basic = function(val){
            if(val == 'Y'){
                $scope.item.USER_ID = $rootScope.user_info.USER_ID;
                $scope.item.RECEIPTOR_NM = $rootScope.user_info.USER_NM;
                $scope.item.RECEIPT_PHONE = $rootScope.user_info.PHONE_2;
                $scope.item.RECEIPT_ADDR = $rootScope.user_info.ADDR;
                $scope.item.RECEIPT_ADDR_DETAIL = $rootScope.user_info.ADDR_DETAIL;
            }else if('N'){
                $scope.item = {};
            }
        }

        // 주문하기
        $scope.click_order = function (){

            $scope.item.ORDER = $scope.list;

            if($stateParams.id = 'mileagemall' ){
                $scope.item.ORDER_GB = 'MILEAGE';
            } else if($stateParams.id == 'auction'){
                $scope.item.ORDER_GB = 'AUCTION';
            }else if($stateParams.id == 'cummerce'){
                $scope.item.ORDER_GB = 'CUMMERCE';
            }
            $scope.insertItem('ange/order', 'item', $scope.item, false)
                .then(function(){
                    dialogs.notify('알림', '주문이 완료되었습니다. 나의 주문 내역에서 확인하실 수 있습니다', {size: 'md'});

                    // 스토어 홈으로 이동
                    $location.url('/store/home');

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 주문취소
        $scope.click_cancel = function (){
            // 스토어 홈으로 이동
            $location.url('/store/home');
        }
        /********** 이벤트 **********/

        $scope.init();

    }]);
});
