/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-06
 * Description : infodeskforgot-request.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('infodeskforgot-request', ['$rootScope', '$scope', '$window', '$location', 'dialogs', function ($rootScope, $scope, $window, $location, dialogs) {

        /********** 초기화 **********/
        // 진행 단계
        $scope.step = 'id';

        // 사용자 정보
        $scope.user = {};
        $scope.forget = {};

        $scope.checkID = false;
        $scope.checkPW = false;
        $scope.comparePW = false;
        $scope.availablePW = false;
        $scope.checkCert = false;
        $scope.isSMS = false;

        $scope.init = function () {
            $scope.user = {USER_ID: '', USER_NM: '', NICK_NM: '', CERT_GB: 'PHONE', CERT_NO: '', CERT_NO_CP: ''}
        };

        /********** 이벤트 **********/
        $scope.$watch('user.PASSWORD', function() {
            if ($scope.user.PASSWORD != undefined && $scope.user.PASSWORD.length > 5) {
                $scope.checkPW = true;

                $scope.user.PASSWORD = $scope.user.PASSWORD.replace( /(\s*)/g, '');

//                var check = /[^a-zA-Z0-9~!@\#$%<>^&*\()\-=+_\']/gi;
//                var check = /^(?=.+[0-9])(?=.+[a-zA-Z])(?=.+[!@#$%^*+=-]).{6,12}$/;
                var check = /^(?=.+[0-9])(?=.+[a-zA-Z]).{6,12}$/;

                console.log($scope.user.PASSWORD)
                console.log(check.test($scope.user.PASSWORD))
                if (check.test($scope.user.PASSWORD)) {
                    $scope.availablePW = true;
                } else {
                    $scope.availablePW = false;
                }
            } else {
                $scope.checkPW = false;
            }
        });

        $scope.$watch('user.PASSWORD_CP', function() {
            if ($scope.user.PASSWORD_CP != undefined && $scope.user.PASSWORD_CP.length > 5) {
                if ($scope.user.PASSWORD == $scope.user.PASSWORD_CP) {
                    $scope.comparePW = true;
                } else {
                    $scope.comparePW = false;
                }
            }
        });

        $scope.checkValidation = function () {

/*
            if (!$scope.availableNick) {
                $('#nick_nm').focus();
                dialogs.notify('알림', '닉네임을 확인해주세요.', {size: 'md'});
                return;
            }

            if ($scope.user.YEAR == '' || $scope.user.MONTH == '' || $scope.user.DAY == '') {
                $('#birth').focus();
                dialogs.notify('알림', '생년월일을 확인해주세요.', {size: 'md'});
                return;
            } else {
                $scope.user.BIRTH = $scope.user.YEAR + ($scope.user.MONTH.length == 1 ? '0' + $scope.user.MONTH : $scope.user.MONTH) + ($scope.user.DAY.length == 1 ? '0' + $scope.user.DAY : $scope.user.DAY);
            }
 */

            if ($scope.user.PHONE_2_1 == '' || $scope.user.PHONE_2_2 == '' || $scope.user.PHONE_2_3 == '') {
                $('#phone_2').focus();
                dialogs.notify('알림', '휴대폰을 확인해주세요.', {size: 'md'});
                return false;
            } else {
                $scope.user.PHONE_2 = $scope.user.PHONE_2_1 + $scope.user.PHONE_2_2 + $scope.user.PHONE_2_3;
            }

            if ($scope.step == 'id') {
                if ($scope.user.USER_NM == '') {
                    $('#user_nm').focus();
                    dialogs.notify('알림', '이름을 확인해주세요.', {size: 'md'});
                    return false;
                }

                $scope.getItem('com/user', 'forgotid', null, $scope.user, false)
                    .then(function(data) {
                        $scope.forget = data;
                        $scope.checkID = true;
                        $scope.sendSMS();
                    })
                    ['catch'](function(error){});
            } else {
                if ($scope.user.USER_ID == '') {
                    $('#user_nm').focus();
                    dialogs.notify('알림', '아이디를 확인해주세요.', {size: 'md'});
                    return false;
                }

                $scope.getItem('com/user', 'forgotpw', null, $scope.user, false)
                    .then(function(data) {
                        if ($scope.user.USER_ID == data.USER_ID) {
                            $scope.sendSMS();
                        }
                    })
                    ['catch'](function(error){});
            }

            return true;
        };

        // 사용자 인증
        $scope.click_certUser = function (cert) {
//            if (cert == 'mail') {
//                $scope.user.USER_NM = '김성환';
//                $scope.user.EMAIL = 'hacker9100@gmail.com';
//
//                $scope.insertItem('com/user', 'mail', $scope.user, false)
//                    .then(function(){ dialogs.notify('알림', '인증메일이 재전송되었습니다.', {size: 'md'});})
//                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
//            } else {
                if (!$scope.checkValidation()) return;
//            }
        };

        $scope.sendSMS = function() {
            $scope.user.CERT_NO = Math.floor(Math.random() * (999999 - 100000) + 100000);

            $scope.insertItem('com/sms', 'item', $scope.user, false)
                .then(function(){ $scope.isSMS = true; dialogs.notify('알림', '인증번호가 전송되었습니다.', {size: 'md'});})
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 사용자 정보 확인
        $scope.click_forgotInfo = function () {
            if ($scope.user.CERT_NO == $scope.user.CERT_NO_CP) {
                dialogs.notify('알림', '인증 되었습니다.', {size: 'md'});
                $scope.checkCert = true;
            } else {
                dialogs.error('오류', '인증번호가 일치하지 않습니다.', {size: 'md'});
                $scope.checkCert = false;
            }
        }
/*
        // 인증번호 확인
        $scope.click_checkCertNo = function () {
            if ($scope.user.CERT_NO == $scope.user.CERT_NO_CP) {
                dialogs.notify('알림', '인증 되었습니다.', {size: 'md'});
                $scope.checkCert = true;
            } else {
                dialogs.error('오류', '인증번호가 일치하지 않습니다.', {size: 'md'});
            }
        };
*/

        // 이전 단계 클릭
        $scope.click_changeStep = function (step) {
            $scope.checkID = false;
            $scope.checkPW = false;
            $scope.comparePW = false;
            $scope.checkCert = false;
            $scope.isSMS = false;

            $scope.user = {USER_ID: '', USER_NM: '', NICK_NM: '', CERT_GB: 'PHONE', CERT_NO: '', CERT_NO_CP: ''};
            $scope.forget = {};

            $scope.step = step;
        };

        // 비밀번호 변경
        $scope.click_changePassword = function () {
            if ($scope.step == 'pw') {
                if (!$scope.comparePW) {
                    $('#password').focus();
                    dialogs.notify('알림', '비밀번호를 확인해주세요.', {size: 'md'});
                    return false;
                }

                $scope.updateItem('com/user', 'password', $scope.user.USER_ID, $scope.user, false)
                    .then(function(){
                        dialogs.notify('알림', '비밀번호가 변경 되었습니다.', {size: 'md'});
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 홈으로 버튼 클릭
        $scope.click_moveHome = function () {
            $location.url('/main');
        };

        $scope.init();
	}]);
});
