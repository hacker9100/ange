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
    controllers.controller('ange-common', ['$rootScope', '$scope', '$stateParams', '$window', '$location', '$q', 'dataService', '$filter', 'dialogs', 'CONSTANT', function ($rootScope, $scope, $stateParams, $window, $location, $q, dataService, $filter, dialogs, CONSTANT) {

        $scope.comming_soon = function() {
            dialogs.notify('알림', '체험기간에는 제공되지 않습니다.', {size: 'md'});
        }

        // 주소 경로
        $scope.path = $scope.location.split('/');

        // 현재 채널 정보
        $scope.channel = $filter('filter')($rootScope.ange_channel, function (data) {
            return (data.CHANNEL_ID.indexOf($scope.path[1]) > -1)
        })[0];

        // 현재 메뉴 정보
        $scope.menu = $filter('filter')($rootScope.ange_menu, function (data) {
            return (data.MENU_ID.indexOf($scope.path[2]) > -1)
        })[0];

        // 카테고리 데이터
        $scope.category = [];

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
                            $rootScope.role = null;
                            $rootScope.menu_role = null;
                            $rootScope.email = null;
                            $rootScope.nick = null;
                            $rootScope.profileImg = null;

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
//                $location.path("/signin");
//                throw( new String('세션이 만료되었습니다.') );
//            throw( new Error("세션이 만료되었습니다.") );
//            } else if (session.USER_ID == '') {
//                $location.path("/signin");
//                throw( new String('로그인 후 사용가능합니다.') );
            } else {
                $rootScope.session = session;

                $rootScope.login = true;
                $rootScope.authenticated = true;
                $rootScope.user_info = session.USER_INFO;
                $rootScope.uid = session.USER_ID;
                $rootScope.name = session.USER_NM;
                $rootScope.role = session.ROLE_ID;
                $rootScope.menu_role = session.MENU_ROLE;
                $rootScope.email = session.EMAIL;
                $rootScope.nick = session.NICK_NM;

                if (session.USER_INFO != undefined && session.USER_INFO.FILE) {
                    $rootScope.profileImg = CONSTANT.BASE_URL + session.USER_INFO.FILE.PATH + session.USER_INFO.FILE.FILE_ID;
                } else {
                    $rootScope.profileImg = null;
                }

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
                        deferred.resolve();
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
                        deferred.resolve();
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
            .catch($scope.reportProblems);

        $scope.getList('cms/category', 'list', {}, {SYSTEM_GB: 'CMS'}, false).then(function(data){
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
        .catch(function(error){});

        $scope.moveAccount = function() {
            if ($rootScope.uid != undefined) {
                if ($rootScope.user_info.USER_ST == 'W' && $rootScope.user_info.CERT_GB == 'MIG') {
                    $location.path('myange/account');
                }
            }
        };

        // 광고센터 URL 셋팅
        $scope.adBannerUrl = function(idx, type) {
            var guid = $rootScope.guid;
            var id = $rootScope.uid;
            var ip = $rootScope.ip;
            var ad_type = (type == undefined ? 1 : type);
            var ad_url = CONSTANT.AD_LOG_URL + '?index=' + idx + '&guid=' + guid + '&id=' + id + '&ip=' + ip + '&type=' + ad_type + '&menu=' + $scope.path[1] + '&category=' + ($scope.path[2] == undefined ? '' : $scope.path[2]);

            return ad_url;
        }

        // 배너 이미지 클릭
        $scope.click_linkBanner = function (item) {
            if (item.ada_url != undefined && item.ada_url != '') {
                var ad_url = $scope.adBannerUrl(item.ada_idx, 1);
                if (item.ada_url.indexOf('http://') > -1) {
                    $window.open(ad_url);

                    $scope.addMileage('BANNER', null);
                } else {
                    $location.url(ad_url);
                }
            }
        };

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

                if (gb == '1') {
                    item.MILEAGE_NO = '17';
                } else if (gb == '2') {
                    item.MILEAGE_NO = '54';
                } else if (gb == '3') {
                    item.MILEAGE_NO = '57';
                } else if (gb == '4') {
                    item.MILEAGE_NO = '59';
                } else if (gb == '5') {
                    item.MILEAGE_NO = '114';
                } else if (gb == '6') {
                    item.MILEAGE_NO = '86';
                } else if (gb == '7') {
                    item.MILEAGE_NO = '125';
                } else {
                    return;
                }
            } else if (type == 'PHOTO') {
                item.MILEAGE_GB = '1';

                if (gb == '11') {
                    item.MILEAGE_NO = '15';
                } else if (gb == '12') {
                    item.MILEAGE_NO = '61';
                } else {
                    return;
                }
            } else if (type == 'CLINIC') {
                item.MILEAGE_GB = '1';

                if (gb == '25') {
                    item.MILEAGE_NO = '68';
                } else {
                    return;
                }
            } else if (type == 'REPLY') {
                item.MILEAGE_GB = '2';

                if (gb == 'TALK') {
                    item.MILEAGE_NO = '74';
                } else if (gb == '1') {
                    item.MILEAGE_NO = '18';
                } else if (gb == '2') {
                    item.MILEAGE_NO = '55';
                } else if (gb == '3') {
                    item.MILEAGE_NO = '58';
                } else if (gb == '4') {
                    item.MILEAGE_NO = '60';
                } else if (gb == '5') {
                    item.MILEAGE_NO = '115';
                } else if (gb == '6') {
                    item.MILEAGE_NO = '87';
                } else if (gb == '7') {
                    item.MILEAGE_NO = '126';
                } else {
                    return;
                }
            } else if (type == 'EVENT') {
                item.MILEAGE_GB = '1';

                if (gb == 'PRODUCT') {
                    item.MILEAGE_NO = '110';
                } else if (gb == 'EXPERIENCE') {
                    item.MILEAGE_NO = '111';
                } else if (gb == 'SAMPLE') {
                    item.MILEAGE_NO = '120'; // 119 하나 더 있음??
                } else if (gb == 'BOOK') {
                    item.MILEAGE_NO = '124';
                } else {
                    return;
                }
            } else if (type == 'REVIEW') {
                item.MILEAGE_GB = '1';

                if (gb == 'PRODUCT') {
                    item.MILEAGE_NO = '110';
                } else if (gb == 'EXPERIENCE') {
                    item.MILEAGE_NO = '111';
                } else {
                    return;
                }
            } else {
                return;
            }

            $scope.insertItem('ange/mileage', 'item', item, false)
                .then(function(data){
//                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                })
                .catch(function(error){dialogs.error('오류', '[마일리지]'+error, {size: 'md'});});
        };

    }]);
});
