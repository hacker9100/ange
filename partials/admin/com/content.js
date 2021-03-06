/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : content.html 화면 콘트롤러
 */

define([
    '../../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('content', ['$timeout', '$scope', '$rootScope', '$location', '$q', 'dataService', 'dialogs', 'CONSTANT', function ($timeout, $scope, $rootScope, $location, $q, dataService, dialogs, CONSTANT) {

        $scope.path = $location.path();

//        var menu = $filter('filter')($rootScope.ange_menu, function (data) {
//            return (data.MENU_ID.indexOf(menu[2]) > -1)
//        })[0];
//
//        $scope.community = menu.MENU_NM;

        /********** ADMIN 공통 함수 **********/
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

                            $rootScope.authenticated = true;
                            $rootScope.user_info = null;
                            $rootScope.uid = null;
                            $rootScope.name = null;
                            $rootScope.role = null;
                            $rootScope.system = null;
                            $rootScope.menu_role = null;
                            $rootScope.email = null;

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
                    $location.path("/signin");
                    console.log('조회에 실패 했습니다.');
                    deferred.reject('조회에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        $location.path("/signin");
                        console.log(data.msg);
                        deferred.reject(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            deferred.resolve(data);
                        } else {
                            $location.path("/signin");
                            // TODO: 데이터가 없을 경우 처리
                            console.log('조회 데이터가 없습니다.');
                            deferred.reject('조회 데이터가 없습니다.');
                        }
                    }
                }
            });

            return deferred.promise;
        }

        // 세션 체크
        $scope.sessionCheck = function(session) {
            if (session.USER_ID == undefined) {
                //$location.path("/signin");
                //throw( new String('세션이 만료되었습니다.') );
//            throw( new Error("세션이 만료되었습니다.") );
            } else if (session.USER_ID == '') {
                //$location.path("/signin");
                //throw( new String('로그인 후 사용가능합니다.') );
            } else {
                if (session.SYSTEM_GB != 'ADMIN') {
//                    dialogs.error('오류', '다른 시스템에 로그인되어있습니다. 로그인 페이지로 이동합니다.', {size: 'md'});
                    $scope.logout($rootScope.uid).then( function(data) {
                        $location.path('/signin');
                    });

                    return;
                }

                $rootScope.session = session;

                $rootScope.authenticated = true;
                $rootScope.user_info = session.USER_INFO;
                $rootScope.uid = session.USER_ID;
                $rootScope.name = session.USER_NM;
                $rootScope.role = session.ROLE_ID;
                $rootScope.system = session.SYSTEM_GB;
                $rootScope.menu_role = session.MENU_ROLE;
                $rootScope.email = session.EMAIL;
            }

            return;
        };

        $scope.permissionCheck = function(url, back) {
            var path = $location.path();

            if ($rootScope.session == undefined || $rootScope.session == null) {
                if (back) {
                    throw( new String('로그인 후 사용가능합니다.') );
                } else {
                    dialogs.error('오류', '로그인 후 사용가능합니다.', {size: 'md'});
                }
                $location.path("/signin");
                return false;
            } else if ($rootScope.session.SYSTEM_GB != CONSTANT.SYSTEM_GB) {
                dialogs.error('오류', '다른 시스템에 로그인되어있습니다. 로그아웃 후 다시 로그인 하세요', {size: 'md'});
            }
            if (url) path = url;

            var spMenu =  path.split('/');
            var menuId = spMenu[1];
            var menuGb = '';

            if (spMenu.length > 1) menuGb = spMenu[2];

            for (var idx in $rootScope.session.MENU_ROLE) {
                var permission = false;
                var role = $rootScope.session.MENU_ROLE[idx];

                if (menuId == 'signup' || menuId == 'signin') {
                    permission = true;
                }

                if (role.MENU_ID == menuId) {
                    if (spMenu.length < 3 && role.MENU_FL == '0') {
                        permission = true;
                    } else {
                        switch (menuGb) {
                            case 'main' :
                                if (role.MENU_FL == '0') {
                                    permission = true;
                                }
                                break;
                            case 'list' :
                                if (role.LIST_FL == '0') {
                                    permission = true;
                                }
                                break;
                            case 'view' :
                                if (role.VIEW_FL == '0') {
                                    permission = true;
                                }
                                break;
                            case 'edit' :
                                if (role.EDIT_FL == '0') {
                                    permission = true;
                                }
                                break;
//                                    default :
//                                        permission = false;
                        }
                    }

                    if (!permission) {
                        if (back) {
                            history.back();
                            throw( new String('접근할 수 없는 메뉴 입니다.') );
                            return;
                        } else {
                            dialogs.error('오류', '접근할 수 없는 메뉴 입니다.', {size: 'md'});
                            return false;
                        }
                    }
                }
            }

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
/*
        $scope.getMenu = function() {
            var deferred = $q.defer();

            $q.all([
                    $scope.getList('menu', {}, {CHANNEL_GB: 'ADMIN'}, false).then(function(data){$rootScope.admin_channel = data;}),
                    $scope.getList('menu', {}, {MENU_GB: 'ADMIN'}, false).then(function(data){$rootScope.admin_menu = data;})
                ])
                .then( function() {
                    deferred.resolve();
                },function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        if ($rootScope.admin_channel == undefined) {
//            $scope.getMenu();
        }
*/
    }]);
});
