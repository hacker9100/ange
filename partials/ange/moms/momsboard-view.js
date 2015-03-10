/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peopleboard-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsboard-view', ['$scope', '$rootScope', '$sce',  '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $sce, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};


        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'BOARD';

        $scope.replyList = [];

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $(document).ready(function(){

        });

        // 초기화
        $scope.init = function(session) {
            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'BOARD';
//            if ($stateParams.menu == 'experiencewinner') {
//                $scope.item.EVENT_GB = "EVENT";
//            } else if ($stateParams.menu == 'eventwinner') {
//                $scope.item.EVENT_GB = "EVENT";
//            } else if ($stateParams.menu == 'supporterboard') {
//                $scope.item.EVENT_GB = "SUPPORTER";
//            }

        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            $location.url('/moms/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

            console.log('view $rootScope.NOW_PAGE_NO = '+$rootScope.NOW_PAGE_NO);

            console.log('$stateParams.menu = '+$stateParams.menu);
            if($rootScope.KEYWORD == undefined){
                $rootScope.KEYWORD = '';
            }

            $location.url('/moms/'+$stateParams.menu+'/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);

            //$location.url('/moms/'+$stateParams.menu+'/list/');
        };

        $scope.addHitCnt = function () {
            $scope.updateItem('com/webboard', 'hit', $stateParams.id, {}, false)
                .then(function(){
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }

                        $scope.renderHtml = $sce.trustAsHtml(data.BODY);
                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };



        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/moms/'+$stateParams.menu+'/view/'+key);
        };

        // 이전글
        $scope.getPreBoard = function (){
/*
            if ($stateParams.menu == 'experiencewinner') {
                $scope.search.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'eventwinner') {
                $scope.search.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'supporterboard') {
                $scope.search.EVENT_GB = "SUPPORTER";
            }
*/

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'pre',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    ['catch'](function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){
/*
            if ($stateParams.menu == 'experiencewinner') {
                $scope.search.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'eventwinner') {
                $scope.search.EVENT_GB = "EVENT";
            } else if ($stateParams.menu == 'supporterboard') {
                $scope.search.EVENT_GB = "SUPPORTER";
            }
*/

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'next',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    ['catch'](function(error){$scope.nextBoardView = "";})
            }
        }

        $scope.click_showPeopleBoardDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

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
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

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

                        // [테스트] 등록자아이디, 등록자명, 닉네임 은 세션처리 되면 삭제할예정
                        $scope.scrap.REG_UID = 'hong';
                        $scope.scrap.NICK_NM = '므에에롱';
                        $scope.scrap.REG_NM = '홍길동';

                        $scope.insertItem('com/scrap', 'item', $scope.scrap, false)
                            .then(function(){

                                dialogs.notify('알림', '스크랩 되었습니다.', {size: 'md'});
                                $scope.getPeopleBoard();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.likeFl)
            .then($scope.addHitCnt)
            .then($scope.getPeopleBoard)
            .then($scope.getPreBoard)
            .then($scope.getNextBoard)
            ['catch']($scope.reportProblems);

    }]);
});
