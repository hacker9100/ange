/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-16
 * Description : site-main.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('site-main', ['$scope', '$stateParams', '$location', 'dialogs', '$timeout', 'CONSTANT', function ($scope, $stateParams, $location, dialogs, $timeout, CONSTANT) {

        /********** 초기화 **********/
        $scope.options = { url: CONSTANT.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 썸네일을 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data[0] !== 'undefined') {
                if (data[0].kind == 'icon' || data[0].kind == 'manager')
                    $scope.file1 = data[0];
                else if (data[0].kind == 'detail' || data[0].kind == 'main')
                    $scope.file2 = data[0];
            }
        });

        // 탭 초기화
        $scope.tab = 0;
        $scope.type = 'submenu';
//        $scope.tab = 1;

        $scope.showEdit = false;

        // 메뉴 모델 초기화
        $scope.key = '';
        $scope.item = {};

        // 선택 카테고리
        $scope.CATEGORY = [];
        // 카테고리 데이터
        $scope.category = [];

        // 카테고리 선택 콤보박스 설정
        $scope.select_settings = {externalIdProp: '', idProp: 'NO', displayProp: 'CATEGORY_NM', dynamicTitle: false, showCheckAll: false, showUncheckAll: false};

        // 초기화
        $scope.init = function() {
            $scope.getList('cms/category', 'list', {}, {SYSTEM_GB: 'CMS'}, false)
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
            $scope.click_cancel();
            $scope.tab = tabIdx;

            if ($scope.tab == 0) {
                $scope.list = $scope.list0;
                $scope.type = 'submenu';
            } else if ($scope.tab == 1) {
                $scope.list = $scope.list1;
                $scope.type = 'menu';
            } else if ($scope.tab == 2) {
                $scope.list = $scope.list2;
                $scope.type = 'menu';
            }
        };

        // 메뉴 등록 버튼 클릭
        $scope.click_createNewMenu = function () {
            $scope.click_reset();

            $scope.showEdit = true;
            $timeout(function() {
                $scope.click_focus('item', 'item_id');
            }, 500);
        };

        // 메뉴 편집 버튼 클릭
        $scope.click_editMenu = function (item) {
            $scope.key = item.NO;
            $scope.item = item;
            $scope.showEdit = true;

            if ($scope.tab == 0) {
                $scope.file1 = {};
                $scope.file2 = {};

                var file = item.FILES;
                for(var i in file) {
                    if (file[i].FILE_GB == 'ICON')
                        $scope.file1 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":CONSTANT.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":"icon"};
                    else
                        $scope.file2 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":CONSTANT.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":"detail"};
                }
            } else if ($scope.tab == 1) {
                if (item.CATEGORY != undefined) {
                    $scope.CATEGORY = angular.fromJson(item.CATEGORY);
                } else {
                    $scope.CATEGORY = [];
                }
            } else {
                if (item.COMM != undefined) {
                    $scope.item.COMM_GB = item.COMM.COMM_GB;
                }

                $scope.file1 = {};
                $scope.file2 = {};

                var file = item.FILES;
                console.log(JSON.stringify(file))
                for(var i in file) {
                    if (file[i].FILE_GB == 'MANAGER')
                        $scope.file1 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":CONSTANT.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":"icon"};
                    else
                        $scope.file2 = {"name":file[i].FILE_NM,"size":file[i].FILE_SIZE,"url":CONSTANT.BASE_URL+file[i].PATH+file[i].FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+file[i].FILE_NM,"deleteType":"DELETE","kind":"detail"};
                }
            }

            $timeout(function() {
                $scope.click_focus('item', 'item_id');
            }, 500);
        }

