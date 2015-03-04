/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : partner-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('partner-list', ['$scope', '$rootScope', '$stateParams', '$location', '$timeout', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, $timeout, dialogs, ngTableParams, CONSTANT) {

        /********** 초기화 **********/
        // 파일 업로드 설정
        $scope.options = { url: CONSTANT.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
            }
        });

        $scope.key = '';
        $scope.item = {COMPANY_GB: 'PARTNER'};
        $scope.search = {COMPANY_GB: 'PARTNER'};
        $scope.showEdit = false;

        // 초기화
        $scope.init = function() {
            // 검색어 조건
            var condition = [{name: "기업명", value: "COMPANY_NM"}, {name: "홈페이지", value: "URL"}];

            $scope.conditions = condition;
            $scope.search.CONDITION = condition[0];
        };

        /********** 이벤트 **********/
        // 배너 등록 버튼 클릭
        $scope.click_showCreateNewPartner = function () {
            $scope.click_reset();

            $scope.showEdit = true;
            $timeout(function() {
                $scope.click_focus('item', 'item_id');
            }, 500);
        };

        // 카테고리 저장 버튼 클릭
        $scope.click_savePartner = function () {
            if ($scope.file == undefined) {
                dialogs.notify('알림', '이미지 파일을 등록해야합니다.', {size: 'md'});
                return;
            }

            $scope.item.FILE = $scope.file;

            if ($scope.key == '') {
                $scope.insertItem('ange/company', 'item', $scope.item, false)
                    .then(function(data){
                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                        $scope.tableParams.reload();
                        $scope.click_cancel();
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('ange/company', 'item', $scope.item.NO, $scope.item, false)
                    .then(function(){
                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                        $scope.tableParams.reload();
                        $scope.click_cancel();
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_cancel = function () {
            $scope.click_reset();
            $scope.showEdit = false;

            $scope.click_focus('search');
        };

        // 초기화
        $scope.click_reset = function () {
            $scope.key = '';
            $scope.item = {COMPANY_GB: 'PARTNER'};
            $scope.file = {};
        };

        // 수정 화면 이동
        $scope.click_showEditPartner = function (item) {
            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $scope.key = item.NO;
            $scope.item = {COMPANY_GB: 'PARTNER'};
            $scope.file = {};
            $scope.showEdit = true;

            $scope.item = item;
            var file = $scope.item.FILE;
            if (file != null) {
                $scope.file = {"name":file.FILE_NM,"size":file.FILE_SIZE,"url":CONSTANT.BASE_URL+file.PATH+file.FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+file.FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file.FILE_GB)};
            }

            $timeout(function() {$scope.click_focus('item', 'item_name');}, 100);
        };

        // 편집 버튼 클릭 시 영역으로 focus 이동
        $scope.click_focus = function (id, name) {
            $('html,body').animate({scrollTop:$('#'+id).offset().top}, 100);
            $('#'+name).focus();
        }

        // 삭제 버튼 클릭
        $scope.click_deletePartner = function (item) {
            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', '삭제 권한이 없습니다.', {size: 'md'});
                return;
            }

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('ange/company', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        };

        // 검색 버튼 클릭
        $scope.click_searchPartner = function () {
            $scope.tableParams.$params.page = 1;
            $scope.tableParams.reload();
        };

        // 페이지 사이즈
        $scope.PAGE_SIZE = 10;

        // 게시판 목록 조회
        $scope.getPartnerList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: $scope.PAGE_SIZE,    // count per page
                sorting: {                  // initial sorting
                    CATEGORY_GB: 'asc'
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('ange/company', 'list', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
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
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getPartnerList)
            ['catch']($scope.reportProblems);
    }]);
});
