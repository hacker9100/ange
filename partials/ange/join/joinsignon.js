/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-06
 * Description : joinsignon.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('joinsignon', ['$scope', '$rootScope', '$location', '$controller', 'dialogs', function ($scope, $rootScope, $location, $controller, dialogs) {

        /********** 초기화 **********/
        // 날짜 콤보박스
        var year = [];
        var babyYear = [];
        var month = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        $scope.checkSave = false;
        $scope.checkCert = false;

        // 진행 단계
        $scope.step = '03';

        // 이용약관 체크
        $scope.checkAll = false;
        $scope.checkTerms = false;
        $scope.checkInfo = false;
        $scope.checkOffer = false;

        // 사용자 정보
        $scope.user = {};
        $scope.checkID = false;
        $scope.checkPW = false;
        $scope.checkNick = false;
        $scope.availableID = false;
        $scope.availablePW = false;
        $scope.availableNick = false;
        $scope.comparePW = false;
        $scope.checkAllAgree = false;

        // 아기 정보
        $scope.babies = [];

        // 블로그 정보
        $scope.blog = {};

        $scope.init = function () {
//            for (var i = 1950; i <= nowYear; i++) {
            for (var i = 2000; i >= 1950; i--) {
                year.push(i+'');
            }

            for (var i = nowYear + 1; i >= 1995; i--) {
                babyYear.push(i+'');
            }

            for (var i = 1; i <= 12; i++) {
                month.push(i+'');
            }

            for (var i = 1; i <= 31; i++) {
                day.push(i+'');
            }

            $scope.year = year;
            $scope.babyYear = babyYear;
            $scope.month = month;
            $scope.day = day;

            $scope.click_checkAllAgree();

            $scope.babies = [{}, {}, {}];

            $scope.user = {USER_ID: '', USER_NM: '', NICK_NM: '', PASSWORD: '', LUNAR_FL: '0', BIRTH: '', ZIP_CODE: '', ADDR: '', ADDR_DETAIL: '', PHONE_1: '', PHONE_2: '', USER_GB: '', USER_ST: '', EMAIL: '', SEX_GB: '',
                            INTRO: '', NOTE: '', MARRIED_FL: 'Y', PREGNENT_FL: 'N', EN_ANGE_EMAIL_FL: true, EN_ANGE_SMS_FL: true, EN_ALARM_EMAIL_FL: true, EN_ALARM_SMS_FL: true, EN_STORE_EMAIL_FL: true, EN_STORE_SMS_FL: true}
            $scope.user.YEAR = '';
            $scope.user.MONTH = '';
            $scope.user.DAY = '';
            $scope.user.PHONE_1_1 = '';
            $scope.user.PHONE_1_2 = '';
            $scope.user.PHONE_1_3 = '';
            $scope.user.PHONE_2_1 = '';
            $scope.user.PHONE_2_2 = '';
            $scope.user.PHONE_2_3 = '';
            $scope.user.EMAIL_ID = '';
            $scope.user.EMAIL_TYPE = '';

            $scope.blog = {BLOG_GB: '', BLOG_URL: ''};
            $scope.blog.BLOG_GB = 'NAVER';
        };

        /********** 이벤트 **********/
        // 이용약관 체크
        $scope.click_checkItem = function (item) {
            if (item == 'checkTerms')
                $scope.checkTerms = !$scope.checkTerms;
            else if (item == 'checkInfo')
                $scope.checkInfo = !$scope.checkInfo;
            else if (item == 'checkOffer')
                $scope.checkOffer = !$scope.checkOffer;
        }

        // 이용약관 전체체크
        $scope.click_checkAll = function () {
            $scope.checkAll = !$scope.checkAll;

            $scope.checkTerms = $scope.checkAll;
            $scope.checkInfo = $scope.checkAll;
            $scope.checkOffer = $scope.checkAll;
        }

        $scope.$watch('user.USER_ID', function() {
            if ($scope.user.USER_ID != undefined && $scope.user.USER_ID.length > 5) {
                var check = /[^a-zA-Z0-9]/;
//                var check = /^(?=.*[0-9a-zA-Z]).{6,12}$/;

                console.log($scope.user.USER_ID)
                console.log(check.test($scope.user.USER_ID))

                if (!check.test($scope.user.USER_ID)) {
                    $scope.click_checkUserId();
                } else {
                    $scope.availableID = false;
                }
            } else {
                $scope.checkID = false;
            }
        });

        $scope.$watch('user.PASSWORD', function() {
            if ($scope.user.PASSWORD != undefined && $scope.user.PASSWORD.length > 5) {
                $scope.checkPW = true;

//                var check = /[^a-zA-Z0-9~!@\#$%<>^&*\()\-=+_\']/gi;
                var check = /^(?=.+[0-9])(?=.+[a-zA-Z])(?=.+[!@#$%^*+=-]).{6,12}$/;

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

        $scope.$watch('user.NICK_NM', function() {
            if ($scope.user.NICK_NM != undefined && $scope.user.NICK_NM.length > 1) {
                var addLen = (escape($scope.user.NICK_NM)+"%u").match(/%u/g).length-1;
                var totalLen = $scope.user.NICK_NM.length + addLen;

                console.log($scope.user.NICK_NM.length + addLen);

                if (totalLen > 3 && totalLen < 13) {
                    console.log("check");
                    $scope.click_checkUserNick();
                } else {
                    $scope.availableNick = false;
                }
            } else {
                $scope.checkNick = false;
            }
        });

        $scope.$watch('user.EMAIL_SELECT', function() {
            console.log($scope.user.EMAIL_SELECT);
            if ($scope.user.EMAIL_SELECT != undefined) {
                if ($scope.user.EMAIL_SELECT == '') {
                    $scope.user.EMAIL_TYPE = '';
                        $scope.disabledEmail = false;
                } else {
                    $scope.disabledEmail = true;
                    $scope.user.EMAIL_TYPE = $scope.user.EMAIL_SELECT;
                }
            }
        });

        $scope.$watch('user.PREGNENT_FL', function() {
            console.log($scope.user.PREGNENT_FL);
            if ($scope.user.PREGNENT_FL != undefined) {
                if ($scope.user.PREGNENT_FL == 'N') {
                    $scope.disabledPregnent = true;
                } else {
                    $scope.disabledPregnent = false;
                }
            }
        });

        $scope.$watch('blog.BLOG_GB', function() {
            console.log($scope.blog.BLOG_GB);
            if ($scope.blog.BLOG_GB != undefined) {
                if ($scope.blog.BLOG_GB == 'NAVER') {
                    $scope.blog.BLOG_URL = 'http://blog.naver.com/';
                } else if ($scope.blog.BLOG_GB == 'DAUM') {
                    $scope.blog.BLOG_URL = 'http://blog.daum.net/';
                } else if ($scope.blog.BLOG_GB == 'TSTORY') {
                    $scope.blog.BLOG_URL = 'http://blog.tstory.com/';
                } else {
                    $scope.blog.BLOG_URL = '';
                }
            }
        });

        // 정보수신동의 전체체크
        $scope.click_checkAllAgree = function () {
            $scope.checkAllAgree = !$scope.checkAllAgree;

            $scope.user.EN_ANGE_EMAIL_FL = $scope.checkAllAgree;
            $scope.user.EN_ANGE_SMS_FL = $scope.checkAllAgree;
            $scope.user.EN_ALARM_EMAIL_FL = $scope.checkAllAgree;
            $scope.user.EN_ALARM_SMS_FL = $scope.checkAllAgree;
            $scope.user.EN_STORE_EMAIL_FL = $scope.checkAllAgree;
            $scope.user.EN_STORE_SMS_FL = $scope.checkAllAgree;
        }

        // 아이디 중복확인
        $scope.click_checkUserId = function () {
            $scope.checkID = true;

            $scope.getItem('com/user', 'check', $scope.user.USER_ID, {SYSTEM_GB: 'ANGE'}, false)
                .then(function(data) {
                    if (data.COUNT < 1) {
                        $scope.availableID = true;
//                        dialogs.notify('알림', '사용 가능한 아이디입니다.', {size: 'md'});
                    } else {
                        $scope.availableID = false;
//                        dialogs.notify('알림', '이미 존재하는 아이디입니다.', {size: 'md'});
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 닉네임 중복확인
        $scope.click_checkUserNick = function () {
            $scope.checkNick = true;

            $scope.getItem('com/user', 'nick', $scope.user.NICK_NM, {SYSTEM_GB: 'ANGE'}, false)
                .then(function(data) {
                    if (data.COUNT < 1) {
                        $scope.availableNick = true;
//                        dialogs.notify('알림', '사용 가능한 아이디입니다.', {size: 'md'});
                    } else {
                        $scope.availableNick = false;
//                        dialogs.notify('알림', '이미 존재하는 아이디입니다.', {size: 'md'});
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 아기 추가
        $scope.click_addBaby = function () {
            $scope.babies.push({});
        };

        // 아기 삭제
        $scope.click_removeBaby = function (idx) {
            $scope.babies.splice(idx, 1);
        };

        // 사용자 정보 저장
        $scope.saveUser = function () {
            $scope.user.SYSTEM_GB = 'ANGE';
            $scope.user.BABY = $scope.babies;
            $scope.user.BLOG = $scope.blog;

            if (!$scope.checkID) {
                $('#user_id').focus();
                dialogs.notify('알림', '아이디를 확인해주세요.', {size: 'md'});
                return;
            }

            if (!$scope.checkPW) {
                $('#password').focus();
                dialogs.notify('알림', '패스워드를 확인해주세요.', {size: 'md'});
                return;
            }

            if ($scope.user.USER_NM == '') {
                $('#user_nm').focus();
                dialogs.notify('알림', '이름을 확인해주세요.', {size: 'md'});
                return;
            }

            if (!$scope.checkNick) {
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

            if ($scope.user.PHONE_1_1 != '' && $scope.user.PHONE_1_2 != '' && $scope.user.PHONE_1_3 != '') {
                $scope.user.PHONE_1 = $scope.user.PHONE_1_1 + $scope.user.PHONE_1_2 + $scope.user.PHONE_1_3;
            }

            if ($scope.user.PHONE_2_1 == '' || $scope.user.PHONE_2_2 == '' || $scope.user.PHONE_2_3 == '') {
                $('#phone_2').focus();
                dialogs.notify('알림', '휴대폰을 확인해주세요.', {size: 'md'});
                return;
            } else {
                $scope.user.PHONE_2 = $scope.user.PHONE_2_1 + $scope.user.PHONE_2_2 + $scope.user.PHONE_2_3;
            }

            if ($scope.user.EMAIL_ID == '' || $scope.user.EMAIL_TYPE == '') {
                $('#email').focus();
                dialogs.notify('알림', '이메일을 확인해주세요.', {size: 'md'});
                return;
            } else {
                $scope.user.EMAIL = $scope.user.EMAIL_ID + '@' + $scope.user.EMAIL_TYPE;
            }

            if ($scope.blog.BLOG_URL != '' && $scope.user.BLOG_DETAIL != '') {
                $scope.blog.BLOG_URL = $scope.blog.BLOG_URL + $scope.user.BLOG_DETAIL;
            }

            if ($scope.checkSave) {
                $scope.insertItem('com/user', 'item', $scope.user, false)
                    .then(function(){ $scope.checkSave = true; /*dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});*/})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('com/user', 'item', $scope.user.USER_ID, $scope.user, false)
                    .then(function(){ /*dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});*/})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 사용자 인증
        $scope.click_certUser = function (cert) {
            if (cert == 'mail') {
                $scope.checkCert = true;
            } else {
                $scope.checkCert = true;
            }
        };

        // 가입 완료
        $scope.finishUser = function () {

        };

        // 이전 단계 클릭
        $scope.click_prevStep = function () {
            if ($scope.step == '02') {
                $scope.step = '01'
            }
        };

        // 다음 단계 클릭
        $scope.click_nextStep = function () {
            if ($scope.step == '01') {
                if (!$scope.checkTerms) {
                    dialogs.notify('알림', '이용약관에 동의해야 합니다.', {size: 'md'});
                    return;
                }

                if (!$scope.checkInfo) {
                    dialogs.notify('알림', '개인정보 취급방침에 동의해야 합니다.', {size: 'md'});
                    return;
                }

                $scope.step = '02';
            } else if ($scope.step == '02') {
                $scope.saveUser();

                $scope.step = '03';
            } else if ($scope.step == '03') {
                $scope.step = '04';
            } else if ($scope.step == '04') {
                $scope.finishUser();
            }
        };

        // 취소 버튼 클릭
        $scope.click_cancel = function () {
            $location.url('/main');
        };

        // 홈으로 버튼 클릭
        $scope.click_moveHome = function () {
            $location.url('/main');
        };

        // 로그인 레이어 팝업
        $scope.click_viewLogin = function () {
            $location.url('/main');
        };

        $scope.init();
	}]);
});
