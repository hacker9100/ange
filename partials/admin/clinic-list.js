/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : notice-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('clinic-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        /********** 초기화 **********/
        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data[0] !== 'undefined') {
                if (data[0].kind == 'manager')
                    $scope.file1 = data[0];
                else if (data[0].kind == 'main')
                    $scope.file2 = data[0];
            }
        });

        $scope.search = {COMM_GB: 'CLINIC'};

        $scope.showEdit = false;

        // 초기화
        $scope.init = function() {
            // 검색어 조건
            var condition = [{name: "상담실명", value: "COMM_NM"}, {name: "전문가", value: "COMM_MG"}];

            $scope.conditions = condition;
            $scope.search.CONDITION = condition[0];
        };

        /********** 이벤트 **********/
        // 등록 버튼 클릭
        $scope.click_showCreateNewCommunity = function () {
            $location.url('/clinic/edit/0');
        };

        // 조회 화면 이동
        $scope.click_showViewCommunity = function (key) {
            $location.url('/clinic/view/'+key);
        };

        // 카테고리 저장 버튼 클릭
        $scope.click_saveCommunity = function () {
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

            $scope.updateItem('ange/community', 'item', $scope.item.NO, $scope.item, false)
                .then(function(){dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.click_cancel = function () {
            $scope.item = {};
            $scope.showEdit = false;

            $scope.click_focus('search');
        };

        // 수정 화면 이동
        $scope.click_showEditCommunity = function (item) {
            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $scope.item = {};
            $scope.showEdit = true;

            $scope.getItem('ange/community', 'item', item.NO, {}, false)
                .then(function(data) {
                    console.log(JSON.stringify(item))
                    $scope.item = data;

                    var file = data.FILES;
                    for(var i in file) {
                        if (file[i].FILE_GB == 'MANAGER')
                            $scope.file1 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":UPLOAD.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file[i].FILE_GB)};
                        else if (file[i].FILE_GB == 'MAIN')
                            $scope.file2 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":UPLOAD.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file[i].FILE_GB)};
                    }

                    $scope.click_focus('item', 'item_name');
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

//            $location.path('/clinic/edit/'+item.NO);
        };

        // 편집 버튼 클릭 시 영역으로 focus 이동
        $scope.click_focus = function (id, name) {
            $('html,body').animate({scrollTop:$('#'+id).offset().top}, 100);
            $('#'+name).focus();
        }

        // 삭제 버튼 클릭
        $scope.click_deleteCommunity = function (item) {
            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', '삭제 권한이 없습니다.', {size: 'md'});
                return;
            }

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

//            dialog.result.then(function(btn){
//                $scope.deleteItem('ange/community', 'item', item.NO, false)
//                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
//                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//            }, function(btn) {
//                return;
//            });
        };

        // 검색 버튼 클릭
        $scope.click_searchCommunity = function () {
            $scope.tableParams.$params.page = 1;
            $scope.tableParams.reload();
        };

        // 페이지 사이즈
        $scope.PAGE_SIZE = 10;

        // 게시판 목록 조회
        $scope.getCommunityList = function () {
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

                    $scope.getList('ange/community', 'list', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_COUNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);
                        })
                        .catch(function(error){$scope.TOTAL_COUNT = 0; $defer.resolve([]);});
                }
            });
        };

        // 사용자 선택 버튼 클릭
        $scope.click_selectManager = function () {
            $scope.openModal(true, {ROLE_ID : 'CLINIC'});
        }

        $scope.openModal = function (modal, search, size) {
            var dlg = dialogs.create('/partials/admin/contact-list.html',
                ['$scope', '$modalInstance', '$controller', function ($scope, $modalInstance, $controller) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('content', {$scope: $scope}));

                    $scope.isModal = true;
                    $scope.search = search;

                    // 사용자 선택 클릭
                    $scope.click_selectUser = function (item) {
                        $modalInstance.close(item);
                    }

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };

                }], search, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(user){
                $scope.item.COMM_MG = user.USER_ID;
                $scope.item.COMM_MG_NM = user.USER_NM;
            },function(){

            });
        }

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getCommunityList)
            .catch($scope.reportProblems);
    }]);
});
