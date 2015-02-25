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
    controllers.controller('module-reply', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', function ($scope, $rootScope, $stateParams, $location, dialogs) {

        /********** 초기화 **********/
        $scope.replyList = [];
        $scope.reply = {};
        $scope.replySearch = {};

        $scope.showCommentDetails = false;
        $scope.showReCommentDetails = false;

        console.log($rootScope.uid);

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


                    for(var i in reply) {

                        //reply[i].COMMENT = reply[i].COMMENT.replaceAll("\r\n", "<br>");
                        console.log(reply[i].COMMENT);
                        $scope.replyList.push(reply[i]);
                    }
                })
                .catch(function(error){$scope.replyList = "";});
        };

        // 의견 등록
        $scope.click_saveComment = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 사용할 수 있습니다.', {size: 'md'});
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
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 답글 등록
        $scope.click_saveReComment = function (item) {

            if($rootScope.uid == null || $rootScope.uid == ''){
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }else if($rootScope.uid == undefined){
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
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
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 수정
        $scope.click_updateReply = function (key, comment) {

            if($rootScope.uid == null || $rootScope.uid == ''){
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }else if($rootScope.uid == undefined){
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
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
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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



        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getReplyList();

//        $scope.getSession()
//            .then($scope.sessionCheck)
//            .catch($scope.reportProblems);


	}]);
});
