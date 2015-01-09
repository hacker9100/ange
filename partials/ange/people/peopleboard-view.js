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
    controllers.controller('peopleboard-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};


        $scope.replyList = [];

        $(document).ready(function(){

            $("#reply_sort_date").addClass("selected");
            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';

            $("#reply_sort_idx").click(function(){
                $scope.search.SORT = 'NO';
                $scope.search.ORDER = 'DESC';
                $("#reply_sort_idx").addClass("selected");
                $("#reply_sort_date").removeClass("selected");

                $scope.replyList = [];
                $scope.getPeopleReplyList();
            });

            $("#reply_sort_date").click(function(){
                $scope.search.SORT = 'REG_DT';
                $scope.search.ORDER = 'DESC';
                $("#reply_sort_date").addClass("selected");
                $("#reply_sort_idx").removeClass("selected");

                $scope.replyList = [];
                $scope.getPeopleReplyList();
            });
        });

        // 초기화
        $scope.init = function(session) {
            // TODO: 수정 버튼은 권한 체크후 수정 권한이 있을 경우만 보임
            if ($stateParams.menu == 'angeroom') {
                $scope.community = "앙쥬맘 수다방";
            } else if($stateParams.menu == 'momstalk') {
                $scope.community = "예비맘 출산맘";
            } else if($stateParams.menu == 'babycare') {
                $scope.community = "육아방";
            } else if($stateParams.menu == 'firstbirthtalk') {
                $scope.community = "돌잔치 톡톡톡";
            } else if($stateParams.menu == 'booktalk') {
                $scope.community = "책수다";
            }

        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            if ($stateParams.menu == 'angeroom') {
                $location.url('/people/angeroom/edit/'+item.NO);
            } else if($stateParams.menu == 'momstalk') {
                $location.url('/people/momstalk/edit/'+item.NO);
            } else if($stateParams.menu == 'babycare') {
                $location.url('/people/babycare/edit/'+item.NO);
            } else if($stateParams.menu == 'firstbirthtalk') {
                $location.url('/people/firstbirthtalk/edit/'+item.NO);
            } else if($stateParams.menu == 'booktalk') {
                $location.url('/people/booktalk/edit/'+item.NO);
            }
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

            if ($stateParams.menu == 'angeroom') {
                $location.url('/people/angeroom/list');
            } else if($stateParams.menu == 'momstalk') {
                $location.url('/people/momstalk/list');
            } else if($stateParams.menu == 'babycare') {
                $location.url('/people/babycare/list');
            } else if($stateParams.menu == 'firstbirthtalk') {
                $location.url('/people/firstbirthtalk/list');
            } else if($stateParams.menu == 'booktalk') {
                $location.url('/people/booktalk/list');
            }
        };

        $scope.addHitCnt = function () {
            $scope.updateItem('com/webboard', 'item', $stateParams.id, {ROLE: true}, false)
                .then(function(){
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 댓글 리스트
        $scope.getPeopleReplyList = function () {

            $scope.search.TARGET_NO = $stateParams.id;

            $scope.getItem('com/reply', 'item', {}, $scope.search, true)
                .then(function(data){

                    var reply = data.COMMENT;

                    console.log('reply =' +reply);
                    console.log('end');

                    for(var i in reply) {
                        $scope.replyList.push({"NO":reply[i].NO,"PARENT_NO":reply[i].PARENT_NO,"COMMENT":reply[i].COMMENT,"RE_COUNT":reply[i].RE_COUNT,"REPLY_COMMENT":reply[i].REPLY_COMMENT,"LEVEL":reply[i].LEVEL,"REPLY_NO":reply[i].REPLY_NO,"NICK_NM":reply[i].NICK_NM,"REG_DT":reply[i].REG_DT});
                    }

                    console.log('RE = '+data.COMMENT);
                    console.log('end');
                })
                .catch(function(error){$scope.replyList = "";});
        };

        // 의견 등록
        $scope.click_savePeopleBoardComment = function () {

            $scope.item.PARENT_NO = 0;
            $scope.item.LEVEL = 1;
            $scope.item.REPLY_NO = 1;
            $scope.item.TARGET_NO = $scope.item.NO;
            $scope.item.TARGET_GB = "BOARD";


            $scope.insertItem('com/reply', 'item', $scope.item, false)
                .then(function(){

                    $scope.search.TARGET_NO = $stateParams.id;
                    $scope.replyList = [];
                    $scope.getPeopleReplyList();

                    $scope.getPeopleBoard();

                    //$scope.replyList.push({"NO":0,"PARENT_NO":$scope.item.PARENT_NO,"COMMENT":$scope.item.COMMENT,"RE_COUNT":0,"REPLY_COMMENT":'',"LEVEL":$scope.item.LEVEL,"REPLY_NO":$scope.item.REPLY_NO});

                    $scope.item.COMMENT = "";
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 답글 등록
        $scope.click_savePeopleBoardReComment = function (item) {

            $scope.reply.PARENT_NO = item.NO;
            $scope.reply.LEVEL = parseInt(item.LEVEL)+1;
            $scope.reply.REPLY_NO = parseInt(item.REPLY_NO)+1;
            $scope.reply.TARGET_GB = "BOARD";
            $scope.reply.TARGET_NO = $stateParams.id;

            $scope.REPLY_COMMENT = $scope.reply;

           $scope.insertItem('com/reply', 'item', $scope.reply, false)
                .then(function(){
                   $scope.search.TARGET_NO = $stateParams.id;
                   $scope.replyList = [];
                   $scope.getPeopleReplyList();
                   $scope.reply.COMMENT = "";

                   $scope.getPeopleBoard();
               })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            if ($stateParams.menu == 'angeroom') {
                $location.url('/people/angeroom/view/'+key);
            } else if($stateParams.menu == 'momstalk') {
                $location.url('/people/momstalk/view/'+key);
            } else if($stateParams.menu == 'babycare') {
                $location.url('/people/babycare/view/'+key);
            } else if($stateParams.menu == 'firstbirthtalk') {
                $location.url('/people/firstbirthtalk/view/'+key);
            } else if($stateParams.menu == 'booktalk') {
                $location.url('/people/booktalk/view/'+key);
            }

        };

        // 이전글
        $scope.getPreBoard = function (){

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

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_PRE = true;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    .catch(function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

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

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_NEXT = true;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    .catch(function(error){$scope.nextBoardView = "";})
            }
        }

        $scope.click_showPeopleBoardDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        if ($stateParams.menu == 'angeroom') {
                            $location.url('/people/angeroom/list');
                        } else if($stateParams.menu == 'momstalk') {
                            $location.url('/people/momstalk/list');
                        } else if($stateParams.menu == 'babycare') {
                            $location.url('/people/babycare/list');
                        } else if($stateParams.menu == 'firstbirthtalk') {
                            $location.url('/people/firstbirthtalk/list');
                        } else if($stateParams.menu == 'booktalk') {
                            $location.url('/people/booktalk/list');
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 공감
        $scope.click_likeCntAdd = function(item){

            $scope.updateItem('com/webboard', 'likeCntitem', item.NO, {}, false)
                .then(function(){

                    dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});
                    $scope.getPeopleBoard();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 스크랩
        $scope.click_scrapAdd = function(item){

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
        $scope.addHitCnt();
        $scope.getPeopleBoard();
        $scope.getPreBoard();
        $scope.getNextBoard();
        $scope.getPeopleReplyList();

    }]);
});
