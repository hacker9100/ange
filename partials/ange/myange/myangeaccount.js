/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangeaccount.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangeaccount', ['$rootScope', '$scope', '$window', '$location', 'dialogs', 'UPLOAD', function ($rootScope, $scope, $window, $location, dialogs, UPLOAD) {

        /********** 초기화 **********/
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 썸네일을 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
            }
        });

        // 날짜 콤보박스
        var year = [];
        var babyYear = [];
        var month = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        $scope.checkSave = false;

        // 패스워드 확인
        $scope.checkPW = false;

        // 진행 단계
        $scope.step = '02';

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

        // 초기화
        $scope.init = function(session) {
//            $scope.community = "회원정보";
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
        // 우편번호 검색
        $scope.click_openDaumPostcode = function () {
            $window.open(
                new daum.Postcode({
                    oncomplete: function(data) {
                        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                        // 우편번호와 주소 정보를 해당 필드에 넣고, 커서를 상세주소 필드로 이동한다.
                        $scope.user.POST_1 = document.getElementById('post_1').value = data.postcode1;
                        $scope.user.POST_2 = document.getElementById('post_2').value = data.postcode2;
                        $scope.user.ADDR = document.getElementById('addr').value = data.address;

                        //전체 주소에서 연결 번지 및 ()로 묶여 있는 부가정보를 제거하고자 할 경우,
                        //아래와 같은 정규식을 사용해도 된다. 정규식은 개발자의 목적에 맞게 수정해서 사용 가능하다.
                        //var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');
                        //document.getElementById('addr').value = addr;

                        document.getElementById('addr_detail').focus();
                    }
                }).open()
            );
        };

//        $scope.$watch('user.USER_ID', function() {
//            if ($scope.user.USER_ID != undefined && $scope.user.USER_ID.length > 5) {
//                var check = /[^a-zA-Z0-9]/;
////                var check = /^(?=.*[0-9a-zA-Z]).{6,12}$/;
//
//                console.log($scope.user.USER_ID)
//                console.log(check.test($scope.user.USER_ID))
//
//                if (!check.test($scope.user.USER_ID)) {
//                    $scope.click_checkUserId();
//                } else {
//                    $scope.availableID = false;
//                }
//            } else {
//                $scope.checkID = false;
//            }
//        });

//        $scope.checkPW = true;
//        $scope.availablePW = true;
//        $scope.comparePW = true;
        $scope.$watch('user.PASSWORD', function() {
            if ($scope.user.PASSWORD != undefined && $scope.user.PASSWORD.length > 5) {
                $scope.checkPW = true;

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

//        $scope.$watch('user.NICK_NM', function() {
//            if ($scope.user.NICK_NM != undefined && $scope.user.NICK_NM.length > 1) {
//                var addLen = (escape($scope.user.NICK_NM)+"%u").match(/%u/g).length-1;
//                var totalLen = $scope.user.NICK_NM.length + addLen;
//
//                console.log($scope.user.NICK_NM.length + addLen);
//
//                if (totalLen > 3 && totalLen < 13) {
//                    console.log("check");
//                    $scope.click_checkUserNick();
//                } else {
//                    $scope.availableNick = false;
//                }
//            } else {
//                $scope.checkNick = false;
//            }
//        });

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

//            if (!$scope.availableID) {
//                $('#user_id').focus();
//                dialogs.notify('알림', '아이디를 확인해주세요.', {size: 'md'});
//                return;
//            }

            if (!$scope.availablePW) {
                $('#password').focus();
                dialogs.notify('알림', '패스워드를 확인해주세요.', {size: 'md'});
                return;
            }

            if ($scope.user.USER_NM == '') {
                $('#user_nm').focus();
                dialogs.notify('알림', '이름을 확인해주세요.', {size: 'md'});
                return;
            }

//            if (!$scope.availableNick) {
//                $('#nick_nm').focus();
//                dialogs.notify('알림', '닉네임을 확인해주세요.', {size: 'md'});
//                return;
//            }

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

            if ($scope.user.POST_1 == '' || $scope.user.POST_2 == '') {
                $('#post_1').focus();
                dialogs.notify('알림', '주소를 확인해주세요.', {size: 'md'});
                return;
            } else {
                $scope.user.ZIP_CODE = $scope.user.POST_1 + $scope.user.POST_2;
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

            if ($scope.blog.BLOG_URL != '' && $scope.blog.BLOG_DETAIL != '') {
                $scope.blog.BLOG_URL = $scope.blog.BLOG_DETAIL;
            }

            if ($scope.blog.THEME_CK != undefined && $scope.blog.THEME_CK.length != 0) {
                var strTheme = '';
                for(var i = 0; i < $scope.blog.THEME_CK.length; i++) {
                    strTheme += $scope.blog.THEME_CK[i];

                    if (i != $scope.blog.THEME_CK.length - 1) strTheme += ',';
                    if ($scope.blog.THEME_CK[i] == 10) strTheme += ',' + $scope.blog.THEME_ETC;
                }

                $scope.blog.THEME = strTheme;
            }

            $scope.user.BABY = $scope.babies;
            $scope.user.BLOG = $scope.blog;

            if ($scope.file) {
                $scope.user.FILE = $scope.file;
                $scope.user.FILE.$destroy = '';
            }

            $scope.updateItem('com/user', 'item', $scope.user.USER_ID, $scope.user, false)
                .then(function(){ dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

//            if ($scope.checkSave) {
//                $scope.insertItem('com/user', 'item', $scope.user, false)
//                    .then(function(){ $scope.checkSave = true; /*dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});*/})
//                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//            } else {
//                $scope.updateItem('com/user', 'item', $scope.user.USER_ID, $scope.user, false)
//                    .then(function(){ /*dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});*/})
//                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//            }
        };

        // 다음 단계 클릭
        $scope.click_nextStep = function () {
            //TODO: 패스워드 체크
        };

        // 취소 버튼 클릭
        $scope.click_cancel = function () {
            $scope.getUser();
        };

        // 저장 버튼 클릭
        $scope.click_saveUser = function () {
            $scope.saveUser();
//            $location.url('/main');
        };

        $scope.getUser = function () {
            $scope.getItem('com/user', 'item', $rootScope.uid, {SYSTEM_GB: 'ANGE', DETAIL: true}, false)
                .then(function(data) {
                    $scope.user = data;

                    $scope.user.YEAR = '';
                    $scope.user.MONTH = '';
                    $scope.user.DAY = '';
                    $scope.user.POST_1 = '';
                    $scope.user.POST_2 = '';
                    $scope.user.PHONE_1_1 = '';
                    $scope.user.PHONE_1_2 = '';
                    $scope.user.PHONE_1_3 = '';
                    $scope.user.PHONE_2_1 = '';
                    $scope.user.PHONE_2_2 = '';
                    $scope.user.PHONE_2_3 = '';
                    $scope.user.EMAIL_ID = '';
                    $scope.user.EMAIL_TYPE = '';

                    var file = data.FILE;
                    if (file != undefined) {
                        $scope.file = {"name":file.FILE_NM,"size":file.FILE_SIZE,"url":UPLOAD.BASE_URL+file.PATH+file.FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+file.FILE_NM,"deleteType":"DELETE"};
                    }

                    if ($scope.user.BIRTH != undefined && $scope.user.BIRTH.length == 8) {
                        $scope.user.YEAR = $scope.user.BIRTH.substr(0, 4);
                        $scope.user.MONTH = $scope.user.BIRTH.substr(4, 2).replace('0', '');
                        $scope.user.DAY = $scope.user.BIRTH.substr(6, 2).replace('0', '');
                    }

                    if ($scope.user.ZIP_CODE != undefined && $scope.user.ZIP_CODE.length == 6) {
                        $scope.user.POST_1 = $scope.user.ZIP_CODE.substr(0, 3);
                        $scope.user.POST_2 = $scope.user.ZIP_CODE.substr(3, 3);
                    }

                    if ($scope.user.PHONE_1 != undefined && $scope.user.PHONE_1.length > 10) {
                        $scope.user.PHONE_1_1 = $scope.user.PHONE_1.substr(0, 3);
                        $scope.user.PHONE_1_2 = $scope.user.PHONE_1.substr(3, 4);
                        $scope.user.PHONE_1_3 = $scope.user.PHONE_1.substr(7, 4);
                    }

                    if ($scope.user.PHONE_2 != undefined && $scope.user.PHONE_2.length > 10) {
                        $scope.user.PHONE_2_1 = $scope.user.PHONE_2.substr(0, 3);
                        $scope.user.PHONE_2_2 = $scope.user.PHONE_2.substr(3, 4);
                        $scope.user.PHONE_2_3 = $scope.user.PHONE_2.substr(7, 4);
                    }

                    if ($scope.user.EMAIL != undefined && $scope.user.EMAIL.length > 4) {
                        var spEmail = $scope.user.EMAIL.split('@')
                        $scope.user.EMAIL_ID = spEmail[0];
                        $scope.user.EMAIL_TYPE = spEmail[1];
                    }

                    $scope.user.EN_ANGE_EMAIL_FL = $scope.user.EN_ANGE_EMAIL_FL == 'Y' ? true : false;
                    $scope.user.EN_ANGE_SMS_FL = $scope.user.EN_ANGE_SMS_FL == 'Y' ? true : false;
                    $scope.user.EN_ALARM_EMAIL_FL = $scope.user.EN_ALARM_EMAIL_FL == 'Y' ? true : false;
                    $scope.user.EN_ALARM_SMS_FL = $scope.user.EN_ALARM_SMS_FL == 'Y' ? true : false;
                    $scope.user.EN_STORE_EMAIL_FL = $scope.user.EN_STORE_EMAIL_FL == 'Y' ? true : false;
                    $scope.user.EN_STORE_SMS_FL = $scope.user.EN_STORE_SMS_FL == 'Y' ? true : false;

                    if ($scope.user.EN_ANGE_EMAIL_FL == 'Y' && $scope.user.EN_ANGE_SMS_FL == 'Y' &&
                        $scope.user.EN_ALARM_EMAIL_FL == 'Y' && $scope.user.EN_ALARM_SMS_FL == 'Y' &&
                        $scope.user.EN_STORE_EMAIL_FL == 'Y' && $scope.user.EN_STORE_SMS_FL == 'Y' ) {
                            $scope.checkAllAgree = true;
                    }

                    if ($scope.user.BABY != null && $scope.user.BABY != '') {
                        for (var i=0; i < $scope.user.BABY.length; i++) {
                            if (i > 2) {
                                $scope.babies.push({});
                            }

                            $scope.babies[i].BABY_NM = $scope.user.BABY[i].BABY_NM;
                            $scope.babies[i].BABY_SEX_GB = $scope.user.BABY[i].BABY_SEX_GB;

                            if ($scope.user.BABY[i].BABY_BIRTH.length == 8) {
                                $scope.babies[i].BABY_YEAR = $scope.user.BABY[i].BABY_BIRTH.substr(0, 4);
                                $scope.babies[i].BABY_MONTH = $scope.user.BABY[i].BABY_BIRTH.substr(4, 2).replace('0', '');
                                $scope.babies[i].BABY_DAY = $scope.user.BABY[i].BABY_BIRTH.substr(6, 2).replace('0', '');
                            }
                        }
                    }

                    if ($scope.user.BLOG != null && $scope.user.BLOG != '') {
                        $scope.blog = $scope.user.BLOG;

                        $scope.blog.BLOG_DETAIL = $scope.user.BLOG.BLOG_URL;
                        if ($scope.blog.BLOG_GB == 'NAVER') {
                            $scope.blog.BLOG_URL = 'http://blog.naver.com/';
                        } else if ($scope.blog.BLOG_GB == 'DAUM') {
                            $scope.blog.BLOG_URL = 'http://blog.daum.net/';
                        } else if ($scope.blog.BLOG_GB == 'TSTORY') {
                            $scope.blog.BLOG_URL = 'http://blog.tstory.com/';
                        } else {
                            $scope.blog.BLOG_URL = '';
                        }

                        if ($scope.blog.THEME != '') {
                            var spTheme = $scope.blog.THEME.split(',');
                            for(var i = 0; i < spTheme.length; i++) {
                                spTheme[i] = parseInt(spTheme[i]);
                            }

                            $scope.blog.THEME_CK = spTheme;
                        }
                    }

//                    $scope.item.ROLE = $scope.user_roles[idx];

                    // 스크롤 이동
//                    $scope.click_focus();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getUser)
            .catch($scope.reportProblems);
    }]);
});
