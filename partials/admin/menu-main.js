/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-16
 * Description : menu-main.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('menu-main', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $stateParams, $location, dialogs, CONSTANT) {

        /********** 초기화 **********/
        // 탭 초기화
//        $scope.tab = 0;
        $scope.tab = 1;

        // 태스크 모델 초기화
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
        $scope.click_editMenu = function (item) {
            $scope.item = item;

            if (item.CATEGORY != null){
                $scope.CATEGORY = angular.fromJson(item.CATEGORY);
            }
        }

        // 메뉴 수정
        $scope.click_updateMenu = function (item) {
            $scope.item.CATEGORY = $scope.CATEGORY;

            $scope.updateItem('admin/menu', 'menu', item.MENU_URL, item, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                    $scope.getMenuList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 메뉴 목록 조회
        $scope.getMenuList = function () {
            $scope.getList('admin/menu', 'menu', {}, {CHANNEL_GB: 'ANGE', CHANNEL_NO: '1'}, true)
                .then(function(data){
                    $scope.list = data;

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
        $scope.getMenuList();
    }]);
});
