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
    controllers.controller('momsevent-list', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.search = {};
        $scope.PAGE_SIZE = 10;

        // 초기화
        $scope.init = function(session) {

            if ($stateParams.menu == 'eventprocess') {
                $scope.community = "진행중인 이벤트";
                $scope.search.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'eventperformance') {
                $scope.community = "공연/체험 이벤트";
                $scope.search.EVENT_GB = "EVENT";
                $scope.search.PERFORM_FL = "Y";
            }
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
/*        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            .catch($scope.reportProblems);*/
        $scope.init();

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

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
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;


                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                            data[i].MAIN_FILE = img;
                        }
                    }

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 상세보기
        $scope.view_momsevent = function(key){

            if ($stateParams.menu == 'eventprocess') {
                $location.url('/moms/eventprocess/view/'+key);
            } else if ($stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventperformance/view/'+key);
            }

        }

        //  응모하기
        $scope.comp_momsevent = function(key){

            if ($stateParams.menu == 'eventprocess') {
                $location.url('/moms/eventprocess/view/'+key);
            } else if ($stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventperformance/view/'+key);
            }

        }

        $scope.getPeopleBoardList();

    }]);
});
