/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangewriting.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangewriting', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function() {
            $scope.community = "내 활동 조회";

            $scope.photoList = [];
        };

        $scope.search = {};

        $scope.BOARD_PAGE_NO = 1;
        $scope.BOARD_PAGE_SIZE = 5;
        $scope.BOARD_TOTAL_COUNT = 0;

        $scope.PHOTO_PAGE_NO = 1;
        $scope.PHOTO_PAGE_SIZE = 6;
        $scope.PHOTO_TOTAL_COUNT = 0;

        $scope.CLINIC_PAGE_NO = 1;
        $scope.CLINIC_PAGE_SIZE = 5;
        $scope.CLINIC_TOTAL_COUNT = 0;


        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.BOARD_PAGE_NO);
            $scope.getPeopleBoardList();
        };

        $scope.pagePhotoChanged = function() {
            console.log('Page changed to: ' + $scope.PHOTO_PAGE_NO);

            $scope.photoList = [];

            $scope.getPeoplePhotoList();

//            $scope.PHOTO_PAGE_NO = 1;
//            $scope.PHOTO_PAGE_SIZE = 6;
//            $scope.PHOTO_TOTAL_COUNT = 0;


        };

        $scope.pageClinicChanged = function() {
            console.log('Page changed to: ' + $scope.CLINIC_PAGE_NO);
            $scope.getPeopleClinicList();
        };

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "등록자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;
        $scope.init();


        $scope.search.REG_UID = $rootScope.uid;

        // 일반 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.BOARD_GB = 'BOARD';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC'

            $scope.getList('com/webboard', 'list', {NO: $scope.BOARD_PAGE_NO- 1, SIZE: $scope.BOARD_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.BOARD_TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.boardList = data;

                })
                .catch(function(error){$scope.BOARD_TOTAL_COUNT = 0; $scope.boardList = "";});
        };

        // 일반 게시판 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (comm_no, key) {

            if (comm_no == 1) {
                $location.url('/people/angeroom/view/'+key);
            } else if(comm_no == 2) {
                $location.url('/people/momstalk/view/'+key);
            } else if(comm_no == 3) {
                $location.url('/people/babycare/view/'+key);
            } else if(comm_no == 4) {
                $location.url('/people/firstbirthtalk/view/'+key);
            } else if(comm_no == 5) {
                $location.url('/people/booktalk/view/'+key);
            }
        };

        // 사진 게시판 목록 조회
        $scope.getPeoplePhotoList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.BOARD_GB = 'PHOTO';
            $scope.search.FILE = true;
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC'


            $scope.getList('com/webboard', 'list', {NO: $scope.PHOTO_PAGE_NO- 1, SIZE: $scope.PHOTO_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.PHOTO_TOTAL_COUNT = search_total_cnt;

//                    for(var i in data) {
//                        if (data[i].FILE != null) {
//                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
//                            data[i].MAIN_FILE = img;
//
//                        }
//                    }
                    for(var i in data) {

//                        if (data[i].FILE != null) {
//                            var img =  UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID; //UPLOAD.BASE_URL
//                            data[i].MAIN_FILE = img;
//                        }
//                        if (data[i].FILE.PATH != undefined) {
//                            var img = UPLOAD.BASE_URL + '/storage/board/' + 'thumbnail/' + data[i].FILE.FILE_ID;
//                            data[i].TYPE = 'BOARD';
//                            data[i].FILE = img;
//                            $scope.list.push(data[i]);
//                        }
//
//                        console.log($scope.list);

                        var img = UPLOAD.BASE_URL + '/storage/board/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'BOARD';
                        data[i].FILE = img;
                        $scope.photoList.push(data[i]);

                        console.log($scope.photoList);
                    }

                    /*$scope.total(total_cnt);*/
                    //$scope.photoList = data;
                })
                .catch(function(error){$scope.photoList = ""; $scope.PHOTO_TOTAL_COUNT = 0});
        };

        // 사진 게시판 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (comm_no, key) {

            if (comm_no == 6) {
                $location.url('/people/angemodel/view/'+key);
            } else if(comm_no ==7) {
                $location.url('/people/recipearcade/view/'+key);
            } else if(comm_no == 8) {
                $location.url('/people/peopletaste/view/'+key);
            }
        };


        // 상담 게시판 목록 조회
        $scope.getPeopleClinicList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC'
            $scope.search.BOARD_GB = 'CLINIC';

            $scope.getList('com/webboard', 'list', {NO: $scope.CLINIC_PAGE_NO-1, SIZE: $scope.CLINIC_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.CLINIC_TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.clinicList = data;

                })
                .catch(function(error){$scope.CLINIC_TOTAL_COUNT = 0; $scope.clinicList = "";});
        };

        // 상담 게시판 조회 화면 이동
        $scope.click_showViewPeopleClinic = function (comm_no, key) {

            if (comm_no == 9) {
                $location.url('/people/childdevelop/view/'+key);
            } else if(comm_no == 10) {
                $location.url('/people/chlidoriental/view/'+key);
            } else if(comm_no == 11) {
                $location.url('/people/obstetrics/view/'+key);
            } else if(comm_no == 12) {
                $location.url('/people/momshealth/view/'+key);
            } else if(comm_no == 13) {
                $location.url('/people/financial/view/'+key);
            }
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            .then($scope.getPeoplePhotoList)
            .then($scope.getPeopleClinicList)
            .catch($scope.reportProblems);

//        $scope.init();
//
//        $scope.getPeopleBoardList();
//        $scope.getPeoplePhotoList();
//        $scope.getPeopleClinicList();

    }]);
});
