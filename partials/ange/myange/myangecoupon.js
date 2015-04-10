/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangecoupon.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangecoupon', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', 'CONSTANT',function ($scope, $rootScope,$stateParams, $location, dialogs, UPLOAD,CONSTANT) {

        $scope.search = {};
        $scope.item = {};
        // 초기화

        var now = new Date();
        var nowYear = now.getFullYear();


        var todayyear = now.getFullYear().toString();
        var totaymonth = (now.getMonth()+1).toString();
        var todaydd  = now.getDate().toString();

        if(totaymonth < 10) {
            totaymonth = '0'+totaymonth;
        }

        if(todaydd < 10) {
            todaydd = '0'+todaydd;
        }

        $scope.todayDate = todayyear+totaymonth+todaydd;

        $scope.init = function(session) {
            $scope.community = "쿠폰";


            $scope.search.DETAIL = true;
            $scope.getItem('com/user', 'item', $scope.uid, $scope.search , false)
                .then(function(data){

                    console.log(data);
                    $rootScope.user_info.BIRTH = data.BIRTH;
                    $rootScope.user_info.BABY = data.BABY;

                    // $rootScope.user_info.BIRTH
                    $scope.MOM_BIRTH_YEAR = data.BIRTH.substr(0,4);
                    $scope.MOM_BIRTH_MONTH = data.BIRTH.substr(4,2);
                    $scope.MOM_BIRTH_DAY = data.BIRTH.substr(6,2);


                    //console.log(' $rootScope.user_info.BABY.BABY_BIRTH = '+ $rootScope.user_info.BABY[0].BABY_BIRTH);

                    console.log(data.BABY);

                    //  $rootScope.user_info.BABY[0].BABY_BIRTH
                    if(data.BABY == null){
                        $scope.BABY_BIRTH_YEAR = '';
                        $scope.BABY_BIRTH_MONTH = '';
                        $scope.BABY_BIRTH_DAY = '';
                    }else{
                        $scope.BABY_BIRTH_YEAR = data.BABY[0].BABY_BIRTH.substr(0,4);
                        $scope.BABY_BIRTH_MONTH = data.BABY[0].BABY_BIRTH.substr(4,2);
                        $scope.BABY_BIRTH_DAY = data.BABY[0].BABY_BIRTH.substr(6,2);
                    }

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});



        };

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 25;
        $scope.TOTAL_COUNT = 0;

        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getCouponList();
        };


        $scope.getCouponList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.getList('ange/coupon', 'list', {NO: $scope.PAGE_NO- 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_CNT;
                    console.log(total_cnt);
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };



        $scope.click_saveMomsBirthCoupon = function (){

            $scope.item.COUPON_CD = 'ANGE_BIRTH'
            $scope.search.COUPON_CD = $scope.item.COUPON_CD;

            $scope.search.YEAR  = nowYear;

            var mombirth = parseInt($scope.MOM_BIRTH_MONTH - 1);
            var momday = parseInt($scope.MOM_BIRTH_DAY);

            var threeDaysAgo = new Date(nowYear, mombirth, momday); // 2014-03-01 - 월은 0에서부터 시작된다.
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3); // 2014-02-26 => 3일전으로~

            var threeDaysAfter = new Date(nowYear, mombirth, momday); // 2014-03-01 - 월은 0에서부터 시작된다.
            threeDaysAfter.setDate(threeDaysAfter.getDate() + 3); // 2014-02-26 => 3일전으로~

            var threeagomm = threeDaysAgo.getMonth()+1;
            if(threeagomm < 10){
                threeagomm = '0'+threeagomm
            }
            var threeagoday = threeDaysAgo.getDate();
            if(threeagoday < 10){
                threeagoday = '0'+threeagoday
            }

            var threeaftermm = threeDaysAfter.getMonth()+1;
            if(threeaftermm < 10){
                threeaftermm = '0'+threeaftermm;
            }
            var threeafterday = threeDaysAfter.getDate();
            if(threeafterday < 10){
                threeafterday = '0'+threeafterday;
            }

            console.log('threeDaysAgo = '+nowYear+threeagomm+threeagoday);
            var threeAgoDate = parseInt(nowYear+threeagomm+threeagoday);

            console.log('threeDaysAfter = '+nowYear+threeaftermm+threeafterday);
            var threeAfterDate = parseInt(nowYear+threeaftermm+threeafterday);

            var todayDate = parseInt($scope.todayDate);

            if(threeAgoDate <= todayDate && todayDate <= threeAfterDate){
                $scope.getList('ange/coupon', 'couponCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                    .then(function(data){

                        var couponCnt = data[0].COUPON_CNT;

                        if(couponCnt ==0){

                            $scope.item.COUPON_GB = 'ANGE'
                            $scope.item.COUPON_NM = '엄마 생일 축하 쿠폰';

                            $scope.item.MILEAGE = 500;
                            $scope.insertItem('ange/coupon', 'item', $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 발급 되었습니다.', {size: 'md'});
                                    $rootScope.mileage = data.mileage;
                                    $scope.getCouponList();
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 쿠폰 발급을 했습니다.', {size: 'md'});
                            $scope.item.COUPON_CD = '';
                            return;
                        }

                    })
                    ['catch'](function(error){});
            }else{
                dialogs.notify('알림', '생일 기간이 아닙니다.', {size: 'md'});
                $scope.item.COUPON_CD = '';
                return;
            }



        }

        $scope.click_saveMomsBecomeCoupon = function (){


            if($scope.BABY_BIRTH_YEAR == '' && $scope.BABY_BIRTH_MONTH == '' && $scope.BABY_BIRTH_DAY == ''){
                dialogs.notify('알림', '회원정보에서 아이 생일을 추가해주세요.', {size: 'md'});
                return;
            }

            $scope.item.COUPON_CD = 'ANGE_MOM_BECAME'
            $scope.search.COUPON_CD = $scope.item.COUPON_CD;

            $scope.search.YEAR  = nowYear;

            var babybirth = parseInt($scope.BABY_BIRTH_MONTH - 1);
            var babyday = parseInt($scope.BABY_BIRTH_DAY);

            var threeDaysAgo = new Date(nowYear, babybirth, babyday); // 2014-03-01 - 월은 0에서부터 시작된다.
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3); // 2014-02-26 => 3일전으로~

            var threeDaysAfter = new Date(nowYear, babybirth, babyday); // 2014-03-01 - 월은 0에서부터 시작된다.
            threeDaysAfter.setDate(threeDaysAfter.getDate() + 3); // 2014-02-26 => 3일전으로~

            var threeagomm = threeDaysAgo.getMonth()+1;
            if(threeagomm < 10){
                threeagomm = '0'+threeagomm
            }
            var threeagoday = threeDaysAgo.getDate();
            if(threeagoday < 10){
                threeagoday = '0'+threeagoday
            }

            var threeaftermm = threeDaysAfter.getMonth()+1;
            if(threeaftermm < 10){
                threeaftermm = '0'+threeaftermm;
            }
            var threeafterday = threeDaysAfter.getDate();
            if(threeafterday < 10){
                threeafterday = '0'+threeafterday;
            }

            console.log('threeDaysAgo = '+nowYear+threeagomm+threeagoday);
            var threeAgoDate = parseInt(nowYear+threeagomm+threeagoday);

            console.log('threeDaysAfter = '+nowYear+threeaftermm+threeafterday);
            var threeAfterDate = parseInt(nowYear+threeaftermm+threeafterday);

            var todayDate = parseInt($scope.todayDate);

            if(threeAgoDate <= todayDate && todayDate <= threeAfterDate){
                $scope.getList('ange/coupon', 'couponCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                    .then(function(data){

                        var couponCnt = data[0].COUPON_CNT;

                        if(couponCnt ==0){

                            $scope.item.COUPON_GB = 'ANGE'
                            $scope.item.COUPON_NM = '엄마가 된 축하 쿠폰';

                            $scope.item.MILEAGE = 200;
                            $scope.insertItem('ange/coupon', 'item', $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 발급 되었습니다.', {size: 'md'});
                                    $rootScope.mileage = data.mileage;
                                    $scope.getCouponList();
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 쿠폰 발급을 했습니다.', {size: 'md'});
                            $scope.item.COUPON_CD = '';
                            return;
                        }
                    })
                    ['catch'](function(error){});
            }else{
                dialogs.notify('알림', '적립 기간이 아닙니다.', {size: 'md'});
                $scope.item.COUPON_CD = '';
                return;
            }

        }

        $scope.click_saveCoupon = function (){

            //$scope.item.COUPON_CD = $scope.item.COUPON_CD.replace(/^\s+|\s+$/g,'');

            if($scope.item.COUPON_CD != undefined){
                $scope.item.COUPON_CD = $scope.item.COUPON_CD.replace(/^\s+|\s+$/g,'');
            }

            if($scope.item.COUPON_CD == undefined || $scope.item.COUPON_CD == ""){
                dialogs.notify('알림', '쿠폰번호를 입력하세요.', {size: 'md'});
                return;
            }

            $scope.item.MILEAGE = 1000;

            var coupon_gb = $scope.item.COUPON_CD.split('_');
            coupon_gb = coupon_gb[0];

            console.log(coupon_gb);
            if(coupon_gb != 'ANGE' && coupon_gb != 'MAGAZINE' && coupon_gb != 'EXPO'){
                dialogs.notify('알림', '쿠폰번호가 유효하지 않습니다.', {size: 'md'});
                return;
            }


            $scope.search.COUPON_CD = $scope.item.COUPON_CD;
            if(coupon_gb = 'MAGAZINE'){
                //$scope.search.MONTH = coupon_gb[1];
                //console.log(coupon_gb[1]);
                var month = $scope.item.COUPON_CD.split('_');
                console.log(month[1]);
                $scope.search.MONTH = month[1];
            }

            $scope.getList('ange/coupon', 'couponCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    var couponCnt = data[0].COUPON_CNT;

                    if(couponCnt ==0){

                        if(coupon_gb == 'ANGE'){
                            $scope.item.COUPON_GB = 'ANGE'
                            $scope.item.COUPON_NM = '앙쥬맘 쿠폰(마일리지적립)'+'_'+$scope.item.COUPON_CD;
                        }else if(coupon_gb == 'MAGAZINE'){
                            $scope.item.COUPON_GB = 'MAGAZINE'
                            $scope.item.COUPON_NM = '매거진다운로드(마일리지적립)'+'_'+$scope.item.COUPON_CD;
                        }else if(coupon_gb == 'EXPO'){
                            $scope.item.COUPON_GB = 'EXPO'
                            $scope.item.COUPON_NM = '박람회 쿠폰(마일리지적립)'+'_'+$scope.item.COUPON_CD;
                        }

                        $scope.insertItem('ange/coupon', 'item', $scope.item, true)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 발급 되었습니다.', {size: 'md'});
                                $rootScope.mileage = data.mileage;
                                $scope.getCouponList();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }else{
                        dialogs.notify('알림', '이미 쿠폰 발급을 했습니다.', {size: 'md'});
                        $scope.item.COUPON_CD = '';
                        return;
                    }

                })
                ['catch'](function(error){});


        }

//        $scope.init();
//        $scope.getCouponList();

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCouponList)
            ['catch']($scope.reportProblems);


    }]);
});
