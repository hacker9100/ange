/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2015-01-22
 * Description : storenaming-request.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('storenaming-request', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {


        $scope.search = {};
        $scope.item = {};

        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 1;

        $scope.showSamplepackDetails = false;

        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };

        // 날짜 셀렉트 박스셋팅
        var year = [];
        var babyYear = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        var month = [];

        var hour = [];
        var minute = [];

        // 초기화
        $scope.init = function() {

            $scope.community = "작명 신청";

            for (var i = 2000; i >= 1950; i--) {
                year.push(i+'');
            }

            for (var i = nowYear + 1; i >= 1995; i--) {
                babyYear.push(i+'');
            }

            for (var i = 1; i <= 12; i++) {
                month.push(i+'');
            }

            for (var i = 1; i <= 31; i++) {
                day.push(i+'');
            }

            for(var i = 0; i < 24; i++){
                hour.push(i+'');
            }

            for(var i = 0; i < 60; i++){
                minute.push(i+'');
            }

            $scope.year = year;
            $scope.babyYear = babyYear;
            $scope.month = month;
            $scope.day = day;
            $scope.hour = hour;
            $scope.minute = minute;

            //console.log($scope.month);
        };

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));
                    $scope.item = {};

                    //console.log($scope.user_info);
                    $scope.item.USER_ID = $scope.user_info.USER_ID;
                    $scope.item.USER_NM = $scope.user_info.USER_NM;
                    $scope.item.NICK_NM = $scope.user_info.NICK_NM;
                    $scope.item.ADDR = $scope.user_info.ADDR;
                    $scope.item.ADDR_DETAIL = $scope.user_info.ADDR_DETAIL;
                    $scope.item.REG_DT = $scope.user_info.REG_DT;
                    $scope.item.REG_DT = $scope.user_info.REG_DT;
                    $scope.item.PHONE_1 = $scope.user_info.PHONE_1;
                    $scope.item.PHONE_2 = $scope.user_info.PHONE_2;
                    $scope.item.PREGNENT_FL = $scope.user_info.PREGNENT_FL;
                    $scope.item.BABY_BIRTH_DT = $scope.user_info.BABY_BIRTH_DT;

                    if($scope.item.PREGNENT_FL == 'Y'){
                        $scope.checked = "Y";
                    }else{
                        $scope.checked = "N";
                    }

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'CMS';

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
                            }).catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){

            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        // 샘플팩 신청
        $scope.click_saveNamingComp = function (){

            $scope.item.RECEIPTOR_NM = $rootScope.user_info.USER_NM;
            $scope.item.RECEIPT_ADDR = $rootScope.user_info.ADDR;
            $scope.item.RECEIPT_ADDR_DETAIL = $rootScope.user_info.ADDR_DETAIL;
            $scope.item.RECEIPT_PHONE = $rootScope.user_info.PHONE_2;

            $scope.item.ORDER_GB = 'NAMING';
            $scope.item.PAY_GB = 'CREDIT';

            $scope.insertItem('ange/order', 'namingitem', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '네이밍 신청이 완료되었습니다.', {size: 'md'});

                    $location.url('/store/naming');
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});


        }

        // 네이밍 셀렉트박스 셋팅
        $scope.namingnoList = function(){
            $scope.getList('ange/order', 'namingnoList', {}, {}, true)
                .then(function(data){
                    $scope.namingnolist = data;
                })
                .catch(function(error){$scope.namingnolist = "";});
        }

        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .catch($scope.reportProblems);*/

        $scope.init();
        $scope.namingnoList();




    }]);
});
