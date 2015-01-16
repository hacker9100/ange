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

        /********** 이벤트 **********/
        // 댓글 리스트
        $scope.getReplyList = function () {

            $scope.replySearch.TARGET_NO = $scope.TARGET_NO;
            $scope.replySearch.TARGET_GB = $scope.TARGET_GB;

            $scope.getItem('com/reply', 'item', {}, $scope.replySearch, true)
                .then(function(data){
                    var reply = data.COMMENT;
                    for(var i in reply) {

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
            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 사용할 수 있습니다.', {size: 'md'});
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

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getReplyList();

//        $scope.getSession()
//            .then($scope.sessionCheck)
//            .catch($scope.reportProblems);


	}]);
});
