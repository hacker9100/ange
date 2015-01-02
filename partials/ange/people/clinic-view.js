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
    controllers.controller('peopleclinic-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {
        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.search = {SYSTEM_GB: 'ANGE'};

        // 초기화
        $scope.init = function(session) {

        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleClinicEdit = function (item) {

            if ($stateParams.menu == 'childrendevelopment') {
                $location.url('/childrendevelopment/edit/'+item.NO);
            } else if($stateParams.menu == 'orientalpediatrics') {
                $location.url('/orientalpediatrics/edit/'+item.NO);
            } else if($stateParams.menu == 'obstetrics') {
                $location.url('/obstetrics/edit/'+item.NO);
            } else if($stateParams.menu == 'momshealth') {
                $location.url('/momshealth/edit/'+item.NO);
            } else if($stateParams.menu == 'financial') {
                $location.url('/financial/edit/'+item.NO);
            }

        };

        // 목록 버튼 클릭
        $scope.click_showPeopleClinicList = function () {
            if ($stateParams.menu == 'childrendevelopment') {
                $location.url('/childrendevelopment/list');
            } else if($stateParams.menu == 'orientalpediatrics') {
                $location.url('/orientalpediatrics/list');
            } else if($stateParams.menu == 'obstetrics') {
                $location.url('/obstetrics/list');
            } else if($stateParams.menu == 'momshealth') {
                $location.url('/momshealth/list');
            } else if($stateParams.menu == 'financial') {
                $location.url('/financial/list');
            }
        };

/*
        $scope.addHitCnt = function () {
            $scope.updateItem('com/webboard', 'item', $stateParams.id, {ROLE: true}, false)
                .then(function(){
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }
*/

        // 게시판 조회
        $scope.getPeopleClinic = function () {
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
            $scope.insertItem('com/reply', 'item', $scope.item, false)
                .then(function(){
                    $scope.item.COMMENT = "";
                    $scope.tableParams.reload();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 대댓글 등록
        $scope.click_savePeopleBoardReComment = function () {

            $scope.item.LEVEL = parseInt($scope.item.LEVEL+1);
            $scope.item.REPLY_NO = parseInt($scope.item.REPLY_NO+1);

            $scope.insertItem('com/reply', 'item', $scope.item, false)
                .then(function(){
                    $scope.item.COMMENT = "";
                    $scope.item.RE_COMMENT = "";
                    $scope.tableParams.reload();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 리스트
        $scope.getPeopleReplyList = function () {

            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: 20,    // count per page
                sorting: {                  // initial sorting
                    REG_DT: 'desc'
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {

                    $scope.search.TARGET_NO = $stateParams.id;

                    $scope.getList('com/reply', 'list', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            $defer.resolve(data);

                            $scope.item.PARENT_NO = data.NO;
                        })
                        .catch(function(error){ $defer.resolve([]);});
                }
            });
        };


        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         .catch($scope.reportProblems);*/
        //$scope.addHitCnt();
        $scope.getPeopleClinic();
        $scope.getPeopleReplyList();


    }]);
});
