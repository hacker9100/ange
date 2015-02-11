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
    controllers.controller('momsevent-list', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD','$timeout', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD, $timeout) {

        $scope.search = {};

        $scope.$parent.reload = false;
        $scope.busy = false;
        $scope.end = false;
        // 페이징
        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 6;

        angular.element(document).ready(function () {
            angular.element(window).scroll(function () {
                $timeout(function(){
                    //$scope.images;
                    $scope.isLoading = false;
                },1000);

                $timeout(function() {
                    $scope.isLoading = true;
                });

//                console.log("scrollTop : "+Math.round(angular.element(document).scrollTop()));
//                console.log("document-window : "+ (angular.element(document).height() - angular.element(window).height() - ($scope.PAGE_NO + 1)));

                if (Math.round(angular.element(window).scrollTop()) >= angular.element(document).height() - angular.element(window).height() - ($scope.PAGE_NO + 1)) {
                    if (!$scope.busy) {
                        //$scope.PAGE_NO++;
                        $scope.PAGE_SIZE++;
                        console.log($scope.PAGE_SIZE);
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

        // 초기화
        $scope.init = function(session) {

            $scope.option = {title: '롤링 배너', api:'ad/banner', size: 5, id: 'main', type: 'banner', gb: 5, dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            $scope.search.ADA_STATE = 1;
            if ($stateParams.menu == 'eventprocess') {
                $scope.community = "진행중인 이벤트";
                $scope.search.EVENT_GB = "event";
            } else if ($stateParams.menu == 'eventperformance') {
                $scope.community = "공연/체험 이벤트";
                $scope.search.EVENT_GB = "event";
                $scope.search.PERFORM_FL = "Y";
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

            if ($stateParams.menu == 'angeroom') {
                $scope.search['COMM_NO'] = '1';
            } else if($stateParams.menu == 'momstalk') {
                $scope.search['COMM_NO'] = '2';
            } else if($stateParams.menu == 'babycare') {
                $scope.search['COMM_NO'] = '3';
            } else if($stateParams.menu == 'firstbirthtalk') {
                $scope.search['COMM_NO'] = '4';
            } else if($stateParams.menu == 'booktalk') {
                $scope.search['COMM_NO'] = '5';
            }

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE = true;

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

                    // 메인이미지
                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
                            data[i].MAIN_FILE = img;
                        }
                    }
                    $scope.list = data;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
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
        $scope.comp_momsevent = function(key){

            $rootScope.focus = 'comp';

            if ($stateParams.menu == 'eventprocess') {
                $location.url('/moms/eventprocess/view/'+key);
            } else if ($stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventperformance/view/'+key);
            }

        }

        $scope.init();
        $scope.getPeopleBoardList();

    }]);
});
