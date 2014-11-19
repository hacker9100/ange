/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : cms_common.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('cms_common', ['$scope', '$rootScope', '$location', '$q', 'dataService', function ($scope, $rootScope, $location, $q, dataService) {

        $rootScope.PAGE_SIZE = 20;

//        alert(localStorage.getItem('userToken'))

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

        // 로그인
        $scope.login = function(key, item) {
            var deferred = $q.defer();

            dataService.login(key,item,function(data, status) {
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
            if (session.USER_ID == undefined || session.USER_ID == '') {
                $location.path("/signin");
                throw( new String('세션이 만료되었습니다.') );
//            throw( new Error("세션이 만료되었습니다.") );
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
            alert(error);
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

        /********** 페이지 타이틀 **********/
        var spMenu = $location.path().split('/');

        $scope.message = 'ANGE CMS';
        if (spMenu[1] == "account") {
            $scope.pageTitle = '개인정보';
            $scope.pageDescription = '개인정보를 조회하고 수정할 수 있습니다.';
            $scope.tailDescription = '내용을 수정한 후 \"수정\"버튼을 누르면 수정이 완료됩니다.<br/>\"취소\"버튼을 누르면 원래대로 돌아갑니다.';
            $scope.lnbSubscript = 'dashboard';
            $scope.lnbTitle = '대시보드';
            $scope.isDashboard = true;
        } else if (spMenu[1] == "archive") {
            $scope.pageTitle = '아카이브';
            $scope.pageDescription = '지난 기사자료를 조회할 수 있습니다.';
            $scope.tailDescription = '검색영역에서 원하는 기사를 찾을 수 있습니다.<br />제목을 클릭하면 자세한 내용을 조회할 수 있습니다.';
            $scope.lnbSubscript = 'dashboard';
            $scope.lnbTitle = '대시보드';
            $scope.isDashboard = true;
        } else if (spMenu[1] == "project") {
            $scope.pageTitle = '프로젝트 관리';
            $scope.pageDescription = '프로젝트를 생성하고 섹션을 설정합니다.';
            $scope.tailDescription = '상단의 검색영역에서 원하는 프로젝트를 필터링하거나 찾을 수 있습니다.<br />진행 중인 프로젝트를 해지하며 이전 프로젝트를 전부 조회할 수 있습니다.';
            $scope.lnbSubscript = 'contents';
            $scope.lnbTitle = '콘텐츠 관리';
            $scope.isDashboard = false;
        } else if (spMenu[1] == 'task') {
            $scope.pageTitle = '태스크 관리';
            $scope.pageDescription = '기사주제 설정하고 할당하여 관리합니다.';
            $scope.tailDescription = '.';
            $scope.lnbSubscript = 'contents';
            $scope.lnbTitle = '콘텐츠 관리';
            $scope.isDashboard = false;
        } else if (spMenu[1] == 'content') {
            $scope.lnbSubscript = 'contents';
            $scope.lnbTitle = '콘텐츠 관리';
            $scope.isDashboard = false;
            if (spMenu[2] == 'article') {
                $scope.pageTitle = '원고 관리';
                $scope.pageDescription = '태스크 내용을 확인하여 원고를 작성하고 관리합니다.';
                $scope.tailDescription = '.';
            } else if (spMenu[2] == 'article_confirm') {
                $scope.pageTitle = '원고 승인';
                $scope.pageDescription = '태스크 내용을 확인하여 원고를 작성하고 관리합니다.';
                $scope.tailDescription = '.';
            } else if (spMenu[2] == 'edit') {
                $scope.pageTitle = '편집';
                $scope.pageDescription = '승인완료된 원고를 편집하여 기사를 완성합니다.';
                $scope.tailDescription = '.';
            } else if (spMenu[2] == 'edit_confirm') {
                $scope.pageTitle = '편집 승인';
                $scope.pageDescription = '편집된 원고를 확인하고 승인관리합니다.';
                $scope.tailDescription = '.';
            }
        } else if (spMenu[1] == "webboard") {
            $scope.pageTitle = '게시판';
            $scope.pageDescription = '공지사항을 게시합니다.';
            $scope.tailDescription = '.';
            $scope.lnbSubscript = 'boaard';
            $scope.lnbTitle = '게시판';
            $scope.isDashboard = false;
        } else if (spMenu[1] == "user") {
            $scope.pageTitle = '사용자 관리';
            $scope.pageDescription = 'CMS 사용자를 관리합니다.';
            $scope.tailDescription = '.';
            $scope.lnbSubscript = 'admin';
            $scope.lnbTitle = '관리자';
            $scope.isDashboard = false;
        } else if (spMenu[1] == "permission") {
            $scope.pageTitle = '권한 관리';
            $scope.pageDescription = 'CMS 사용 권한을 관리합니다.';
            $scope.tailDescription = '.';
            $scope.lnbSubscript = 'admin';
            $scope.lnbTitle = '관리자';
            $scope.isDashboard = false;
        } else if (spMenu[1] == "category") {
            $scope.pageTitle = '카테고리 관리';
            $scope.pageDescription = 'CMS 사용하는 카테고리를 관리합니다.';
            $scope.tailDescription = '.';
            $scope.lnbSubscript = 'admin';
            $scope.lnbTitle = '관리자';
            $scope.isDashboard = false;
        } else if (spMenu[1] == "series") {
            $scope.pageTitle = '시리즈 관리';
            $scope.pageDescription = 'CMS 시리즈를 관리합니다.';
            $scope.tailDescription = '.';
            $scope.lnbSubscript = 'admin';
            $scope.lnbTitle = '관리자';
            $scope.isDashboard = false;
        } else if (spMenu[1] == "contact") {
            $scope.pageTitle = '주소록';
            $scope.pageDescription = 'CMS 시리즈를 관리합니다.';
            $scope.tailDescription = '.';
            $scope.lnbSubscript = 'admin';
            $scope.lnbTitle = '관리자';
            $scope.isDashboard = false;
        }
    }]);
});
