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
    controllers.controller('momsexperience-list', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD' ,'$timeout', function ($scope, $stateParams, $location, dialogs, UPLOAD, $timeout) {

        $(document).ready(function() {
            $(window).scroll(function() {

                $timeout(function(){
                    //$scope.images;
                    $scope.isLoading = false;
                },1000);

                $timeout(function() {
                    $scope.isLoading = true;
                });

                if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                    var scope = angular.element($("#listr")).scope();
                    scope.$apply(function(){
                        scope.count = scope.count + 4;
                        alert("-->>")
                    });
                }
            });
        });

        $scope.search = {};
        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'experienceprocess') {
                $scope.community = "진행중인 체험단";
                $scope.search.EVENT_GB = "EXPERIENCE";
                $scope.search.PROCESS = "process";
                $scope.menu = "experienceprocess"
            } else if ($stateParams.menu == 'experiencepast') {
                $scope.community = "지난 체험단";
                $scope.search.EVENT_GB = "EXPERIENCE";
                $scope.search.PAST = "past";
                $scope.menu = "experiencepast"
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

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE = true;
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                            data[i].MAIN_FILE = img;
                        }
                    }


                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 상세보기
        $scope.view_momsexperience = function(key){

            if ($stateParams.menu == 'experienceprocess') {
               $location.url('/moms/experienceprocess/view/'+key);
            } else if ($stateParams.menu == 'experiencepast') {
                $location.url('/moms/experiencepast/view/'+key);
            }

        }

        //  응모하기
        $scope.comp_momsexperience = function(key){

            if ($stateParams.menu == 'experienceprocess') {
                $location.url('/moms/experienceprocess/view/'+key);
            } else if ($stateParams.menu == 'experiencepast') {
                $location.url('/moms/experiencepast/view/'+key);
            }

        }

        $scope.getPeopleBoardList();
    }]);
});
