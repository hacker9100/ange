/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : member-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('member-list', ['$scope', '$stateParams', '$location', '$filter', '$q', '$modal', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $stateParams, $location, $filter, $q, $modal, dialogs, ngTableParams, CONSTANT) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.menu = $stateParams.menu;
        $scope.search = {SYSTEM_GB: 'ANGE'};
//        $scope.search = {};
        $scope.action = {};

        // 목록 데이터
        $scope.list = [];

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_CNT = 0;

        var isFirst = true;

        // 초기화
        $scope.init = function() {

            // 검색조건
            var condition = [{name: "이름", value: "USER_NM", index: 0}, {name: "아이디", value: "USER_ID", index: 1}, {name: "닉네임", value: "NICK_NM", index: 2}, {name: "전화번호", value: "PHONE", index: 3}, {name: "주소", value: "ADDR", index: 4}, {name: "이메일", value: "EMAIL", index: 5}, {name: "생일", value: "BIRTH", index: 6}, {name: "가입기간", value: "REG_DT", index: 7}];
            var type = [{name: "일반회원", value: "MEMBER"}, {name: "앙쥬클럽", value: "CLUB"}, {name: "서포터즈", value: "SUPPORTERS"}];
            // N : NORMAL, P : POOR, D : DORMANCY, S : SECESSION, W : WAITING
            var status = [{name: "전체", value: "A"}, {name: "정상", value: "N"}, {name: "불량", value: "P"}, {name: "휴면", value: "D"}, {name: "탈퇴", value: "S"}];
            var act = [{name: "일반정보", value: "A"}, {name: "커뮤니티활동", value: "C"}, {name: "참여활동", value: "P"}, {name: "블로거활동", value: "B"}];
            var sort = [{name: "가입일", value: "REG_DT", index: 0}, {name: "이름", value: "USER_NM", index: 1}, {name: "포인트", value: "POINT", index: 2}, {name: "스코어", value: "SCORE", index: 3}];
            var order = [{name: "내림차순", value: "DESC", index: 0}, {name: "오름차순", value: "ASC", index: 1}];

            var range = [{name: "선택한 회원", value: "C"}, {name: "리스트 전체", value: "A"}];
            var func = [{name: "엑셀저장", value: "excel"}, {name: "목록저장", value: "save"}, {name: "불량회원", value: "poor"}, {name: "블랙리스트", value: "blacklist"}, {name: "메일발송", value: "mail"}, {name: "문자발송", value: "sms"}, {name: "쪽지발송", value: "message"}, {name: "송장출력", value: "print"}, {name: "마일리지", value: "mileage"}];

            if ($scope.menu == 'save') {
                func = [{name: "엑셀저장", value: "excel"}, {name: "목록제외", value: "remove"}, {name: "불량회원", value: "poor"}, {name: "블랙리스트", value: "blacklist"}, {name: "메일발송", value: "mail"}, {name: "문자발송", value: "sms"}, {name: "쪽지발송", value: "message"}, {name: "송장출력", value: "print"}, {name: "마일리지", value: "mileage"}];

                $scope.getList('admin/user_list', 'list', null, null, true)
                    .then(function(data){
                        $scope.saveList = data;
                        $scope.search.ADMIN_SAVE_LIST = data[0];
                    })
                    .catch(function(error){alert(error)});

                $scope.$watch('search.ADMIN_SAVE_LIST', function(item) {
                    if (item != undefined) {
                        var arrType = {};
                        if (item.TYPE != '') {
                            arrType = item.TYPE.split(',')
                        }
                        $scope.search.TYPE = arrType;
                        $scope.search.KEYWORD = item.KEYWORD;
                        $scope.search.STATUS = item.STATUS;
                        $scope.search.ACT = item.ACT;
                        $scope.search.SORT = sort[item.SORT_IDX];
                        $scope.search.ORDER = order[item.ORDER_IDX];

                        if (isFirst)
                            $scope.getUserList();
                        else
                        $scope.tableParams.reload();
                    }
                })
            }

            $scope.condition = condition;
            $scope.type = type;
            $scope.status = status;
            $scope.act = act;
            $scope.sort = sort;
            $scope.order = order;
            $scope.search.CONDITION = condition[0];
            $scope.search.STATUS = status[0].value;
            $scope.search.ACT = status[0].value;
            $scope.search.SORT = sort[0];
            $scope.search.ORDER = order[0];

            $scope.range = range;
            $scope.function = func;
            $scope.action.CHECKED = range[0].value;
            $scope.action.FUNCTION = func[0];

            // ui bootstrap 달력
            $scope.format = 'yyyy-MM-dd';

            $scope.today = function() {
                $scope.search.START_YMD = new Date();
                $scope.search.END_YMD = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.search.START_YMD = null;
                $scope.search.END_YMD = null;
            };

            $scope.open = function($event, opened) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope[opened] = true;
            };
        };

        /********** 함수 **********/
        function autoHypenPhone(str){
            str = str.replace(/[^0-9]/g, '');
            var tmp = '';
            if( str.length < 4) {
                return str;
            } else if(str.length < 7) {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3);
                return tmp;
            } else if(str.length < 11) {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3, 3);
                tmp += '-';
                tmp += str.substr(6);
                return tmp;
            } else {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3, 4);
                tmp += '-';
                tmp += str.substr(7);
                return tmp;
            }
            return str;
        }

        /********** 이벤트 **********/
        $scope.check_user = [];
        $scope.check_cnt = 0;
        $scope.$watch('check_user', function(newArr, oldArr) {
            if (newArr != undefined && newArr != '') {
                $scope.check_cnt = newArr.length;
            }

//            if (newArr != undefined && newArr != '') $scope.check_cnt++;
//            if (oldArr != undefined && oldArr != '') $scope.check_cnt--;
//
//            var cnt = 0;
//            angular.forEach($scope.list, function(item){
//                console.log(item)
//                cnt += item.CHECKED ? 1 : 0;
//            })
//            $scope.selected_cnt = cnt;
        }, true);

        // 실행 버튼 클릭
        $scope.click_function = function () {

            switch($scope.action.FUNCTION.value) {
                case 'excel' :
                    var item = {};

                    if ($scope.action.CHECKED == 'C' ) {
                        if ($scope.check_user.length == 0) {
                            dialogs.notify('알림', '선택한 회원이 없습니다..', {size: 'md'});
                            return;
                        }

                        item.USER_ID_LIST = angular.copy($scope.check_user);
                        item.CHECKED = $scope.action.CHECKED;
                    } else {
                        item = angular.copy($scope.search);
                        item.CHECKED = $scope.action.CHECKED;
                    }

                    var dataUrl = CONSTANT.BASE_URL+'/serverscript/services/admin/excel.php?_type=user&_search='+JSON.stringify(item);

                    var link = document.createElement('a');
                    angular.element(link)
                        .attr('href', dataUrl)
//                        .attr('download', "bl.xlsx")
                        .attr('target', '_blank')
                    link.click();

//                    $scope.getList('com/excel', {NO:0, SIZE:5}, $scope.search, true)
//                        .then(function(data){$scope.list = data; $scope.total_cnt = $scope.list.length;})
//                        .catch(function(error){alert(error)});
                    break;
                case 'save' :
                    var item = angular.copy($scope.search);
                    item.CHECKED = $scope.action.CHECKED;

                    if ($scope.action.CHECKED == 'C' ) {
                        if ($scope.check_user.length == 0) {
                            dialogs.notify('알림', '선택한 회원이 없습니다..', {size: 'md'});
                            return;
                        }

                        item.USER_ID_LIST = angular.copy($scope.check_user);
                    }

                    $scope.openPopupSaveListRegModal(item);
                    break;
                case 'blacklist' :
                case 'mail' :
                case 'sms' :
                    alert("준비중입니다.")
                    break;
                case 'remove' :
                    $scope.click_removeSearch();
                    break;
                case 'poor' :
                    var item = {};

                    if ($scope.action.CHECKED == 'C' ) {
                        if ($scope.check_user.length == 0) {
                            dialogs.notify('알림', '선택한 회원이 없습니다..', {size: 'md'});
                            return;
                        }

                        item.USER_ID_LIST = angular.copy($scope.check_user);
                        item.CHECKED = $scope.action.CHECKED;
                        item.USER_ST = 'P';
                    } else {
                        item = angular.copy($scope.search);
                        item.CHECKED = $scope.action.CHECKED;
                        item.USER_ST = 'P';
                    }

                    $scope.updateItem('com/user', 'admin', null, item, false)
                        .then(function(){dialogs.notify('알림', '사용자 상태가 변경되었습니다.', {size: 'md'}); /*$scope.tableParams.reload(); $scope.getCmsUserList();*/})
                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'}); $scope.tableParams.reload();});
                    break;
                case 'message' :
                    var item = {};

                    if ($scope.action.CHECKED == 'C' ) {
                        if ($scope.check_user.length == 0) {
                            dialogs.notify('알림', '선택한 회원이 없습니다..', {size: 'md'});
                            return;
                        }

                        item.USER_ID_LIST = angular.copy($scope.check_user);
                        item.CHECKED = $scope.action.CHECKED;
                    } else {
                        item = angular.copy($scope.search);
                        item.CHECKED = $scope.action.CHECKED;
                    }

                    $scope.openPopupMessageRegModal(item);
                    break;
                case 'mileage' :
                    var item = {};

                    if ($scope.action.CHECKED == 'C' ) {
                        if ($scope.check_user.length == 0) {
                            dialogs.notify('알림', '선택한 회원이 없습니다..', {size: 'md'});
                            return;
                        }

                        item.USER_ID_LIST = angular.copy($scope.check_user);
                        item.CHECKED = $scope.action.CHECKED;
                        item.EARN_GB = 'EARN';
                        item.PLACE_GB = 'ADMIN';
                    } else {
                        item = angular.copy($scope.search);
                        item.CHECKED = $scope.action.CHECKED;
                        item.EARN_GB = 'EARN';
                        item.PLACE_GB = 'ADMIN';
                    }

                    $scope.openPopupMileageRegModal(item);
                    break;

            };
        };

        // 목록갱신 버튼 클릭
        $scope.click_refreshList = function () {
            $scope.tableParams.reload();
        };
                
        // 등록 버튼 클릭
        $scope.click_createNewUser = function () {
            $location.url('/member/edit/0');
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

        $scope.openPopupSaveListRegModal = function (user) {
            var dlg = dialogs.create('save_list_popup.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('content', {$scope: $scope}));

                    $scope.item = data;

                    $scope.click_reg = function () {
                        $scope.insertItem('admin/user_list', 'item', $scope.item, false)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        $modalInstance.close();
                        //console.log($scope.item);
                    };

                    $scope.click_close = function(){
                        $modalInstance.close();
                    }

                }], user, {size: 'lg',keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        $scope.openPopupMessageRegModal = function (user) {
            var dlg = dialogs.create('myangemessage_popup.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('content', {$scope: $scope}));

                    $scope.item = data;

                    $scope.click_reg = function () {
                        $scope.insertItem('ange/message', 'admin', $scope.item, true)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 전송되었습니다.', {size: 'md'});
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        $modalInstance.close();
                        //console.log($scope.item);
                    };

                    $scope.click_close = function(){
                        $modalInstance.close();
                    }

                }], user, {size: 'lg',keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        $scope.openPopupMileageRegModal = function (user) {
            var dlg = dialogs.create('mileage_popup.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('content', {$scope: $scope}));

                    $scope.item = data;

                    $scope.click_reg = function () {
                        $scope.insertItem('ange/mileage', 'admin', $scope.item, false)
                            .then(function(){dialogs.notify('알림', '마일리지가 등록되었습니다.', {size: 'md'}); /*$scope.tableParams.reload(); $scope.getCmsUserList();*/})
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'}); $scope.tableParams.reload();});

                        $modalInstance.close();
                        //console.log($scope.item);
                    };

                    $scope.click_close = function(){
                        $modalInstance.close();
                    }

                }], user, {size: 'lg',keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 사용자 마일리지 선택 버튼 클릭
        $scope.click_selectMileageList = function (item) {
            $scope.openPopupMileageListModal(true, {USER_ID : item.USER_ID});
        }

        $scope.openPopupMileageListModal = function (modal, search, size) {
            var dlg = dialogs.create('/partials/admin/popup/member-mileage-list.html',
                ['$modalInstance', function ($modalInstance) {
                    $scope.isModal = true;
                    $scope._search = search;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };

                }], search, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        }

        // 사용자 게시물 선택 버튼 클릭
        $scope.click_selectWriteList = function (item) {
            $scope.openPopupWriteListModal(true, {NOTICE_FL: 'N', REG_UID : item.USER_ID});
        }

        $scope.openPopupWriteListModal = function (modal, search, size) {
            var dlg = dialogs.create('/partials/admin/popup/member-write-list.html',
                ['$modalInstance', function ($modalInstance) {
                    $scope.isModal = true;
                    $scope._search = search;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };

                }], search, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        }

        // 사용자 응모 선택 버튼 클릭
        $scope.click_selectCompList = function (item, type) {
            $scope.openPopupCompListModal(true, {USER_ID : item.USER_ID, TARGET_GB : angular.uppercase(type)});
        }

        $scope.openPopupCompListModal = function (modal, search, size) {
            var dlg = dialogs.create('/partials/admin/popup/member-comp-list.html',
                ['$modalInstance', function ($modalInstance) {
                    $scope.isModal = true;
                    $scope._search = search;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };

                }], search, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        }

        // 조회 화면 이동
        $scope.click_showViewUser = function (item) {
            $location.url('/member/view/'+item.USER_ID);
        };

        // 수정 화면 이동
        $scope.click_showEditUser = function (item) {
            $location.url('/member/edit/'+item.USER_ID);
        };

        $scope.isStatus = false;
        $scope.selectUser = '';

        // 상태 변경 기능 클릭
        $scope.click_changeStatusUser = function (item) {
            $scope.isStatus = true;
            $scope.selectUser = item.USER_ID;
        };

        // 상태 변경 기능 클릭
        $scope.change_userStatus = function (item) {
            $scope.updateItem('com/user', 'status', item.USER_ID, item, true)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                    $scope.isStatus = false;
                    $scope.selectUser = '';
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 유형 변경 기능 클릭
        $scope.change_userType = function (item) {
            $scope.updateItem('com/user', 'type', item.USER_ID, item, true)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                    $scope.isStatus = false;
                    $scope.selectUser = '';
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 고객응대 메모 버튼 클릭
        $scope.click_responseUser = function (item) {
            $scope.openPopupResponseListModal(true, {USER_ID : item.USER_ID});
        }

        $scope.openPopupResponseListModal = function (modal, search, size) {
            var dlg = dialogs.create('/partials/admin/popup/member-response-list.html',
                ['$modalInstance', function ($modalInstance) {
                    $scope.isModal = true;
                    $scope._search = search;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };

                }], search, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        }

        // 자주쓰는 목록 사용자 제거
        $scope.click_removeUser = function (item) {
            $scope.deleteItem('admin/user_list', 'item', item.USER_ID, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 제외되었습니다.', {size: 'md'});
                    $scope.getUserList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 검색 버튼 클릭
        $scope.click_searchUser = function () {
            $scope.tableParams.reload();
        }

        // 사용자 목록 조회
//        $scope.getUserList = function () {
////            $scope.search.SORT = $scope.search.SORT.value;
////            $scope.search.ORDER = $scope.search.ORDER.value;
//
//            $scope.getList('com/user', 'admin', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
//                .then(function(data){
//                    $scope.list = data;
//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
//                })
//                .catch(function(error){alert(error)});
//        };
//
//        $scope.pageChanged = function() {
//            console.log('Page changed to: ' + $scope.PAGE_NO);
//            $scope.getUserList();
//            console.log('Page changed to: ' + $scope.PAGE_NO);
//        };

        // 사용자 목록 조회
        $scope.getUserList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: $scope.PAGE_SIZE,    // count per page
                sorting: {                  // initial sorting
                    REG_DT: 'DESC'
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    isFirst = false;
                    var key = Object.keys(params.sorting())[0];

//                    $scope.search['SORT'] = key;
//                    $scope.search['ORDER'] = params.sorting()[key];

                    if ($scope.search.CONDITION.index >= 6) {
                        $scope.search.START_YMD = $filter('date')($scope.search.START_YMD, 'yyyy-MM-dd');
                        $scope.search.END_YMD = $filter('date')($scope.search.END_YMD, 'yyyy-MM-dd');
                    }

                    $scope.getList('com/user', 'admin', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_CNT = total_cnt;

                            for(var i in data) {
                                data[i].PHONE_1 = autoHypenPhone(data[i].PHONE_1);
                                data[i].PHONE_2 = autoHypenPhone(data[i].PHONE_2);
                            }

                            params.total(total_cnt);
                            $defer.resolve(data);
                        })
                        .catch(function(error){$scope.TOTAL_CNT = 0; $defer.resolve([]);});
                }
            });
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .catch($scope.reportProblems);

        $scope.init();
        if ($scope.menu != 'save') {
            $scope.getUserList();
        }

    }]);
});
