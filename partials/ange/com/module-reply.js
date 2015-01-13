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
                dialogs.notify('알림', '로그인 후 의견을 등록 할 수 있습니다.', {size: 'md'});
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
                dialogs.notify('알림', '로그인 후 댓글을 등록 할 수 있습니다.', {size: 'md'});
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

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getReplyList();

//        $scope.getSession()
//            .then($scope.sessionCheck)
//            .catch($scope.reportProblems);


	}]);
});
