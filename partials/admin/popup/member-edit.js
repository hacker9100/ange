/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-14
 * Description : member-edit.html 화면 콘트롤러
 */

define([
    '../../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('member-edit', ['$scope', '$stateParams', '$location', 'dialogs', function ($scope, $stateParams, $location, dialogs) {

        if ($scope.isModal) {
//            $scope.id = data;
        } else {
            $scope.id = $stateParams.id;
        }

        /********** 초기화 **********/
        // 사용자 모델
        $scope.item = {};

        // 날짜 콤보박스
        var year = [];
        var babyYear = [];
        var month = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        $scope.checkAllAgree = true;

        // 초기화
        $scope.init = function() {
            var type = [{name: "일반회원", value: "MEMBER"}, {name: "앙쥬클럽", value: "CLUB"}, {name: "서포터즈", value: "SUPPORTERS"}];
            $scope.type = type;

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

            $scope.years = year;
            $scope.babyYear = babyYear;
            $scope.months = month;
            $scope.days = day;

            $scope.babies = [{}, {}, {}];

            $scope.item = {USER_ID: '', USER_NM: '', NICK_NM: '', PASSWORD: '', LUNAR_FL: '0', BIRTH: '', ZIP_CODE: '', ADDR: '', ADDR_DETAIL: '', PHONE_1: '', PHONE_2: '', USER_GB: '', USER_ST: '', EMAIL: '', SEX_GB: 'F',
                INTRO: '', NOTE: '', MARRIED_FL: 'Y', PREGNENT_FL: 'N', EN_ANGE_EMAIL_FL: true, EN_ANGE_SMS_FL: true, EN_ALARM_EMAIL_FL: true, EN_ALARM_SMS_FL: true, EN_STORE_EMAIL_FL: true, EN_STORE_SMS_FL: true}
            $scope.item.YEAR = '';
            $scope.item.MONTH = '';
            $scope.item.DAY = '';
            $scope.item.PHONE_1_1 = '';
            $scope.item.PHONE_1_2 = '';
            $scope.item.PHONE_1_3 = '';
            $scope.item.PHONE_2_1 = '';
            $scope.item.PHONE_2_2 = '';
            $scope.item.PHONE_2_3 = '';
            $scope.item.EMAIL_ID = '';
            $scope.item.EMAIL_TYPE = '';
            $scope.item.USER_GB = type[0];

            $scope.blog = {BLOG_GB: '', BLOG_URL: ''};
            $scope.blog.BLOG_GB = 'NAVER';
        };

        /********** 이벤트 **********/
            // 정보수신동의 전체체크
        $scope.click_checkAllAgree = function () {
            $scope.checkAllAgree = !$scope.checkAllAgree;

            $scope.item.EN_ANGE_EMAIL_FL = $scope.checkAllAgree;
            $scope.item.EN_ANGE_SMS_FL = $scope.checkAllAgree;
            $scope.item.EN_ALARM_EMAIL_FL = $scope.checkAllAgree;
            $scope.item.EN_ALARM_SMS_FL = $scope.checkAllAgree;
            $scope.item.EN_STORE_EMAIL_FL = $scope.checkAllAgree;
            $scope.item.EN_STORE_SMS_FL = $scope.checkAllAgree;
        }

        // 사용자 목록 이동
        $scope.click_showUserList = function () {
//            window.history.back();
            if ($scope.isModal) $scope.click_close();
//            $location.url('/member/list');
        };

        // 사용자 저장 버튼 클릭
        $scope.click_saveUser = function () {
            $scope.item.SYSTEM_GB = 'ANGE';

            if ($scope.item.YEAR == '' || $scope.item.MONTH == '' || $scope.item.DAY == '') {
                $('#birth').focus();
                dialogs.notify('알림', '생년월일을 확인해주세요.', {size: 'md'});
                return;
            } else {
                $scope.item.BIRTH = $scope.item.YEAR + ($scope.item.MONTH.length == 1 ? '0' + $scope.item.MONTH : $scope.item.MONTH) + ($scope.item.DAY.length == 1 ? '0' + $scope.item.DAY : $scope.item.DAY);
            }
            
            if ($scope.item.POST_1 == '' || $scope.item.POST_2 == '') {
                $('#post_1').focus();
                dialogs.notify('알림', '주소를 확인해주세요.', {size: 'md'});
                return;
            } else {
                $scope.item.ZIP_CODE = $scope.item.POST_1 + $scope.item.POST_2;
            }
            
            $scope.item.BABY = $scope.babies;
            $scope.item.BLOG = $scope.blog;

            if ($scope.id == 0) {
                $scope.insertItem('com/user', 'item', $scope.item, false)
                    .then(function(){
//                        $location.url('/member/list');
                        if ($scope.isModal) $scope.click_close();
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('com/user', 'item', $scope.id, $scope.item, false)
                    .then(function(){
//                        $location.url('/member/list');
                        if ($scope.isModal) $scope.click_close();
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 사용자 조회
        $scope.getUser = function () {
            if ($scope.id != 0) {
                $scope.getItem('com/user', 'item', $scope.id, {DETAIL: true}, false)
                    .then(function(data) {
//                        var idx = 0;
//                        for (var i=0; i < $scope.user_roles.length; i ++) {
//                            if (JSON.stringify(data.ROLE) == JSON.stringify($scope.user_roles[i])) {
//                                idx = i;
//                            }
//                        }
console.log(JSON.stringify(data))
                        $scope.item = data;

                        var idx = 0;
                        for (var i=0; i < $scope.type.length; i ++) {
                            if ($scope.item.USER_GB == $scope.type[i].value) {
                                idx = i;
                                break;
                            }
                        }

                        $scope.item.USER_GB = $scope.type[i];

                        if ($scope.item.BIRTH.length == 8) {
                            $scope.item.YEAR = $scope.item.BIRTH.substr(0, 4);
                            $scope.item.MONTH = $scope.item.BIRTH.substr(4, 2).replace('0', '');
                            $scope.item.DAY = $scope.item.BIRTH.substr(6, 2).replace('0', '');
                        }

                        if ($scope.item.ZIP_CODE.length == 6) {
                            $scope.item.POST_1 = $scope.item.ZIP_CODE.substr(0, 3);
                            $scope.item.POST_2 = $scope.item.ZIP_CODE.substr(3, 3);
                        }

//                        if ($scope.item.PHONE_1.length > 10) {
//                            $scope.item.PHONE_1_1 = $scope.item.PHONE_1.substr(0, 3);
//                            $scope.item.PHONE_1_2 = $scope.item.PHONE_1.substr(3, 4);
//                            $scope.item.PHONE_1_3 = $scope.item.PHONE_1.substr(7, 4);
//                        }
//
//                        if ($scope.item.PHONE_2.length > 10) {
//                            $scope.item.PHONE_2_1 = $scope.item.PHONE_2.substr(0, 3);
//                            $scope.item.PHONE_2_2 = $scope.item.PHONE_2.substr(3, 4);
//                            $scope.item.PHONE_2_3 = $scope.item.PHONE_2.substr(7, 4);
//                        }

                        $scope.item.EN_ANGE_EMAIL_FL = $scope.item.EN_ANGE_EMAIL_FL == 'Y' ? true : false;
                        $scope.item.EN_ANGE_SMS_FL = $scope.item.EN_ANGE_SMS_FL == 'Y' ? true : false;
                        $scope.item.EN_ALARM_EMAIL_FL = $scope.item.EN_ALARM_EMAIL_FL == 'Y' ? true : false;
                        $scope.item.EN_ALARM_SMS_FL = $scope.item.EN_ALARM_SMS_FL == 'Y' ? true : false;
                        $scope.item.EN_STORE_EMAIL_FL = $scope.item.EN_STORE_EMAIL_FL == 'Y' ? true : false;
                        $scope.item.EN_STORE_SMS_FL = $scope.item.EN_STORE_SMS_FL == 'Y' ? true : false;

                        if ($scope.item.EN_ANGE_EMAIL_FL == 'Y' && $scope.item.EN_ANGE_SMS_FL == 'Y' &&
                            $scope.item.EN_ALARM_EMAIL_FL == 'Y' && $scope.item.EN_ALARM_SMS_FL == 'Y' &&
                            $scope.item.EN_STORE_EMAIL_FL == 'Y' && $scope.item.EN_STORE_SMS_FL == 'Y' ) {
                            $scope.checkAllAgree = true;
                        }

                        if ($scope.item.BABY != null) {
                            for (var i=0; i < $scope.item.BABY.length; i++) {
                                if (i > 2) {
                                    $scope.babies.push({});
                                }

                                $scope.babies[i].BABY_NM = $scope.item.BABY[i].BABY_NM;
                                $scope.babies[i].BABY_SEX_GB = $scope.item.BABY[i].BABY_SEX_GB;

                                if ($scope.item.BABY[i].BABY_BIRTH.length == 8) {
                                    $scope.babies[i].BABY_YEAR = $scope.item.BABY[i].BABY_BIRTH.substr(0, 4);
                                    $scope.babies[i].BABY_MONTH = $scope.item.BABY[i].BABY_BIRTH.substr(4, 2).replace('0', '');
                                    $scope.babies[i].BABY_DAY = $scope.item.BABY[i].BABY_BIRTH.substr(6, 2).replace('0', '');
                                }
                            }
                        }

                        if ($scope.item.BLOG != null) {
                            $scope.blog = $scope.item.BLOG;

//                            if ($scope.blog.THEME != '') {
//                                var spTheme = $scope.blog.THEME.split(',');
//                                for(var i = 0; i < spTheme.length; i++) {
//                                    spTheme[i] = parseInt(spTheme[i]);
//                                }
//
//                                $scope.blog.THEME_CK = spTheme;
//                            }
                        }

//                        $scope.item.ROLE = $scope.user_roles[idx];
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.babies = [{}, {}, {}];

        // 아기 추가
        $scope.click_addBaby = function () {
            $scope.babies.push({});
        };

        // 아기 삭제
        $scope.click_removeBaby = function (idx) {
            $scope.babies.splice(idx, 1);
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getUser)
            .catch($scope.reportProblems);
    }]);
});
