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
                $scope.isUpload = true;
            }
        });

        // 날짜 콤보박스
        var year = [];
        var babyYear = [];
        var month = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        $scope.isUpload = false;

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
            $scope.community = "회원정보 수정";
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
                INTRO: '', NOTE: '', MARRIED_FL: 'Y', PREGNENT_FL: 'N', BABY_BIRTH_DT: '', EN_ANGE_EMAIL_FL: true, EN_ANGE_SMS_FL: true, EN_ALARM_EMAIL_FL: true, EN_ALARM_SMS_FL: true, EN_STORE_EMAIL_FL: true, EN_STORE_SMS_FL: true}
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

//                console.log($scope.user.PASSWORD)
//                console.log(check.test($scope.user.PASSWORD))
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
//            console.log($scope.user.EMAIL_SELECT);
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
//            console.log($scope.user.PREGNENT_FL);
            if ($scope.user.PREGNENT_FL != undefined) {
                if ($scope.user.PREGNENT_FL == 'N') {
                    $scope.disabledPregnent = true;

                    $scope.user.YEAR1 = '';
                    $scope.user.MONTH1 = '';
                    $scope.user.DAY1 = '';
                } else {
                    $scope.disabledPregnent = false;
                }
            }
        });

        /*
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
         */

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
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
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

            if (($scope.user.PASSWORD != undefined && $scope.user.PASSWORD != '') && !$scope.availablePW) {
                $('#password').focus();
                dialogs.notify('알림', '패스워드를 확인해주세요.', {size: 'md'});
                return;
            }

            if ($scope.user.USER_NM == '') {
                $('#user_nm').focus();
                dialogs.notify('알림', '이름을 확인해주세요.', {size: 'md'});
                return;
            } else if ($scope.user.USER_NM.length < 2) {
                $('#user_nm').focus();
                dialogs.notify('알림', '이름을 2자리 이상 입력해주세요.', {size: 'md'});
                return false;
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

            if ($scope.user.PREGNENT_FL == '') {
                $('#pregment').focus();
                dialogs.notify('알림', '임신여부를 선택해주세요.', {size: 'md'});
                return;
            }

            if ($scope.user.MARRIED_FL == '') {
                $('#married').focus();
                dialogs.notify('알림', '결혼여부를 선택해주세요.', {size: 'md'});
                return;
            }

            if ( ($scope.user.YEAR1 == undefined || $scope.user.YEAR1 == '') || ($scope.user.MONTH1 == undefined || $scope.user.MONTH1 == '') || ($scope.user.DAY1 == undefined || $scope.user.DAY1 == '') ) {
            } else {
                $scope.user.BABY_BIRTH_DT = $scope.user.YEAR1 + ($scope.user.MONTH1.length == 1 ? '0' + $scope.user.MONTH1 : $scope.user.MONTH1) + ($scope.user.DAY1.length == 1 ? '0' + $scope.user.DAY1 : $scope.user.DAY1);
            }

//            if ($scope.blog.BLOG_URL != '' && $scope.blog.BLOG_DETAIL != '') {
//                $scope.blog.BLOG_URL = $scope.blog.BLOG_DETAIL;
//            }

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
                $scope.isUpload = false;
            }

            var isWate = false;;

            if ($scope.user.USER_ST == 'W' ) {
                isWate = true;
            }

            $scope.user.USER_ST = 'N';

            $scope.updateItem('com/user', 'item', $scope.user.USER_ID, $scope.user, false)
                .then(function(){
                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                    /*
                     if (isWate && $scope.user.CERT_GB == 'MIG') {
                     $scope.mileage = {};
                     $scope.mileage.USER_ID = $scope.user.USER_ID;
                     $scope.mileage.EARN_GB = $scope.user.USER_ID;
                     $scope.mileage.PLACE_GB = '이벤트';
                     $scope.mileage.POINT = '2000';
                     $scope.mileage.REASON = '회원 정보 수정 이벤트';

                     $scope.insertItem('ange/mileage', 'item', $scope.mileage, false)
                     .then(function(){ dialogs.notify('알림', '이벤트에 참여되었습니다.', {size: 'md'});})
                     ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                     }
                     */
                    $scope.user.FILE = {};

                    $scope.item = {};
                    $scope.item.SYSTEM_GB = 'ANGE';

                    $scope.updateSession($scope.user.USER_ID, $scope.item)
                        .then(function(data){
                            $rootScope.login = true;
                            $rootScope.authenticated = true;
                            $rootScope.user_info = data;
                            $rootScope.uid = data.USER_ID;
                            $rootScope.name = data.USER_NM;
                            $rootScope.role = data.ROLE_ID;
                            $rootScope.mileage = data.REMAIN_POINT;
                            $rootScope.system = data.SYSTEM_GB;
                            $rootScope.menu_role = data.MENU_ROLE;
                            $rootScope.email = data.EMAIL;
                            $rootScope.nick = data.NICK_NM;

                            if (data.FILE) {
                                $rootScope.profileImg = UPLOAD.BASE_URL + data.FILE.PATH + data.FILE.FILE_ID;
                            } else {
                                $rootScope.profileImg = null;
                            }
                        })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

//            if ($scope.checkSave) {
//                $scope.insertItem('com/user', 'item', $scope.user, false)
//                    .then(function(){ $scope.checkSave = true; /*dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});*/})
//                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
//            } else {
//                $scope.updateItem('com/user', 'item', $scope.user.USER_ID, $scope.user, false)
//                    .then(function(){ /*dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});*/})
//                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
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

        // 저장 버튼 클릭
        $scope.click_historyBack = function () {
            history.back();
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
                    if (file != false && file != null) {
                        $scope.file = {"name":file.FILE_NM,"size":file.FILE_SIZE,"url":UPLOAD.BASE_URL+file.PATH+file.FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+file.FILE_NM,"deleteType":"DELETE"};
                    }

                    if ($scope.user.BIRTH != undefined && $scope.user.BIRTH.length == 8) {
                        $scope.user.YEAR = $scope.user.BIRTH.substr(0, 4);
                        $scope.user.MONTH = parseInt($scope.user.BIRTH.substr(4, 2))+'';
                        $scope.user.DAY = parseInt($scope.user.BIRTH.substr(6, 2))+'';
                    }

                    if ($scope.user.ZIP_CODE != undefined && $scope.user.ZIP_CODE.length == 6) {
                        $scope.user.POST_1 = $scope.user.ZIP_CODE.substr(0, 3);
                        $scope.user.POST_2 = $scope.user.ZIP_CODE.substr(3, 3);
                    }

                    if ($scope.user.PHONE_1 != undefined && $scope.user.PHONE_1.length >= 8) {
                        if ($scope.user.PHONE_1.substr(0, 2) == '02') {
                            $scope.user.PHONE_1_1 = $scope.user.PHONE_1.substr(0, 2);
                            if ($scope.user.PHONE_1.length == 9) {
                                $scope.user.PHONE_1_2 = $scope.user.PHONE_1.substr(2, 3);
                                $scope.user.PHONE_1_3 = $scope.user.PHONE_1.substr(5, 4);
                            } else {
                                $scope.user.PHONE_1_2 = $scope.user.PHONE_1.substr(2, 4);
                                $scope.user.PHONE_1_3 = $scope.user.PHONE_1.substr(6, 4);
                            }
                        } else {
                            $scope.user.PHONE_1_1 = $scope.user.PHONE_1.substr(0, 3);
                            if ($scope.user.PHONE_1.length == 10) {
                                $scope.user.PHONE_1_2 = $scope.user.PHONE_1.substr(3, 3);
                                $scope.user.PHONE_1_3 = $scope.user.PHONE_1.substr(6, 4);
                            } else {
                                $scope.user.PHONE_1_2 = $scope.user.PHONE_1.substr(3, 4);
                                $scope.user.PHONE_1_3 = $scope.user.PHONE_1.substr(7, 4);
                            }
                        }
                    }

                    if ($scope.user.PHONE_2 != undefined && $scope.user.PHONE_2.length > 9) {
                        $scope.user.PHONE_2_1 = $scope.user.PHONE_2.substr(0, 3);
                        if ($scope.user.PHONE_2.length == 10) {
                            $scope.user.PHONE_2_2 = $scope.user.PHONE_2.substr(3, 3);
                            $scope.user.PHONE_2_3 = $scope.user.PHONE_2.substr(6, 4);
                        } else {
                            $scope.user.PHONE_2_2 = $scope.user.PHONE_2.substr(3, 4);
                            $scope.user.PHONE_2_3 = $scope.user.PHONE_2.substr(7, 4);
                        }
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

                    if ($scope.user.BABY_BIRTH_DT != undefined && $scope.user.BABY_BIRTH_DT.length == 8) {
                        $scope.user.YEAR1 = $scope.user.BABY_BIRTH_DT.substr(0, 4);
                        $scope.user.MONTH1 = parseInt($scope.user.BABY_BIRTH_DT.substr(4, 2))+'';
                        $scope.user.DAY1 = parseInt($scope.user.BABY_BIRTH_DT.substr(6, 2))+'';
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
                                $scope.babies[i].BABY_MONTH = parseInt($scope.user.BABY[i].BABY_BIRTH.substr(4, 2))+'';
                                $scope.babies[i].BABY_DAY = parseInt($scope.user.BABY[i].BABY_BIRTH.substr(6, 2))+'';
                            }
                        }
                    }

                    if ($scope.user.BLOG != null && $scope.user.BLOG != '') {
                        $scope.blog = $scope.user.BLOG;

//                        $scope.blog.BLOG_DETAIL = $scope.user.BLOG.BLOG_URL;
//                        if ($scope.blog.BLOG_GB == 'NAVER') {
//                            $scope.blog.BLOG_URL = 'http://blog.naver.com/';
//                        } else if ($scope.blog.BLOG_GB == 'DAUM') {
//                            $scope.blog.BLOG_URL = 'http://blog.daum.net/';
//                        } else if ($scope.blog.BLOG_GB == 'TSTORY') {
//                            $scope.blog.BLOG_URL = 'http://blog.tstory.com/';
//                        } else {
//                            $scope.blog.BLOG_URL = '';
//                        }

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
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getUser)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('myangealbum-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT) {

        $scope.search = {};
        $scope.isAlbum = true;
        $scope.nowAlbumSubject = '';

        if ($stateParams.id == undefined) {
            $scope.search.PARENT_NO = '0';
            $scope.isAlbum = true;
        } else {
            $scope.search.PARENT_NO = $stateParams.id;
            $scope.isAlbum = false;
        }

        // 페이징
        //$scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 9;
        $scope.SEARCH_TOTAL_COUNT = 0;

        $scope.list = [];

        // 검색어 조건
        var condition = [{name: "제목", value: "SUBJECT"} , {name: "내용", value: "SUMMARY"}];
        var mode = [{name: "모아보기", value: "COLLECTION"} , {name: "크게보기", value: "ALBUM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];
        $scope.search.PARENT_NO = $stateParams.id == undefined ? 0 : $stateParams.id;

        $scope.modes = mode;
        $scope.m_view_mode = mode[0];

        $scope.pageChanged = function() {
            $scope.list = [];
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getMyAlbumList();
        };

        /********** 초기화 **********/
            // 초기화
        $scope.init = function(session) {
            $scope.getMyAlbumTotalCnt();

            // 검색조건유지
            var getParam = function(key){
                var _parammap = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    _parammap[decode(arguments[1])] = decode(arguments[2]);
                });

                return _parammap[key];
            };

            if(getParam("page_no") == undefined){
                $scope.PAGE_NO = 1;
            }else{
                $scope.PAGE_NO = getParam("page_no");
                if(getParam("condition") != undefined){
                    $scope.search.CONDITION.value = getParam("condition");
                }
                $scope.search.KEYWORD = getParam("keyword");
            }
        };

        /********** 이벤트 **********/
            // 보기모드 변경
//        $scope.change_mode = function(mode) {
//            alert(mode)
//            $scope.m_view_mode = mode;
//        }

        function firstImage() {
            $scope.current = _.first($scope.list);
        }

        $scope.click_currentImage = function (item) {
            $scope.current = item;
        };

        // 앨범 리스트 클릭
        $scope.click_showMyAlbum = function() {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
        };

        // 앨범 삭제 클릭
        $scope.click_deleteMyAlbum = function(item, idx) {

            if (item == undefined || item.ALBUM_GB == 'ALBUM') {
                var dialog = dialogs.confirm('알림', '앨범을 삭제 하시겠습니까? 앨범에 속한 모든 사진이 함께 삭제 됩니다.', {size: 'md'});

                dialog.result.then(function(btn){
                    $scope.deleteItem('ange/album', 'album', item != undefined ? item.NO : $stateParams.id, true)
                        .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                            if (item != undefined) {
                                $scope.list.splice(idx, 1);
                            } else {
                                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                            }
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                }, function(btn) {
                    return;
                });
            } else {

                $scope.click_togglePhotoConfig();

                var dialog = dialogs.confirm('알림', '사진을 삭제 하시겠습니까?', {size: 'md'});

                dialog.result.then(function(btn){
                    $scope.deleteItem('ange/album', 'picture', item.NO, true)
                        .then(function(data){
                            dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                            $scope.list.splice(idx, 1);
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                }, function(btn) {
                    return;
                });
            }
        };

        $scope.getMyAlbumTotalCnt = function () {
            $scope.getItem('ange/album', 'total', null, $scope.search, true)
                .then(function(data){
                    $scope.TOTAL_COUNT = data.TOTAL_COUNT;
                })
                ['catch'](function(error){});
        };

        $scope.getAddAlbum = function () {
            if ($scope.isAlbum) {
                var add = {};
                add.ALBUM_GB = 'ADD';
                add.ALBUM_FILE = CONSTANT.BASE_URL + '/imgs/ange/newalbum_add.png';
                add.NEW_ALBUM = false;

                $scope.list.push(add);
            }
        };

        $scope.isLoding = false;

        // 게시판 목록 조회
        $scope.getMyAlbumList = function () {

            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';

            $scope.isLoding = true;

            $scope.getList('ange/album', 'list', {}, $scope.search, true)
                .then(function(data){
                    for(var i in data) {
//                        if (data[i].FILE_ID == null)
                        data[i].ALBUM_FILE = CONSTANT.BASE_URL + data[i].PATH + 'thumbnail/' + data[i].FILE_ID;
                        data[i].NEW_ALBUM = (data[i].ALBUM_GB == 'ALBUM' && data[i].PATH == null) ? true : false;

                        $scope.list.push(data[i]);
                    }

                    firstImage();

                    $scope.isLoding = false;

                    $scope.SEARCH_COUNT = data[0].TOTAL_COUNT;

                    $scope.getAddAlbum();
                })
                ['catch'](function(error){ $scope.list = []; $scope.SEARCH_COUNT = 0; $scope.getAddAlbum(); $scope.isLoding = false; });
        };

        // 검색
        $scope.click_searchMyAlbum = function(){
            $scope.list = [];
            $scope.PAGE_NO = 1;
            $scope.getMyAlbumList();
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/'+$stateParams.id+'?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);

        }

        // 조회 버튼 클릭
        $scope.click_showViewMyAlbum = function (item) {
            if (item.ALBUM_GB == 'ADD') {
                $scope.openViewMyAlbumRegModal(null, null, 'lg');
            } else if (item.ALBUM_GB == 'ALBUM') {
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/'+item.NO);
            } else {
                $scope.openViewMyAlbumModal(item, 'lg');
            }
        };

        $scope.openViewMyAlbumModal = function (item, size) {
            var dlg = dialogs.create('partials/ange/myange/myangealbum-view-popup.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', 'data', function($scope, $rootScope, $modalInstance, $controller, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));

                    $scope.isHome = false;
                    $scope.item = data;

                    $scope.click_delete = function () {

                        var dialog = dialogs.confirm('알림', '사진을 삭제 하시겠습니까?', {size: 'md'});

                        dialog.result.then(function(btn){
                            $scope.deleteItem('ange/album', 'picture', item.NO, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                                    $modalInstance.close('DELETE');
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }, function(btn) {
                            return;
                        });
                    };

                    $scope.click_update = function () {
                        $modalInstance.close('UPDATE');
                    };

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }
                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(action){
                if (action == 'DELETE') {
                    $scope.list = [];
                    $scope.PAGE_NO = 1;
                    $scope.getMyAlbumList();
                } else if (action == 'UPDATE') {
                    $scope.openViewMyPictureRegModal(item, 'lg');
                }
            },function(){

            });
        };

        var temp_num = '';

        $scope.click_togglePhotoConfig = function (p_num) {

            //alert('photo_menu_' + p_num);
            if (p_num == temp_num) {
                temp_num = '';
            }

            if(p_num){
                document.getElementById('photo_menu_' + p_num).style.display = "block";
            }

            if(temp_num) {
                document.getElementById('photo_menu_' + temp_num).style.display = "none";
            }
            temp_num = p_num;
        };


        // 앨범/사진 수정 버튼 클릭
        $scope.click_showEditMyAlbum = function (item, idx) {

            if (item.ALBUM_GB == 'ALBUM') {
                $scope.openViewMyAlbumRegModal(item, idx, 'lg');
            } else {
                $scope.openViewMyPictureRegModal(item, idx, 'lg');
            }

            $scope.click_togglePhotoConfig();
        };

        // 앨범 등록 버튼 클릭
        $scope.click_showCreateMyAlbum = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 앨범을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }

            $scope.openViewMyAlbumRegModal(null, null, 'lg');
        };

        $scope.openViewMyAlbumRegModal = function (item, idx, size) {
            var dlg = dialogs.create('myangealbum-edit.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', '$filter', '$http', 'CONSTANT', 'data', function($scope, $rootScope, $modalInstance, $controller, $filter, $http, CONSTANT, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));

                    $scope.item = {};

                    if (data != null) {
                        $scope.item = data;
                    }

                    $scope.click_reg = function () {

                        if (data == null) {
                            $scope.insertItem('ange/album', 'album', $scope.item, true)
                                .then(function(data){
                                    $scope.item.ACTION = 'CREATE';
                                    $modalInstance.close($scope.item);
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        } else {
                            $scope.updateItem('ange/album', 'album', $scope.item.NO, $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                    $scope.item.ACTION = 'UPDATE';
                                    $modalInstance.close($scope.item);
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }
                    };

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }
                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(data){
                if (data.ACTION == 'CREATE') {
                    $scope.list = [];
                    $scope.getMyAlbumList();
                } else if (data.ACTION == 'UPDATE') {
                    $scope.list[idx] = data;
                }
            },function(){

            });
        };

        // 사진 등록 버튼 클릭
        $scope.click_showCreateMyPicture = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 사진을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }

            $scope.openViewMyPictureRegModal(null, 'lg');
        };

        $scope.openViewMyPictureRegModal = function (item, idx, size) {
            var dlg = dialogs.create('myangepicture-edit.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', '$filter', '$http', 'CONSTANT', 'data', function($scope, $rootScope, $modalInstance, $controller, $filter, $http, CONSTANT, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));

                    // 파일 업로드 설정
                    $scope.options = { url: CONSTANT.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

                    $scope.queue = [];
                    $scope.item = {};
                    $scope.item.queue = [];

                    if (data != null) {
                        $scope.item = data;
                        $scope.queue.push({"no":data.NO, "name":data.FILE_NM,"size":data.FILE_SIZE,"url":CONSTANT.BASE_URL+data.PATH+data.FILE_ID,"thumbnailUrl":CONSTANT.BASE_URL+data.PATH+"thumbnail/"+data.FILE_ID,"mediumUrl":CONSTANT.BASE_URL+data.PATH+"medium/"+data.FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+data.FILE_NM,"deleteType":"DELETE","kind":data.FILE_GB,"type":data.FILE_EXT,"isUpdate":true});
                    }

                    // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
                    $scope.checkAll = false;

                    $scope.checkFile = [];

                    // ui bootstrap 달력
                    $scope.format = 'yyyy-MM-dd';

                    $scope.today = function() {
                        $scope.item.SHOOTING_YMD = new Date();
                    };
                    $scope.today();

                    $scope.clear = function () {
                        $scope.item.SHOOTING_YMD = null;
                    };

                    $scope.open = function($event, opened) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        $scope[opened] = true;
                    };

                    $scope.click_checkAllToggle = function () {
                        $scope.checkAll = !$scope.checkAll;

                        if ($scope.checkAll) {
                            $scope.item.queue = angular.copy($scope.queue);
                        } else {
                            $scope.item.queue = [];
                        }
                    };

                    var state;
                    $scope.click_checkFileDestroy = function () {
                        angular.forEach($scope.item.queue, function(file) {
                            state = 'pending';
                            return $http({
                                url: file.deleteUrl,
                                method: file.deleteType
                            }).then(
                                function () {
                                    $scope.item.queue.splice($scope.checkFile.indexOf(file), 1);

                                    state = 'resolved';
                                    $scope.clear(file);
                                },
                                function () {
                                    state = 'rejected';
                                }
                            );
                        });
                    };

                    $scope.click_reg = function () {
                        $scope.item.PARENT_NO = $stateParams.id;
                        $scope.item.SHOOTING_YMD = $filter('date')($scope.item.SHOOTING_YMD, 'yyyy-MM-dd');
                        $scope.item.FILES = $scope.queue;

                        for(var i in $scope.item.FILES) {
                            $scope.item.FILES[i].$destroy = '';
                            $scope.item.FILES[i].$editor = '';
                        }

                        if (data == null) {
                            $scope.insertItem('ange/album', 'picture', $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                    $modalInstance.close($scope.item);
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        } else {
                            $scope.updateItem('ange/album', 'picture', $scope.item.NO, $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                    $modalInstance.close($scope.item);
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }
                    };

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }
                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(data){
                if (data) {
                    $scope.list = [];
                    $scope.getMyAlbumList();
                }
            },function(){

            });
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMyAlbumList)
            ['catch']($scope.reportProblems);

    }]);

    controllers.controller('myangealbum-view-popup', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT) {

        $scope.search = {};

        /********** 초기화 **********/
            // 초기화
        $scope.init = function(session) {

        };

        /********** 이벤트 **********/
            // 게시판 목록 조회
        $scope.getMyAlbum = function () {

            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';

            $scope.isLoding = true;
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMyAlbum)
            ['catch']($scope.reportProblems);

    }]);

    controllers.controller('myangecalendar', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.talkCheck = false;

        // 초기화
        $scope.init = function(session) {

            var now = new Date();
            var nowYear = now.getFullYear();
            var nowMonth = now.getMonth() + 1;

            // $scope.search.year 가 null 일때 당해 입력
            // $scope.search.month 가 null 일때 당월 입력
            $scope.search = {"year":nowYear,"month":nowMonth};

            $scope.community = "캘린더";
            $scope.monthtable = "<b>Hi</b>";

            $scope.data = 	{
                "1":{ "day":"1","event":"" },
                "2":{ "day":"1","event":"" },
                "3":{ "day":"1","event":"" },
                "4":{ "day":"1","event":"" },
                "5":{ "day":"1","event":"" },
                "6":{ "day":"1","event":"" },
                "7":{ "day":"1","event":"" },
                "8":{ "day":"1","event":"" },
                "9":{ "day":"1","event":"" },
                "10":{ "day":"1","event":"" },
                "11":{ "day":"1","event":"" },
                "12":{ "day":"1","event":"" },
                "13":{ "day":"2","event":"" }
            };


            $scope.getEventList();
            $scope.getTalkSubject();
        };

        $scope.click_moveTalk = function () {
            $location.url('people/linetalk/list');
        };

        $scope.getTalkSubject = function (){

            // 일일 날짜 셋팅
            var date = new Date();

            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var thisyear = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();

            if(mm < 10){
                mm = '0'+mm;
            }

            if(dd < 10){
                dd = '0'+dd;
            }

            $scope.getItem('com/reply', 'subjectitem', {}, {TODAY_DATE: true, YEAR: thisyear, MONTH: mm, DAY: dd}, true)
                .then(function(data){
                    console.log(data)
                    $scope.talkitem = data;
                })
                ['catch'](function(error){
                $scope.talkitem="";
            });

            $scope.getItem('com/reply', 'check', {}, {TODAY_DATE: true, YEAR: thisyear, MONTH: mm, DAY: dd, TARGET_GB: 'TALK', REG_UID: $rootScope.uid}, true)
                .then(function(data){
                    if (data.COUNT > 0) {
                        $scope.talkCheck = true;
                    } else {
                        $scope.talkCheck = false;
                    }

                })
                ['catch'](function(error){
                $scope.talkCheck = false;
            });
        }

        // 일반 게시판 목록 조회
        $scope.getEventList = function () {

            $scope.getList('ange/calendar', 'list', {}, {"year":$scope.search.year,"month":$scope.search.month}, true)
                .then(function(data){
                    /*
                     var i = 0;
                     var preIdx = 0;
                     for (var idx in data.list) {
                     preIdx = idx;
                     if (i != 0 && data.list[idx].day == data.list[preIdx].day) {
                     data.list[idx].day = '';
                     }

                     i++;
                     }
                     */

                    $scope.data = data;
                })
                ['catch'](function(error){
                alert('error');
            });
        };

        $scope.moveCalendar = function (p_year,p_month,p_add) {

            p_year = parseInt(p_year);
            p_month = parseInt(p_month)+p_add;

            if (p_month>12) {
                p_month=1;
                p_year++;
            }
            if (p_month<1) {
                p_month=12;
                p_year--;
            }

            $scope.search.year = p_year;
            $scope.search.month = p_month;
            $scope.getEventList();
        };

        $scope.init();
    }]);

    controllers.controller('myangecoupon', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', 'CONSTANT',function ($scope, $rootScope,$stateParams, $location, dialogs, UPLOAD,CONSTANT) {

        $scope.search = {};
        $scope.item = {};
        // 초기화

        var now = new Date();
        var nowYear = now.getFullYear();


        var todayyear = now.getFullYear().toString();
        var totaymonth = (now.getMonth()+1).toString();
        var todaydd  = now.getDate().toString();

        if(totaymonth < 10) {
            totaymonth = '0'+totaymonth;
        }

        if(todaydd < 10) {
            todaydd = '0'+todaydd;
        }

        $scope.todayDate = todayyear+totaymonth+todaydd;

        $scope.init = function(session) {
            $scope.community = "쿠폰";


            $scope.search.DETAIL = true;
            $scope.getItem('com/user', 'item', $scope.uid, $scope.search , false)
                .then(function(data){

                    console.log(data);
                    $rootScope.user_info.BIRTH = data.BIRTH;
                    $rootScope.user_info.BABY = data.BABY;

                    // $rootScope.user_info.BIRTH
                    $scope.MOM_BIRTH_YEAR = data.BIRTH.substr(0,4);
                    $scope.MOM_BIRTH_MONTH = data.BIRTH.substr(4,2);
                    $scope.MOM_BIRTH_DAY = data.BIRTH.substr(6,2);


                    //console.log(' $rootScope.user_info.BABY.BABY_BIRTH = '+ $rootScope.user_info.BABY[0].BABY_BIRTH);

                    console.log(data.BABY);

                    //  $rootScope.user_info.BABY[0].BABY_BIRTH
                    if(data.BABY == null){
                        $scope.BABY_BIRTH_YEAR = '';
                        $scope.BABY_BIRTH_MONTH = '';
                        $scope.BABY_BIRTH_DAY = '';
                    }else{
                        $scope.BABY_BIRTH_YEAR = data.BABY[0].BABY_BIRTH.substr(0,4);
                        $scope.BABY_BIRTH_MONTH = data.BABY[0].BABY_BIRTH.substr(4,2);
                        $scope.BABY_BIRTH_DAY = data.BABY[0].BABY_BIRTH.substr(6,2);
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 25;
        $scope.TOTAL_COUNT = 0;

        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getCouponList();
        };


        $scope.getCouponList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.getList('ange/coupon', 'list', {NO: $scope.PAGE_NO- 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_CNT;
                    console.log(total_cnt);
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };



        $scope.click_saveMomsBirthCoupon = function (){

            $scope.item.COUPON_CD = 'ANGE_BIRTH'
            $scope.search.COUPON_CD = $scope.item.COUPON_CD;

            $scope.search.YEAR  = nowYear;

            var mombirth = parseInt($scope.MOM_BIRTH_MONTH - 1);
            var momday = parseInt($scope.MOM_BIRTH_DAY);

            var threeDaysAgo = new Date(nowYear, mombirth, momday); // 2014-03-01 - 월은 0에서부터 시작된다.
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3); // 2014-02-26 => 3일전으로~

            var threeDaysAfter = new Date(nowYear, mombirth, momday); // 2014-03-01 - 월은 0에서부터 시작된다.
            threeDaysAfter.setDate(threeDaysAfter.getDate() + 3); // 2014-02-26 => 3일전으로~

            var threeagomm = threeDaysAgo.getMonth()+1;
            if(threeagomm < 10){
                threeagomm = '0'+threeagomm
            }
            var threeagoday = threeDaysAgo.getDate();
            if(threeagoday < 10){
                threeagoday = '0'+threeagoday
            }

            var threeaftermm = threeDaysAfter.getMonth()+1;
            if(threeaftermm < 10){
                threeaftermm = '0'+threeaftermm;
            }
            var threeafterday = threeDaysAfter.getDate();
            if(threeafterday < 10){
                threeafterday = '0'+threeafterday;
            }

            console.log('threeDaysAgo = '+nowYear+threeagomm+threeagoday);
            var threeAgoDate = parseInt(nowYear+threeagomm+threeagoday);

            console.log('threeDaysAfter = '+nowYear+threeaftermm+threeafterday);
            var threeAfterDate = parseInt(nowYear+threeaftermm+threeafterday);

            var todayDate = parseInt($scope.todayDate);

            if(threeAgoDate <= todayDate && todayDate <= threeAfterDate){
                $scope.getList('ange/coupon', 'couponCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                    .then(function(data){

                        var couponCnt = data[0].COUPON_CNT;

                        if(couponCnt ==0){

                            $scope.item.COUPON_GB = 'ANGE'
                            $scope.item.COUPON_NM = '엄마 생일 축하 쿠폰';

                            $scope.item.MILEAGE = 500;
                            $scope.insertItem('ange/coupon', 'item', $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 발급 되었습니다.', {size: 'md'});
                                    $rootScope.mileage = data.mileage;
                                    $scope.item.COUPON_CD = '';
                                    $scope.getCouponList();
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 쿠폰 발급을 했습니다.', {size: 'md'});
                            $scope.item.COUPON_CD = '';
                            return;
                        }

                    })
                    ['catch'](function(error){});
            }else{
                dialogs.notify('알림', '생일 기간이 아닙니다.', {size: 'md'});
                $scope.item.COUPON_CD = '';
                return;
            }
        }

        $scope.click_saveMomsBecomeCoupon = function (){

            if($scope.BABY_BIRTH_YEAR == '' && $scope.BABY_BIRTH_MONTH == '' && $scope.BABY_BIRTH_DAY == ''){
                dialogs.notify('알림', '회원정보에서 아이 생일을 추가해주세요.', {size: 'md'});
                return;
            }

            $scope.item.COUPON_CD = 'ANGE_MOM_BECAME'
            $scope.search.COUPON_CD = $scope.item.COUPON_CD;

            $scope.search.YEAR  = nowYear;

            var babybirth = parseInt($scope.BABY_BIRTH_MONTH - 1);
            var babyday = parseInt($scope.BABY_BIRTH_DAY);

            var threeDaysAgo = new Date(nowYear, babybirth, babyday); // 2014-03-01 - 월은 0에서부터 시작된다.
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3); // 2014-02-26 => 3일전으로~

            var threeDaysAfter = new Date(nowYear, babybirth, babyday); // 2014-03-01 - 월은 0에서부터 시작된다.
            threeDaysAfter.setDate(threeDaysAfter.getDate() + 3); // 2014-02-26 => 3일전으로~

            var threeagomm = threeDaysAgo.getMonth()+1;
            if(threeagomm < 10){
                threeagomm = '0'+threeagomm
            }
            var threeagoday = threeDaysAgo.getDate();
            if(threeagoday < 10){
                threeagoday = '0'+threeagoday
            }

            var threeaftermm = threeDaysAfter.getMonth()+1;
            if(threeaftermm < 10){
                threeaftermm = '0'+threeaftermm;
            }
            var threeafterday = threeDaysAfter.getDate();
            if(threeafterday < 10){
                threeafterday = '0'+threeafterday;
            }

            console.log('threeDaysAgo = '+nowYear+threeagomm+threeagoday);
            var threeAgoDate = parseInt(nowYear+threeagomm+threeagoday);

            console.log('threeDaysAfter = '+nowYear+threeaftermm+threeafterday);
            var threeAfterDate = parseInt(nowYear+threeaftermm+threeafterday);

            var todayDate = parseInt($scope.todayDate);

            if(threeAgoDate <= todayDate && todayDate <= threeAfterDate){
                $scope.getList('ange/coupon', 'couponCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                    .then(function(data){

                        var couponCnt = data[0].COUPON_CNT;

                        if(couponCnt ==0){

                            $scope.item.COUPON_GB = 'ANGE'
                            $scope.item.COUPON_NM = '엄마가 된 축하 쿠폰';

                            $scope.item.MILEAGE = 200;
                            $scope.insertItem('ange/coupon', 'item', $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 발급 되었습니다.', {size: 'md'});
                                    $rootScope.mileage = data.mileage;
                                    $scope.item.COUPON_CD = '';
                                    $scope.getCouponList();
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 쿠폰 발급을 했습니다.', {size: 'md'});
                            $scope.item.COUPON_CD = '';
                            return;
                        }
                    })
                    ['catch'](function(error){});
            }else{
                dialogs.notify('알림', '적립 기간이 아닙니다.', {size: 'md'});
                $scope.item.COUPON_CD = '';
                return;
            }

        }

        $scope.click_saveCoupon = function (){

            //$scope.item.COUPON_CD = $scope.item.COUPON_CD.replace(/^\s+|\s+$/g,'');

            if($scope.item.COUPON_CD != undefined){
                $scope.item.COUPON_CD = $scope.item.COUPON_CD.replace(/^\s+|\s+$/g,'');
            }

            if($scope.item.COUPON_CD == undefined || $scope.item.COUPON_CD == ""){
                dialogs.notify('알림', '쿠폰번호를 입력하세요.', {size: 'md'});
                return;
            }

            $scope.item.MILEAGE = 1000;

            var coupon_gb = $scope.item.COUPON_CD.split('_');
            coupon_gb = coupon_gb[0];

            console.log(coupon_gb);
            if(coupon_gb != 'ANGE' && coupon_gb != 'MAGAZINE' && coupon_gb != 'EXPO'){
                dialogs.notify('알림', '쿠폰번호가 유효하지 않습니다.', {size: 'md'});
                return;
            }

            $scope.search.COUPON_CD = $scope.item.COUPON_CD;

            if(coupon_gb == 'MAGAZINE'){
                //$scope.search.MONTH = coupon_gb[1];
                //console.log(coupon_gb[1]);
                var month = $scope.item.COUPON_CD.split('_');
                console.log(month[1]);


                if((todayyear+totaymonth) < month[1]){
                    dialogs.notify('알림', '발급일이 아닙니다', {size: 'md'});
                    return;
                }

                if((todayyear+totaymonth) > month[1]){
                    dialogs.notify('알림', '발급일이 지났습니다', {size: 'md'});
                    return;
                }

                $scope.search.MONTH = month[1];
            }

            $scope.getList('ange/coupon', 'couponCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    var couponCnt = data[0].COUPON_CNT;

                    if(couponCnt ==0){

                        if(coupon_gb == 'ANGE'){
                            $scope.item.COUPON_GB = 'ANGE'
                            $scope.item.COUPON_NM = '앙쥬맘 쿠폰(마일리지적립)'+'_'+$scope.item.COUPON_CD;
                        }else if(coupon_gb == 'MAGAZINE'){
                            $scope.item.COUPON_GB = 'MAGAZINE'
                            $scope.item.COUPON_NM = '매거진다운로드(마일리지적립)'+'_'+$scope.item.COUPON_CD;
                        }else if(coupon_gb == 'EXPO'){
                            $scope.item.COUPON_GB = 'EXPO'
                            $scope.item.COUPON_NM = '박람회 쿠폰(마일리지적립)'+'_'+$scope.item.COUPON_CD;
                        }

                        $scope.insertItem('ange/coupon', 'item', $scope.item, true)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 발급 되었습니다.', {size: 'md'});
                                $rootScope.mileage = data.mileage;
                                $scope.item.COUPON_CD = '';
                                $scope.getCouponList();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }else{
                        dialogs.notify('알림', '이미 쿠폰 발급을 했습니다.', {size: 'md'});
                        $scope.item.COUPON_CD = '';
                        return;
                    }

                })
                ['catch'](function(error){});


        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCouponList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('myangegroup', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {
            $scope.community = "앙쥬그룹";
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);

    controllers.controller('myangehome', ['$scope', '$stateParams', '$location', 'dialogs', function ($scope, $stateParams, $location, dialogs) {

        // 초기화
        $scope.init = function(session) {
            // ange-portlet-slide-album
            $scope.option_r1_c1 = {title: '나의 앨범', api:'ange/album', size: 12, id: 'album', url: '/myange/album', dots: false, autoplay: true, centerMode: true, showNo: 6, fade: 'false'};

            // ange-portlet-calendar
            $scope.option_r2_c1 = {title: '마이캘린더', api:'ange/order', size: 3, channel: "myange", type: 'order', url: '/myange/orderlist', defIdx: 0, tab: [{gb: 'MILEAGE', menu: '/myange/orderlist', name: '마일리지몰'}, {gb: 'CUMMERCE', menu: '/myange/orderlist', name: '공동구매'}], image: true, head: true, date: false, nick: false};

            // ange-portlet-order-list
            $scope.option_r3_c1 = {title: '주문/구매내역', api:'ange/order', size: 3, channel: "myange", type: 'order', url: '/myange/orderlist', defIdx: 0, tab: [{gb: 'MILEAGE', menu: '/myange/orderlist', name: '마일리지몰'}, {gb: 'CUMMERCE', menu: '/myange/orderlist', name: '공동구매'}], image: true, head: true, date: false, nick: false};

            // ange-portlet-channel-list
            $scope.option_r3_c2 = {title: '내활동', api:'com/webboard', size: 5, channel: "people", type: 'writing', url: '/myange/writing', image: false, head: true, date: false, nick: false};
        };

        /********** 이벤트 **********/
        $scope.getItem('ange/comp', 'compcount', null, false)
            .then(function(data){
                $scope.COMP_CNT = data.COMP_CNT;
            })
            ['catch'](function(error){$scope.COMP_CNT = 0;});

        $scope.getItem('ange/message', 'tocount', null, false)
            .then(function(data){
                $scope.TO_CNT = data.TO_CNT;
            })
            ['catch'](function(error){$scope.TO_CNT = 0;});

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

        /********** 화면 초기화 **********/
        $scope.init();
    }]);

    controllers.controller('myangemate', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {
            $scope.community = "앙쥬메이트";
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);

    controllers.controller('myangemessage', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope,$rootScope, $stateParams, $location, dialogs, CONSTANT) {

        $scope.search = {};

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 25;
        $scope.TOTAL_COUNT = 0;

        $scope.list = [];
        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);

//            $scope.PAGE_NO = 1;
//            $scope.PAGE_SIZE = 10;
//            $scope.TOTAL_COUNT = 0;

            $scope.list = [];

            $scope.getMessageList();
        };

        // 초기화
        $scope.init = function(session) {
            $scope.community = "메시지";
        };

        $scope.getMessageList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.getList('ange/message', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    //console.log(data);
                    var total_cnt = data[0].TOTAL_CNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    //console.log($scope.TOTAL_COUNT);

                    for(var i in data) {

                        var source = data[i].BODY;
                        var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

                        source = source.replace(pattern, '');
                        source = source.replace(/&nbsp;/ig, '');
                        source = source.trim();

                        data[i].BODY = source;

                        $scope.list.push(data[i]);
                    }

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 상세조회 버튼 클릭
        $scope.click_showViewMessage = function (item) {
            $scope.openViewScrapModal(item, 'lg'); //{NO : item.key}
        };

        $scope.openViewScrapModal = function (item, size) {
            var dlg = dialogs.create('myangemessage_view.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.reitem = {};
                    $scope.getItem('ange/message', 'item', item.NO, {}, false)
                        .then(function(data){
                            $scope.item = data;
                            console.log($scope.item);

                            var source = data.BODY;
                            var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

//                            var state = "";
//                            if ($scope.item.FROM_ID == $_SESSION['uid']) {
//                                state = "SEND";
//                            } else {
//                                state = "RECIEVE";
//                            }

                            source = source.replace(pattern, '');
                            source = source.replace(/&nbsp;/ig, '');
                            source = source.trim();

                            $scope.item.BODY = source;

                            if($scope.item.FROM_ID != $scope.uid){
                                $scope.reitem.FROM_ID = $scope.item.TO_ID;
                                $scope.reitem.FROM_NM = $scope.item.TO_NM;
                                $scope.reitem.TO_ID = $scope.item.FROM_ID;
                                $scope.reitem.TO_NM = $scope.item.FROM_NM;
                            }else{
                                $scope.reitem.TO_ID = $scope.item.TO_ID;
                                $scope.reitem.TO_NM = $scope.item.TO_NM;
                                $scope.reitem.FROM_ID = $scope.item.FROM_ID;
                                $scope.reitem.FROM_NM = $scope.item.FROM_NM;
                            }

                            console.log("보내는"+$scope.reitem.TO_ID);
                            console.log("보내는"+$scope.reitem.TO_NM);
                            console.log("받는"+$scope.reitem.FROM_ID);
                            console.log("받는"+$scope.reitem.FROM_NM);

                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    $scope.viewCheckFl = function () {
                        $scope.updateItem('ange/message', 'check', item.NO, {ROLE: true}, false)
                            .then(function(data){ $rootScope.message = data.message; })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $scope.click_reg = function () {

                        //console.log(trim($scope.reitem.BODY));

                        if($scope.reitem.BODY != undefined){
                            $scope.reitem.BODY = $scope.reitem.BODY.replace(/^\s+|\s+$/g,'');
                        }


                        console.log($scope.reitem.BODY);

                        if($scope.reitem.BODY == undefined || $scope.reitem.BODY == ""){
                            alert('내용을 입력하세요');
                            return;
                        }

//                        if(trim($scope.reitem.BODY) == ""){
//                            alert('내용을 입력하세요');
//                            return;
//                        }

                        if($scope.reitem.TO_ID == undefined){
                            alert('수신자를 검색해서 선택하세요');
                            return;
                        }

//                        if($scope.uid == $scope.item.FROM_ID){
//
//                            dialogs.notify('알림', '본인에게 보낼 수 없습니다.', {size: 'md'});
//                            return;
//
//                        }else{
//
//                            console.log($scope.reitem);
//                            $scope.insertItem('ange/message', 'item', $scope.reitem, true)
//                                .then(function(data){
//                                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
//                                    $modalInstance.close();
//                                })
//                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
//                        }
                        console.log($scope.reitem);
                        $scope.insertItem('ange/message', 'item', $scope.reitem, true)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    };

                    $scope.click_ok = function () {
                        //$scope.getMessageList();
                        $modalInstance.close();
                    };

                    // 받는사람과 로그인한 사람이 일치할때 확인여부 수정
                    if(item.TO_ID == $scope.uid){
                        console.log('일치');
                        $scope.viewCheckFl();
                    }else{
                        console.log('일치하지 않음');
                    }

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.list = [];
                $scope.getMessageList();
            },function(){

            });
        };


        // 등록 버튼 클릭
        $rootScope.click_regMessage = function () {
            $rootScope.openViewMessageRegModal(null, null, 'lg');
        };

        $rootScope.openViewMessageRegModal = function (content, item,  size) {
            var dlg = dialogs.create('myangemessage_edit.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', 'data', function($scope, $rootScope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));
                    $scope.content = data;

                    $scope.searchUsetList = "N";

                    $scope.selectUser = "N";

                    $scope.search = {};

                    console.log(item);
                    $scope.item = {};

//                    if(item != null){
//                        $scope.item.TO_ID = item.TO_ID;
//                        $scope.item.TO_NICK_NM = item.TO_NICK_NM;
//                    }else{
//                        $scope.item.TO_ID = "";
//                        $scope.item.TO_NICK_NM = "";
//                    }


                    $scope.click_reg = function () {

                        console.log($scope.item.BODY);
                        console.log($scope.item.TO_ID);

//                        if($scope.item.BODY == undefined){
//                            alert('내용을 입력하세요');
//                            return;
//                        }

                        //console.log(trim($scope.item.BODY));

                        if($scope.item.BODY != undefined){
                            $scope.item.BODY = $scope.item.BODY.replace(/^\s+|\s+$/g,'');
                        }

                        console.log($scope.item.BODY);

                        if($scope.item.BODY == undefined || $scope.item.BODY == ""){
                            alert('내용을 입력하세요');
                            return;
                        }

                        if($scope.item.TO_ID == undefined){
                            alert('수신자를 검색해서 선택하세요');
                            return;
                        }

                        $scope.insertItem('ange/message', 'item', $scope.item, true)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    };

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }

                    $scope.search.FILE = true;
                    // 사용자 조회 검색 클릭
                    $scope.click_searchUser = function (name) { //item

                        if(name == null || name == ''){
                            $scope.searchUsetList = "N";
                            dialogs.notify('알림', '닉네임을 입력하세요.', {size: 'md'});
                            return;
                        }else{
                            //var search = '';
                            //search = name;
//                            $modalInstance.close();
//                            $rootScope.openViewMessageSearchModal(search, 'lg'); //{TO_ID : item.TO_ID, TO_NM : item.TO_NM}

                            var stringByteLength = name.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
                            console.log(stringByteLength + " Bytes");


                            if(stringByteLength < 4){
                                dialogs.notify('알림', '한글은 2자 이상, 영문은 4자 이상으로 입력해주세요.', {size: 'md'});
                                return;
                            }else{
                                $scope.search.NICK_NM = name;
                                $scope.searchUserList();
                            }

                        }

                    };

                    $scope.user_pageChanged = function(){
                        console.log('User Page changed to: ' + $scope.USER_PAGE_NO);
                        $scope.searchUserList();
                    }

                    $scope.USER_PAGE_NO = 1;
                    $scope.USER_PAGE_SIZE = 15;
                    $scope.USER_TOTAL_COUNT = 0;



                    // 사용자 리스트
                    $scope.searchUserList = function () {
                        $scope.getList('ange/message', 'searchuserlist', {NO: $scope.USER_PAGE_NO - 1, SIZE: $scope.USER_PAGE_SIZE}, $scope.search, true)
                            .then(function(data){
                                var total_cnt = data[0].TOTAL_COUNT;
                                $scope.USER_TOTAL_COUNT = total_cnt;

                                for (var i in data) {
                                    if (data[i].FILE != null ) {

                                        data[i].profileImg = CONSTANT.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
                                        data[i].FILE_YN = data[i].FILE.FILE_ID;
                                        console.log(data[i].FILE_YN);
                                    }
                                }

                                /*$scope.total(total_cnt);*/
                                $scope.list = data;

                                $scope.searchUsetList = "Y";

                            })
                            ['catch'](function(error){$scope.USER_TOTAL_COUNT = 0; $scope.searchUsetList = "Y";  $scope.list = "";});
                    };

                    // 사용자 선택
                    $scope.select_user = function (to_id, to_nm, file_yn, img){

                        if(to_id == $scope.uid){
                            dialogs.notify('알림', '본인에게 보낼 수 없습니다.', {size: 'md'});
                            return;
                        }else{
//                            $modalInstance.close();
//                            $rootScope.openViewMessageRegModal(null, {TO_ID : to_id, TO_NICK_NM: to_nm} ,'lg');
                            $scope.selectUser = "Y";

                            $scope.item.TO_ID = to_id;
                            $scope.item.TO_NM = to_nm;
                            $scope.item.FILE_YN = file_yn;
                            $scope.item.profileImg = img;

                            $scope.searchUsetList = "N";
                            console.log($scope.item.TO_ID);
                            console.log($scope.item.TO_NM);
                        }
                    }


                }], content, item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.list = [];
                $scope.getMessageList();
            },function(){

            });
        };

        $rootScope.openViewMessageSearchModal = function (item, size) {
            var dlg = dialogs.create('myangemessage_search.html',
                ['$scope','$rootScope','$modalInstance', '$controller', 'data', function($scope, $rootScope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));
                    $scope.item = {};

                    $scope.PAGE_NO = 1;
                    $scope.PAGE_SIZE = 10;
                    $scope.TOTAL_COUNT = 0;

                    $scope.search = {};

                    //console.log(item);
                    if(item != null){
                        $scope.search.NICK_NM = item;
                    }

                    $scope.searchUserList = function () {
                        $scope.getList('ange/message', 'searchuserlist', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                            .then(function(data){
                                var total_cnt = data[0].TOTAL_COUNT;
                                $scope.TOTAL_COUNT = total_cnt;

                                /*$scope.total(total_cnt);*/
                                $scope.list = data;

                            })
                            ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
                    };

                    // 팝업에서 검색
                    $scope.popupsearchList = function (){
                        $scope.search.NICK_NM = '';
                        $scope.searchUserList();
                    }

                    $scope.pageChanged = function() {
                        console.log('Page changed to: ' + $scope.PAGE_NO);
                        $scope.searchUserList();
                    };

                    // 사용자 선택
                    $scope.select_user = function (to_id, to_nm){

                        if(to_id == $scope.uid){
                            dialogs.notify('알림', '본인에게 보낼 수 없습니다.', {size: 'md'});
                            return;
                        }else{
                            $modalInstance.close();
                            $rootScope.openViewMessageRegModal(null, {TO_ID : to_id, TO_NICK_NM: to_nm} ,'lg');
                        }
                    }

                    $scope.searchUserList();

                    $scope.click_close = function(){
                        $modalInstance.close();
                    }

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
            },function(){

            });
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMessageList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('myangemileage', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT) {


        $scope.search = {};

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;


        var year = [];
        //var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        //var month = [];

        for (var i = nowYear; i >= 2010; i--) {
            year.push(i+'');
        }

        $scope.search_year = year;

        var date = new Date();

        var month = [];

        var thisyear = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var lastdd = new Date(thisyear, mm ,0);
        var lastday = lastdd.getDate();

        for (var i = 1; i <= 12; i++) {

            if(i < 10){
                i = '0'+i;
            }
            month.push(i+'');
        }

        $scope.month = month;

        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        $scope.init = function(){

            $scope.community = "마일리지";

            $scope.search.YEAR = nowYear + '';
            $scope.search.REG_UID = $rootScope.uid;
            $scope.search.STATUS = true;

            $scope.getList('ange/mileage', 'mymileagepoint', {NO: $scope.PAGE_NO- 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    if(data[0].SUM_POINT == null){
                        $scope.SUM_POINT = 0;
                    }else{
                        var sum_point = data[0].SUM_POINT;
                        $scope.SUM_POINT = sum_point;
                    }

                    if(data[0].USE_POINT == null){
                        $scope.USE_POINT = 0;
                    }else{
                        var use_point = data[0].USE_POINT;
                        $scope.USE_POINT = use_point;
                    }

                    if(data[0].REMAIN_POINT == null){
                        $scope.REMAIN_POINT = 0;
                    }else{
                        var remain_point = data[0].REMAIN_POINT;
                        $scope.REMAIN_POINT = remain_point;
                    }

                })
                ['catch'](function(error){$scope.SUM_POINT = 0; $scope.USE_POINT = 0; $scope.REMAIN_POINT = 0;});
        }

        $scope.isLoding = false;

        // 일반 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.BOARD_GB = 'BOARD';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC'

            $scope.isLoding = true;
            $scope.getList('ange/mileage', 'list', {NO: $scope.PAGE_NO- 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    var point = data[0].POINT;
                    $scope.POINT = point;

                    var total_point = data[0].TOTAL_POINT;
                    $scope.TOTAL_POINT = total_point;
                    console.log('$scope.TOTAL_POINT = '+$scope.TOTAL_POINT);

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.isLoding = false;
                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);
                })
                ['catch'](function(error){
                $scope.TOTAL_COUNT = 0;
                $scope.list = "";
                $scope.TOTAL_POINT = 0;
                $scope.isLoding = false;
            });
        };

        // 연도 선택
        $scope.change_year = function(year){

            $scope.search.YEAR = year;
            $scope.getPeopleBoardList();
        }

        // 월 선택
        $scope.change_month = function(month){

            $scope.search.MONTH = month;

            $scope.getPeopleBoardList();
//            $scope.getPeopleReplyList();
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('myangeorderlist', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.returnPayment = function (ret, val) {
//            $scope.frameName = 'pay';
            $scope.frameUrl = 'about:blank';

            if (ret) {
                alert(ret);
//                $scope.cancelOrder();
            }
        }

        $scope.selectIdx = 0;

        $scope.search = {};

        // 페이징(마일리지 & 경매소)
        $scope.MILEAGE_PAGE_NO = 1;
        $scope.MILEAGE_PAGE_SIZE = 5;
        $scope.MILEAGE_TOTAL_COUNT = 0;

        // 페이징(커머스)
        $scope.CUMMERCE_PAGE_NO = 1;
        $scope.CUMMERCE_PAGE_SIZE = 5;
        $scope.CUMMERCE_TOTAL_COUNT = 0;

        // 네이밍
        $scope.NAMING_PAGE_NO = 1;
        $scope.NAMING_PAGE_SIZE = 5;
        $scope.NAMING_TOTAL_COUNT = 0;

        $scope.search = {};

        $scope.item = {};

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "작성자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        // 제이쿼리
        $(function () {
            //$("#start_dt").datepicker();
            //$("#start_dt").datepicker({ dateFormat: 'yy-mm-dd' });
        });

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            $scope.community = '주문/구매 현황';

        };

        /********** 화면 초기화 **********/
            //$scope.init();

            // 게시판 목록 조회
        $scope.getMileageList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC';
            $scope.search.FILE = true;

            $scope.search.ORDER_GB = 'MILEAGE';

            $scope.getList('ange/order', 'list', {NO: $scope.MILEAGE_PAGE_NO-1, SIZE: $scope.MILEAGE_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.MILEAGE_TOTAL_COUNT = search_total_cnt;

                    //alert('$scope.MILEAGE_TOTAL_COUNT = '+$scope.MILEAGE_TOTAL_COUNT);

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }

                    $scope.mileagelist = data;
                })
                ['catch'](function(error){$scope.mileagelist = ""; $scope.MILEAGE_TOTAL_COUNT = 0});
        };

        // 게시판 목록 조회
        $scope.getCummerceList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC';
            $scope.search.FILE = true;

            $scope.search.ORDER_GB = 'CUMMERCE';

            $scope.getList('ange/order', 'list', {NO: $scope.CUMMERCE_PAGE_NO-1, SIZE: $scope.CUMMERCE_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.CUMMERCE_TOTAL_COUNT = search_total_cnt;

                    //alert('$scope.CUMMERCE_TOTAL_COUNT = '+$scope.CUMMERCE_TOTAL_COUNT);

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }

                    $scope.cummercelist = data;
                })
                ['catch'](function(error){$scope.cummercelist = ""; $scope.CUMMERCE_TOTAL_COUNT = 0});
        };

        // 게시판 목록 조회
        $scope.getNamingList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC';
            $scope.search.FILE = true;

            $scope.search.ORDER_GB = 'NAMING';

            $scope.getList('ange/order', 'list', {NO: $scope.NAMING_PAGE_NO-1, SIZE: $scope.NAMING_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.NAMING_TOTAL_COUNT = search_total_cnt;

                    //alert('$scope.NAMING_TOTAL_COUNT = '+$scope.NAMING_TOTAL_COUNT);

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }

                    $scope.naminglist = data;
                })
                ['catch'](function(error){$scope.naminglist = ""; $scope.NAMING_TOTAL_COUNT = 0});
        };

        // 조회 화면 이동(마일리지 & 경매소)
        $scope.click_showStoreView = function (product_gb, key) {

            if(product_gb == 'MILEAGE'){
                $location.url('/store/mileagemall/view/'+key);
            }else if(product_gb == 'AUCTION'){
                $location.url('/store/auction/view/'+key);
            }else if(product_gb == 'CUMMERCE'){
                $location.url('/store/cummerce/view/'+key);
            }
        };

        // 네이밍 상세 화면 이동
        $scope.click_showNamingView = function (key){
            $location.url('/store/naming/request/'+key);
        }

        // 상태변경
        $scope.click_counsel = function (item){
            $scope.openCounselModal(item, 'lg');
        }

        $scope.openCounselModal = function (item, size){

            var dlg = dialogs.create('order_counsel.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller,data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = item;
                    $scope.search = {};

                    $scope.showDetails = false;

                    // 파일 업로드 설정
                    $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

                    // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
                    $scope.addEditor = false;
                    $scope.checkAll = false;

                    $scope.click_selectMainImage = function (file) {

                        angular.forEach($scope.queue, function(file) {
                            file.kind = '';
                        });

                        if (file.kind == 'MAIN') {
                            file.kind = '';
                        } else {
                            file.kind = 'MAIN';
                        }
                    };

                    $scope.click_checkAllToggle = function () {
                        $scope.checkAll = !$scope.checkAll;

                        if ($scope.checkAll) {
                            $scope.item.queue = angular.copy($scope.queue);
                        } else {
//                angular.forEach($scope.select, function(file) {
//                    $scope.select.pop();
//                });
                            $scope.item.queue = [];
//                $scope.item.queue.splice(0, $scope.item.queue.length);
                        }
//            console.log(JSON.stringify($scope.item.queue))
                    };

                    var state;
                    $scope.click_checkFileDestroy = function () {
                        angular.forEach($scope.item.queue, function(file) {
                            state = 'pending';
                            return $http({
                                url: file.deleteUrl,
                                method: file.deleteType
                            }).then(
                                function () {
                                    $scope.item.queue.splice($scope.checkFile.indexOf(file), 1);

                                    state = 'resolved';
                                    $scope.clear(file);
                                },
                                function () {
                                    state = 'rejected';
                                }
                            );
                        });
                    };

                    $scope.click_checkFileEditor = function () {
                        angular.forEach($scope.item.queue, function(file) {
                            if (!angular.isUndefined(CKEDITOR)) {
                                var element = CKEDITOR.dom.element.createFromHtml( '<img alt="" src="'+file.url+'" />' );
                                CKEDITOR.instances.editor1.insertElement( element );
                            }
                        });
                    };

                    /********** 초기화 **********/
                        // 첨부파일 초기화
                    $scope.queue = [];

                    $(document).ready(function() {

                        /*// radio change 이벤트
                         $("input[name='counsel']").change(function() {

                         var radioValue = $(this).val();

                         console.log('radioValue = '+radioValue);


                         });*/
                        $("#product_notice").hide();

                    });

                    $scope.productnoList = function(){
                        $scope.getList('ange/order', 'productnolist', {}, {}, true)
                            .then(function(data){
                                $scope.productnolist = data;

                                var idx = 0;
                                for(var i =0; i<$scope.productnolist.length; i++){

                                    if(JSON.stringify(item.PRODUCT_CODE) == JSON.stringify($scope.productnolist[i].PRODUCT_CODE)){
                                        idx = i;
                                    }
                                }
                                item.PRODUCT_CODE = $scope.productnolist[idx];

                                $scope.searchProductNm(item.PRODUCT_CODE);


                            })
                            ['catch'](function(error){$scope.productnolist = "";});
                    }


                    $scope.searchProductNm = function(productno){

                        $scope.search.PRODUCT_CODE = productno;
                        $scope.getList('ange/order', 'productnmlist', {}, $scope.search, true)
                            .then(function(data){
                                $scope.productnmlist = data;

                                var idx = 0;
                                for(var i =0; i<$scope.productnmlist.length; i++){

                                    if(JSON.stringify(item.PRODUCT_NO) == JSON.stringify($scope.productnmlist[i].PRODUCT_NO)){
                                        idx = i;
                                    }
                                }

                                console.log($scope.productnmlist[idx].PRODUCT_NO);

                                $scope.item.PRODUCT = $scope.productnmlist[idx];

                            })
                            ['catch'](function(error){$scope.productnmlist = "";});
                    }

                    $scope.namingnoList = function(){
                        $scope.getList('ange/order', 'namingnoList', {}, {}, true)
                            .then(function(data){
                                $scope.namingnolist = data;
                            })
                            ['catch'](function(error){$scope.namingnolist = "";});
                    }

                    $scope.radio_change = function (value){
                        if (value == "9" || value == "10" || value == "11" || value == "12" || value == "13") {
                            $("#product_info").hide();
                            $("#product_change").hide();
                            $("#product_notice").hide();
                            $(".product_note").show();
                        } else if (value == "1" || value == "2" || value == "3" || value == "4" || value == "6" || value == "8") {
                            $("#product_info").show();
                            $("#product_change").hide();
                            $("#product_notice").hide();
                            $(".product_note").show();
                        } else if (value == "7") {
                            $("#product_info").show();
                            $("#product_change").show();
                            $(".product_note").hide();
                            $("#product_notice").show();
                        }
                    }

                    $scope.item.FILES = $scope.queue;

                    $scope.click_savecounsel = function (){

                        for(var i in $scope.item.FILES) {
                            $scope.item.FILES[i].$destroy = '';
                            $scope.item.FILES[i].$editor = '';
//                $scope.item.FILES[i].$submit();
                        }

                        console.log($scope.item);

                        if($scope.item.ORDER_GB == 'NAMING'){
                            $scope.insertItem('ange/counsel', 'item', $scope.item, false)
                                .then(function(){
                                    alert('해당 상품 신청화면으로 이동합니다');
                                    $modalInstance.close();
                                    $location.url('/store/naming/request/'+$scope.item.CHANGE_PRODUCT.NO);

                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            $scope.insertItem('ange/counsel', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '신청이 완료되었습니다. 나의 변경신청에서 확인하실 수 있습니다', {size: 'md'});
                                    $modalInstance.close();
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                    $scope.productnoList();
                    $scope.namingnoList();

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
        }

        // 주문취소
        $scope.click_cancel = function (item){
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            var dialog = dialogs.confirm('알림', '주문취소를 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.item= item;
                $scope.item.ORDER_ST = 5;
                $scope.item.PRICE = item.SUM_PRICE;

                if ($scope.item.ORDER_GB == 'MILEAGE') {
                    $scope.cancelOrder();
                } else if ($scope.item.ORDER_GB == 'CUMMERCE') {
                    $scope.frameName = 'pay';
                    $scope.frameUrl = '/easypay70_plugin_php_window/web/normal/mgr.php?mgr_txtype=40&org_cno='+$scope.item.ORDER_NO+'&req_id='+$rootScope.uid;
                }

            }, function(btn) {
                return;
            });
        }

        // 주문 취소 등록
        $scope.cancelOrder = function(item) {
            $scope.updateItem('ange/order', 'item', $scope.item.NO, $scope.item, false)
                .then(function(data){
                    $rootScope.mileage = data.mileage;
                    dialogs.notify('알림', '주문취소 되었습니다.', {size: 'md'});

                    //$scope.getPeopleBoardList();

                    $scope.getMileageList();
                    $scope.getCummerceList();
                    $scope.getNamingList();

                    //$rootScope.mileage = data.mileage;
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.pageMileageChanged = function() {
            console.log('Page changed to: ' + $scope.MILEAGE_PAGE_NO);
            $scope.getMileageList();
        };

        $scope.pageCummerceChanged = function() {
            console.log('Page changed to: ' + $scope.PHOTO_PAGE_NO);
            $scope.getCummerceList();
        };

        $scope.pageNamingChanged = function() {
            console.log('Page changed to: ' + $scope.CLINIC_PAGE_NO);
            $scope.getNamingList();
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMileageList)
            .then($scope.getCummerceList)
            .then($scope.getNamingList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('myangeorderstatus', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.selectIdx = 0;

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        $scope.search = {};

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "등록자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            $scope.community = '상태변경신청 내역';
        };


        // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/board/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
            //$scope.init();

            // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC';
            $scope.search.FILE = true;

            $scope.getList('ange/counsel', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }

                    $scope.list = data;
                })
                ['catch'](function(error){$scope.list = ""; $scope.SEARCH_TOTAL_COUNT = 0});
        };

        // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (key) {

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 상태변경
        $scope.click_counsel_view = function (key){
            $scope.openCounselModal(key, 'lg');
        }

        $scope.openCounselModal = function (item, size){

            var dlg = dialogs.create('order_counsel_view.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.search = {};

                    $scope.radio_change = function (value){
                        if (value == "9" || value == "10" || value == "11" || value == "12" || value == "13") {
                            $("#product_info").hide();
                            $("#product_change").hide();
                            $("#product_notice").hide();
                            $(".product_note").show();
                        } else if (value == "1" || value == "2" || value == "3" || value == "4" || value == "6" || value == "8") {
                            $("#product_info").show();
                            $("#product_change").hide();
                            $("#product_notice").hide();
                            $(".product_note").show();
                        } else if (value == "7") {
                            $("#product_info").show();
                            $("#product_change").show();
                            $(".product_note").hide();
                            $("#product_notice").show();
                        }
                    }

                    console.log(item);

                    $scope.getItem('ange/counsel', 'item', item.NO, {}, false)
                        .then(function(data){
                            $scope.item = data;

                            $("input:radio[name='counsel']:radio[value='"+data.COUNSEL_ST+"']").attr("checked",true);
                            $scope.radio_change(data.COUNSEL_ST);
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    // 상품코드 selectbox
                    $scope.productnoList = function(){
                        $scope.getList('ange/order', 'productnolist', {}, {}, true)
                            .then(function(data){
                                $scope.productnolist = data;

                                var idx = 0;
                                for(var i =0; i<$scope.productnolist.length; i++){
                                    if(JSON.stringify(item.PRODUCT_CODE) == JSON.stringify($scope.productnolist[i].PRODUCT_CODE)){
                                        idx = i;
                                    }
                                }

                                $scope.item.PRODUCT_CODE = $scope.productnolist[idx];

                                // 상품명 조회
                                $scope.searchProductNm($scope.item.PRODUCT_CODE);


                            })
                            ['catch'](function(error){$scope.productnolist = "";});
                    }

                    // 상품명 selectbox
                    $scope.searchProductNm = function(productno){

                        $scope.search.PRODUCT_CODE = productno;

                        $scope.getList('ange/order', 'productnmlist', {}, $scope.search, true)
                            .then(function(data){
                                $scope.productnmlist = data;

                                var idx = 0;
                                for(var i =0; i<$scope.productnmlist.length; i++){

                                    if(JSON.stringify(item.PRODUCT_NO) == JSON.stringify($scope.productnmlist[i].PRODUCT_NO)){
                                        idx = i;
                                    }
                                }

                                $scope.item.PRODUCT = $scope.productnmlist[idx];
                            })
                            ['catch'](function(error){$scope.productnmlist = "";});
                    }

                    $scope.namingnoList = function(){
                        $scope.getList('ange/order', 'namingnoList', {}, {}, true)
                            .then(function(data){
                                $scope.namingnolist = data;

                                var idx = 0;
                                for(var i =0; i<$scope.namingnolist.length; i++){
                                    if(JSON.stringify(item.CHANGE_PRODUCT) == JSON.stringify($scope.namingnolist[i].NO)){
                                        idx = i;
                                    }
                                }

                                $scope.item.CHANGE_PRODUCT = $scope.namingnolist[idx];
                            })
                            ['catch'](function(error){$scope.namingnolist = "";});
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                    $scope.productnoList();
                    $scope.namingnoList();

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
        }

        $scope.init();
        $scope.getPeopleBoardList();

    }]);

    controllers.controller('myangepostcard', ['$rootScope', '$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD','CONSTANT', function ($rootScope, $scope, $stateParams, $location, dialogs, UPLOAD,CONSTANT) {

        $scope.search = {};

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;

        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getCompList();
        };

        // 초기화
        $scope.init = function(session) {
            $scope.community = "이벤트/응모 신청내역";
        };

        $scope.getCompList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.USER_ID = $rootScope.uid;
            $scope.getList('ange/comp', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCompList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('myangescrap', ['$scope', '$stateParams', '$sce', '$rootScope', '$location', '$modal', '$timeout', 'dialogs', 'UPLOAD', function($scope, $stateParams, $sce, $rootScope, $location, $modal, $timeout, dialogs, UPLOAD) {

        $scope.search = {};
        // 초기화
        $scope.init = function() {
            $scope.community = "스크랩";
        };

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 25;
        $scope.TOTAL_COUNT = 0;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getScarpList();
        };

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "등록자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        /********** 이벤트 **********/
        $scope.getScarpList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.getList('com/scrap', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 검색
        $scope.click_searchScrap = function(){
            $scope.getScarpList();
        }

        // 상세조회 버튼 클릭
        $scope.click_showViewScrap = function (comm_no, key) {
            //$scope.openViewScrapModal({NO : key}, 'lg');

            console.log(comm_no);
            console.log(key);

            if (comm_no == 1) {
                $location.url('/people/angeroom/view/'+key);
            } else if(comm_no == 2) {
                $location.url('/people/momstalk/view/'+key);
            } else if(comm_no == 3) {
                $location.url('/people/babycare/view/'+key);
            } else if(comm_no == 4) {
                $location.url('/people/firstbirthtalk/view/'+key);
            } else if(comm_no == 5) {
                $location.url('/people/booktalk/view/'+key);
            } else if(comm_no == 6) {
                $location.url('/people/working/view/'+key);
            } else if(comm_no == 7) {
                $location.url('/people/readypreg/view/'+key);
            } else if(comm_no == 8) {
                $location.url('/people/anony/view/'+key);
            }else if(comm_no == 11) {
                $location.url('/people/angemodel/view/'+key);
            }else if(comm_no == 12) {
                $location.url('/people/recipearcade/view/'+key);
            }else if(comm_no == 13) {
                $location.url('/people/peopletaste/view/'+key);
            }else if(comm_no == 21) {
                $location.url('/people/childdevelop/view/'+key);
            }else if(comm_no == 22) {
                $location.url('/people/chlidoriental/view/'+key);
            }else if(comm_no == 23) {
                $location.url('/people/obstetrics/view/'+key);
            }else if(comm_no == 24) {
                $location.url('/people/momshealth/view/'+key);
            }else if(comm_no == 25) {
                $location.url('/people/financial/view/'+key);
            }
        };

        // 콘텐츠 클릭 조회
//        $scope.click_showViewContent = function (item) {
//            $scope.openModal(item, 'lg');
//        };

        $scope.click_showViewContent = function (item) {
            $scope.getItem('cms/task', 'item', item.TARGET_NO, {}, true)
                .then(function(data){
                    $scope.openModal(data, 'lg');
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 콘텐츠보기 모달창
        $scope.openModal = function (content, size) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/ange/story/storycontent-view-popup.html',
                controller: 'storycontent-view-popup',
                size: size,
                scope: $scope,
                resolve: {
                    data: function () {
                        return content;
                    }
                }
            });

            modalInstance.result.then(function () {
//                alert(JSON.stringify(approval))
            }, function () {
                console.log("결재 오류");
            });
        }

        // 일반게시글 삭제
        $scope.delete_board = function (item){

            var dialog = dialogs.confirm('알림', '선택한 스크랩 게시물을 삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/scrap', 'item', item, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $scope.getScarpList();
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });

        }
        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getScarpList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('myangewriting', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function() {
            $scope.community = "내 활동 조회";

            $scope.photoList = [];
        };

        $scope.search = {};

        $scope.BOARD_PAGE_NO = 1;
        $scope.BOARD_PAGE_SIZE = 5;
        $scope.BOARD_TOTAL_COUNT = 0;

        $scope.PHOTO_PAGE_NO = 1;
        $scope.PHOTO_PAGE_SIZE = 6;
        $scope.PHOTO_TOTAL_COUNT = 0;

        $scope.CLINIC_PAGE_NO = 1;
        $scope.CLINIC_PAGE_SIZE = 5;
        $scope.CLINIC_TOTAL_COUNT = 0;


        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.BOARD_PAGE_NO);
            $scope.getPeopleBoardList();
        };

        $scope.pagePhotoChanged = function() {
            console.log('Page changed to: ' + $scope.PHOTO_PAGE_NO);

            $scope.photoList = [];

            $scope.getPeoplePhotoList();

//            $scope.PHOTO_PAGE_NO = 1;
//            $scope.PHOTO_PAGE_SIZE = 6;
//            $scope.PHOTO_TOTAL_COUNT = 0;


        };

        $scope.pageClinicChanged = function() {
            console.log('Page changed to: ' + $scope.CLINIC_PAGE_NO);
            $scope.getPeopleClinicList();
        };

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "등록자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;
        $scope.init();




        // 일반 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.BOARD_GB = 'BOARD';
            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC'
            $scope.search.FILE_EXIST = true;
            $scope.search.REG_UID = $rootScope.uid;

            $scope.getList('com/webboard', 'list', {NO: $scope.BOARD_PAGE_NO- 1, SIZE: $scope.BOARD_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.BOARD_TOTAL_COUNT = total_cnt;
                    console.log('BOARD_TOTAL_COUNT = '+$scope.BOARD_TOTAL_COUNT);

                    /*$scope.total(total_cnt);*/
                    $scope.boardList = data;

                    $scope.BOARD_TOTAL_PAGES = Math.ceil($scope.BOARD_TOTAL_COUNT / $scope.BOARD_PAGE_SIZE);

                })
                ['catch'](function(error){$scope.BOARD_TOTAL_COUNT = 0; $scope.boardList = "";});
        };

        // 일반 게시판 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (comm_no, key) {

            $rootScope.COMM_NO = comm_no;

            if (comm_no == 1) {
                $location.url('/people/angeroom/view/'+key);
            } else if(comm_no == 2) {
                $location.url('/people/momstalk/view/'+key);
            } else if(comm_no == 3) {
                $location.url('/people/babycare/view/'+key);
            } else if(comm_no == 4) {
                $location.url('/people/firstbirthtalk/view/'+key);
            } else if(comm_no == 5) {
                $location.url('/people/booktalk/view/'+key);
            } else if(comm_no == 31) {
                $location.url('/people/supporter/view/'+key);
            }

//            $scope.board_item = {};
//            $scope.board_item.COMM_NO = comm_no;
//            $scope.board_item.NO = key;
//            $scope.openViewBoardModal($scope.board_item, 'lg'); //{NO : item.key}
        };

        $scope.openViewBoardModal = function (item, size) {
            var dlg = dialogs.create('myangeboard_view.html',
                ['$scope', '$modalInstance', '$controller', 'data','UPLOAD', function($scope, $modalInstance, $controller, data,UPLOAD) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.getItem('com/webboard', 'item', item.NO, {}, false)
                        .then(function(data){
                            $scope.item = data;
                            var files = data.FILES;
                            for(var i in files) {
                                $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                            }
                            //$scope.search.TARGET_NO = $stateParams.id;
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    $scope.click_ok = function () {
                        //$scope.getMessageList();
                        $modalInstance.close();
                    };

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.photoList = [];
                $scope.getPeoplePhotoList();
            },function(){

            });
        };

        // 사진 게시판 목록 조회
        $scope.getPeoplePhotoList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.BOARD_GB = 'PHOTO';
            $scope.search.FILE = true;
            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC'
            $scope.search.REG_UID = $rootScope.uid;


            $scope.getList('com/webboard', 'list', {NO: $scope.PHOTO_PAGE_NO- 1, SIZE: $scope.PHOTO_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.PHOTO_TOTAL_COUNT = search_total_cnt;

//                    for(var i in data) {
//                        if (data[i].FILE != null) {
//                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
//                            data[i].MAIN_FILE = img;
//
//                        }
//                    }
                    for(var i in data) {

//                        if (data[i].FILE != null) {
//                            var img =  UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID; //UPLOAD.BASE_URL
//                            data[i].MAIN_FILE = img;
//                        }
//                        if (data[i].FILE.PATH != undefined) {
//                            var img = UPLOAD.BASE_URL + '/storage/board/' + 'thumbnail/' + data[i].FILE.FILE_ID;
//                            data[i].TYPE = 'BOARD';
//                            data[i].FILE = img;
//                            $scope.list.push(data[i]);
//                        }
//
//                        console.log($scope.list);

                        var img = UPLOAD.BASE_URL + '/storage/board/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'BOARD';
                        data[i].FILE = img;
                        $scope.photoList.push(data[i]);

                        console.log($scope.photoList);
                    }

                    $scope.PHOTO_TOTAL_PAGES = Math.ceil($scope.PHOTO_TOTAL_COUNT / $scope.PHOTO_PAGE_SIZE);
                    /*$scope.total(total_cnt);*/
                    //$scope.photoList = data;
                })
                ['catch'](function(error){$scope.photoList = ""; $scope.PHOTO_TOTAL_COUNT = 0});
        };

        // 사진 게시판 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (comm_no, key) {

            $rootScope.COMM_NO = comm_no;

            if (comm_no == 6) {
                $location.url('/people/angemodel/view/'+key);
            } else if(comm_no ==7) {
                $location.url('/people/recipearcade/view/'+key);
            } else if(comm_no == 8) {
                $location.url('/people/peopletaste/view/'+key);
            }
//            $scope.photo_item = {};
//            $scope.photo_item.COMM_NO = comm_no;
//            $scope.photo_item.NO = key;
//            $scope.openViewPhotoModal($scope.photo_item, 'lg'); //{NO : item.key}
        };

        $scope.openViewPhotoModal = function (item, size) {
            var dlg = dialogs.create('myangephoto_view.html',
                ['$scope', '$modalInstance', '$controller', 'data','CONSTANT', function($scope, $modalInstance, $controller, data,CONSTANT) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.getItem('com/webboard', 'item', item.NO, {}, false)
                        .then(function(data){
                            var files = data.FILES;
                            //console.log(JSON.stringify(data));
                            for(var i in files) {
                                if (files[i].FILE_GB == 'MAIN') {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                                    //var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                    var img = CONSTANT.BASE_URL+ files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                    data.MAIN_FILE = img;
                                }
                            }

                            $scope.item = data;

                            $scope.item.PARENT_NO = 0;
                            $scope.item.LEVEL = 1;
                            $scope.item.REPLY_NO = 1;
                            $scope.item.TARGET_NO = $scope.item.NO;
                            $scope.item.TARGET_GB = "BOARD";
                            $scope.item.RE_COMMENT = "";
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    $scope.click_ok = function () {
                        //$scope.getMessageList();
                        $modalInstance.close();
                    };

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.photoList = [];
                $scope.getPeoplePhotoList();
            },function(){

            });
        };

        // 상담 게시판 목록 조회
        $scope.getPeopleClinicList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC'
            $scope.search.BOARD_GB = 'CLINIC';
            $scope.search.FILE_EXIST = true;
            $scope.search.REG_UID = $rootScope.uid;

            $scope.getList('com/webboard', 'list', {NO: $scope.CLINIC_PAGE_NO-1, SIZE: $scope.CLINIC_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.CLINIC_TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.clinicList = data;

                    $scope.CLINIC_TOTAL_PAGES = Math.ceil($scope.CLINIC_TOTAL_COUNT / $scope.CLINIC_PAGE_SIZE);

                })
                ['catch'](function(error){$scope.CLINIC_TOTAL_COUNT = 0; $scope.clinicList = "";});
        };

        // 상담 게시판 조회 화면 이동
        $scope.click_showViewPeopleClinic = function (comm_no, key) {

            $rootScope.COMM_NO = comm_no;

            if (comm_no == 9) {
                $location.url('/people/childdevelop/view/'+key);
            } else if(comm_no == 10) {
                $location.url('/people/chlidoriental/view/'+key);
            } else if(comm_no == 11) {
                $location.url('/people/obstetrics/view/'+key);
            } else if(comm_no == 12) {
                $location.url('/people/momshealth/view/'+key);
            } else if(comm_no == 13) {
                $location.url('/people/financial/view/'+key);
            }
//            $scope.clinic_item = {};
//            $scope.clinic_item.COMM_NO = comm_no;
//            $scope.clinic_item.NO = key;
//            $scope.openViewClinicModal($scope.clinic_item, 'lg'); //{NO : item.key}
        };

        $scope.openViewClinicModal = function (item, size) {
            var dlg = dialogs.create('myangeclinic_view.html',
                ['$scope', '$modalInstance', '$controller', 'data','CONSTANT', function($scope, $modalInstance, $controller, data,CONSTANT) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.reply = {};

                    $scope.getItem('com/webboard', 'item', item.NO, {}, false)
                        .then(function(data){
                            $scope.item = data;

                            var files = data.FILES;
                            for(var i in files) {
                                $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":CONSTANT.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":CONSTANT.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":CONSTANT.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                            }


                            if(data.BOARD_ST == 'D'){
                                if(data.REPLY_YN == 'N'){
                                    $scope.item.BODY = "작성자가 삭제한 글 입니다";
                                } else {
                                    $scope.item.BODY = "작성자가 삭제한 글 입니다"+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                                }
                            }else{
                                if(data.BLIND_FL == 'N'){
                                    if(data.REPLY_YN == 'N'){
                                        $scope.item.BODY;
                                    } else {
                                        $scope.item.BODY = data.BODY+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                                    }
                                }else{
                                    if(data.REPLY_YN == 'N'){
                                        $scope.item.BODY = "관리자에 의해 블라인드 처리가 된 글입니다";
                                    } else {
                                        $scope.item.BODY = "관리자에 의해 블라인드 처리가 된 글입니다"+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                                    }
                                }
                            }

                            $scope.reply.SUBJECT = "[답변]"+$scope.item.SUBJECT;
                            $scope.reply.PARENT_NO = $scope.item.NO;
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    $scope.click_ok = function () {
                        //$scope.getMessageList();
                        $modalInstance.close();
                    };

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.photoList = [];
                $scope.getPeoplePhotoList();
            },function(){

            });
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            .then($scope.getPeoplePhotoList)
            .then($scope.getPeopleClinicList)
            ['catch']($scope.reportProblems);
    }]);
});
