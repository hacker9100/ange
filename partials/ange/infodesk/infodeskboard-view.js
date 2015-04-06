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
    controllers.controller('infodeskboard-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

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
            if ($stateParams.menu == 'notice') {
                $scope.community = "공지사항";
                $scope.menu = "notice";
                $scope.search.COMM_NO = 51;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'system') {
                $scope.community = "시스템공지";
                $scope.menu = "system";
                $scope.search.COMM_NO = 52;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'faq') {
                $scope.community = "자주묻는질문";
                $scope.menu = "faq";
                $scope.search.COMM_NO = 53;
                $scope.search.COMM_GB = 'FAQ';
            } else if($stateParams.menu == 'qna') {
                $scope.community = "문의/게시판";
                $scope.menu = "qna";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 54;
                $scope.search.COMM_GB = 'QNA';
            } else if($stateParams.menu == 'myqna') {
                $scope.community = "내 질문과 답변";
                $scope.menu = "myqna";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 55;
                $scope.search.COMM_GB = 'QNA';
            }

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
            $scope.search.SYSTEM_GB = 'ANGE';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            if ($stateParams.menu == 'notice') {
                $location.url('/infodesk/notice/edit/'+item.NO);
            } else if($stateParams.menu == 'system') {
                $location.url('/infodesk/system/edit/'+item.NO);
            } else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/edit/'+item.NO);
            } else if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/edit/'+item.NO);
            } else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/edit/'+item.NO);
            }
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

            console.log('view $rootScope.NOW_PAGE_NO = '+$rootScope.NOW_PAGE_NO);

            console.log('$stateParams.menu = '+$stateParams.menu);

            if($rootScope.KEYWORD == undefined){
                $rootScope.KEYWORD = '';
            }

            if($rootScope.CONDITION == undefined){
                $rootScope.CONDITION = 'SUBJECT';
            }

            if($rootScope.NOW_PAGE_NO == undefined){
                $rootScope.NOW_PAGE_NO = 1;
            }

            if ($stateParams.menu == 'notice') {
                $location.url('/infodesk/notice/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if($stateParams.menu == 'system') {
                $location.url('/infodesk/system/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            }
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

                        if(data.REPLY_YN == 'N'){
                            $scope.item.BODY;
                        } else {
                            $scope.item.BODY = data.BODY+"<br><br><br><br><br><p><font color='blue'>관리자 답변<br>"+data.REPLY_BODY+"</font></p>";
                        }

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
                ['catch'](function(error){$scope.replyList = "";});
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
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            if ($stateParams.menu == 'notice') {
                $location.url('/infodesk/notice/view/'+key);
            } else if($stateParams.menu == 'system') {
                $location.url('/infodesk/system/view/'+key);
            } else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/view/'+key);
            } else if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/view/'+key);
            } else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/view/'+key);
            }

        };

        // 이전글
        $scope.getPreBoard = function (){

            if ($stateParams.menu == 'notice') {
                $scope.search['COMM_NO'] = '51';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'system') {
                $scope.search['COMM_NO'] = '52';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'faq') {
                $scope.search['COMM_NO'] = '53';
            }else if($stateParams.menu == 'qna') {
                $scope.search['COMM_NO'] = '54';
            } else if($stateParams.menu == 'myqna') {
                $scope.search['COMM_NO'] = '54';
                $scope.search['REG_UID'] = $scope.uid;
            }

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_PRE = true;

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

            if ($stateParams.menu == 'notice') {
                $scope.search['COMM_NO'] = '51';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'system') {
                $scope.search['COMM_NO'] = '52';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'faq') {
                $scope.search['COMM_NO'] = '53';
            }else if($stateParams.menu == 'qna') {
                $scope.search['COMM_NO'] = '54';
            } else if($stateParams.menu == 'myqna') {
                $scope.search['COMM_NO'] = '54';
                $scope.search['REG_UID'] = $scope.uid;
            }
            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_NEXT = true;

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
                        if ($stateParams.menu == 'notice') {
                            $location.url('/infodesk/notice/list');
                        } else if($stateParams.menu == 'system') {
                            $location.url('/infodesk/system/list');
                        } else if($stateParams.menu == 'faq') {
                            $location.url('/infodesk/faq/list');
                        } else if($stateParams.menu == 'qna') {
                            $location.url('/infodesk/qna/list');
                        } else if($stateParams.menu == 'myqna') {
                            $location.url('/infodesk/myqna/list');
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 공감
        $scope.click_likeCntAdd = function(item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 공감이 가능합니다.', {size: 'md'});
                return;
            }

            $scope.updateItem('com/webboard', 'likeCntitem', item.NO, {}, false)
                .then(function(){

                    dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});
                    $scope.getPeopleBoard();
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
                       /* $scope.scrap.REG_UID = 'hong';
                        $scope.scrap.NICK_NM = '므에에롱';
                        $scope.scrap.REG_NM = '홍길동';*/

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

        // 전문가답변 등록
        $scope.click_saveInfoDeskQnaComment = function () {

            $scope.reply.SYSTEM_GB = 'ANGE';

            if ($stateParams.menu == 'qna' || $stateParams.menu == 'myqna') {
                $scope.reply.COMM_NO = '17';
            }

            $scope.reply.PARENT_NO = $scope.item.NO;

            $scope.insertItem('com/webboard', 'item', $scope.reply, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                    /*                    if ($stateParams.menu == 'childdevelop') {
                     $location.url('/people/childdevelop/view/'+$scope.item.NO);
                     } else if($stateParams.menu == 'chlidoriental') {
                     $location.url('/people/chlidoriental/view/'+$scope.item.NO);
                     } else if($stateParams.menu == 'obstetrics') {
                     $location.url('/people/obstetrics/view/'+$scope.item.NO);
                     } else if($stateParams.menu == 'momshealth') {
                     $location.url('/people/momshealth/view/'+$scope.item.NO);
                     } else if($stateParams.menu == 'financial') {
                     $location.url('/people/financial/view/'+$scope.item.NO);
                     }*/
                    if($stateParams.menu == 'qna') {
                        $location.url('/infodesk/qna/list');
                    } else if($stateParams.menu == 'myqna') {
                        $location.url('/infodesk/myqna/list');
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.addHitCnt)
            .then($scope.getPeopleBoard)
            .then($scope.getPreBoard)
            .then($scope.getNextBoard)
            .then($scope.getPeopleReplyList)
            ['catch']($scope.reportProblems);

        console.log($scope.uid);

//        $scope.init();
//        $scope.addHitCnt();
//        $scope.getPeopleBoard();
//        $scope.getPreBoard();
//        $scope.getNextBoard();
//        $scope.getPeopleReplyList();

    }]);
});
