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
                ['catch'](function(error){$scope.BOARD_TOTAL_COUNT = 0; $scope.boardList = "";});
        };

        // 일반 게시판 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (comm_no, key) {

            $rootScope.COMM_NO = comm_no;

            $scope.board_item = {};
            $scope.board_item.COMM_NO = comm_no;
            $scope.board_item.NO = key;
            $scope.openViewBoardModal($scope.board_item, 'lg'); //{NO : item.key}
        };

        $scope.openViewBoardModal = function (item, size) {
            var dlg = dialogs.create('myangeboard_view.html',
                ['$scope', '$modalInstance', '$controller', 'data','UPLOAD', function($scope, $modalInstance, $controller, data,UPLOAD) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.getItem('com/webboard', 'item', item.NO, {}, false)
                        .then(function(data){
                            $scope.item = data;
                            var files = data.FILES;
                            for(var i in files) {
                                $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                            }
                            //$scope.search.TARGET_NO = $stateParams.id;
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    $scope.click_ok = function () {
                        //$scope.getMessageList();
                        $modalInstance.close();
                    };

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.getPeopleBoardList();
            },function(){

            });
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

                    for(var i in data) {
                        var img = UPLOAD.BASE_URL + '/storage/board/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'BOARD';
                        data[i].FILE = img;
                        $scope.photoList.push(data[i]);

                        console.log($scope.photoList);
                    }

                    /*$scope.total(total_cnt);*/
                    //$scope.photoList = data;
                })
                ['catch'](function(error){$scope.photoList = ""; $scope.PHOTO_TOTAL_COUNT = 0});
        };

        // 사진 게시판 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (comm_no, key) {

            $scope.photo_item = {};
            $scope.photo_item.COMM_NO = comm_no;
            $scope.photo_item.NO = key;
            $scope.openViewPhotoModal($scope.photo_item, 'lg'); //{NO : item.key}
        };

        $scope.openViewPhotoModal = function (item, size) {
            var dlg = dialogs.create('myangephoto_view.html',
                ['$scope', '$modalInstance', '$controller', 'data','CONSTANT', function($scope, $modalInstance, $controller, data,CONSTANT) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.getItem('com/webboard', 'item', item.NO, {}, false)
                        .then(function(data){
                            var files = data.FILES;
                            //console.log(JSON.stringify(data));
                            for(var i in files) {
                                if (files[i].FILE_GB == 'MAIN') {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                                    //var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                    var img = CONSTANT.BASE_URL+ files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                    data.MAIN_FILE = img;
                                }
                            }

                            $scope.item = data;

                            $scope.item.PARENT_NO = 0;
                            $scope.item.LEVEL = 1;
                            $scope.item.REPLY_NO = 1;
                            $scope.item.TARGET_NO = $scope.item.NO;
                            $scope.item.TARGET_GB = "BOARD";
                            $scope.item.RE_COMMENT = "";
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    $scope.click_ok = function () {
                        //$scope.getMessageList();
                        $modalInstance.close();
                    };

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.photoList = [];
                $scope.getPeoplePhotoList();
            },function(){

            });
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
                ['catch'](function(error){$scope.CLINIC_TOTAL_COUNT = 0; $scope.clinicList = "";});
        };

        // 상담 게시판 조회 화면 이동
        $scope.click_showViewPeopleClinic = function (comm_no, key) {
            $scope.clinic_item = {};
            $scope.clinic_item.COMM_NO = comm_no;
            $scope.clinic_item.NO = key;
            $scope.openViewClinicModal($scope.clinic_item, 'lg'); //{NO : item.key}
        };

        $scope.openViewClinicModal = function (item, size) {
            var dlg = dialogs.create('myangeclinic_view.html',
                ['$scope', '$modalInstance', '$controller', 'data','CONSTANT', function($scope, $modalInstance, $controller, data,CONSTANT) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.getItem('com/webboard', 'item', item.NO, {}, false)
                        .then(function(data){
                            $scope.item = data;

                            var files = data.FILES;
                            for(var i in files) {
                                $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":CONSTANT.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":CONSTANT.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":CONSTANT.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                            }


                            if(data.BOARD_ST == 'D'){
                                if(data.REPLY_YN == 'N'){
                                    $scope.item.BODY = "작성자가 삭제한 글 입니다";
                                } else {
                                    $scope.item.BODY = "작성자가 삭제한 글 입니다"+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                                }
                            }else{
                                if(data.BLIND_FL == 'N'){
                                    if(data.REPLY_YN == 'N'){
                                        $scope.item.BODY;
                                    } else {
                                        $scope.item.BODY = data.BODY+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                                    }
                                }else{
                                    if(data.REPLY_YN == 'N'){
                                        $scope.item.BODY = "관리자에 의해 블라인드 처리가 된 글입니다";
                                    } else {
                                        $scope.item.BODY = "관리자에 의해 블라인드 처리가 된 글입니다"+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                                    }
                                }
                            }

                            $scope.reply.SUBJECT = "[답변]"+$scope.item.SUBJECT;
                            $scope.reply.PARENT_NO = $scope.item.NO;
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    $scope.click_ok = function () {
                        //$scope.getMessageList();
                        $modalInstance.close();
                    };

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.getPeoplePhotoList();
            },function(){

            });
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
//            .then($scope.getPeopleBoardList)
//            .then($scope.getPeoplePhotoList)
//            .then($scope.getPeopleClinicList)
            .catch($scope.reportProblems);
    }]);
});
