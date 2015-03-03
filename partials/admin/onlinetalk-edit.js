/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : onlinetalk-edit.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('onlinetalk-edit', ['$scope', '$stateParams', '$location', '$q', '$filter', 'dialogs', 'CONSTANT', function ($scope, $stateParams, $location, $q, $filter, dialogs, CONSTANT) {

        // 파일 업로드 설정
        $scope.options = { url: CONSTANT.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
        $scope.addEditor = true;

        /********** 초기화 **********/
        // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};

        // 초기화
        $scope.init = function() {

            // ui bootstrap 달력
            $scope.format = 'yyyy-MM-dd';

            $scope.today = function() {
                $scope.item.ETC1 = new Date();
                $scope.item.ETC2 = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.item.ETC1 = null;
                $scope.item.ETC2 = null;
            };

            $scope.open = function($event, opened) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope[opened] = true;
            };
        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });

        /********** 이벤트 **********/
        // 게시판 목록 이동
        $scope.click_showOnlineTalkList = function () {
            $location.url('/onlinetalk/list');
        };

        // 게시판 조회
        $scope.getOnlineTalk = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'discussitem', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"no":files[i].NO, "name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":CONSTANT.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":CONSTANT.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":CONSTANT.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE", "isUpdate": true});
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_saveOnlineTalk = function () {
            $scope.item.PARENT_NO = '0';
            $scope.item.COMM_NO = CONSTANT.COMM_NO_ONLINETALK;
            $scope.item.BOARD_GB = 'TALK';
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.ETC1 = $filter('date')($scope.item.ETC1, 'yyyy-MM-dd');
            $scope.item.ETC2 = $filter('date')($scope.item.ETC2, 'yyyy-MM-dd');
            $scope.item.FILES = $scope.queue;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
                $scope.item.FILES[i].$editor = '';
//                $scope.item.FILES[i].$submit();
            }

            if ($stateParams.id == 0) {
                $scope.insertItem('com/webboard', 'item', $scope.item, false)
                    .then(function(){$location.url('/onlinetalk/list');})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('com/webboard', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){$location.url('/onlinetalk/list');})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getOnlineTalk)
            ['catch']($scope.reportProblems);

    }]);
});
