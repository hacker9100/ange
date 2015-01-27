/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-26
 * Description : order-main.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('order-main', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, CONSTANT, UPLOAD) {

        /********** 초기화 **********/
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 썸네일을 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data[0] !== 'undefined') {
                if (data[0].kind == 'icon')
                    $scope.file1 = data[0];
                else if (data[0].kind == 'detail')
                    $scope.file2 = data[0];
            }
        });

        // 탭 초기화
        $scope.tab = 0;
//        $scope.tab = 1;

        // 메뉴 모델 초기화
        $scope.subItem = {};
        $scope.item = {};

        // 선택 카테고리
        $scope.CATEGORY = [];
        // 카테고리 데이터
        $scope.category = [];

        // 카테고리 선택 콤보박스 설정
        $scope.select_settings = {externalIdProp: '', idProp: 'NO', displayProp: 'CATEGORY_NM', dynamicTitle: false, showCheckAll: false, showUncheckAll: false};

        // 초기화
        $scope.init = function() {
            $scope.getList('cms/category', 'list', {}, {}, false)
                .then(function(data){
                    $scope.category = data;

                    var category_a = [];
                    var category_b = [];

                    for (var i in data) {
                        var item = data[i];

                        if (item.CATEGORY_GB == '1' && item.CATEGORY_ST == '0') {
                            category_a.push(item);
                        } else if (item.CATEGORY_GB == '2' && item.CATEGORY_ST == '0' && item.PARENT_NO == '0') {
                            category_b.push(item);
                        }
                    }

                    $scope.category_a = category_a;
                    $scope.category_b = category_b;
                })
        };

        /********** 이벤트 **********/
            // 카테고리 주제 대분류 선택
        $scope.$watch('CATEGORY_M', function(data) {
            var category_s = [];

            if (data != undefined) {
                for (var i in $scope.category) {
                    var item = $scope.category[i];

                    if (item.PARENT_NO == data.NO && item.CATEGORY_GB == '2' && item.CATEGORY_ST == '0' && item.PARENT_NO != '0') {
                        category_s.push(item);
                    }
                }
            }
            $scope.category_s = category_s;
        });

        // 추가된 카테고리 클릭
        $scope.click_removeCategory = function(idx) {
            $scope.CATEGORY.splice(idx, 1);
        }

        $scope.click_selectTab = function (tabIdx) {
            $scope.tab = tabIdx;
        };

        // 목록갱신 버튼 클릭
        $scope.click_refreshList = function () {
            $scope.getUserList();
        };

        // 등록 버튼 클릭
        $scope.click_createNewUser = function () {
            $location.url('/user/edit/0');
        };

        // 자주쓰는 목록 버튼 클릭
        $scope.click_saveSearch = function () {
            var item = angular.copy($scope.search);
            item.LIST_NM = $scope.LIST_NM;
            item.CHECKED = $scope.action.CHECKED;

            if ($scope.action.CHECKED == 'C' ) {
                if ($scope.check_user.length == 0) {
                    dialogs.notify('알림', '선택한 회원이 없습니다..', {size: 'md'});
                    return;
                }

                item.USER_ID_LIST = angular.copy($scope.check_user);
            }

            $scope.insertItem('admin/user_list', 'item', item, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 자주쓰는 목록 제외 버튼 클릭
        $scope.click_removeSearch = function () {
            var item = $scope.search.ADMIN_SAVE_LIST;

            $scope.deleteItem('admin/user_list', 'list', item.NO, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 제외되었습니다.', {size: 'md'});
                    $scope.saveList.splice($scope.saveList.indexOf($scope.search.ADMIN_SAVE_LIST), 1);
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 조회 화면 이동
        $scope.click_showViewUser = function (key) {
            $location.url('/user/view/'+key);
        };

        // 수정 화면 이동
        $scope.click_showEditUser = function (item) {
            $location.url('/user/edit/'+item.NO);
        };

        // 자주쓰는 목록 사용자 제거
        $scope.click_removeUser = function (item) {
            $scope.deleteItem('admin/user_list', 'item', item.USER_ID, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 제외되었습니다.', {size: 'md'});
                    $scope.getUserList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 메뉴 수정
        $scope.click_editSubMenu = function (item) {
            $scope.subItem = item;
            $scope.file1 = {};
            $scope.file2 = {};

            var file = item.FILES;
            for(var i in file) {
                if (file[i].FILE_GB == 'ICON')
                    $scope.file1 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":UPLOAD.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":"icon"};
                else
                    $scope.file2 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":UPLOAD.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":"detail"};
            }

            $scope.click_focus('subMenu');
        }

        // 메뉴 수정
        $scope.click_editMenu = function (item) {
            $scope.item = item;
            $scope.item.COMM_GB = item.COMM.COMM_GB;
            $scope.CATEGORY = angular.fromJson(item.CATEGORY);

            $scope.click_focus('menu');
        }

        // 메뉴 등록
        $scope.click_insertSubMenu = function () {
            if ($scope.file1 == undefined) {
                dialogs.notify('알림', '아이콘 이미지를 등록해야합니다.', {size: 'md'});
                return;
            }

            if ($scope.file1 == undefined) {
                dialogs.notify('알림', '상세 이미지를 등록해야합니다.', {size: 'md'});
                return;
            }

            $scope.subItem.SYSTEM_GB = 'ANGE';
            $scope.subItem.FILES = [];
            $scope.subItem.FILES.push($scope.file1);
            $scope.subItem.FILES.push($scope.file2);

            for(var i in $scope.item.FILES) {
                $scope.subItem.FILES[i].$destroy = '';
            }

            $scope.insertItem('admin/menu', 'submenu', $scope.subItem, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                    $scope.getMenuList0();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 메뉴 수정
        $scope.click_updateSubMenu = function () {
            if ($scope.file1 == undefined) {
                dialogs.notify('알림', '아이콘 이미지를 등록해야합니다.', {size: 'md'});
                return;
            }

            if ($scope.file1 == undefined) {
                dialogs.notify('알림', '상세 이미지를 등록해야합니다.', {size: 'md'});
                return;
            }

            $scope.subItem.SYSTEM_GB = 'ANGE';
            $scope.subItem.FILES = [];
            $scope.subItem.FILES.push($scope.file1);
            $scope.subItem.FILES.push($scope.file2);

            for(var i in $scope.item.FILES) {
                $scope.subItem.FILES[i].$destroy = '';
            }

            $scope.updateItem('admin/menu', 'submenu', $scope.subItem.NO, $scope.subItem, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                    $scope.getMenuList0();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 메뉴 등록
        $scope.click_insertMenu = function () {
//            $scope.item.CATEGORY = $scope.CATEGORY;
            $scope.item.CHANNEL_NO = '2';
            $scope.item.MENU_URL = '/people/'+$scope.item.MENU_ID+'/list';
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.MENU_ST = 'Y';

            $scope.insertItem('admin/menu', 'menu', $scope.item, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                    $scope.getMenuList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 메뉴 수정
        $scope.click_updateMenu = function () {
            $scope.item.CATEGORY = $scope.CATEGORY;

            $scope.updateItem('admin/menu', 'menu', $scope.item.MENU_URL, $scope.item, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                    $scope.getMenuList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 카테고리 등록 버튼 클릭 시 등록하는 영역으로 focus 이동
        $scope.click_focus = function (id) {
            $('html,body').animate({scrollTop:$('#'+id).offset().top}, 100);
            $('#item_gb').focus();
        }

        // 취소
        $scope.click_cancel = function () {
            $scope.item = {};
            $scope.CATEGORY = {};
        };

        // 메뉴 목록 조회
        $scope.getMenuList0 = function () {
            $scope.getList('admin/menu', 'submenu', {}, {SYSTEM_GB: 'ANGE', MENU_ID: 'home'}, true)
                .then(function(data){
                    console.log(JSON.stringify(data))
                    $scope.list0 = data;

//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
                })
                .catch(function(error){alert(error)});
        };

        // 메뉴 목록 조회
        $scope.getMenuList1 = function () {
            $scope.getList('admin/menu', 'menu', {}, {SYSTEM_GB: 'ANGE', CHANNEL_NO: '1'}, true)
                .then(function(data){
                    $scope.list1 = data;

//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
                })
                .catch(function(error){alert(error)});
        };

        // 메뉴 목록 조회
        $scope.getMenuList2 = function () {
            $scope.getList('admin/menu', 'menu', {}, {SYSTEM_GB: 'ANGE', CHANNEL_NO: '2'}, true)
                .then(function(data){
                    $scope.list2 = data;

//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
                })
                .catch(function(error){alert(error)});
        };

        /********** 화면 초기화 **********/
//        $scope.getSession()
//            .then($scope.sessionCheck)
////            .then($scope.permissionCheck)
//            .catch($scope.reportProblems);

        $scope.init();
        $scope.getMenuList0();
//        $scope.getMenuList1();
//        $scope.getMenuList2();
    }]);
});
