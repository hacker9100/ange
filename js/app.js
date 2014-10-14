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
    'jsBootstrap',
    'uiBootstrap',
    'ngSanitize',
    'uiRouter',
    'ckeditor-jquery',
    'plupload',
//    'ngPlupload',
    'uiPlupload',
//    'ngActivityIndicator',

    // 각 컨트롤러 로딩
    './controller/index',
    './directive/index',
    './filter/index',
    './service/index'//,
//    './mockhttp'
], function (angular, routeConfig) { // 의존 모듈들은 순서대로 매개변수에 담긴다.
    // 의존 모듈들이 모두 로딩 완료되면 이 함수를 실행한다.
    'use strict';

    // bootstrap.js에 설정한 App Name를 여기서 동일하게 설정
    var app = angular.module('mtApp', [
        'mtApp.services',
        'mtApp.controllers',
        'mtApp.filters',
        'mtApp.directives',
        'ui.bootstrap',
        'ui.router'
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

    app.run(function ($rootScope) {
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
            var loginPromise = loginService.getLogin($scope.login.id);
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
/*
        $http.get('menuinfo.json').success( function(data){

            for (var i in data) {
                if (data[i]._key == _location) {
                    //alert(JSON.stringify(data[i].menu));
                    $scope.menuInfos = data[i].localmenu;
                }
            }

            //alert($scope.menuInfos);


        });
*/
    });

    // 외부에 노출할 함수들만 반환한다.
    return app;
});
