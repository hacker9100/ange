/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : 최상위 module를 선언하고, app 에 사용되는 모듈을 로드한다.
 * define에는 주로 각 모듈별 top level에 해당하는 파일들을 선언한다.
 */

define([ // 의존 모듈들을 나열한다. 모듈을 한 개라도 배열로 넘겨야 한다.
    // 라이브러리 로딩
    'angular',
    'route-config', //registers에 각 프로바이더를 제공하기 위해 임포트
    'js-bootstrap',
    'ui-bootstrap',
    'angular-sanitize',
    'angular-ui-router',
    'ng-table',
    'dialog',
    'dialog-translation',
    'ngActivityIndicator',
    'lodash', // dropdownMultiSelect 관련 라이브러리
    'ckeditor-jquery', // ckeditor 관련 라이브러리
    'ui-widget', // fileUpload ui 관련 라이브러리
    'fileupload', // fileUpload 관련 라이브러리
    'fileupload-process', // fileUpload ui 관련 라이브러리
    'fileupload-angular', // fileUpload angularjs 관련 라이브러리

    // 각 컨트롤러 로딩
    './service/index',
    './directive/index',
    './controller/index',
    './filter/index'
//    './mockhttp'
], function (angular, routeConfig) { // 의존 모듈들은 순서대로 매개변수에 담긴다.
    // 의존 모듈들이 모두 로딩 완료되면 이 함수를 실행한다.
    'use strict';

    // bootstrap.js에 설정한 App Name를 여기서 동일하게 설정
    var app = angular.module('mtApp', [
        'mtApp.services',
        'mtApp.directives',
        'mtApp.controllers',
        'mtApp.filters',
//        'mtApp.constants',
//        'ui.bootstrap',
        'ngTable',
        'ui.router',
        'blueimp.fileupload'
//        'mtTest.mock'
        ], function ($provide, $compileProvider, $controllerProvider, $filterProvider) {
            // 여기서는 필요한 설정들을 진행.

            //부트스트랩 과정에서만 가져올 수 있는 프로바이더들을 각 registers와 연계될 수 있도록
            routeConfig.setProvide($provide); //for serverscript
            routeConfig.setCompileProvider($compileProvider);  //for directives
            routeConfig.setControllerProvider($controllerProvider); //for controllers
            routeConfig.setFilterProvider($filterProvider); //for filters
        }
    );

    app.directive('ngFocus', ['$parse', function($parse) {
        return function(scope, element, attr) {
            var fn = $parse(attr['ngFocus']);
            alert("-->>"+element)
            element.bind('focus', function(event) {
                alert("-->>")
                scope.$apply(function() {
                    fn(scope, {$event:event});
                });
            });
        }
    }]);

    app.directive('ngBlur', ['$parse', function($parse) {
        return function(scope, element, attr) {
            var fn = $parse(attr['ngBlur']);
            element.bind('blur', function(event) {
                scope.$apply(function() {
                    fn(scope, {$event:event});
                });
            });
        }
    }]);

    // yourApp에 사용할 전체 controller를 설정.
    // 지금은 불필요하므로 remark.
//    yourApp.controller('YourAppCtrl', function($scope) {
//    });

    app.provider('login', function () {

        var userToken = localStorage.getItem('userToken'),
            errorState = 'app.error',
            logoutState = 'app.home';

        this.$get = function ($rootScope, $http, $q, $state) {

            /**
             * Low-level, private functions.
             */

            var setHeaders = function (token) {
                if (!token) {
                    delete $http.defaults.headers.common['X-Token'];
                    return;
                }
                $http.defaults.headers.common['X-Token'] = token.toString();
            };

            var setToken = function (token) {
                if (!token) {
                    localStorage.removeItem('userToken');
                } else {
                    localStorage.setItem('userToken', token);
                }
                setHeaders(token);
            };

            var getLoginData = function () {
                if (userToken) {
                    setHeaders(userToken);
                } else {
                    wrappedService.userRole = userRoles.public;
                    wrappedService.isLogged = false;
                    wrappedService.doneLoading = true;
                }
            };

            var managePermissions = function () {
                // Register routing function.
                $rootScope.$on('$stateChangeStart', function (event, to, toParams, from, fromParams) {

                    /**
                     * $stateChangeStart is a synchronous check to the accessLevels property
                     * if it's not set, it will setup a pendingStateChange and will let
                     * the grandfather resolve do his job.
                     *
                     * In short:
                     * If accessLevels is still undefined, it let the user change the state.
                     * Grandfather.resolve will either let the user in or reject the promise later!
                     */
                    if (wrappedService.userRole === null) {
                        wrappedService.doneLoading = false;
                        wrappedService.pendingStateChange = {
                            to: to,
                            toParams: toParams
                        };
                        return;
                    }

                    // if the state has undefined accessLevel, anyone can access it.
                    // NOTE: if `wrappedService.userRole === undefined` means the service still doesn't know the user role,
                    // we need to rely on grandfather resolve, so we let the stateChange success, for now.
                    if (to.accessLevel === undefined || to.accessLevel.bitMask & wrappedService.userRole.bitMask) {
                        angular.noop(); // requested state can be transitioned to.
                    } else {
                        event.preventDefault();
                        $rootScope.$emit('$statePermissionError');
                        $state.go(errorState, { error: 'unauthorized' }, { location: false, inherit: false });
                    }
                });

                /**
                 * Gets triggered when a resolve isn't fulfilled
                 * NOTE: when the user doesn't have required permissions for a state, this event
                 *       it's not triggered.
                 *
                 * In order to redirect to the desired state, the $http status code gets parsed.
                 * If it's an HTTP code (ex: 403), could be prefixed with a string (ex: resolvename403),
                 * to handle same status codes for different resolve(s).
                 * This is defined inside $state.redirectMap.
                 */

                $rootScope.$on('$stateChangeError', function (event, to, toParams, from, fromParams, error) {
                    /**
                     * This is a very clever way to implement failure redirection.
                     * You can use the value of redirectMap, based on the value of the rejection
                     * So you can setup DIFFERENT redirections based on different promise errors.
                     */

                    var errorObj, redirectObj;
                    // in case the promise given to resolve function is an $http request
                    // the error is a object containing the error and additional informations
                    error = (typeof error === 'object') ? error.status.toString() : error;
                    // in case of a random 4xx/5xx status code from server, user gets loggedout
                    // otherwise it *might* forever loop (look call diagram)
                    if (/^[45]\d{2}$/.test(error)) {
                        wrappedService.logoutUser();
                    }
                    /**
                     * Generic redirect handling.
                     * If a state transition has been prevented and it's not one of the 2 above errors, means it's a
                     * custom error in your application.
                     *
                     * redirectMap should be defined in the $state(s) that can generate transition errors.
                     */

                    if (angular.isDefined(to.redirectMap) && angular.isDefined(to.redirectMap[error])) {
                        if (typeof to.redirectMap[error] === 'string') {
                            return $state.go(to.redirectMap[error], { error: error }, { location: false, inherit: false });
                        } else if (typeof to.redirectMap[error] === 'object') {
                            redirectObj = to.redirectMap[error];
                            return $state.go(redirectObj.state, { error: redirectObj.prefix + error }, { location: false, inherit: false });
                        }
                    }
                    return $state.go(errorState, { error: error }, { location: false, inherit: false });
                });
            };

            /**
             * High level, public methods
             */

            var wrappedService = {
                loginHandler: function (user, status, headers, config) {
                    /**
                     * Custom logic to manually set userRole goes here
                     *
                     * Commented example shows an userObj coming with a 'completed'
                     * property defining if the user has completed his registration process,
                     * validating his/her email or not.
                     *
                     * EXAMPLE:
                     * if (user.hasValidatedEmail) {
                     *   wrappedService.userRole = userRoles.registered;
                     * } else {
                     *   wrappedService.userRole = userRoles.invalidEmail;
                     *   $state.go('app.nagscreen');
                     * }
                     */
alert(JSON.stringify(user));
                    // setup token
                    setToken(user.token);
                    // update user
                    angular.extend(wrappedService.user, user);
                    // flag true on isLogged
                    wrappedService.isLogged = true;
                    // update userRole
                    wrappedService.userRole = user.userRole;
                    return user;
                },
                loginUser: function (httpPromise) {
alert("loginUser")
                    httpPromise.success(this.loginHandler);
                },
                logoutUser: function (httpPromise) {
                    /**
                     * De-registers the userToken remotely
                     * then clears the loginService as it was on startup
                     */

                    setToken(null);
                    this.userRole = userRoles.public;
                    this.user = {};
                    this.isLogged = false;
                    $state.go(logoutState);
                },

                resolvePendingState: function (httpPromise) {
alert("resolvePendingState");
                    var checkUser = $q.defer(),
                        self = this,
                        pendingState = self.pendingStateChange;

                    // When the $http is done, we register the http result into loginHandler, `data` parameter goes into loginService.loginHandler
                    httpPromise.success(self.loginHandler);

                    httpPromise.then(
                        function success(httpObj) {
                            self.doneLoading = true;
                            // duplicated logic from $stateChangeStart, slightly different, now we surely have the userRole informations.
                            if (pendingState.to.accessLevel === undefined || pendingState.to.accessLevel.bitMask & self.userRole.bitMask) {
                                checkUser.resolve();
                            } else {
                                checkUser.reject('unauthorized');
                            }
                        },
                        function reject(httpObj) {
                            checkUser.reject(httpObj.status.toString());
                        }
                    );
                    /**
                     * I setted up the state change inside the promises success/error,
                     * so i can safely assign pendingStateChange back to null.
                     */

                    self.pendingStateChange = null;
                    return checkUser.promise;
                },
                /**
                 * Public properties
                 */

                userRole: null,
                user: {},
                isLogged: null,
                pendingStateChange: null,
                doneLoading: null
            };

            getLoginData();
            managePermissions();

            return wrappedService;
        };
    });

    app.run(function ($rootScope, loginService, $location) {
        // 기본 값 설정
        $rootScope.pageSize = 20;

        // TODO: 메뉴정보와 코드 정보를 로딩한다.

//        // 페이지 이동시 권한 체크
//        $rootScope.$on("$stateChangeStart", function (event, next, current) {
//            $rootScope.authenticated = false;
//            loginService.getSession().then(function (session) {
//                if (session.data.USER_ID) {
//                    var path = $location.path();
//                    var spMenu =  path.split('/');
//                    var menuId = spMenu[1];
//                    var menuGb = '';
//
//                    if (spMenu.length > 1) menuGb = spMenu[2];
//
//                    if (menuId == "content") {
//                        menuId = spMenu[2];
//                        menuGb = spMenu[3];
//                    }
//
//                    for (var idx in session.data.MENU_ROLE) {
//                        var permission = false;
//                        var role = session.data.MENU_ROLE[idx];
//
//                        if (menuId == 'signup' || menuId == 'signin') {
//                            permission = true;
//                        }
//
//                        if (role.MENU_ID == menuId) {
//                            if (spMenu.length < 3 && role.MENU_FL == '0') {
//                                permission = true;
//                            } else {
//                                switch (menuGb) {
//                                    case 'list' :
//                                        if (role.LIST_FL == '0') {
//                                            permission = true;
//                                        }
//                                        break;
//                                    case 'view' :
//                                        if (role.VIEW_FL == '0') {
//                                            permission = true;
//                                        }
//                                        break;
//                                    case 'edit' :
//                                        if (role.EDIT_FL == '0') {
//                                            permission = true;
//                                        }
//                                        break;
////                                    default :
////                                        permission = false;
//                                }
//                            }
//
//                            if (!permission) {
//                                alert('접근할 수 없는 메뉴 입니다.');
//                                history.back();
//                                return;
//                            }
//                        }
//                    }
//
//                    $rootScope.authenticated = true;
//                    $rootScope.uid = session.data.USER_ID;
//                    $rootScope.name = session.data.USER_NM;
//                    $rootScope.role = session.data.ROLE_ID;
//                    $rootScope.menu_role = session.data.MENU_ROLE;
//                    $rootScope.email = session.data.EMAIL;
//                } else {
////                    $location.path('/signin');
////                    var nextUrl = next.$$route.originalPath;
//                    if ($location.path() == '/signup' || $location.path() == '/signin') {
//
//                    } else {
//                        alert("로그인이 필요한 메뉴입니다.")
//                        $location.path("/signin");
//                    }
//                }
//            });
//        });

        /**
         * $rootScope.doingResolve is a flag useful to display a spinner on changing states.
         * Some states may require remote data so it will take awhile to load.
         */
        var resolveDone = function () { $rootScope.doingResolve = false; };
        $rootScope.doingResolve = false;

        $rootScope.$on('$stateChangeStart', function () {
            $rootScope.doingResolve = true;
        });
        $rootScope.$on('$stateChangeSuccess', resolveDone);
        $rootScope.$on('$stateChangeError', resolveDone);
        $rootScope.$on('$statePermissionError', resolveDone);
    });

    //공통 컨트롤러 설정 - 모든 컨트롤러에서 공통적으로 사용하는 부분들 선언
    app.controller('common', function($scope, $q, dataService) {

//        // 파일 사이즈 변환
//        $scope.formatFileSize = function (bytes) {
////            if (typeof bytes !== 'number') {
////                return '';
////            }
//            if (bytes >= 1000000000) {
//                return (bytes / 1000000000).toFixed(2) + ' GB';
//            }
//            if (bytes >= 1000000) {
//                return (bytes / 1000000).toFixed(2) + ' MB';
//            }
//            return (bytes / 1000).toFixed(2) + ' KB';
//        }
//
//        // 로그인
//        $scope.login = function(key, item) {
//            var deferred = $q.defer();
//
//            dataService.login(key,item,function(data, status) {
//                if (status != 200) {
//                    console.log('조회에 실패 했습니다.');
//                    deferred.reject('조회에 실패 했습니다.');
//                } else {
//                    if (data.err == true) {
//                        console.log(data.msg);
//                        deferred.reject(data.msg);
//                    } else {
//                        if (angular.isObject(data)) {
//                            deferred.resolve(data);
//                        } else {
//                            // TODO: 데이터가 없을 경우 처리
//                            console.log('조회 데이터가 없습니다.');
//                            deferred.reject('조회 데이터가 없습니다.');
//                        }
//                    }
//                }
//            });
//
//            return deferred.promise;
//        }
//
//        // 세션 조회
//        $scope.getSession = function() {
//            var deferred = $q.defer();
//
//            dataService.getSession(function(data, status) {
//                if (status != 200) {
//                    console.log('조회에 실패 했습니다.');
//                    deferred.reject('조회에 실패 했습니다.');
//                } else {
//                    if (data.err == true) {
//                        console.log(data.msg);
//                        deferred.reject(data.msg);
//                    } else {
//                        if (angular.isObject(data)) {
//                            deferred.resolve(data);
//                        } else {
//                            // TODO: 데이터가 없을 경우 처리
//                            console.log('조회 데이터가 없습니다.');
//                            deferred.reject('조회 데이터가 없습니다.');
//                        }
//                    }
//                }
//            });
//
//            return deferred.promise;
//        }
//
//        // 세션 체크
//        $scope.sessionCheck = function(session) {
//            if (session.USER_ID == undefined || session.USER_ID == '')
//                throw( new String('세션이 만료되었습니다.') );
////            throw( new Error("세션이 만료되었습니다.") );
//            return session;
//        };
//
//        // 오류 리포트
//        $scope.reportProblems = function(error) {
//            alert(error);
//        };
//
//        // 목록 데이터를 조회
//        $scope.getList = function (service, page, search, loding) {
//            var deferred = $q.defer();
//
//            if (loding) $scope.isLoading = true;
//            dataService.db(service).find(page,search,function(data, status) {
//                if (status != 200) {
//                    console.log('조회에 실패 했습니다.');
//                    deferred.reject('조회에 실패 했습니다.');
//                } else {
//                    if (data.err == true) {
//                        console.log(data.msg);
//                        deferred.reject(data.msg);
//                    } else {
//                        if (angular.isObject(data)) {
//                            deferred.resolve(data);
//                        } else {
//                            // TODO: 데이터가 없을 경우 처리
//                            console.log('조회 데이터가 없습니다.');
//                            deferred.reject('조회 데이터가 없습니다.');
//                        }
//                    }
//                }
//
//                if (loding) $scope.isLoading = false;
//            });
//
//            return deferred.promise;
//        };
//
//        // 모델 데이터를 조회
//        $scope.getItem = function (service, key, search, loding) {
//            var deferred = $q.defer();
//
//            if (loding) $scope.isLoading = true;
//            dataService.db(service).findOne(key,search,function(data, status) {
//                if (status != 200) {
//                    console.log('조회에 실패 했습니다.');
//                    deferred.reject('조회에 실패 했습니다.');
//                } else {
//                    if (data.err == true) {
//                        console.log(data.msg);
//                        deferred.reject(data.msg);
//                    } else {
//                        if (angular.isObject(data)) {
//                            deferred.resolve(data);
//                        } else {
//                            // TODO: 데이터가 없을 경우 처리
//                            console.log('조회 데이터가 없습니다.');
//                            deferred.reject('조회 데이터가 없습니다.');
//                        }
//                    }
//                }
//
//                if (loding) $scope.isLoading = false;
//            });
//
//            return deferred.promise;
//        };
//
//        // 모델 등록
//        $scope.insertItem = function (service, item, loding) {
//            var deferred = $q.defer();
//
//            if (loding) $scope.isLoading = true;
//            dataService.db(service).insert(item,function(data, status) {
//                if (status != 200) {
//                    console.log('등록에 실패 했습니다.');
//                    deferred.reject('등록에 실패 했습니다.');
//                } else {
//                    if (data.err == true) {
//                        console.log(data.msg);
//                        deferred.reject(data.msg);
//                    } else {
//                        deferred.resolve();
//                    }
//                }
//
//                if (loding) $scope.isLoading = false;
//            });
//
//            return deferred.promise;
//        };
//
//        // 모델 수정
//        $scope.updateItem = function (service, key, item, loding) {
//            var deferred = $q.defer();
//
//            if (loding) $scope.isLoading = true;
//            dataService.db(service).update(key, item,function(data, status) {
//                if (status != 200) {
//                    console.log('수정에 실패 했습니다.');
//                    deferred.reject('수정에 실패 했습니다.');
//                } else {
//                    if (data.err == true) {
//                        console.log(data.msg);
//                        deferred.reject(data.msg);
//                    } else {
//                        deferred.resolve();
//                    }
//                }
//
//                if (loding) $scope.isLoading = false;
//            });
//
//            return deferred.promise;
//        };
//
//        // 모델 삭제
//        $scope.deleteItem = function (service, key, loding) {
//            var deferred = $q.defer();
//
//            if (loding) $scope.isLoading = true;
//            dataService.db(service).remove(key,function(data, status){
//                if (status != 200) {
//                    console.log('삭제에 실패 했습니다.');
//                    deferred.reject('삭제에 실패 했습니다.');
//                } else {
//                    if (data.err == true) {
//                        console.log(data.msg);
//                        deferred.reject(data.msg);
//                    } else {
//                            deferred.resolve();
//                    }
//                }
//
//                if (loding) $scope.isLoading = false;
//            });
//
//            return deferred.promise;
//        };
    });

    //공통 컨트롤러 설정 - 모든 컨트롤러에서 공통적으로 사용하는 부분들 선언
    app.controller('commonCtrl', function($scope, $http, $location, $state, $stateParams, login, $timeout, loginService) {

        // Expose $state and $stateParams to the <body> tag
        $scope.$state = $state;
        $scope.$stateParams = $stateParams;

        // loginService exposed and a new Object containing login user/pwd
        $scope.ls = login;
        $scope.login = {
            working: false,
            wrong: false
        };
        $scope.loginMe = function () {
            // setup promise, and 'working' flag
//            var loginPromise = $http.post('/login', $scope.login);
//            alert($scope.login.id);
            var loginPromise = loginService.login($scope.login.id);
            $scope.login.working = true;
            $scope.login.wrong = false;

            login.loginUser(loginPromise);

            loginPromise.success(function () {
                $location.path('/dashboard');
            });
            loginPromise.error(function () {
                $scope.login.wrong = true;
                $timeout(function () { $scope.login.wrong = false; }, 8000);
            });
            loginPromise.finally(function () {
                $scope.login.working = false;
            });
        };
        $scope.logoutMe = function () {
            login.logoutUser($http.get('/logout'));
        };

        //alert($location.path().replace('/',''));
        var _location = $location.path().replace('/','');

        $scope.test = 'Display on!';

        //스타일시트 업데이트
        $scope.$on('updateCSS', function(event, args) {

            //파라메터로 받아온 스타일 시트 반영
            $scope.stylesheets = args;

        });

    });

    // 외부에 노출할 함수들만 반환한다.
    return app;
});
