/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-02-02
 * Description : talk-main.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('talk-main', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        /********** 초기화 **********/
        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
            }
        });

        $scope.search = {};

        // 사용자 모델
        $scope.item = {};

        // 날짜 콤보박스
        var year = [];
        var month = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();
        var nowMonth = now.getMonth() + 1;
        var nowDay = now.getDate();
        var lastDay = ( new Date( nowYear, nowMonth, 0) ).getDate();

        $scope.showEdit = false;

        // 초기화
        $scope.init = function() {
            for (var i = 2014; i <= nowYear; i++) {
                year.push(i);
            }

            for (var i = 1; i <= 12; i++) {
                month.push(i < 10 ? '0' + i : i + '');
            }

            for (var i = 1; i <= lastDay; i++) {
                day.push(i < 10 ? '0' + i : i + '');
            }

            $scope.years = year;
            $scope.months = month;
            $scope.days = day;

            $scope.search.YEAR = nowYear;
            $scope.search.MONTH = (nowMonth < 10) ? '0' + nowMonth : nowMonth + '';
            $scope.search.DAY = nowDay;

            $scope.click_showEditTalk();
        };

        /********** 이벤트 **********/
        // 날짜 변경
        $scope.change_date = function () {
            day = [];
            lastDay = ( new Date( $scope.item.YEAR, $scope.item.MONTH, 0) ).getDate();

            for (var i = 1; i <= lastDay; i++) {
                day.push(i);
            }

            $scope.days = day;
            $scope.search.DAY = '';
        };

        // 일자 클릭
        $scope.click_day = function (day) {
            $scope.search.DAY = day;

            $scope.click_showEditTalk();
        };

        // 톡 저장 버튼 클릭
        $scope.click_saveTalk = function () {

            if ($scope.file == undefined) {
                dialogs.notify('알림', '이미지를 등록해야합니다.', {size: 'md'});
                return;
            }

            $scope.item.FILE = $scope.file;

            if ($scope.item.NO == undefined) {
                $scope.insertItem('ange/talk', 'item', $scope.item, false)
                    .then(function(data){dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'}); $scope.item.NO = data})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('ange/talk', 'item', $scope.item.NO, $scope.item, false)
                    .then(function(){dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_cancel = function () {
//            $scope.item = {};
        };

        // 수정 화면 이동
        $scope.click_showEditTalk = function () {
            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

//            $scope.item = {};

            $scope.getItem('ange/talk', 'item', null, $scope.search, false)
                .then(function(data) {
                    $scope.item = data;

                    console.log(JSON.stringify(data.FILE))
                    var file = data.FILE;
                    if (file) {
                        $scope.file = {"name":file.FILE_NM,"size":file.FILE_SIZE,"url":UPLOAD.BASE_URL+file.PATH+file.FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+file.FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file.FILE_GB)};
                    }

//                    $scope.click_focus('item', 'item_name');
                })
                ['catch'](function(error){
                    $scope.item = {};
                    $scope.item = $scope.search;
                    $scope.file = '';
                });
        };

        // 편집 버튼 클릭 시 영역으로 focus 이동
        $scope.click_focus = function (id, name) {
            $('html,body').animate({scrollTop:$('#'+id).offset().top}, 100);
            $('#'+name).focus();
        }

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            ['catch']($scope.reportProblems);
    }]);
});
