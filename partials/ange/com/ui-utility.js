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

        $scope.verbs = [
                            {
                                "title": "WM-Qualifikation: DFB-Frauen mit Tor-Festival gegen die Slowakei",
                                "text": "Bundestrainerin Silvia Neid kann allmählich mit den Planungen für die WM im kommenden Jahr beginnen. Die Fußball-Nationalmannschaft der Frauen gewann auch ihr achtes Qualifikationsspiel souverän und kann kaum noch von Rang eins verdrängt werden.",
                                "creationDate": "Thu, 08 May 2014 19:10:00 +0200",
                                "changeDate": "Sun, 12 May 2014 09:30:00 +0200"
                            },
                            {
                                "title": "2,5 Milliarden Euro: Real Madrid ist wertvollster Fußballclub der Welt",
                                "text": "Als einziger deutscher Club hat es der FC Bayern in die Top Ten der wertvollsten Fußball-Vereine der Welt geschafft. Die Münchner liegen im \"Forbes\"-Ranking auf Rang vier hinter Real Madrid, dem FC Barcelona und Manchester United.",
                                "creationDate": "Thu, 08 May 2014 18:28:00 +0200",
                                "changeDate": "Sat, 11 May 2014 12:40:00 +0200"
                            }
                        ];
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
