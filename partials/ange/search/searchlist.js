/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-03-12
 * Description : searchlist.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('searchlist', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function() {
            $scope.community = "검색";

            $scope.photoList = [];

            var getParam = function(key){
                var _parammap = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    _parammap[decode(arguments[1])] = decode(arguments[2]);
                });

                return _parammap[key];
            };

            $scope.search.SEARCH_KEYWORD = getParam("search_key");
        };

        $scope.search = {};

        $scope.STORY_PAGE_NO = 1;
        $scope.STORY_PAGE_SIZE = 5;
        $scope.STORY_TOTAL_COUNT = 0;

        $scope.BOARD_PAGE_NO = 1;
        $scope.BOARD_PAGE_SIZE = 5;
        $scope.BOARD_TOTAL_COUNT = 0;

        $scope.PHOTO_PAGE_NO = 1;
        $scope.PHOTO_PAGE_SIZE = 6;
        $scope.PHOTO_TOTAL_COUNT = 0;

        $scope.CLINIC_PAGE_NO = 1;
        $scope.CLINIC_PAGE_SIZE = 5;
        $scope.CLINIC_TOTAL_COUNT = 0;


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

        // 스토리 목록 조회
        $scope.getStoryList = function () {

            $scope.search.FILE = false;
            $scope.search.BOARD_GB = 'STORY';

            $scope.getList('ange/search', 'list', {NO: $scope.STORY_PAGE_NO- 1, SIZE: $scope.STORY_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;

                    $scope.STORY_TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.storyList = data;

                })
                ['catch'](function(error){
                $scope.STORY_TOTAL_COUNT = 0; $scope.storyList = "";
            });
        };

        $scope.pageChanged_story = function () {
            $scope.getStoryList();
        };


        // 일반 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.FILE = false;
            $scope.search.BOARD_GB = 'BOARD';

            $scope.getList('ange/search', 'list', {NO: $scope.BOARD_PAGE_NO- 1, SIZE: $scope.BOARD_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.BOARD_TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.boardList = data;

                })
                ['catch'](function(error){$scope.BOARD_TOTAL_COUNT = 0; $scope.boardList = "";});
        };

        $scope.pageChanged_board = function () {
            $scope.getPeopleBoardList();
        };

        // 사진 게시판 목록 조회
        $scope.getPeoplePhotoList = function () {

            $scope.search.FILE = true;
            $scope.search.BOARD_GB = 'PHOTO';

            $scope.getList('ange/search', 'list', {NO: $scope.PHOTO_PAGE_NO- 1, SIZE: $scope.PHOTO_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.PHOTO_TOTAL_COUNT = total_cnt;

                    for(var i in data) {
                        var img = UPLOAD.BASE_URL + '/storage/board/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'BOARD';
                        data[i].FILE = img;
                        //$scope.photoList.push(data[i]);
                    }

                    /*$scope.total(total_cnt);*/
                    $scope.photoList = data;
                })
                ['catch'](function(error){$scope.photoList = ""; $scope.PHOTO_TOTAL_COUNT = 0});
        };

        $scope.pageChanged_photo = function () {
            $scope.getPeoplePhotoList();
        };



        // 상담 게시판 목록 조회
        $scope.getPeopleClinicList = function () {

            $scope.search.FILE = false;
            $scope.search.BOARD_GB = 'CLINIC';

            $scope.getList('ange/search', 'list', {NO: $scope.CLINIC_PAGE_NO-1, SIZE: $scope.CLINIC_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.CLINIC_TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.clinicList = data;

                })
                ['catch'](function(error){$scope.CLINIC_TOTAL_COUNT = 0; $scope.clinicList = "";});
        };

        $scope.pageChanged_clinic = function () {
            $scope.getPeopleClinicList();
        };

        $scope.showSearchResult = function () {

            $scope.getStoryList();
            $scope.getPeopleBoardList();
            $scope.getPeoplePhotoList();
            $scope.getPeopleClinicList();

        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getStoryList)
            .then($scope.getPeopleBoardList)
            .then($scope.getPeoplePhotoList)
            .then($scope.getPeopleClinicList)
            .catch($scope.reportProblems);
    }]);
});
