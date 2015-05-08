/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-10
 * Description : module-reply.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('module-reply', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT) {

        /********** 초기화 **********/
        $scope.replyList = [];
        $scope.reply = {};
        $scope.replySearch = {};

        $scope.showCommentDetails = false;
        $scope.showReCommentDetails = false;

        if ($scope.menu != undefined) {
            $scope.comm_no = $scope.menu.COMM_NO;
        }

        if($rootScope.uid == undefined){
            $scope.nouserid = true;
        }else if($rootScope.uid == null || $rootScope.uid == ''){
            $scope.nouserid = true;
        }else{
            $scope.nouserid = false;
        }

        // 페이징
        $scope.replySearch.PAGE_NO = 1;
        $scope.replySearch.PAGE_SIZE = 10;
        $scope.replySearch.TOTAL_COUNT = 0;

        $scope.pageChanged = function(){

            console.log('Page changed to: ' + $scope.search.PAGE_NO);
            $scope.replyList = [];
            $scope.getReplyList();
        }

        /********** 이벤트 **********/
        var temp_num = '';

        $scope.click_toggleReplyConfig = function (r_num) {
            //alert('photo_menu_' + p_num);
            if (r_num == temp_num) {
                temp_num = '';
            }

            if(r_num){
                document.getElementById('reply_menu_' + r_num).style.display = "block";
            }

            if(temp_num) {
                document.getElementById('reply_menu_' + temp_num).style.display = "none";
            }
            temp_num = r_num;
        };

        // 댓글 리스트
        $scope.getReplyList = function () {

            $scope.replySearch.TARGET_NO = $scope.TARGET_NO;
            $scope.replySearch.TARGET_GB = $scope.TARGET_GB;

            $scope.getItem('com/reply', 'item', {}, $scope.replySearch, true)
                .then(function(data){

                    if(data.COMMENT == null){
                        $scope.replySearch.TOTAL_COUNT = 0;
                    }else{
                        $scope.replySearch.TOTAL_COUNT = data.COMMENT[0].TOTAL_COUNT;
                    }

                    var reply = data.COMMENT;
                    $scope.replyItem = {};

                    for(var i in reply) {

                        if (reply[i].FILE_ID != null) {
                            reply[i].profileImg = CONSTANT.BASE_URL + reply[i].PATH + reply[i].FILE_ID;
                        }

                        $("textarea#comment").val(reply[i].COMMENT);
                        $scope.replyList.push(reply[i]);
                    }
                })
                ['catch'](function(error){$scope.replyList = "";});
        };

        // 의견 등록
        $scope.click_saveComment = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $scope.replyItem.PARENT_NO = 0;
            $scope.replyItem.LEVEL = 1;
            $scope.replyItem.REPLY_NO = 1;
            $scope.replyItem.TARGET_NO = $scope.TARGET_NO;
            $scope.replyItem.TARGET_GB = $scope.TARGET_GB;
            console.log($scope.replyItem.COMMENT);

            //$scope.replyItem.COMMENT = $scope.replyItem.COMMENT.replace("\r\n","");

            $scope.insertItem('com/reply', 'item', $scope.replyItem, false)
                .then(function(){

                    $scope.replySearch.TARGET_NO = $scope.replyItem.NO;
                    $scope.replyList = [];
                    $scope.getReplyList();

                    $scope.replyItem.COMMENT = "";

                    if ($scope.TARGET_GB == 'CONTENT') {
                        $scope.addMileage('REPLY', 'CONTENT');
                    } else if ($scope.TARGET_GB == 'BOARD') {
                        $scope.addMileage('REPLY', $scope.menu.COMM_NO);
                    } else if ($scope.TARGET_GB == 'REVIEW') {
                        $scope.addMileage('REPLY', $scope.TARGET_GB);
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 답글 등록
        $scope.click_saveReComment = function (item) {

            if($rootScope.uid == null || $rootScope.uid == ''){
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }else if($rootScope.uid == undefined){
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $scope.reply.PARENT_NO = item.NO;
            $scope.reply.LEVEL = parseInt(item.LEVEL)+1;
            $scope.reply.REPLY_NO = parseInt(item.REPLY_NO)+1;
            $scope.reply.TARGET_GB = $scope.TARGET_GB;
            $scope.reply.TARGET_NO = $scope.TARGET_NO;

            $scope.REPLY_COMMENT = $scope.replyList;

            $scope.insertItem('com/reply', 'item', $scope.reply, false)
                .then(function(){
                    $scope.replySearch.TARGET_NO = $scope.TARGET_NO;
                    $scope.replyList = [];
                    $scope.getReplyList();
                    $scope.reply.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 블라인드 처리
        $scope.click_blind = function (key){

            /*for(var i=0; i< replyList.length; i++){
             $scope.item.NO = replyList[i].NO;
             }*/

            console.log(key);

            $scope.updateItem('com/reply', 'blind', key, {}, false)
                .then(function(){

                    dialogs.notify('알림', '블라인드 처리가 되었습니다.', {size: 'md'});

                    $scope.replyList = [];
                    $scope.getReplyList();
                    $scope.reply.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 블라인드 처리 해제
        $scope.click_blind_clear = function (key){

            console.log(key);
            $scope.updateItem('com/reply', 'blind_clear', key, {}, false)
                .then(function(){

                    dialogs.notify('알림', '블라인드 처리가 해제 되었습니다.', {size: 'md'});

                    $scope.replyList = [];
                    $scope.getReplyList();
                    $scope.reply.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 수정
        $scope.click_updateReply = function (key, comment) {

            if($rootScope.uid == null || $rootScope.uid == ''){
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }else if($rootScope.uid == undefined){
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            console.log(key);

            $scope.replyItem = {};
            $scope.replyItem.COMMENT = comment;

            $scope.updateItem('com/reply', 'item', key, $scope.replyItem, false)
                .then(function(){

                    $scope.replyItem.COMMENT = "";

                    dialogs.notify('알림', '댓글이 수정 되었습니다.', {size: 'md'});

                    $scope.replyList = [];
                    $scope.getReplyList();
                    $scope.reply.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 삭제
        $scope.click_deleteReply = function (item) {

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/reply', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $scope.replyList = [];
                        $scope.getReplyList();
                        $scope.reply.COMMENT = "";
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }


        $scope.fnByteCal = function () {

            var tempText = $("#comment");
            var tempChar = "";                                        // TextArea의 문자를 한글자씩 담는다
            var tempChar2 = "";                                        // 절삭된 문자들을 담기 위한 변수
            var countChar = 0;                                        // 한글자씩 담긴 문자를 카운트 한다
            var tempHangul = 0;                                        // 한글을 카운트 한다
            var maxSize = 500;                                        // 최대값

            // 글자수 바이트 체크를 위한 반복
            for(var i = 0 ; i < tempText.val().length; i++) {
                tempChar = tempText.val().charAt(i);

                // 한글일 경우 2 추가, 영문일 경우 1 추가
                if(escape(tempChar).length > 4) {
                    countChar += 2;
                    tempHangul++;
                } else {
                    countChar++;
                }
            }

            // 카운트된 문자수가 MAX 값을 초과하게 되면 절삭 수치까지만 출력을 한다.(한글 입력 체크)
            // 내용에 한글이 입력되어 있는 경우 한글에 해당하는 카운트 만큼을 전체 카운트에서 뺀 숫자가 maxSize보다 크면 수행
            if((countChar-tempHangul) > maxSize) {
                alert("최대 글자수를 초과하였습니다.");

                tempChar2 = tempText.val().substr(0, maxSize-1);
                tempText.val(tempChar2);
            }
        }


        // 신고버튼
        $scope.click_boardReport = function (item) {

            $scope.openCounselModal(item, 'lg');

        };

        // 신고버튼 팝업
        $scope.openCounselModal = function (item, size){

            var dlg = dialogs.create('reply_report.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller,data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};

                    console.log($scope.menu.CHANNEL_NO);
                    console.log($scope.menu.NO);

                    $scope.item.CHANNEL_NO = $scope.menu.CHANNEL_NO;
                    $scope.item.MENU_NO = $scope.menu.NO;
                    $scope.item.TARGET_NO = item.NO;
                    $scope.item.TARGET_GB = 'REPLY';
                    $scope.item.DETAIL_GB = 'REPLY';
                    $scope.item.TARGET_NOTE = item.COMMENT;
                    $scope.item.TARGET_UID = item.REG_UID;
                    $scope.item.TARGET_NICK = item.NICK_NM;
                    $scope.item.REG_UID = $scope.uid;
                    $scope.item.REG_NICK = $rootScope.nick;

                    $scope.click_saveReport = function (){

                        $scope.insertItem('ange/notify', 'item', $scope.item, false)
                            .then(function(){

                                dialogs.notify('알림', '신고가 접수되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };


                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.getReplyList();
            },function(){

            });
        };

        // 대댓글 신고버튼
        $scope.click_re_boardReport = function (item, reitem) {

            console.log(item);
            console.log(reitem);

            $scope.reportitem = {};

            $scope.reportitem.TARGET_GB = 'REPLY';
            $scope.reportitem.DETAIL_GB = 'REPLY';
            $scope.reportitem.TARGET_NO = reitem.NO;
            $scope.reportitem.TARGET_NOTE = reitem.COMMENT;
            $scope.reportitem.ETC_NO = reitem.PARENT_NO;
            $scope.reportitem.ETC_GB = 'REPLY';
            $scope.reportitem.ETC_NOTE = item.COMMENT;
            $scope.reportitem.TARGET_UID = reitem.REG_UID;
            $scope.reportitem.TARGET_NICK = reitem.NICK_NM;

            $scope.openReCounselModal($scope.reportitem, 'lg');

        };

        // 대댓글 신고버튼 팝업
        $scope.openReCounselModal = function (item, size){

            var dlg = dialogs.create('reply_report.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller,data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};

                    $scope.item = item;
                    $scope.item.CHANNEL_NO = $scope.menu.CHANNEL_NO;
                    $scope.item.MENU_NO = $scope.menu.NO;
                    $scope.item.REG_UID = $scope.uid;
                    $scope.item.REG_NICK = $rootScope.nick;

                    $scope.click_saveReport = function (){

                        $scope.insertItem('ange/notify', 'item', $scope.item, false)
                            .then(function(){

                                dialogs.notify('알림', '신고가 접수되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };


                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.getReplyList();
            },function(){

            });
        };

        // 메시지 버튼 클릭
        $scope.click_sendMessage = function (item) {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $scope.openViewMessageRegModal(null, item, 'lg');
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getReplyList();

//        $scope.getSession()
//            .then($scope.sessionCheck)
//            ['catch']($scope.reportProblems);


    }]);
});