/*
        // 메뉴 수정
        $scope.click_editMenu = function (item) {
            $scope.item = item;
            if (item.COMM != undefined) {
                $scope.item.COMM_GB = item.COMM.COMM_GB;
            }
            if (item.CATEGORY != undefined) {
                $scope.CATEGORY = angular.fromJson(item.CATEGORY);
            } else {
                $scope.CATEGORY = [];
            }

            $scope.click_focus('item', 'item_id');
        }
*/

        // 메뉴 저장 버튼 클릭
        $scope.click_saveMenu = function () {
            $scope.item.SYSTEM_GB = 'ANGE';

            if ($scope.tab == 0) {
                if ($scope.file1 == undefined) {
                    dialogs.notify('알림', '아이콘 이미지를 등록해야합니다.', {size: 'md'});
                    return;
                }
    
                if ($scope.file2 == undefined) {
                    dialogs.notify('알림', '상세 이미지를 등록해야합니다.', {size: 'md'});
                    return;
                }

                $scope.item.FILES = [];
                $scope.item.FILES.push($scope.file1);
                $scope.item.FILES.push($scope.file2);
    
                for(var i in $scope.item.FILES) {
                    $scope.item.FILES[i].$destroy = '';
                }
            } else if ($scope.tab == 1) {
                $scope.item.MENU_URL = '/people/'+$scope.item.MENU_ID+'/list';
                $scope.item.MENU_ST = 'Y';
                if ($scope.item.MENU_ORD1 == undefined) {
                    $scope.item.MENU_ORD = $scope.item.COMM.COMM_GB == 'BOARD' ? 10 + parseInt($scope.item.MENU_ORD2) : $scope.item.COMM.COMM_GB == 'PHOTO' ? 20 + parseInt($scope.item.MENU_ORD2) : $scope.item.COMM.COMM_GB == 'CLINIC' ? 40 + parseInt($scope.item.MENU_ORD2) : 0;
                } else {
                    $scope.item.MENU_ORD = parseInt($scope.item.MENU_ORD1) + parseInt($scope.item.MENU_ORD2);
                }
            } else {
                $scope.item.MENU_URL = '/people/'+$scope.item.MENU_ID+'/list';
                $scope.item.MENU_ST = 'Y';
                if ($scope.item.MENU_ORD1 == undefined) {
                    $scope.item.MENU_ORD = $scope.item.COMM.COMM_GB == 'BOARD' ? 10 + parseInt($scope.item.MENU_ORD2) : $scope.item.COMM.COMM_GB == 'PHOTO' ? 20 + parseInt($scope.item.MENU_ORD2) : $scope.item.COMM.COMM_GB == 'CLINIC' ? 40 + parseInt($scope.item.MENU_ORD2) : 0;
                } else {
                    $scope.item.MENU_ORD = parseInt($scope.item.MENU_ORD1) + parseInt($scope.item.MENU_ORD2);
                }

                $scope.item.FILES = [];
                $scope.item.FILES.push($scope.file1);
                $scope.item.FILES.push($scope.file2);

                for(var i in $scope.item.FILES) {
                    $scope.item.FILES[i].$destroy = '';
                }
            }

            if ($scope.key == '') {
                $scope.insertItem('com/menu', $scope.type, $scope.item, false)
                    .then(function(data){
                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                        $scope.refreshMenuList();
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('com/menu', $scope.type, $scope.item.NO, $scope.item, false)
                    .then(function(data){
                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                        $scope.refreshMenuList();
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

            $scope.click_cancel();
        };
/*
        // 메뉴 수정
        $scope.click_updateMenu = function () {
            if ($scope.tab == 0) {
                if ($scope.file1 == undefined) {
                    dialogs.notify('알림', '아이콘 이미지를 등록해야합니다.', {size: 'md'});
                    return;
                }

                if ($scope.file1 == undefined) {
                    dialogs.notify('알림', '상세 이미지를 등록해야합니다.', {size: 'md'});
                    return;
                }

                $scope.item.SYSTEM_GB = 'ANGE';
                $scope.item.FILES = [];
                $scope.item.FILES.push($scope.file1);
                $scope.item.FILES.push($scope.file2);

                for(var i in $scope.item.FILES) {
                    $scope.item.FILES[i].$destroy = '';
                }
            } else {
                $scope.item.MENU_URL = '/people/'+$scope.item.MENU_ID+'/list';
                $scope.item.MENU_ST = 'Y';
            }

            $scope.updateItem('com/menu', $scope.type, $scope.item.NO, $scope.item, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                    $scope.refreshMenuList();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 메뉴 등록
        $scope.click_insertMenu = function () {
//            $scope.item.CATEGORY = $scope.CATEGORY;
            $scope.item.CHANNEL_NO = '2';
            $scope.item.MENU_URL = '/people/'+$scope.item.MENU_ID+'/list';
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.MENU_ST = 'Y';

            $scope.insertItem('com/menu', 'menu', $scope.item, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                    $scope.getMenuList1();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 메뉴 수정
        $scope.click_updateMenu = function () {
            $scope.item.CATEGORY = $scope.CATEGORY;

            $scope.updateItem('com/menu', 'menu', $scope.item.MENU_URL, $scope.item, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                    $scope.getMenuList1();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };
*/
        // 메뉴 삭제
        $scope.click_deleteMenu = function (item) {
            $scope.deleteItem('com/menu', $scope.type, item.NO, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                    $scope.refreshMenuList();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 편집 버튼 클릭 시 영역으로 focus 이동
        $scope.click_focus = function (id, name) {
            $('html,body').animate({scrollTop:$('#'+id).offset().top}, 100);
            $('#'+name).focus();
        }

        // 취소
        $scope.click_cancel = function () {
            $scope.click_reset();

            $scope.showEdit = false;
            $scope.click_focus('list');
        };

        // 초기화
        $scope.click_reset = function () {
            if ($scope.tab == 0) {
                $scope.item = {MENU_ID: 'home', MENU_URL: '/home/main', COLUMN_ORD: 1};
                $scope.file1 = {};
                $scope.file2 = {};
            } else if ($scope.tab == 1) {
                $scope.item = {DEPTH: 1};
                $scope.CATEGORY = {};
            } else {
                $scope.item = {DEPTH: 1};
                $scope.file1 = {};
                $scope.file2 = {};
            }

            $scope.key = '';
        };

        $scope.refreshMenuList = function() {
            if ($scope.tab == 0) {
                $scope.getMenuList0();
            } else if ($scope.tab == 1) {
                $scope.getMenuList1();
            } else if ($scope.tab == 2) {
                $scope.getMenuList2();
            }
        };

        // 메뉴 목록 조회
        $scope.getMenuList0 = function () {
            $scope.getList('com/menu', 'submenu', {}, {SYSTEM_GB: 'ANGE', MENU_ID: 'home'}, true)
                .then(function(data){
                    console.log(JSON.stringify(data))
                    $scope.list0 = data;
                    $scope.click_selectTab(0);
//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
                })
                ['catch'](function(error){alert(error)});
        };

        // 메뉴 목록 조회
        $scope.getMenuList1 = function () {
            $scope.getList('com/menu', 'menu', {}, {SYSTEM_GB: 'ANGE', CHANNEL_NO: '1'}, true)
                .then(function(data){
                    $scope.list1 = data;

//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
                })
                ['catch'](function(error){alert(error)});
        };

        // 메뉴 목록 조회
        $scope.getMenuList2 = function () {
            $scope.getList('com/menu', 'menu', {}, {SYSTEM_GB: 'ANGE', CHANNEL_NO: '2', FILE: true}, true)
                .then(function(data){
                    $scope.list2 = data;
                    console.log(JSON.stringify(data))

//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
                })
                ['catch'](function(error){alert(error)});
        };

        // 사용자 선택 버튼 클릭
        $scope.click_selectManager = function () {
            if ($scope.item.COMM_GB == 'BOARD') {
                $scope.openModal(true, {SYSTEM_GB: 'ANGE', ROLE_ID : 'BOARD_MG'});
            } else {
                $scope.openModal(true, {SYSTEM_GB: 'ANGE', ROLE_ID : 'CLINIC'});
            }
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
                $scope.item.COMM.COMM_MG_ID = user.USER_ID;
                if ($scope.item.COMM_GB == 'BOARD') {
                    $scope.item.COMM.COMM_MG_NM = user.NICK_NM;
                } else {
                    $scope.item.COMM.COMM_MG_NM = user.USER_NM;
                }
            },function(){

            });
        }

        /********** 화면 초기화 **********/
//        $scope.getSession()
//            .then($scope.sessionCheck)
////            .then($scope.permissionCheck)
//            ['catch']($scope.reportProblems);

        $scope.init();
        $scope.getMenuList0();
        $scope.getMenuList1();
        $scope.getMenuList2();
    }]);
});
