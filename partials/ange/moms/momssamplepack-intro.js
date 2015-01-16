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

            var today = year+'-'+mm+'-'+dd;

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
        $scope.click_sampleSeason1List = function () {

            $scope.search.EVENT_GB = 'SAMPLE1';
            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    $scope.item.SEASON1 = 'season1';

                })
                .catch(function(error){});
        };

        // 게시판 목록 이동
        $scope.click_sampleSeason2List = function () {

            $scope.search.EVENT_GB = 'SAMPLE2';
            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var event_gb = data[0].EVENT_GB;
                    $scope.item.SEASON2 = 'sesaon2';

                })
                .catch(function(error){});
        };

        $scope.click_samplepackedit = function(season){

            if($rootScope.uid == '' || $rootScope.uid == null){
                dialogs.notify('알림', '로그인 후 신청이 가능 합니다.', {size: 'md'});
                return;
            }

            if(season == 'sesaon2'){
                if($scope.todayDay < 25){
                    console.log('a');
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
            .catch($scope.reportProblems);*/
        $scope.init();
        $scope.click_sampleSeason1List();
        $scope.click_sampleSeason2List();

    }]);
});
