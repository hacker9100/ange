/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2014-12-28
 * Description : storycontent-view-popup.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("storycontent-view-popup", ['$scope', '$sce', '$controller', '$rootScope', '$location', '$modalInstance', '$q', 'UPLOAD', 'data', function($scope, $sce, $controller, $rootScope, $location, $modalInstance, $q, UPLOAD, data) {

        angular.extend(this, $controller('ange-common', {$scope: $scope}));

        /********** 초기화 **********/

        // 초기화
        $scope.init = function () {

        };

        /********** 콘텐츠 랜더링 **********/
        $scope.renderHtml = function(html_code) {
            return html_code;
//            return $sce.trustAsHtml(html_code);
        };

        /********** 이벤트 **********/
        $scope.click_ok = function () {
            $modalInstance.close();
        };

        // 콘텐츠 조회
        $scope.getContent = function () {
            var deferred = $q.defer();
            $q.all([
                    $scope.getItem('cms/task', 'item', data.NO, {}, false).then(function(data){ /* $scope.task = data; */ }),
                    $scope.getItem('cms/content', 'item', data.NO, {}, false).then(function(data){
                        $scope.item = data;
                    }),
                    $scope.getList('ad/banner', 'list', {NO:$scope.PAGE_NO, SIZE:1}, $scope.search, false).then(function(data){
                        for (var i in data) {
                            if (data[i].FILE.PATH != undefined) {
                                var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                data[i].FILE = img;
                                $scope.ad = data[i];
                            }
                        }
                    }),
                    $scope.getItem('com/reply', 'item', {}, $scope.search, {TARGET_NO: data.NO, REPLY_GB: 'CONTENT'}).then(function(data){
                        $scope.reply = data.COMMENT;
                    })
                ])
                .then( function(results) {
                    deferred.resolve();
                },function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        // 댓글 리스트
        $scope.getPeopleReplyList = function () {

            $scope.search.TARGET_NO = data.NO;
            $scope.search.REPLE_GB = 'CONTENT';

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

        $scope.init();
        $scope.getContent();
    }]);
});

