/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : notice-edit.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('notice-edit', ['$scope', '$stateParams', '$location', '$q', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, $q, dialogs, UPLOAD) {

        //<p><input name="버튼" id="btn" onclick="test();" type="button" value="test" /></p>

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
        $scope.addEditor = true;

        /********** 초기화 **********/
        // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};

        // 초기화
        $scope.init = function() {
            var deferred = $q.defer();

            $scope.getList('ange/community', 'list', null, {SYSTEM_GB: 'ANGE', COMM_GB: 'NOTICE'}, false)
                .then(function(data){
                    $scope.comm = data;
                    $scope.item.COMM = data[0];

                    deferred.resolve();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

            return deferred.promise;
        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });

        /********** 이벤트 **********/
        // 게시판 목록 이동
        $scope.click_showNoticeList = function () {
            $location.url('/notice/list');
        };

        // 게시판 조회
        $scope.getNotice = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        $scope.item.NOTICE_FL == 'Y' ? $scope.item.NOTICE_FL = true : $scope.item.NOTICE_FL = false;

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"no":files[i].NO, "name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE", "isUpdate": true});
                        }

                        for (var i in $scope.comm) {
                            if ($scope.comm[i].NO == $scope.item.COMM_NO) {
                                $scope.item.COMM = $scope.comm[i];
                                break;
                            }
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_saveNotice = function () {
            $scope.item.PARENT_NO = '0';
            $scope.item.BOARD_GB = 'NOTICE';
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.COMM_NO = $scope.item.COMM.NO;
            $scope.item.FILES = $scope.queue;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
                $scope.item.FILES[i].$editor = '';
//                $scope.item.FILES[i].$submit();
            }

            if ($stateParams.id == 0) {
                $scope.insertItem('com/webboard', 'item', $scope.item, false)
                    .then(function(){$location.url('/notice/list');})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('com/webboard', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){$location.url('/notice/list');})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getNotice)
            ['catch']($scope.reportProblems);

    }]);
});
