/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : admin_common.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('admin_common', ['$timeout', '$scope', '$rootScope', '$location', '$q', 'dataService', 'dialogs', function ($timeout, $scope, $rootScope, $location, $q, dataService, dialogs) {

        $rootScope.PAGE_SIZE = 20;
        $scope.path = $location.path();

        /********** CMS 공통 함수 **********/
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

        // 엑셀 다운로드
        $scope.excelDownload = function (service, data, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.excelDownload(service,data,function(data, status) {
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
                            console.log('로그인 데이터가 없습니다.');
                            deferred.reject('로그인 데이터가 없습니다.');
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
            });

            return deferred.promise;
        }

        // 세션 체크
        $scope.sessionCheck = function(session) {
            if (session.USER_ID == undefined) {
                $location.path("/signin");
                throw( new String('세션이 만료되었습니다.') );
//            throw( new Error("세션이 만료되었습니다.") );
            } else if (session.USER_ID == '') {
                $location.path("/signin");
                throw( new String('로그인 후 사용가능합니다.') );
            } else {
                $rootScope.authenticated = true;
                $rootScope.uid = session.USER_ID;
                $rootScope.name = session.USER_NM;
                $rootScope.role = session.ROLE_ID;
                $rootScope.menu_role = session.MENU_ROLE;
                $rootScope.email = session.EMAIL;
            }

            return session;
        };

        $scope.permissionCheck = function(session) {
            var path = $location.path();
            var spMenu =  path.split('/');
            var menuId = spMenu[1];
            var menuGb = '';

            if (spMenu.length > 1) menuGb = spMenu[2];

            if (menuId == "content") {
                menuId = spMenu[2];
                menuGb = spMenu[3];
            }

            for (var idx in session.MENU_ROLE) {
                var permission = false;
                var role = session.MENU_ROLE[idx];

                if (menuId == 'signup' || menuId == 'signin') {
                    permission = true;
                }

                if (role.MENU_ID == menuId) {
                    if (spMenu.length < 3 && role.MENU_FL == '0') {
                        permission = true;
                    } else {
                        switch (menuGb) {
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
//                        alert('접근할 수 없는 메뉴 입니다.');
                        history.back();
                        throw( new String('접근할 수 없는 메뉴 입니다.') );
                        return;
                    }
                }
            }

            return session;
        };

        // 오류 리포트
        $scope.reportProblems = function(error) {
            dialogs.error('오류', error+'', {size: 'md'});
        };

        // 목록 데이터를 조회
        $scope.getList = function (service, page, search, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.db(service).find(page,search,function(data, status) {
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
        $scope.getItem = function (service, key, search, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.db(service).findOne(key,search,function(data, status) {
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
        $scope.insertItem = function (service, item, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.db(service).insert(item,function(data, status) {
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
        $scope.updateItem = function (service, key, item, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.db(service).update(key, item,function(data, status) {
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
        $scope.deleteItem = function (service, key, loding) {
            var deferred = $q.defer();

            if (loding) $scope.isLoading = true;
            dataService.db(service).remove(key,function(data, status){
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

    }]);
});
