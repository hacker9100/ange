/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-12-29
 * Description : peopleboard-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('photo-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {
        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.search = {SYSTEM_GB: 'ANGE'};
        $scope.reply = {};

        // 초기화
        $scope.init = function(session) {
        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeoplePhotoEdit = function (item) {
            if ($stateParams.menu == 'peopletaste') {
                $location.url('/people/peopletaste/edit/'+item.NO);
            } else if($stateParams.menu == 'angemodel') {
                $location.url('/people/angemodel/edit/'+item.NO);
            } else if($stateParams.menu == 'recipearcade') {
                $location.url('/people/recipearcade/edit/'+item.NO);
            }
        };

        // 목록 버튼 클릭
        $scope.click_showPeoplePhotoList = function () {
            if ($stateParams.menu == 'peopletaste') {
                $location.url('/people/peopletaste/list');
            } else if($stateParams.menu == 'angemodel') {
                $location.url('/people/angemodel/list');
            } else if($stateParams.menu == 'recipearcade') {
                $location.url('/people/recipearcade/list');
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

                        $scope.item.PARENT_NO = 0;
                        $scope.item.LEVEL = 1;
                        $scope.item.REPLY_NO = 1;
                        $scope.item.TARGET_NO = $scope.item.NO;
                        $scope.item.TARGET_GB = "BOARD";
                        $scope.item.RE_COMMENT = "";

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 답글 등록
        $scope.click_savePeopleBoardComment = function () {

            $scope.item.PARENT_NO = 0;
            $scope.item.LEVEL = 1;
            $scope.item.REPLY_NO = 1;
            $scope.item.TARGET_NO = $scope.item.NO;
            $scope.item.TARGET_GB = "BOARD";


            $scope.insertItem('com/reply', 'item', $scope.item, false)
                .then(function(){

                    $scope.search.TARGET_NO = $stateParams.id;
                    $scope.getPeopleReplyList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 대댓글
        $scope.click_savePeopleBoardReComment = function () {
            //  console.log( $scope.reply.PARENT_NO);

            $scope.reply.PARENT_NO = $("#parent_no").val();
            $scope.reply.LEVEL = parseInt($("#level").val())+1;
            $scope.reply.REPLY_NO = parseInt($("#reply_no").val())+1;
            $scope.reply.TARGET_GB = "BOARD";
            $scope.reply.TARGET_NO = $stateParams.id;


            $scope.insertItem('com/reply', 'item', $scope.reply, false)
                .then(function(){

                    $scope.search.TARGET_NO = $stateParams.id;
                    $scope.getPeopleReplyList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 리스트
        $scope.getPeopleReplyList = function () {

            $scope.search.TARGET_NO = $stateParams.id;

            $scope.getList('com/reply', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    $scope.replyList = data;
                })
                .catch(function(error){$scope.replyList = "";});
        };

        // 이전글
        $scope.getPreBoard = function (){

            if ($stateParams.menu == 'angemodel') {
                $scope.search['COMM_NO'] = '6';
            } else if($stateParams.menu == 'recipearcade') {
                $scope.search['COMM_NO'] = '7';
            } else if($stateParams.menu == 'peopletaste') {
                $scope.search['COMM_NO'] = '8';
            }

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

            if ($stateParams.menu == 'angemodel') {
                $scope.search['COMM_NO'] = '6';
            } else if($stateParams.menu == 'recipearcade') {
                $scope.search['COMM_NO'] = '7';
            } else if($stateParams.menu == 'peopletaste') {
                $scope.search['COMM_NO'] = '8';
            }

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_NEXT = true;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    .catch(function(error){$scope.preBoardView = "";})
            }
        }

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            if ($stateParams.menu == 'angemodel') {
                $location.url('/people/angemodel/view/'+key);
            } else if($stateParams.menu == 'recipearcade') {
                $location.url('/people/recipearcade/view/'+key);
            } else if($stateParams.menu == 'peopletaste') {
                $location.url('/people/peopletaste/view/'+key);
            }

        };

        $scope.click_showPeoplePhotoDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        if ($stateParams.menu == 'peopletaste') {
                            $location.url('/people/peopletaste/list');
                        } else if($stateParams.menu == 'angemodel') {
                            $location.url('/people/angemodel/list');
                        } else if($stateParams.menu == 'recipearcade') {
                            $location.url('/people/recipearcade/list');
                        }
                     ;})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         .catch($scope.reportProblems);*/
        $scope.addHitCnt();
        $scope.getPeopleBoard();
        $scope.getPeopleReplyList();
        $scope.getPreBoard();
        $scope.getNextBoard();


    }]);
});
