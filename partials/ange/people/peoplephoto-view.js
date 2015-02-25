/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-12-29
 * Description : peoplephoto-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peoplephoto-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {
        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.search = {SYSTEM_GB: 'ANGE'};
        $scope.reply = {};

        $scope.replyList = [];

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'PHOTO';


        // 초기화
        $scope.init = function(session) {

            $scope.community_show = $stateParams.menu;

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'PHOTO';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                .catch(function(error){});

//            if ($stateParams.menu == 'angemodel') {
//                $scope.community = "앙쥬모델 선발대회";
//                $scope.community_show = "angemodel";
//            } else if($stateParams.menu == 'recipearcade') {
//                $scope.community = "레시피 아케이드";
//                $scope.community_show = "recipearcade";
//            } else if($stateParams.menu == 'peopletaste') {
//                $scope.community = "피플 맛집";
//                $scope.community_show = "peopletaste";
//            }
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        $scope.likeFl = function (){
            if($rootScope.uid != '' && $rootScope.uid != null){

                $scope.search.NO = $stateParams.id;
                $scope.search.TARGET_GB = 'BOARD';

                $scope.getItem('com/webboard', 'like', $stateParams.id, $scope.search, false)
                    .then(function(data){

                        if(data.TOTAL_COUNT == 0){
                            $scope.LIKE_FL = 'N';
                        }else{
                            $scope.LIKE_FL = data.LIKE_FL;
                            console.log($scope.LIKE_FL);
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }else{
                $scope.LIKE_FL = 'N';
            }

        }

        // 공감
        $scope.click_likeCntAdd = function(item, like_fl){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 공감이 가능합니다.', {size: 'md'});
                return;
            }

            $scope.likeItem = {};
            $scope.likeItem.LIKE_FL = like_fl;
            $scope.likeItem.TARGET_NO = item.NO;
            $scope.likeItem.TARGET_GB = 'BOARD';

            $scope.insertItem('com/like', 'item', $scope.likeItem, false)
                .then(function(){
                    var afterLike = $scope.likeItem.LIKE_FL == 'Y' ? 'N' : 'Y';
                    if (afterLike == 'Y') {
                        dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.queue = [];
                        $scope.getPeopleBoard();
                    } else {
                        dialogs.notify('알림', '공감 취소되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.queue = [];
                        $scope.getPeopleBoard();
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            /*            $scope.updateItem('com/webboard', 'likeCntitem', item.NO, {}, false)
             .then(function(){

             dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});
             $scope.getPeopleBoard();
             })
             .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});*/
        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeoplePhotoEdit = function (item) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeoplePhotoList = function () {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
        };

        $scope.addHitCnt = function () {
            $scope.updateItem('com/webboard', 'hit', $stateParams.id, {}, false)
                .then(function(){
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                .then(function(data){
                    var files = data.FILES;
                    //console.log(JSON.stringify(data));
                    for(var i in files) {
                        if (files[i].FILE_GB == 'MAIN') {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                            var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
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
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };


        // 이전글
        $scope.getPreBoard = function (){

            $scope.search.COMM_NO = $scope.menu.COMM_NO;

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_PRE = true;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    .catch(function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

            $scope.search.COMM_NO = $scope.menu.COMM_NO;

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_NEXT = true;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    .catch(function(error){$scope.nextBoardView = "";})
            }
        }

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

        };

        $scope.click_showPeoplePhotoDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                     ;})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }


        // 스크랩
        $scope.click_scrapAdd = function(item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 스크랩이 가능합니다.', {size: 'md'});
                return;
            }

            $scope.search['TARGET_NO'] = item.NO;

            // $scope.search['USER_UID'] = 'test'; 세션 uid를 저장해야함
            $scope.search['REG_UID'] = 'hong'; // 테스트

            $scope.getList('com/scrap', 'check', {}, $scope.search, false)
                .then(function(data){
                    var scrap_cnt = data[0].SCRAP_CNT;

                    if (scrap_cnt == 1) {
                        dialogs.notify('알림', '이미 스크랩 된 게시물 입니다.', {size: 'md'});
                    } else {

                        $scope.scrap = {};

                        $scope.scrap.TARGET_NO = item.NO;
                        $scope.scrap.TARGET_GB = item.BOARD_GB;

                        $scope.insertItem('com/scrap', 'item', $scope.scrap, false)
                            .then(function(){

                                dialogs.notify('알림', '스크랩 되었습니다.', {size: 'md'});
                                $scope.getPeopleBoard();
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         .catch($scope.reportProblems);*/
        $scope.init();
        $scope.likeFl();
//        $scope.addHitCnt();
        $scope.getPeopleBoard();
        $scope.getPreBoard();
        $scope.getNextBoard();
    }]);
});
