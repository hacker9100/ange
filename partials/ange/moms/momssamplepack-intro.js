/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : samplepack-intro.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('samplepack-intro', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {

            $scope.community = "샘플팩 소개";

            var date = new Date();

            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var year = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();

            $scope.month = mm; // 현재

            if(mm < 10){
                mm = '0'+mm;
            }

            if(dd < 10){
                dd = '0'+dd;
            }

            $scope.check = year+mm; // 신규회원 이달말 체크


            $scope.todayDay = dd;
            console.log($scope.todayDay);

            var dt = new Date(year, mm, 0);
            $scope.Day = dt;
            console.log(dt.getDate());
        };

        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 1;

        $scope.search = {};
        $scope.item = {};

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_sampleSeason1List = function () {
//
//            $scope.search.EVENT_GB = 'SAMPLE1';
//            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
//                .then(function(data){
//                    $scope.item.SEASON1 = 'season1';
//
//                })
//                ['catch'](function(error){});
//        };

        // 게시판 목록 이동
//        $scope.click_sampleSeason2List = function () {
//
//            $scope.search.EVENT_GB = 'SAMPLE2';
//            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
//                .then(function(data){
//                    var event_gb = data[0].EVENT_GB;
//                    $scope.item.SEASON2 = 'season2';
//
//                })
//                ['catch'](function(error){});
//        };

        $scope.click_samplepackedit = function(season){

            if($rootScope.uid == '' || $rootScope.uid == null){
                dialogs.notify('알림', '로그인 후 신청이 가능 합니다.', {size: 'md'});
                return;
            }

            if(season == 'season1'){ // 신규회원 --> 현재 이달에 회원가입한 신규회원 체크(조건 : 가입일이 현재달 1일 ~ 현재달 말일)

                var reg_dt = $rootScope.user_info.REG_DT;
                reg_dt = reg_dt.replace('-','');
                reg_dt = reg_dt.substring(0,6);

                console.log($scope.check);

                if($scope.check != reg_dt && $rootScope.role == 'MEMBER'){
                    dialogs.notify('알림', $scope.month+'월에 가입한 신규회원만 신청이 가능합니다.', {size: 'md'});
                    return;
                }

            }else if(season == 'season2'){
                if($scope.todayDay < 25 && $rootScope.role == 'MEMBER'){ // 기존회원 --> 매달 25일 ~ 매달 말일
                    dialogs.notify('알림', '기존회원 샘플팩 신청기간이 아닙니다.', {size: 'md'});
                    return;
                }
            }


            $location.url('/moms/samplepack/edit/'+season);
        }

        /********** 화면 초기화 **********/
/*        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            ['catch']($scope.reportProblems);*/
        $scope.init();
        //$scope.click_sampleSeason1List();
        //$scope.click_sampleSeason2List();

    }]);
});
