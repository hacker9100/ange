/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsexperience-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsexperience-list', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'CONSTANT', 'UPLOAD' ,'$timeout', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT, UPLOAD, $timeout) {

        angular.element(document).ready(function () {
            angular.element('#common').scroll(function () {
                $timeout(function(){
                    //$scope.images;
                    $scope.isLoading = false;
                },1000);

                $timeout(function() {
                    $scope.isLoading = true;
                });

//                console.log("common : "+ (angular.element('#common').prop('scrollHeight') - angular.element('#common').height()));
//                console.log("scrollTop : "+(angular.element('#common').scrollTop() ));

                if (angular.element('#common').scrollTop() + 100 >= angular.element('#common').prop('scrollHeight') - angular.element('#common').height()) {
                    if (!$scope.busy) {
                        $scope.PAGE_NO++;
                        //$scope.getContentList();
                        //$scope.getPeopleBoardList();
                        $scope.getPeopleBoardList();
                    }
//                    var scope = angular.element($("#listr")).scope();
//                    scope.$apply(function(){
//                        scope.PAGE_NO++;
//                        $scope.getContentList();
//                    });
                }
            });
        });

        $scope.search = {};
//        $scope.$parent.reload = false;
//        $scope.busy = false;
//        $scope.end = false;
        $scope.$parent.reload = false;
        $scope.busy = false;
        $scope.end = false;
        $scope.list = [];

        // 페이징
        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 15;
        //$scope.list = {};

        // 초기화
        $scope.init = function() {
            $scope.option = {title: '롤링 배너', api:'ad/banner', size: 5, id: 'main', type: 'banner', gb: 5, dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            if ($stateParams.menu == 'experienceprocess') {
                $scope.community = "진행중인 체험단";
                $scope.search.EVENT_GB = "exp";
                //$scope.search.ADA_STATE = 1;
                $scope.search.PROCESS = "process";
                $scope.menu = "experienceprocess"
            } else if ($stateParams.menu == 'experiencepast') {
                $scope.community = "지난 체험단";
                $scope.search.EVENT_GB = "exp";
                //$scope.search.ADA_STATE = 0;
                $scope.search.PAST = "past";
                $scope.menu = "experiencepast"
            }

            var date = new Date();

            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var year = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();

            if(mm < 10){
                mm = '0'+mm;
            }

            if(dd < 10){
                dd = '0'+dd;
            }

            var today = year+'-'+mm+'-'+dd;

            $scope.todayDate = today;
        };

        /********** 이벤트 **********/
        // 게시판 목록 조회
        $scope.$parent.getPeopleBoardList = function () {

            $scope.busy = true;
            if ($scope.$parent.reload) {
                $scope.end = false;
                $scope.list = [];
                $scope.PAGE_NO = 0;
            }

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE = true;
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.search.NOT_SAMPLE = "Y";

            $scope.search.SORT = 'a.ada_date_open';
            $scope.search.ORDER = 'DESC';
            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;


                    for(var i in data) {
                        var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                        data[i].ada_preview_img = img;
                        $scope.list.push(data[i]);
                    }

                    //$scope.list = data;

                    $scope.$parent.reload = false;
                    $scope.busy = false;

                })
                ['catch'](function(error){ $scope.end = true; }); // $scope.TOTAL_COUNT = 0; $scope.list = "";
//                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.comp_momsexperience = function (item){

//            if (item.ada_state == 0) {
//                dialogs.notify('알림', "체험단 참여 기간이 아닙니다.", {size: 'md'});
//                return;
//            }
//
//            if ($scope.todayDate < item.ada_date_open || $scope.todayDate > item.ada_date_close) {
//                dialogs.notify('알림', "체험단 참여 기간이 아닙니다.", {size: 'md'});
//                return;
//            }

            if ($stateParams.menu == 'experienceprocess') {
                $location.url('/moms/experienceprocess/view/'+item.ada_idx);
            } else if ($stateParams.menu == 'experiencepast') {
                $location.url('/moms/experiencepast/view/'+item.ada_idx);
            }

        }
        $scope.init();
        $scope.getPeopleBoardList();
    }]);
});
