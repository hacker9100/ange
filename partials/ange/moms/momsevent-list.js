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
    controllers.controller('momsevent-list', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'CONSTANT', 'UPLOAD','$timeout', '$sce', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT, UPLOAD, $timeout, $sce) {


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

            //$scope.search.ADA_STATE = 1;
            if ($stateParams.menu == 'eventprocess') {
                $scope.community = "진행중인 이벤트";
                $scope.search.EVENT_GB = "event";
            } else if ($stateParams.menu == 'eventperformance') {
                $scope.community = "공연/체험 이벤트";
                $scope.search.EVENT_GB = "event";
                $scope.search.PERFORM_FL = "Y";
            }

            $scope.search.PROCESS = "process"; // 진행중인 이벤트


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

        var isFirst = true;
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

            $scope.search.NOT_POST = "Y";

            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    var endDate = data[0].ada_date_close;

                    if(endDate >= $scope.todayDate){
                        $scope.showForm = "compForm";
                    }else{
                        $scope.showForm = "reviewForm";
                    }

                    for(var i in data) {
                        var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                        data[i].ada_preview_img = img;
                        $scope.list.push(data[i]);
                    }

                    //$scope.list = data;

                    $scope.$parent.reload = false;
                    $scope.busy = false;
//                    if (isFirst) {
//                        console.log($scope.PAGE_NO);
//
//                        $scope.PAGE_NO = $scope.PAGE_NO + 1;
//                        $scope.PAGE_SIZE = 1;
//                        isFirst = false;
//                    }

                })
                .catch(function(error){$scope.end = true;}); // $scope.TOTAL_COUNT = 0; $scope.list = "";
        };

        // 상세보기
        $scope.view_momsevent = function(key){

            $rootScope.focus = 'view';

            if ($stateParams.menu == 'eventprocess') {
                $location.url('/moms/eventprocess/view/'+key);
            } else if ($stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventperformance/view/'+key);
            }

        }

        //  응모하기
        $scope.comp_momsevent = function(item){

            if (item.ada_state == 0) {
                dialogs.notify('알림', "이벤트 참여 기간이 아닙니다.", {size: 'md'});
                return;
            }

            if ($scope.todayDate < item.ada_date_open || $scope.todayDate > item.ada_date_close) {
                dialogs.notify('알림', "이벤트 참여 기간이 아닙니다.", {size: 'md'});
                return;
            }

            $rootScope.focus = 'comp';

            if ($stateParams.menu == 'eventprocess') {
                $location.url('/moms/eventprocess/view/'+item.ada_idx);
            } else if ($stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventperformance/view/'+item.ada_idx);
            }

        }

        $scope.init();
        $scope.getPeopleBoardList();

    }]);
});
