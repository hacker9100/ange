/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-29
 * Description : ui_utility.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('ui-utility', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', '$window', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $controller, $location, $window, dialogs, CONSTANT) {

        angular.extend(this, $controller('ange-common', {$scope: $scope}));

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
            $scope.comming_soon();
            return;

            $location.url('/club/home');
        };

        $scope.click_settingAccount = function () {
            $location.url('myange/account');
        };

        $scope.click_settingBaby = function () {
            $location.url('myange/baby');
        };

        $scope.click_myangeMileage = function () {
            $location.url('myange/mileage');
        };

        $scope.click_myangeWriting = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                return;
            }

            $location.url('myange/writing');
        };

        $scope.click_myangeMessage = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                return;
            }

            $location.url('myange/message');
        };

        $scope.click_infodesk = function () {
            $location.url('infodesk/home');
        };

        // 로그인 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('login_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', 'CONSTANT', function($scope, $modalInstance, $controller, data, CONSTANT) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};
                    $scope.save_id = false;
                    $scope.content = data;

                    if (localStorage.getItem('save_id')) {
                        $scope.save_id = true;
                        $scope.item.id = localStorage.getItem('user_id');
                    }

                    // 상단 배너 이미지 조회
                    $scope.getLoginBanner = function () {
                        $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, {ADP_IDX: CONSTANT.AD_CODE_BN31, ADA_STATE: 1}, false)
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

                                $modalInstance.close();
                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
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
            dlg.result.then(function(){

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
//                    $location.url('main');
                });
            }
        };

        // 상단 배너 이미지 조회
        $scope.getTopBanner = function () {
            $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, {ADP_IDX: CONSTANT.AD_CODE_BN01, ADA_STATE: 1}, false)
                .then(function(data){
                    $scope.topBanner = data[0];
                    $scope.topBanner.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                })
                ['catch'](function(error){});
        };

        $scope.getTopBanner();

        // 하단 배너 이미지 조회
        $scope.getTopBanner = function () {
            $scope.getList('ad/banner', 'list', {NO:0, SIZE:2}, {ADP_IDX: CONSTANT.AD_CODE_BN03, ADA_STATE: 1}, false)
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

//        $scope.getSession()
//            .then($scope.sessionCheck)
//            ['catch']($scope.reportProblems);


	}]);
});
