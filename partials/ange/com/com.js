/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : ange-common.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('ange-common', ['$rootScope', '$scope', '$stateParams', '$window', '$location', '$timeout', '$q', 'dataService', '$filter', 'dialogs', 'CONSTANT', function ($rootScope, $scope, $stateParams, $window, $location, $timeout, $q, dataService, $filter, dialogs, CONSTANT) {

        $scope.comming_soon = function() {
            dialogs.notify('알림', '준비중입니다.', {size: 'md'});
        }

        // 주소 경로
        $scope.path = $scope.location.split('/');

        // 현재 채널 정보
        $scope.channel = $filter('filter')($rootScope.ange_channel, function (data) {
            return (data.CHANNEL_ID.indexOf($scope.path[1]) > -1)
        })[0];

        // 현재 메뉴 정보
        $scope.menu = $filter('filter')($rootScope.ange_menu, function (data) {
//            if ($scope.path[2] == 'content') $scope.path[2] = 'happy';

            return (data.MENU_ID.indexOf($scope.path[2]) > -1)
        })[0];

        // 카테고리 데이터
        $scope.category = [];

        var category_a = [];
        var category_b = [];

        for (var i in $rootScope.ange_category) {
            var item = $rootScope.ange_category[i];
            if (item.CATEGORY_GB == '1' && item.CATEGORY_ST == '0') {
                category_a.push(item);
            } else if (item.CATEGORY_GB == '2' && item.CATEGORY_ST == '0' && item.PARENT_NO == '0') {
                category_b.push(item);
            }
        }

        $scope.category_a = category_a;
        $scope.category_b = category_b;

        if ($scope.path.length > 2 && $scope.menu != undefined) {
            $scope.community = $scope.menu.MENU_NM;
        }

//        for (var i in $rootScope.ange_menu) {
//            if ($rootScope.ange_menu[i].MENU_URL == $location.path()) {
//                $scope.menu = $rootScope.ange_menu[i];
//                console.log(JSON.stringify($scope.menu));
//            }
//        }

        // 메인 화면 class
        $scope.ui_wraptype = "content_wrap";

        switch($scope.path[1]) {
            case 'main' :
                $scope.ui_wraptype = 'content_wrap';
                break;
            case 'people' :
                $scope.ui_wraptype = 'sub_content_wrap';
                break;
            case 'club' :
            case 'company' :
                $scope.ui_wraptype = 'content_wrap';
                break;
            default :
                $scope.ui_wraptype = 'sub_content_wrap';
        }

//        alert(localStorage.getItem('userToken'))

        /********** ANGE 공통 함수 **********/
            // 시스템 별로 분리 해야할지??
            // 파일 사이즈 변환
        $scope.formatFileSize = function (bytes) {
//            if (typeof bytes !== 'number') {
//                return '';
//            }
            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }
            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }
            return (bytes / 1000).toFixed(2) + ' KB';
        }

        // 로그인
        $scope.login = function(key, item) {
            var deferred = $q.defer();

            dataService.login(key,item,function(data, status) {
                if (status != 200) {
                    console.log('로그인에 실패 했습니다.');
                    deferred.reject('로그인에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            deferred.resolve(data);
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            console.log('아이디나 패스워드가 일치하지 않습니다.');
                            deferred.reject('아이디나 패스워드가 일치하지 않습니다.');
                        }
                    }
                }
            });

            return deferred.promise;
        }

        // 로그아웃
        $scope.logout = function(key) {
            var deferred = $q.defer();

            dataService.logout(key, function(data, status) {
                if (status != 200) {
                    console.log('로그아웃에 실패 했습니다.');
                    deferred.reject('로그아웃에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            $rootScope.session = null;

                            $rootScope.login = false;
                            $rootScope.authenticated = false;
                            $rootScope.user_info = null;
                            $rootScope.uid = null;
                            $rootScope.name = null;
                            $rootScope.mileage = 0;
                            $rootScope.message = 0;
                            $rootScope.role = null;
                            $rootScope.menu_role = null;
                            $rootScope.email = null;
                            $rootScope.nick = null;
                            $rootScope.profileImg = null;
                            $rootScope.albumList = null;

                            $rootScope.addr = null;
                            $rootScope.addr_detail = null;
                            $rootScope.phone1 = null;
                            $rootScope.phone2 = null;

                            $rootScope.preg_fl = null;

                            deferred.resolve(data);
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            console.log('로그아웃에 패스워드가 일치하지 않습니다.');
                            deferred.reject('로그아웃에 패스워드가 일치하지 않습니다.');
                        }
                    }
                }
            });

            return deferred.promise;
        }

        // 세션 조회
        $scope.getSession = function() {
            var deferred = $q.defer();

            dataService.getSession(function(data, status) {
                if (status != 200) {
//                    $location.path("/signin");
                    console.log('조회에 실패 했습니다.');
                    deferred.reject('조회에 실패 했습니다.');
                } else {
                    if (data.err == true) {
//                        $location.path("/signin");
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            deferred.resolve(data);
                        } else {
//                            $location.path("/signin");
                            // TODO: 데이터가 없을 경우 처리
                            console.log('조회 데이터가 없습니다.');
                            deferred.reject('조회 데이터가 없습니다.');
                        }
                    }
                }
            });

            return deferred.promise;
        }

        // 세션 갱신
        $scope.updateSession = function(key, item) {
            var deferred = $q.defer();

            dataService.updateSession(key, item, function(data, status) {
                if (status != 200) {
//                    $location.path("/signin");
                    console.log('세션 갱신에 실패 했습니다.');
                    deferred.reject('세션 갱신에 실패 했습니다.');
                } else {
                    if (data.err == true) {
//                        $location.path("/signin");
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            deferred.resolve(data);
                        } else {
//                            $location.path("/signin");
                            // TODO: 데이터가 없을 경우 처리
                            console.log('세션 데이터가 없습니다.');
                            deferred.reject('세션 데이터가 없습니다.');
                        }
                    }
                }
            });

            return deferred.promise;
        }

        // 세션 체크
        $scope.sessionCheck = function(session) {
            $rootScope.ip = session.IP;
            $rootScope.guid = session.GUID;

            if (session.USER_ID == undefined || session.USER_ID == '') {
                $rootScope.session = null;

                $rootScope.login = false;
                $rootScope.authenticated = false;
                $rootScope.user_info = null;
                $rootScope.uid = '';
                $rootScope.name = '';
                $rootScope.mileage = 0;
                $rootScope.message = 0;
                $rootScope.role = '';
                $rootScope.menu_role = null;
                $rootScope.email = '';
                $rootScope.nick = '';

                $rootScope.addr = null;
                $rootScope.addr_detail = null;
                $rootScope.phone1 = null;
                $rootScope.phone2 = null;

                $rootScope.preg_fl = null;
                $rootScope.baby_birth_dt = null;

                $rootScope.user_gb = null;
                $rootScope.support_no = null;

                if ($scope.channel.CHANNEL_NO == 4 && $rootScope.isLogout != true) {
                    $rootScope.isLogout = true;
                    $location.path("/main");
                    throw( new String('세션이 만료되었습니다. 다시 로그인 해 주세요.'));

                    $timeout(function() {
                        $scope.isLogout = false;
                    },2000);
                }
//                $location.path("/signin");
//                throw( new String('세션이 만료되었습니다.') );
//            throw( new Error("세션이 만료되었습니다.") );
//            } else if (session.USER_ID == '') {
//                $location.path("/signin");
//                throw( new String('로그인 후 사용가능합니다.') );
            } else {
                if (session.SYSTEM_GB != 'ANGE') {
//                    dialogs.error('오류', '다른 시스템에 로그인되어있습니다. 로그인 페이지로 이동합니다.', {size: 'md'});
                    $scope.logout($rootScope.uid).then( function(data) {
                        $rootScope.session = null;

                        $rootScope.login = false;
                        $rootScope.authenticated = false;
                        $rootScope.user_info = null;
                        $rootScope.uid = '';
                        $rootScope.name = '';
                        $rootScope.mileage = 0;
                        $rootScope.message = 0;
                        $rootScope.role = '';
                        $rootScope.menu_role = null;
                        $rootScope.email = '';
                        $rootScope.nick = '';

                        $rootScope.addr = null;
                        $rootScope.addr_detail = null;
                        $rootScope.phone1 = null;
                        $rootScope.phone2 = null;

                        $rootScope.preg_fl = null;
                        $rootScope.baby_birth_dt = null;

                        $rootScope.user_gb = null;
                        $rootScope.support_no = null;

                        if ($scope.channel.CHANNEL_NO == 4 && $rootScope.isLogout != true) {
                            $rootScope.isLogout = true;
                            $location.path("/main");
                            throw( new String('세션이 만료되었습니다. 다시 로그인 해 주세요.'));

                            $timeout(function() {
                                $scope.isLogout = false;
                            },2000);
                        }
                    });

                    return;
                }

                $rootScope.session = session;

                $rootScope.login = true;
                $rootScope.authenticated = true;
                $rootScope.user_info = session.USER_INFO;
                $rootScope.uid = session.USER_ID;
                $rootScope.name = session.USER_NM;
                $rootScope.mileage = session.REMAIN_POINT;
                $rootScope.message = session.MESSAGE_CNT;
                $rootScope.role = session.ROLE_ID;
                $rootScope.menu_role = session.MENU_ROLE;
                $rootScope.email = session.EMAIL;
                $rootScope.nick = session.NICK_NM;

                if (session.USER_INFO != undefined && session.USER_INFO.FILE) {
                    $rootScope.profileImg = CONSTANT.BASE_URL + session.USER_INFO.FILE.PATH + session.USER_INFO.FILE.FILE_ID;
                } else {
                    $rootScope.profileImg = null;
                }

                if (session.USER_INFO != undefined && session.USER_INFO.ALBUM) {
                    var albumData = session.USER_INFO.ALBUM;
                    for(var i in albumData) {
                        if (albumData[i].FILE_ID != null) {
                            albumData[i].ALBUM_FILE = CONSTANT.BASE_URL + albumData[i].PATH + 'thumbnail/' + albumData[i].FILE_ID;
                        }
                    }

                    $rootScope.albumList = albumData;
                } else {
                    $rootScope.albumList = null;
                }

                $rootScope.scheduleList = session.USER_INFO.SCHEDULE;

                $rootScope.addr = session.ADDR;
                $rootScope.addr_detail = session.ADDR_DETAIL;
                $rootScope.phone1 = session.PHONE_1;
                $rootScope.phone2 = session.PHONE_2;
                $rootScope.preg_fl =session.PREGNENT_FL;
                $rootScope.baby_birth_dt =session.BABY_BIRTH_DT;

                $rootScope.baby_cnt =session.BABY_CNT;
                $rootScope.baby_male_cnt =session.BABY_MALE_CNT;
                $rootScope.baby_female_cnt =session.BABY_FEMALE_CNT;

                $rootScope.user_gb = session.USER_INFO.USER_GB;
                $rootScope.support_no = session.USER_INFO.SUPPORT_NO;

                console.log($rootScope.user_gb);
            }

            $scope.getCanlendarList();

            return true;
        };

        $scope.test = function() {
            console.log($rootScope.uid);
        };

        $scope.permissionCheck = function(url, back) {
            var path = $location.path();

            if ($rootScope.session == undefined || $rootScope.session == null) {
                if (back) {
                    throw( new String('로그인 후 사용가능합니다.') );
                } else {
                    dialogs.error('오류', '로그인 후 사용가능합니다.', {size: 'md'});
                }
                $location.path("/main");
                return false;
            }

//            if (url) path = url;
//
//            var spMenu =  path.split('/');
//            var menuId = spMenu[1];
//            var menuGb = '';
//
//            if (spMenu.length > 1) menuGb = spMenu[2];
//
//            if (menuId == "content") {
//                menuId = spMenu[2];
//                menuGb = spMenu[3];
//            }
//
//            for (var idx in $rootScope.session.MENU_ROLE) {
//                var permission = false;
//                var role = $rootScope.session.MENU_ROLE[idx];
//
//                if (menuId == 'signup' || menuId == 'signin') {
//                    permission = true;
//                }
//
//                if (role.MENU_ID == menuId) {
//                    if (spMenu.length < 3 && role.MENU_FL == '0') {
//                        permission = true;
//                    } else {
//                        switch (menuGb) {
//                            case 'main' :
//                                if (role.MENU_FL == '0') {
//                                    permission = true;
//                                }
//                                break;
//                            case 'list' :
//                                if (role.LIST_FL == '0') {
//                                    permission = true;
//                                }
//                                break;
//                            case 'view' :
//                                if (role.VIEW_FL == '0') {
//                                    permission = true;
//                                }
//                                break;
//                            case 'edit' :
//                                if (role.EDIT_FL == '0') {
//                                    permission = true;
//                                }
//                                break;
//                        }
//                    }
//
//                    if (!permission) {
//                        if (back) {
//                            history.back();
//                            throw( new String('접근할 수 없는 메뉴 입니다.') );
//                            return;
//                        } else {
//                            dialogs.error('오류', '접근할 수 없는 메뉴 입니다.', {size: 'md'});
//                            return false;
//                        }
//                    }
//                }
//            }

            return true;
        };

        // 오류 리포트
        $scope.reportProblems = function(error) {
            dialogs.error('오류', error+'', {size: 'md'});
        };

        // 목록 데이터를 조회
        $scope.getList = function (service, type, page, search, loding) {

            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.db(service).find(type,page,search,function(data, status) {
                if (status != 200) {
                    console.log('조회에 실패 했습니다.');
                    deferred.reject('조회에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            deferred.resolve(data);
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            console.log('조회 데이터가 없습니다.');
                            deferred.reject('조회 데이터가 없습니다.');
                        }
                    }
                }

                if (loding) $scope.isLoading = false;
            });

            return deferred.promise;
        };

        // 모델 데이터를 조회
        $scope.getItem = function (service, type, key, search, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.db(service).findOne(type,key,search,function(data, status) {
                if (status != 200) {
                    console.log('조회에 실패 했습니다.');
                    deferred.reject('조회에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            deferred.resolve(data);
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            console.log('조회 데이터가 없습니다.');
                            deferred.reject('조회 데이터가 없습니다.');
                        }
                    }
                }

                if (loding) $scope.isLoading = false;
            });

            return deferred.promise;
        };

        // 모델 등록
        $scope.insertItem = function (service, type, item, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.db(service).insert(type,item,function(data, status) {
                if (status != 200) {
                    console.log('등록에 실패 했습니다.');
                    deferred.reject('등록에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        deferred.resolve(data);
                    }
                }

                if (loding) $scope.isLoading = false;
            });

            return deferred.promise;
        };

        // 모델 수정
        $scope.updateItem = function (service, type, key, item, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.db(service).update(type,key,item,function(data, status) {
                if (status != 200) {
                    console.log('수정에 실패 했습니다.');
                    deferred.reject('수정에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        deferred.resolve(data);
                    }
                }

                if (loding) $scope.isLoading = false;
            });

            return deferred.promise;
        };

        // 모델 상태 수정
        $scope.updateStatus = function (service, type, key, phase, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.updateStatus(service,type,key,phase,function(data, status) {
                if (status != 200) {
                    console.log('수정에 실패 했습니다.');
                    deferred.reject('수정에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        deferred.resolve();
                    }
                }

                if (loding) $scope.isLoading = false;
            });

            return deferred.promise;
        };

        // 모델 삭제
        $scope.deleteItem = function (service, type, key, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.db(service).remove(type,key,function(data, status){
                if (status != 200) {
                    console.log('삭제에 실패 했습니다.');
                    deferred.reject('삭제에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        deferred.resolve();
                    }
                }

                if (loding) $scope.isLoading = false;
            });

            return deferred.promise;
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            ['catch']($scope.reportProblems);

        $scope.moveAccount = function() {
            if ($rootScope.uid != undefined) {
                if ($rootScope.user_info.USER_ST == 'W' && $rootScope.user_info.CERT_GB == 'MIG') {
                    $location.path('myange/account');
                }
            }
        };

        // 로그인 모달창
        $scope.openLogin = function (content, size) {
            var dlg = dialogs.create('/partials/ange/popup/login-popup.html',
                ['$scope', '$modalInstance', '$controller', '$timeout', 'data', 'CONSTANT', function($scope, $modalInstance, $controller, $timeout, data, CONSTANT) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};
                    $scope.save_id = false;
                    $scope.content = data;

                    if (localStorage.getItem('save_id')) {
                        $scope.save_id = true;
                        $scope.item.id = localStorage.getItem('user_id');

                        $timeout(function() { $('#password').focus();}, 1000);
                    } else {
                        $timeout(function() { $('#id').focus();}, 1000);
                    }

                    // 상단 배너 이미지 조회
                    $scope.getLoginBanner = function () {
                        $scope.search = {};
                        $scope.search.ADP_IDX = CONSTANT.AD_CODE_BN31;
                        $scope.search.ADA_STATE = 1;
                        $scope.search.ADA_TYPE = 'banner';
                        $scope.search.MENU = $scope.path[1];
                        $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);

                        $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, $scope.search, false)
                            .then(function(data){
                                $scope.loginBanner = data[0];
                                $scope.loginBanner.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                            })
                            ['catch'](function(error){});
                    };

                    $scope.getLoginBanner();

                    $scope.click_ok = function () {
                        if ($scope.item.id == null || $scope.item.id == '') {
                            dialogs.notify('알림', '아이디를 입력하세요', {size: 'md'});
                            return;
                        }

                        if ($scope.save_id) {
                            localStorage.setItem('user_id', $scope.item.id);
                        } else {
                            localStorage.removeItem('user_id');
                        }

                        $scope.item.SYSTEM_GB = 'ANGE';

                        $scope.login($scope.item.id, $scope.item)
                            .then(function(data){
                                $rootScope.login = true;
                                $rootScope.authenticated = true;
                                $rootScope.user_info = data;
                                $rootScope.uid = data.USER_ID;
                                $rootScope.mileage = data.REMAIN_POINT;
                                $rootScope.message = data.MESSAGE_CNT;
                                $rootScope.name = data.USER_NM;
                                $rootScope.role = data.ROLE_ID;
                                $rootScope.system = data.SYSTEM_GB;
                                $rootScope.menu_role = data.MENU_ROLE;
                                $rootScope.email = data.EMAIL;
                                $rootScope.nick = data.NICK_NM;

                                if (data.FILE) {
                                    $rootScope.profileImg = CONSTANT.BASE_URL + data.FILE.PATH + data.FILE.FILE_ID;
                                } else {
                                    $rootScope.profileImg = null;
                                }

                                $scope.addMileage('LOGIN', null);

                                if (data.USER_ST == 'W' && data.CERT_GB == 'MIG') {
                                    $location.path('myange/account');
                                }

                                $modalInstance.close('login');
                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                    $scope.click_forgotInfo = function () {
                        $location.url('infodesk/forgot/request');
                        $modalInstance.close();
                    };

                    $scope.click_joinMember = function () {
                        $location.url('infodesk/signon');
                        $modalInstance.close();
                    };

                    $scope.check_saveId = function ($event) {
                        var checkbox = $event.target;
                        if (checkbox.checked) {
                            localStorage.setItem('save_id', $scope.save_id);
                        } else {
                            localStorage.removeItem('save_id');
                        }
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(action){
                if (action == 'login') {
                    $scope.getCanlendarList();
                }
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        // 메시지 클릭
        $scope.openViewMessageRegModal = function (item,  size) {
            var dlg = dialogs.create('partials/ange/popup/message-popup.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', 'data', function($scope, $rootScope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));
                    $scope.content = data;

                    $scope.searchUsetList = "N";
                    $scope.selectUser = "N";

                    $scope.search = {};
                    $scope.item = {};

                    if(item != null){
                        $scope.item = item;
                        $scope.item.TO_ID = item.REG_UID;
                        $scope.item.TO_NM = item.NICK_NM;

                        $scope.selectUser = "Y";
                    }
//                    }else{
//                        $scope.item.TO_ID = "";
//                        $scope.item.TO_NICK_NM = "";
//                    }


                    $scope.click_reg = function () {

                        console.log($scope.item.BODY);
                        console.log($scope.item.TO_ID);

//                        if($scope.item.BODY == undefined){
//                            alert('내용을 입력하세요');
//                            return;
//                        }

                        //console.log(trim($scope.item.BODY));

                        if($scope.item.BODY != undefined){
                            $scope.item.BODY = $scope.item.BODY.replace(/^\s+|\s+$/g,'');
                        }

                        console.log($scope.item.BODY);

                        if($scope.item.BODY == undefined || $scope.item.BODY == ""){
                            alert('내용을 입력하세요');
                            return;
                        }

                        if($scope.item.TO_ID == undefined){
                            alert('수신자를 검색해서 선택하세요');
                            return;
                        }

                        $scope.insertItem('ange/message', 'item', $scope.item, true)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    };

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }

                    $scope.search.FILE = true;
                    // 사용자 조회 검색 클릭
                    $scope.click_searchUser = function (name) { //item

                        if(name == null || name == ''){
                            $scope.searchUsetList = "N";
                            dialogs.notify('알림', '닉네임을 입력하세요.', {size: 'md'});
                            return;
                        }else{
                            var stringByteLength = name.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
                            console.log(stringByteLength + " Bytes");


                            if(stringByteLength < 4){
                                dialogs.notify('알림', '한글은 2자 이상, 영문은 4자 이상으로 입력해주세요.', {size: 'md'});
                                return;
                            }else{
                                $scope.search.NICK_NM = name;
                                $scope.searchUserList();
                            }

                        }

                    };

                    $scope.user_pageChanged = function(){
                        console.log('User Page changed to: ' + $scope.USER_PAGE_NO);
                        $scope.searchUserList();
                    }

                    $scope.USER_PAGE_NO = 1;
                    $scope.USER_PAGE_SIZE = 15;
                    $scope.USER_TOTAL_COUNT = 0;

                    // 사용자 리스트
                    $scope.searchUserList = function () {
                        $scope.getList('ange/message', 'searchuserlist', {NO: $scope.USER_PAGE_NO - 1, SIZE: $scope.USER_PAGE_SIZE}, $scope.search, true)
                            .then(function(data){
                                var total_cnt = data[0].TOTAL_COUNT;
                                $scope.USER_TOTAL_COUNT = total_cnt;

                                for (var i in data) {
                                    if (data[i].FILE != null ) {

                                        data[i].profileImg = CONSTANT.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
                                        data[i].FILE_YN = data[i].FILE.FILE_ID;
                                        console.log(data[i].FILE_YN);
                                    }
                                }

                                /*$scope.total(total_cnt);*/
                                $scope.list = data;

                                $scope.searchUsetList = "Y";

                            })
                            ['catch'](function(error){$scope.USER_TOTAL_COUNT = 0; $scope.searchUsetList = "Y";  $scope.list = "";});
                    };

                    // 사용자 선택
                    $scope.select_user = function (to_id, to_nm, file_yn, img){

                        if(to_id == $scope.uid){
                            dialogs.notify('알림', '본인에게 보낼 수 없습니다.', {size: 'md'});
                            return;
                        }else{
//                            $modalInstance.close();
//                            $rootScope.openViewMessageRegModal(null, {TO_ID : to_id, TO_NICK_NM: to_nm} ,'lg');
                            $scope.selectUser = "Y";

                            $scope.item.TO_ID = to_id;
                            $scope.item.TO_NM = to_nm;
                            $scope.item.FILE_YN = file_yn;
                            $scope.item.profileImg = img;

                            $scope.searchUsetList = "N";
                            console.log($scope.item.TO_ID);
                            console.log($scope.item.TO_NM);
                        }
                    }


                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 광고센터 URL 셋팅
        $scope.adBannerUrl = function(idx, type, ad_type) {
            var deferred = $q.defer();

            var guid = $rootScope.guid;
            var id = $rootScope.uid;
            var ip = $rootScope.ip;
            var type = (type == undefined ? 1 : type);
            var ad_url = CONSTANT.AD_LOG_URL + '?index=' + idx + '&guid=' + guid + '&id=' + id + '&ip=' + ip + '&type=' + type + '&menu=' + $scope.path[1] + '&category=' + ($scope.path[2] == undefined ? '' : $scope.path[2]);
            if (guid == '' || guid == null) {
                $scope.getSession()
                    .then($scope.sessionCheck)
                    .then(function(){
                        guid = $rootScope.guid;
                        id = $rootScope.uid;
                        ip = $rootScope.ip;

                        var ad_url = CONSTANT.AD_LOG_URL + '?index=' + idx + '&guid=' + guid + '&id=' + id + '&ip=' + ip + '&type=' + type + '&menu=' + $scope.path[1] + '&category=' + ($scope.path[2] == undefined ? '' : $scope.path[2]);
                        if (ad_type == 'exp' || ad_type == 'event') ad_url += '&target=' + ad_type;
                        deferred.resolve(ad_url);
                    })
            } else {
                var ad_url = CONSTANT.AD_LOG_URL + '?index=' + idx + '&guid=' + guid + '&id=' + id + '&ip=' + ip + '&type=' + type + '&menu=' + $scope.path[1] + '&category=' + ($scope.path[2] == undefined ? '' : $scope.path[2]);
                if (ad_type == 'exp' || ad_type == 'event') ad_url += '&target=' + ad_type;
                deferred.resolve(ad_url);
            }

            return deferred.promise;
        }

        // 배너 이미지 클릭
        $scope.click_linkBanner = function (item) {
            if (item.ada_url != undefined && item.ada_url != '') {
                $scope.adBannerUrl(item.ada_idx, 1, item.ada_type)
                    .then(function(data){
                        if ($rootScope.uid != '' && $rootScope.uid != null) {
                            $scope.addMileage('BANNER', null);
                        }

                        if (item.ada_url.indexOf('://')>0) {
                            $window.open(data, 'width=1200,height=800');
                        } else {
                            $window.open(data, '_self');
                        }
                    });
            }
        };

        // 가입축하 마일리지 적립
        $scope.addMileageSignon = function (type, gb, item) {
            if (type == 'CONGRATULATION') {
                if (gb == '1') {
                    item.MILEAGE_GB = '3';
                    item.MILEAGE_NO = '1';
                } else if (gb == '2') {
                    item.MILEAGE_GB = '4';
                    item.MILEAGE_NO = '2';
                }
            }

            $scope.insertItem('ange/mileage', 'item', item, false)
                .then(function(data){
                    $rootScope.mileage = data.mileage;
//                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                })
                ['catch'](function(error){dialogs.error('오류', '[마일리지]'+error, {size: 'md'});});
        }

        // 마일리지 적립
        $scope.addMileage = function (type, gb) {
            var item = {};

            if (type == 'LOGIN') {
                item.MILEAGE_GB = '6';
                item.MILEAGE_NO = '4';
            } else if (type == 'BANNER') {
                item.MILEAGE_GB = '11';
                item.MILEAGE_NO = '34';
            } else if (type == 'BOARD') {
                item.MILEAGE_GB = '1';

                if (gb == '1') {            // 시시콜콜수다방
                    item.MILEAGE_NO = '17';
                } else if (gb == '2') {     // 예비맘이야기
                    item.MILEAGE_NO = '54';
                } else if (gb == '3') {     // 좌충우돌 육아방
                    item.MILEAGE_NO = '57';
                } else if (gb == '4') {     // 힘내라워킹방
                    item.MILEAGE_NO = '59';
                } else if (gb == '5') {     // 임신준비방
                    item.MILEAGE_NO = '114';
                } else if (gb == '6') {     // 톡톡톡
                    item.MILEAGE_NO = '86';
                } else if (gb == '7') {     // 책수다
                    item.MILEAGE_NO = '125';
                } else if (gb == '61') {    // 온라인 토론
                    item.MILEAGE_NO = '12';
                } else {
                    return;
                }
            } else if (type == 'PHOTO') {
                item.MILEAGE_GB = '1';

                if (gb == '11') {           // 도전앙쥬 모델
                    item.MILEAGE_NO = '15';
                } else if (gb == '12') {    // 나의 맛잇는 레시피
                    item.MILEAGE_NO = '61';
                } else if (gb == '13') {    // 피플 맛집
                    item.MILEAGE_NO = '151';
                } else {
                    return;
                }
            } else if (type == 'CLINIC') {
                item.MILEAGE_GB = '1';

                if (gb == '25') {           // 재테크상담
                    item.MILEAGE_NO = '68';
                } else {
                    return;
                }
            } else if (type == 'REPLY') {
                item.MILEAGE_GB = '2';

                if (gb == 'CONTENT') {      // 임신출산컨텐츠
                    item.MILEAGE_NO = '8';
                } else if (gb == 'TALK') {  // 투데이 톡
                    item.MILEAGE_NO = '74';
                } else if (gb == '1') {     // 시시콜콜수다방
                    item.MILEAGE_NO = '18';
                } else if (gb == '2') {     // 예비맘 이야기
                    item.MILEAGE_NO = '55';
                } else if (gb == '3') {     // 좌충우돌 육아방
                    item.MILEAGE_NO = '58';
                } else if (gb == '4') {     // 힘내라워킹방
                    item.MILEAGE_NO = '60';
                } else if (gb == '5') {     // 임신준비방
                    item.MILEAGE_NO = '115';
                } else if (gb == '6') {     // 톡톡톡
                    item.MILEAGE_NO = '87';
                } else if (gb == '7') {     // 책수다
                    item.MILEAGE_NO = '126';
                } else if (gb == '11') {    // 도전앙쥬 모델
                    item.MILEAGE_NO = '16';
                } else if (gb == '12') {    // 나의 맛잇는 레시피
                    item.MILEAGE_NO = '62';
                } else if (gb == '13') {    // 피플 맛집
                    item.MILEAGE_NO = '152';
                } else if (gb == 'EXPERIENCE') {    // 체험단 후기
                    item.MILEAGE_NO = '62';
                } else if (gb == 'EVENT') {         // 이벤트 후기
                    item.MILEAGE_NO = '85';
                } else if (gb == 'SAMPLE') {        // 샘플팩 후기
                    item.MILEAGE_NO = '121';
                } else if (gb == 'BOOK') {        // 샘플팩 후기
                    item.MILEAGE_NO = '143';
                } else {
                    return;
                }
            } else if (type == 'EVENT') {
                item.MILEAGE_GB = '10';

                if (gb == 'EVENT') {        // 이벤트응모시
                    item.MILEAGE_NO = '33';
                } else {
                    return;
                }
            } else if (type == 'EXPERIENCE') {
                item.MILEAGE_GB = '1';

                if (gb == 'EXPERIENCE') {        // 체험단 응모
                    item.MILEAGE_NO = '69';
                } else {
                    return;
                }
            } else if (type == 'REVIEW') {
                item.MILEAGE_GB = '1';

                if (gb == 'PRODUCT') {              // 체험단 후기
                    item.MILEAGE_NO = '110';
                } else if (gb == 'EXPERIENCE') {    // 체험단 후기
                    item.MILEAGE_NO = '70';
                } else if (gb == 'EVENT') {         // 이벤트 후기
                    item.MILEAGE_NO = '150';
                } else if (gb == 'SAMPLE') {
                    item.MILEAGE_NO = '120';        // 119 하나 더 있음??
                } else if (gb == 'BOOK') {
                    item.MILEAGE_NO = '124';
                } else {
                    return;
                }
            } else if (type == 'POST') {
                item.MILEAGE_GB = '4';

                if (gb == 'POST') {      // 체험단 후기
                    item.MILEAGE_NO = '118';
                } else {
                    return;
                }
            } else if (type == 'SAMPLE') {
                item.MILEAGE_GB = '';

                if (gb == 'SAMPLE') {      // 샘플팩 후기
                    item.MILEAGE_NO = '';
                } else {
                    return;
                }
            } else {
                return;
            }

            $scope.insertItem('ange/mileage', 'item', item, false)
                .then(function(data){
                    $rootScope.mileage = data.mileage;
//                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                })
                ['catch'](function(error){dialogs.error('오류', '[마일리지]'+error, {size: 'md'});});
        };

        $scope.getCanlendarList = function () {
            var now = new Date();
            var nowYear = now.getFullYear();
            var nowMonth = now.getMonth() + 1;

            $scope.getList('ange/calendar', 'list', {}, {"year":nowYear,"month":nowMonth}, true)
                .then(function(data){
                    $scope.data = data;
                })
                ['catch'](function(error){
                alert('error');
            });
        };

        $scope.click_showCalendar = function () {
            $location.url('/myange/calendar');
        };
    }]);

    controllers.controller('board-report', ['$rootScope', '$scope', '$window', '$sce', '$controller', '$location', '$modalInstance', '$q', 'dialogs', 'CONSTANT', 'UPLOAD', 'data', '$modal', function($rootScope, $scope, $window, $sce, $controller, $location, $modalInstance, $q, dialogs, CONSTANT, UPLOAD, data, $modal) {

        $scope.init = function (){

            console.log(data.TARGET_GB);
            console.log(data.DETAIL_GB);

            $scope.item.CHANNEL_NO = $scope.menu.CHANNEL_NO;
            $scope.item.MENU_NO = $scope.menu.NO;
            $scope.item.TARGET_NO = data.NO;
            $scope.item.TARGET_GB = data.TARGET_GB;
            $scope.item.TARGET_NOTE = data.SUBJECT;
            $scope.item.DETAIL_GB = data.DETAIL_GB;
            $scope.item.TARGET_UID = data.REG_UID;
            $scope.item.TARGET_NICK = data.NICK_NM;
            $scope.item.REG_UID = $scope.uid;
            $scope.item.REG_NICK = $rootScope.nick;

        }


        $scope.click_saveReport = function (){

            $scope.insertItem('ange/notify', 'item', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '신고가 접수되었습니다.', {size: 'md'});
                    $modalInstance.close();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        $scope.click_cancel = function () {
            $modalInstance.close();
        };


        $scope.init();
    }]);

    controllers.controller('module-reply', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT) {

        /********** 초기화 **********/
        $scope.replyList = [];
        $scope.reply = {};
        $scope.replySearch = {};

        $scope.showCommentDetails = false;
        $scope.showReCommentDetails = false;

        if ($scope.menu != undefined) {
            $scope.comm_no = $scope.menu.COMM_NO;
        }

        if($rootScope.uid == undefined){
            $scope.nouserid = true;
        }else if($rootScope.uid == null || $rootScope.uid == ''){
            $scope.nouserid = true;
        }else{
            $scope.nouserid = false;
        }

        // 페이징
        $scope.replySearch.PAGE_NO = 1;
        $scope.replySearch.PAGE_SIZE = 10;
        $scope.replySearch.TOTAL_COUNT = 0;

        $scope.pageChanged = function(){

            console.log('Page changed to: ' + $scope.search.PAGE_NO);
            $scope.replyList = [];
            $scope.getReplyList();
        }

        /********** 이벤트 **********/
        var temp_num = '';

        $scope.click_toggleReplyConfig = function (r_num) {
            //alert('photo_menu_' + p_num);
            if (r_num == temp_num) {
                temp_num = '';
            }

            if(r_num){
                document.getElementById('reply_menu_' + r_num).style.display = "block";
            }

            if(temp_num) {
                document.getElementById('reply_menu_' + temp_num).style.display = "none";
            }
            temp_num = r_num;
        };

        // 댓글 리스트
        $scope.getReplyList = function () {

            $scope.replySearch.TARGET_NO = $scope.TARGET_NO;
            $scope.replySearch.TARGET_GB = $scope.TARGET_GB;

            $scope.getItem('com/reply', 'item', {}, $scope.replySearch, true)
                .then(function(data){

                    if(data.COMMENT == null){
                        $scope.replySearch.TOTAL_COUNT = 0;
                    }else{
                        $scope.replySearch.TOTAL_COUNT = data.COMMENT[0].TOTAL_COUNT;
                    }

                    var reply = data.COMMENT;
                    $scope.replyItem = {};

                    for(var i in reply) {

                        if (reply[i].FILE_ID != null) {
                            reply[i].profileImg = CONSTANT.BASE_URL + reply[i].PATH + reply[i].FILE_ID;
                        }

                        $("textarea#comment").val(reply[i].COMMENT);
                        $scope.replyList.push(reply[i]);
                    }
                })
                ['catch'](function(error){$scope.replyList = "";});
        };

        // 의견 등록
        $scope.click_saveComment = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $scope.replyItem.PARENT_NO = 0;
            $scope.replyItem.LEVEL = 1;
            $scope.replyItem.REPLY_NO = 1;
            $scope.replyItem.TARGET_NO = $scope.TARGET_NO;
            $scope.replyItem.TARGET_GB = $scope.TARGET_GB;
            console.log($scope.replyItem.COMMENT);

            //$scope.replyItem.COMMENT = $scope.replyItem.COMMENT.replace("\r\n","");

            $scope.insertItem('com/reply', 'item', $scope.replyItem, false)
                .then(function(){

                    $scope.replySearch.TARGET_NO = $scope.replyItem.NO;
                    $scope.replyList = [];
                    $scope.getReplyList();

                    $scope.replyItem.COMMENT = "";

                    if ($scope.TARGET_GB == 'CONTENT') {
                        $scope.addMileage('REPLY', 'CONTENT');
                    } else if ($scope.TARGET_GB == 'BOARD') {
                        $scope.addMileage('REPLY', $scope.menu.COMM_NO);
                    } else if ($scope.TARGET_GB == 'REVIEW') {
                        $scope.addMileage('REPLY', $scope.TARGET_GB);
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 답글 등록
        $scope.click_saveReComment = function (item) {

            if($rootScope.uid == null || $rootScope.uid == ''){
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }else if($rootScope.uid == undefined){
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $scope.reply.PARENT_NO = item.NO;
            $scope.reply.LEVEL = parseInt(item.LEVEL)+1;
            $scope.reply.REPLY_NO = parseInt(item.REPLY_NO)+1;
            $scope.reply.TARGET_GB = $scope.TARGET_GB;
            $scope.reply.TARGET_NO = $scope.TARGET_NO;

            $scope.REPLY_COMMENT = $scope.replyList;

            $scope.insertItem('com/reply', 'item', $scope.reply, false)
                .then(function(){
                    $scope.replySearch.TARGET_NO = $scope.TARGET_NO;
                    $scope.replyList = [];
                    $scope.getReplyList();
                    $scope.reply.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 블라인드 처리
        $scope.click_blind = function (key){

            /*for(var i=0; i< replyList.length; i++){
             $scope.item.NO = replyList[i].NO;
             }*/

            console.log(key);

            $scope.updateItem('com/reply', 'blind', key, {}, false)
                .then(function(){

                    dialogs.notify('알림', '블라인드 처리가 되었습니다.', {size: 'md'});

                    $scope.replyList = [];
                    $scope.getReplyList();
                    $scope.reply.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 블라인드 처리 해제
        $scope.click_blind_clear = function (key){

            console.log(key);
            $scope.updateItem('com/reply', 'blind_clear', key, {}, false)
                .then(function(){

                    dialogs.notify('알림', '블라인드 처리가 해제 되었습니다.', {size: 'md'});

                    $scope.replyList = [];
                    $scope.getReplyList();
                    $scope.reply.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 수정
        $scope.click_updateReply = function (key, comment) {

            if($rootScope.uid == null || $rootScope.uid == ''){
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }else if($rootScope.uid == undefined){
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            console.log(key);

            $scope.replyItem = {};
            $scope.replyItem.COMMENT = comment;

            $scope.updateItem('com/reply', 'item', key, $scope.replyItem, false)
                .then(function(){

                    $scope.replyItem.COMMENT = "";

                    dialogs.notify('알림', '댓글이 수정 되었습니다.', {size: 'md'});

                    $scope.replyList = [];
                    $scope.getReplyList();
                    $scope.reply.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 삭제
        $scope.click_deleteReply = function (item) {

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/reply', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $scope.replyList = [];
                        $scope.getReplyList();
                        $scope.reply.COMMENT = "";
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }


        $scope.fnByteCal = function () {

            var tempText = $("#comment");
            var tempChar = "";                                        // TextArea의 문자를 한글자씩 담는다
            var tempChar2 = "";                                        // 절삭된 문자들을 담기 위한 변수
            var countChar = 0;                                        // 한글자씩 담긴 문자를 카운트 한다
            var tempHangul = 0;                                        // 한글을 카운트 한다
            var maxSize = 500;                                        // 최대값

            // 글자수 바이트 체크를 위한 반복
            for(var i = 0 ; i < tempText.val().length; i++) {
                tempChar = tempText.val().charAt(i);

                // 한글일 경우 2 추가, 영문일 경우 1 추가
                if(escape(tempChar).length > 4) {
                    countChar += 2;
                    tempHangul++;
                } else {
                    countChar++;
                }
            }

            // 카운트된 문자수가 MAX 값을 초과하게 되면 절삭 수치까지만 출력을 한다.(한글 입력 체크)
            // 내용에 한글이 입력되어 있는 경우 한글에 해당하는 카운트 만큼을 전체 카운트에서 뺀 숫자가 maxSize보다 크면 수행
            if((countChar-tempHangul) > maxSize) {
                alert("최대 글자수를 초과하였습니다.");

                tempChar2 = tempText.val().substr(0, maxSize-1);
                tempText.val(tempChar2);
            }
        }


        // 신고버튼
        $scope.click_boardReport = function (item) {

            $scope.openCounselModal(item, 'lg');

        };

        // 신고버튼 팝업
        $scope.openCounselModal = function (item, size){

            var dlg = dialogs.create('reply_report.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller,data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};

                    console.log($scope.menu.CHANNEL_NO);
                    console.log($scope.menu.NO);

                    $scope.item.CHANNEL_NO = $scope.menu.CHANNEL_NO;
                    $scope.item.MENU_NO = $scope.menu.NO;
                    $scope.item.TARGET_NO = item.NO;
                    $scope.item.TARGET_GB = 'REPLY';
                    $scope.item.DETAIL_GB = 'REPLY';
                    $scope.item.TARGET_NOTE = item.COMMENT;
                    $scope.item.TARGET_UID = item.REG_UID;
                    $scope.item.TARGET_NICK = item.NICK_NM;
                    $scope.item.REG_UID = $scope.uid;
                    $scope.item.REG_NICK = $rootScope.nick;

                    $scope.click_saveReport = function (){

                        $scope.insertItem('ange/notify', 'item', $scope.item, false)
                            .then(function(){

                                dialogs.notify('알림', '신고가 접수되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };


                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.getReplyList();
            },function(){

            });
        };

        // 대댓글 신고버튼
        $scope.click_re_boardReport = function (item, reitem) {

            console.log(item);
            console.log(reitem);

            $scope.reportitem = {};

            $scope.reportitem.TARGET_GB = 'REPLY';
            $scope.reportitem.DETAIL_GB = 'REPLY';
            $scope.reportitem.TARGET_NO = reitem.NO;
            $scope.reportitem.TARGET_NOTE = reitem.COMMENT;
            $scope.reportitem.ETC_NO = reitem.PARENT_NO;
            $scope.reportitem.ETC_GB = 'REPLY';
            $scope.reportitem.ETC_NOTE = item.COMMENT;
            $scope.reportitem.TARGET_UID = reitem.REG_UID;
            $scope.reportitem.TARGET_NICK = reitem.NICK_NM;

            $scope.openReCounselModal($scope.reportitem, 'lg');

        };

        // 대댓글 신고버튼 팝업
        $scope.openReCounselModal = function (item, size){

            var dlg = dialogs.create('reply_report.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller,data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};

                    $scope.item = item;
                    $scope.item.CHANNEL_NO = $scope.menu.CHANNEL_NO;
                    $scope.item.MENU_NO = $scope.menu.NO;
                    $scope.item.REG_UID = $scope.uid;
                    $scope.item.REG_NICK = $rootScope.nick;

                    $scope.click_saveReport = function (){

                        $scope.insertItem('ange/notify', 'item', $scope.item, false)
                            .then(function(){

                                dialogs.notify('알림', '신고가 접수되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };


                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.getReplyList();
            },function(){

            });
        };

        // 메시지 버튼 클릭
        $scope.click_sendMessage = function (item) {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $scope.openViewMessageRegModal(null, item, 'lg');
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getReplyList();

//        $scope.getSession()
//            .then($scope.sessionCheck)
//            ['catch']($scope.reportProblems);


    }]);

    controllers.controller('subside-ad', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $controller, $location, dialogs, CONSTANT) {

        var spMenu = $location.path().split('/');

        // 초기화
        $scope.init = function() {
            var sd_01 = 0;
            var sd_02 = 0;

            if ($scope.channel.CHANNEL_NO == 2) {
                sd_01 = CONSTANT.AD_CODE_BN17;
                sd_02 = CONSTANT.AD_CODE_BN16;
            } else if ($scope.channel.CHANNEL_NO == 3) {
                sd_01 = CONSTANT.AD_CODE_BN21;
                sd_02 = CONSTANT.AD_CODE_BN20;
            } else if ($scope.channel.CHANNEL_NO == 4) {
                sd_01 = CONSTANT.AD_CODE_BN17;
                sd_02 = CONSTANT.AD_CODE_BN16;
            } else if ($scope.channel.CHANNEL_NO == 5) {
                sd_01 = CONSTANT.AD_CODE_BN24;
                sd_02 = CONSTANT.AD_CODE_BN23
            } else if ($scope.channel.CHANNEL_NO == 8) {
                sd_01 = CONSTANT.AD_CODE_BN56;
                sd_02 = CONSTANT.AD_CODE_BN30;
            }

            // ange-portlet-link-image
            $scope.option_r1 = {title: '이벤트 배너', api:'ad/banner', size: 1, gb: sd_01, link: true, open: true, image: '/imgs/ange/temp/temp_maineventbanner.png'};

            // ange-portlet-link-image2
            $scope.option_r2 = {title: '이벤트 배너', api:'ad/banner', size: 3, gb: sd_02, link: true, open: true, image: '/imgs/ange/temp/temp_maineventbanner.png'};
        }

        /********** 이벤트 **********/

        $scope.init();

    }]);

    controllers.controller('ui-ads', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $controller, $location, dialogs, CONSTANT) {

        angular.extend(this, $controller('ange-common', {$scope: $scope}));

        $scope.option_r1 = {title: '롤링', api:'ad/banner', size: 2, id: 'ads1', type: 'ange', gb: 1, dots: false, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

        $scope.option_r2 = {title: '롤링', api:'ad/banner', size: 5, id: 'ads2', type: 'ange', gb: 2, dots: false, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

        $scope.option_r3 = {title: '롤링', api:'ad/banner', size: 2, id: 'ads3', type: 'ange', gb: 3, dots: false, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

        $scope.option_r4 = {title: '롤링', api:'ad/banner', size: 2, id: 'ads4', type: 'banner', gb: CONSTANT.AD_CODE_BN02, dots: false, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

        /********** 이벤트 **********/
        $scope.click_mainLogo = function() {
            $location.url("/main");
        };

        $scope.click_intro = function() {
            $location.url("/company/intro")
        };

        $scope.click_affiliates = function() {
            $location.url("/company/affiliates")
        };

    }]);

    controllers.controller('ui-gnb', ['$scope', '$rootScope', '$location', 'dialogs', '$stateParams', function ($scope, $rootScope, $location, dialogs, $stateParams) {

        $scope.search = {};

        $scope.channeltitle = $stateParams.channel; //채널 타이틀(GNB 하이라이트용)

        var spMenu = $location.path().split('/');

        var channel_nm = $stateParams.channel;

        /********** 이벤트 **********/
        $scope.init = function () {
            var getParam = function(key){
                var _parammap = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    _parammap[decode(arguments[1])] = decode(arguments[2]);
                });

                return _parammap[key];
            };

            $scope.search.SEARCH_KEYWORD = getParam("search_key");
        };

//        <a href="/story/content/list" ng-class="channeltitle == 'story' ? 'gnb_chnnel chnnel1 nowmenu' : 'gnb_chnnel chnnel1'">ANGE Story</a>
//        <a href="/people/home" ng-class="channeltitle == 'people' ? 'gnb_chnnel chnnel2 nowmenu' : 'gnb_chnnel chnnel2'">ANGE People</a>
//            <a href="/moms/home" ng-class="channeltitle == 'moms' ? 'gnb_chnnel chnnel3 nowmenu' : 'gnb_chnnel chnnel3'">ANGE Mom's</a>
//        <a ng-click="click_myange();" ng-class="channeltitle == 'myange' ? 'gnb_chnnel chnnel4 nowmenu' : 'gnb_chnnel chnnel4'">My ANGE</a>
//
//        <div class="gnb_right">
//            <a href="/store/mileagemall/list" ng-class="channeltitle == 'store' ? 'gnb_store ch_store nowmenu' : 'gnb_store ch_store'">ANGE Store</a>
//            <!--<a href="/store/home" class="gnb_store ch_store">ANGE Store</a>--

        $scope.click_channel = function(menu) {

            switch(menu){
                case 'story':
                    $location.url('/story/content/list');
                    break;
                case 'people':
                    $location.url('/people/home');
                    break;
                case 'moms':
                    $location.url('/moms/home');
                    break;
                case 'myange':
                    $scope.click_myange();
                    break;
                case 'store':
                    $location.url('/store/mileagemall/list');
                    break;
                case 'infodesk':
                    $location.url('/infodesk/qna/list');
                    break;
                default:
                    dialogs.notify('알림', '잘못된 접근입니다.', {size: 'md'});
                    $location.url('/');
                    break;
            }
//            if(menu != $scope.channeltitle) {
//                switch(menu){
//                    case 'story':
//                        $location.url('/story/content/list');
//                        break;
//                    case 'people':
//                        $location.url('/people/home');
//                        break;
//                    case 'moms':
//                        $location.url('/moms/home');
//                        break;
//                    case 'myange':
//                        $scope.click_myange();
//                        break;
//                    case 'store':
//                        $location.url('/store/mileagemall/list');
//                        break;
//                    case 'infodesk':
//                        $location.url('/infodesk/qna/list');
//                        break;
//                    default:
//                        dialogs.notify('알림', '잘못된 접근입니다.', {size: 'md'});
//                        $location.url('/');
//                        break;
//                }
//            } else {
//                console.log ("[" + $scope.channeltitle + "] 현재 메뉴입니다.")
//            }
        };

        $scope.click_login = function () {
            $scope.openModal(null, 'md');
        };

        $scope.click_myange = function (){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/myange/home');
//            $location.url('/myange/mileage');
        }

        $scope.click_showSearch = function (){
            if($scope.search.SEARCH_KEYWORD == undefined){
                $scope.search.SEARCH_KEYWORD = '';
            }

            $location.url('/search/list?search_key='+$scope.search.SEARCH_KEYWORD);
        }

        $scope.click_showSearch_mobile = function (){
            $location.url('/search/list');
        }

        $scope.click_searchContent = function(path, no){
            $window,open();
        }

        $scope.init();
    }]);


    // 사용할 서비스를 주입
    controllers.controller('ui-lnb-mobile', ['$scope', '$rootScope', '$location', 'dialogs', '$stateParams', function ($scope, $rootScope, $location, dialogs, $stateParams) {

        var spMenu = $location.path().split('/');

        var channel_nm = $stateParams.channel;

        /********** 이벤트 **********/
        $scope.click_channel = function() {
            switch(menu){
                case 'story':
                    $location.url('/story/content/list');
                    break;
                case 'people':
                    $location.url('/people/home');
                    break;
                case 'moms':
                    $location.url('/moms/home');
                    break;
                case 'myange':
                    $scope.click_myange();
                    break;
                case 'store':
                    $location.url('/store/mileagemall/list');
                    break;
                case 'infodesk':
                    $location.url('/infodesk/qna/list');
                    break;
                default:
                    dialogs.notify('알림', '잘못된 접근입니다.', {size: 'md'});
                    $location.url('/');
                    break;
            }
        };

        $scope.click_login = function () {
            $scope.openModal(null, 'md');
        };

        $scope.click_myange = function (){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/myange/home');
        }

    }]);

    controllers.controller('ui-lnb', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', '$filter', 'dialogs', function ($scope, $rootScope, $stateParams, $controller, $location, $filter, dialogs) {

        /********** 페이지 타이틀 **********/
//        angular.forEach($rootScope.ange_menu, function(menu) {
//
//            if (menu.MENU_URL.indexOf(spMenu[1]+"/") > -1) {
//                $scope.$parent.$parent.pageTitle = menu.MENU_NM;
//                $scope.$parent.$parent.pageDescription = menu.MENU_DESC;
//                $scope.$parent.$parent.tailDescription = menu.TAIL_DESC;
//
//                return;
//            }
//        });

        /********** 초기화 **********/
            // 카테고리 데이터
        $scope.category = [];

        // 초기화
        $scope.init = function() {
            $scope.getList('cms/category', 'list', {}, {SYSTEM_GB: 'CMS'}, false).then(function(data){

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
                ['catch'](function(error){$scope.projects = []; console.log(error)});
        };

        /********** 좌측 메뉴 **********/
//        var menu = $filter('filter')($rootScope.ange_menu, function (data) {
//            return (data.MENU_URL.indexOf(menu[1]) > -1)
//        })[0];

        var channelNo = "2";

        var channel = $filter('filter')($rootScope.ange_channel, function (data) {
            return data.CHANNEL_NO === channelNo;
        })[0];

        $scope.item = channel;

        /********** 화면 초기화 **********/
        $scope.init();

//        $scope.selectMenu = function(menu) {
//            if ($scope.permissionCheck(menu.MENU_URL, false)) {
//                $location.url(menu.MENU_URL);
//            }
//        };
//
//        $scope.nowMenu = spMenu[1];
        //alert(spMenu[1]);

    }]);

    controllers.controller('ui-utility', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', '$window', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $controller, $location, $window, dialogs, CONSTANT) {

        angular.extend(this, $controller('ange-common', {$scope: $scope}));

        $scope.duration = 3000;

        $scope.isProfile = false;

        /********** 이벤트 **********/
        $scope.click_login = function () {
            $scope.openModal(null, 'md');
        };

        $scope.click_joinMember = function () {
            $location.url('infodesk/signon');
        };

        $scope.click_forgotInfo = function () {
            $location.url('infodesk/forgot/request');
        };

        $scope.click_goClub = function () {
//            $scope.comming_soon();
//            return;

            console.log('$rootScope.user_gb = '+$rootScope.user_gb);
            console.log('$rootScope.role = '+$rootScope.role);
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

//            if($rootScope.user_gb != 'CLUB' || $rootScope.role != 'ANGE_ADMIN'){
//                dialogs.notify('알림', '앙쥬클럽 회원만 사용가능 합니다.', {size: 'md'});
//                return;
//            }

            if($rootScope.user_gb == 'CLUB'){
                $location.url('/club/home');
            }else if($rootScope.role == 'ANGE_ADMIN'){
                $location.url('/club/home');
            }else if($rootScope.user_gb == 'CLINIC'){
                $location.url('/club/home');
            }else{
                dialogs.notify('알림', '앙쥬클럽 회원만 사용가능 합니다.', {size: 'md'});
                return;
            }

//            if($rootScope.role != 'ANGE_ADMIN' ){ //|| $rootScope.user_gb != 'CLUB'
//                dialogs.notify('알림', '앙쥬클럽 회원만 사용가능 합니다.', {size: 'md'});
//                return;
//            }


        };

        $scope.click_settingAccount = function () {
            $location.url('myange/account');
        };

        $scope.click_showSlide = function () {
            $scope.isProfile = true;
        };

        $scope.click_closeSlide = function () {
            $scope.isProfile = false;
        };

        $scope.click_settingBaby = function () {
            $location.url('myange/baby');
        };

        $scope.click_myangeMileage = function () {
            $location.url('myange/mileage');
        };

        $scope.click_myangeScrap = function () {
            $location.url('myange/scrap');
        };

        $scope.click_storeCart = function () {
            $location.url('store/cart/list');
        };

        $scope.click_myangeWriting = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('myange/writing');
        };

        $scope.click_myangeMessage = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('myange/message');
        };

        $scope.click_infodesk = function () {
            $location.url('infodesk/qna/list');
//            $location.url('infodesk/home');
        };

        $scope.click_myangeAlbum = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('myange/album/list');
        };

        // 조회 버튼 클릭
        $scope.click_showViewMyAlbum = function (item) {
            $scope.openViewMyAlbumModal(item, 'lg');
        };

        $scope.openViewMyAlbumModal = function (item, size) {
            var dlg = dialogs.create('partials/ange/myange/myangealbum-view-popup.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', 'data', function($scope, $rootScope, $modalInstance, $controller, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));

                    $scope.isHome = true;
                    $scope.item = data;

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }
                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 로그인 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('login_modal.html',
                ['$scope', '$modalInstance', '$controller', '$timeout', 'data', 'CONSTANT', function($scope, $modalInstance, $controller, $timeout, data, CONSTANT) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};
                    $scope.save_id = false;
                    $scope.content = data;

                    if (localStorage.getItem('save_id')) {
                        $scope.save_id = true;
                        $scope.item.id = localStorage.getItem('user_id');

                        $timeout(function() { $('#password').focus();}, 1000);
                    } else {
                        $timeout(function() { $('#id').focus();}, 1000);
                    }

                    // 상단 배너 이미지 조회
                    $scope.getLoginBanner = function () {
                        $scope.search = {};
                        $scope.search.ADP_IDX = CONSTANT.AD_CODE_BN31;
                        $scope.search.ADA_STATE = 1;
                        $scope.search.ADA_TYPE = 'banner';
                        $scope.search.MENU = $scope.path[1];
                        $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);

                        $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, $scope.search, false)
                            .then(function(data){
                                $scope.loginBanner = data[0];
                                $scope.loginBanner.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                            })
                            ['catch'](function(error){});
                    };

                    $scope.getLoginBanner();

                    $scope.click_ok = function () {
                        if ($scope.item.id == null || $scope.item.id == '') {
                            dialogs.notify('알림', '아이디를 입력하세요', {size: 'md'});
                            return;
                        }

                        if ($scope.save_id) {
                            localStorage.setItem('user_id', $scope.item.id);
                        } else {
                            localStorage.removeItem('user_id');
                        }

                        $scope.item.SYSTEM_GB = 'ANGE';

                        $scope.login($scope.item.id, $scope.item)
                            .then(function(data){
                                $rootScope.login = true;
                                $rootScope.authenticated = true;
                                $rootScope.user_info = data;
                                $rootScope.uid = data.USER_ID;
                                $rootScope.mileage = data.REMAIN_POINT;
                                $rootScope.message = data.MESSAGE_CNT;
                                $rootScope.name = data.USER_NM;
                                $rootScope.role = data.ROLE_ID;
                                $rootScope.system = data.SYSTEM_GB;
                                $rootScope.menu_role = data.MENU_ROLE;
                                $rootScope.email = data.EMAIL;
                                $rootScope.nick = data.NICK_NM;

                                if (data.FILE) {
                                    $rootScope.profileImg = CONSTANT.BASE_URL + data.FILE.PATH + data.FILE.FILE_ID;
                                } else {
                                    $rootScope.profileImg = null;
                                }

                                if (data != undefined && data.ALBUM) {
                                    var albumData = data.ALBUM;
                                    for(var i in albumData) {
                                        if (albumData[i].FILE_ID != null) {
                                            albumData[i].ALBUM_FILE = CONSTANT.BASE_URL + albumData[i].PATH + 'thumbnail/' + albumData[i].FILE_ID;
                                        }
                                    }

                                    $rootScope.albumList = albumData;
                                } else {
                                    $rootScope.albumList = null;
                                }

                                $rootScope.scheduleList = data.SCHEDULE;

                                $scope.addMileage('LOGIN', null);

                                var check = /^(?=.+[@])$/;

                                if (check.test(data.USER_ID) || data.NICK_NM == '') {
                                    $location.path('myange/account');
                                }

                                if (data.USER_ST == 'W' && data.CERT_GB == 'MIG') {
                                    $location.path('myange/account');
                                }

                                $modalInstance.close('login');
                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                    $scope.click_forgotInfo = function () {
                        $location.url('infodesk/forgot/request');
                        $modalInstance.close();
                    };

                    $scope.click_joinMember = function () {
                        $location.url('infodesk/signon');
                        $modalInstance.close();
                    };

                    $scope.check_saveId = function ($event) {
                        var checkbox = $event.target;
                        if (checkbox.checked) {
                            localStorage.setItem('save_id', $scope.save_id);
                        } else {
                            localStorage.removeItem('save_id');
                        }
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(action){
                if (action == 'login') {
                    $scope.getCanlendarList();
//                    $rootScope.scheduleList = [{"name":"이예슬", "event":"돌", "dday":"88"}, {"name":"므에에롱", "event":"생일", "dday":"30"}, {"name":"막둥이", "event":"백일", "dday":"10"}]
                }
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        $scope.logoutMe = function() {
            if ($rootScope.uid != undefined) {
                $scope.logout($rootScope.uid).then( function(data) {
                    dialogs.notify('알림', "로그아웃 되었습니다.", {size: 'md'});

                    if ($scope.channel.CHANNEL_NO == 4 ) {
                        $location.path("/main");
                    }

                    if ($stateParams.menu == 'supporter') {
                        $location.path("/people/home");
                    }
//                    $location.url('main');
                });
            }

            $scope.isProfile = false;
        };

        // 상단 배너 이미지 조회
        $scope.getTopBanner = function () {
            $scope.search = {};
            $scope.search.ADP_IDX = CONSTANT.AD_CODE_BN01;
            $scope.search.ADA_STATE = 1;
            $scope.search.ADA_TYPE = 'banner';
            $scope.search.MENU = $scope.path[1];
            $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);

            $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, $scope.search, false)
                .then(function(data){
                    $scope.topBanner = data[0];
                    $scope.topBanner.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                })
                ['catch'](function(error){});
        };

        $scope.getTopBanner();

        // 하단 배너 이미지 조회
        $scope.getTopBanner = function () {
            $scope.search = {};
            $scope.search.ADP_IDX = CONSTANT.AD_CODE_BN03;
            $scope.search.ADA_STATE = 1;
            $scope.search.ADA_TYPE = 'banner';
            $scope.search.MENU = $scope.path[1];
            $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);

            $scope.getList('ad/banner', 'list', {NO:0, SIZE:2}, $scope.search, false)
                .then(function(data){
                    $scope.bottomBanner1 = data[0];
                    $scope.bottomBanner1.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;

                    $scope.bottomBanner2 = data[1];
                    $scope.bottomBanner2.img = CONSTANT.AD_FILE_URL + data[1].ada_preview;
                })
                ['catch'](function(error){});
        };

        $scope.getTopBanner();

        /*        // 세션 체크
         $scope.sessionCheck = function(session) {
         if (session.USER_ID == undefined) {
         //                $location.path("/signin");
         //                throw( new String('세션이 만료되었습니다.') );
         //            throw( new Error("세션이 만료되었습니다.") );
         } else if (session.USER_ID == '') {
         //                $location.path("/signin");
         //                throw( new String('로그인 후 사용가능합니다.') );
         } else {
         $rootScope.session = session;



         $rootScope.authenticated = true;
         $rootScope.uid = session.USER_ID;

         //console.log($rootScope.uid);

         $rootScope.name = session.USER_NM;
         $rootScope.role = session.ROLE_ID;
         $rootScope.menu_role = session.MENU_ROLE;
         $rootScope.email = session.EMAIL;
         }

         //console.log($rootScope.uid);

         return;

         };*/

        $scope.click_mainLogo = function() {

        };

        $scope.activeMsg = 0;

        $scope.setVisible = function(index) {
            if (index == $scope.activeMsg) {
                return("1") ;
            } else {
                return("0") ;
            }
        }

        $scope.refresh = function() {
            $scope.$apply(function() {
                $scope.activeMsg++ ;

                if ($rootScope.scheduleList != undefined && $scope.activeMsg >= $rootScope.scheduleList.length) {
                    $scope.activeMsg = 0 ;
                }
            })
        }

        setInterval($scope.refresh,3000) ;

//        $scope.getSession()
//            .then($scope.sessionCheck)
//            ['catch']($scope.reportProblems);


    }]);
});
