/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-28
 * Description : download-main.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('download-main', ['$scope', '$rootScope', '$stateParams', '$location', '$timeout', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, $timeout, dialogs, ngTableParams, UPLOAD) {

        /********** 초기화 **********/
        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
            }
        });

        $scope.search = {SYSTEM_GB: 'ANGE', CHANNEL_NO: '6', ETC: 'DOWNLOAD', FILE: true};

        $scope.showEdit = false;

        // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/
        // 메뉴 저장 버튼 클릭
        $scope.click_saveMenu = function () {
            if ($scope.file == undefined) {
                dialogs.notify('알림', '다운로드 파일을 등록해야합니다.', {size: 'md'});
                return;
            }

            $scope.item.FILE = $scope.file;

            $scope.updateItem('com/menu', 'menu', $scope.item.MENU_URL, $scope.item, false)
                .then(function(){dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.click_cancel = function () {
            $scope.item = {};
            $scope.showEdit = false;

            $scope.click_focus('list');
        };

        // 수정 화면 이동
        $scope.click_showEditMenu = function (item) {
            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $scope.item = {};
            $scope.showEdit = true;

            $scope.item = item;
            var file = $scope.item.FILE;
            if (file != null) {
                $scope.file = {"name":file.FILE_NM,"size":file.FILE_SIZE,"url":UPLOAD.BASE_URL+file.PATH+file.FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+file.FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file.FILE_GB)};
            }

            $timeout(function() {$scope.click_focus('item', 'item_name');}, 100);

//            $scope.getItem('com/menu', 'menu', item.NO, {}, false)
//                .then(function(data) {
//                    console.log(JSON.stringify(item))
//                    $scope.item = data;
//
//                    var file = data.FILE;
//                    if (file != null) {
//                        $scope.file = {"name":file.FILE_NM,"size":file.FILE_SIZE,"url":UPLOAD.BASE_URL+file.PATH+file.FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+file.FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file.FILE_GB)};
//                    }
//
//                    $scope.click_focus('item', 'item_name');
//                })
//                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 편집 버튼 클릭 시 영역으로 focus 이동
        $scope.click_focus = function (id, name) {
            $('html,body').animate({scrollTop:$('#'+id).offset().top}, 100);
            $('#'+name).focus();
        }

        // 페이지 사이즈
        $scope.PAGE_SIZE = 10;

        // 게시판 목록 조회
        $scope.getMenuList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: $scope.PAGE_SIZE,    // count per page
                sorting: {                  // initial sorting
                    REG_DT: 'desc'
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('com/menu', 'menu', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_COUNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);
                        })
                        ['catch'](function(error){$scope.TOTAL_COUNT = 0; $defer.resolve([]);});
                }
            });
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMenuList)
            ['catch']($scope.reportProblems);
    }]);
});
