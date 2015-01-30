/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-27
 * Description : event-edit.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('event-edit', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data[0] !== 'undefined') {
                if (data[0].kind == 'thumb')
                    $scope.file1 = data[0];
                else if (data[0].kind == 'main')
                    $scope.file2 = data[0];
                else if (data[0].kind == 'banner')
                    $scope.file3 = data[0];
                else if (data[0].kind == 'mobile')
                    $scope.file4 = data[0];
            }
        });

        /********** 초기화 **********/
        // 첨부파일 초기화
        $scope.queue = [];

        // 상품 초기화
        $scope.item = {};

        // 초기화
        $scope.init = function() {
            $scope.event_gb = [{value: "EXPERIENCE", name: "체험단"}, {value: "EVENT", name: "이벤트"}];
            $scope.event_tp = [{value: "BASIC", name: "기본"}, {value: "REPLY", name: "댓글"}, {value: "PHOTO", name: "사진"}, {value: "QUIZ", name: "퀴즈"}, {value: "MUSICAL", name: "뮤지컬"}, {value: "PERFORM", name: "공연"}];

            $scope.item.EVENT_GB = $scope.event_gb[0];
            $scope.item.EVENT_TP = $scope.event_tp[0];
        };

        // CK Editor
//        $scope.$on("ckeditor.ready", function( event ) {
//            $scope.isReady = true;
//        });

        /********** 이벤트 **********/
        // 게시판 목록 이동
        $scope.click_showEventList = function () {
            $location.url('/event/list');
        };

        // 이벤트 조회
        $scope.getEvent = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('ange/event', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        $scope.item.CLUB_FL == 'Y' ? $scope.item.CLUB_FL = true : $scope.item.CLUB_FL = false;

                        for (var i in $scope.event_gb) {
                            if ($scope.event_gb[i].value == $scope.item.EVENT_GB) {
                                $scope.item.EVENT_GB = $scope.event_gb[i];
                                break;
                            }
                        }

                        var file = data.FILES;
                        for(var i in file) {
                            if (file[i].FILE_GB == 'THUMB')
                                $scope.file1 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":UPLOAD.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file[i].FILE_GB)};
                            else if (file[i].FILE_GB == 'MAIN')
                                $scope.file2 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":UPLOAD.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file[i].FILE_GB)};
                            else if (file[i].FILE_GB == 'BANNER')
                                $scope.file3 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":UPLOAD.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file[i].FILE_GB)};
                            else if (file[i].FILE_GB == 'MOBILE')
                                $scope.file4 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":UPLOAD.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file[i].FILE_GB)};
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 이벤트 등록
        $scope.click_saveEvent = function () {
            if ($scope.file1 == undefined) {
                dialogs.notify('알림', '썸네일 이미지를 등록해야합니다.', {size: 'md'});
                return;
            }

            if ($scope.file2 == undefined) {
                dialogs.notify('알림', '메인 이미지를 등록해야합니다.', {size: 'md'});
                return;
            }

            $scope.item.FILES = [];
            $scope.item.FILES.push($scope.file1);
            $scope.item.FILES.push($scope.file2);
            $scope.item.FILES.push($scope.file3);
            $scope.item.FILES.push($scope.file4);

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
            }

            if ($stateParams.id == 0) {
                $scope.insertItem('ange/event', 'item', $scope.item, false)
                    .then(function(data){
                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                        $location.url('/event/list');
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('ange/event', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){
                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                        $location.url('/event/list');
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };





        // 상품 저장 버튼 클릭
        $scope.click_saveProduct = function () {
            $scope.item.FILES = $scope.queue;

            var ckMain = false;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
                $scope.item.FILES[i].$editor = '';

                if ($scope.item.FILES[i].kind == 'MAIN') ckMain = true;
            }

            if (!ckMain) {
                dialogs.notify('알림', '메인이미지를 선택하세요.', {size: 'md'});
                return;
            }

            if ($stateParams.id == 0) {
                $scope.insertItem('ange/product', 'item', $scope.item, false)
                    .then(function(){$location.url('/product/list');})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('ange/product', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){$location.url('/product/list');})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getEvent)
            .catch($scope.reportProblems);

    }]);
});
