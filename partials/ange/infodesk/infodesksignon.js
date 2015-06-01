/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-06
 * Description : infodesksignon.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('infodesksignon', ['$rootScope', '$scope', '$window', '$location', '$timeout', 'dialogs', 'UPLOAD', function ($rootScope, $scope, $window, $location, $timeout, dialogs, UPLOAD) {

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

        $scope.isSave = false;
        $scope.isUpload = false;

        $scope.checkSave = false;
        $scope.checkCert = false;

        // 진행 단계
        $scope.step = '01';

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

            $scope.user = {USER_ID: '', USER_NM: '', NICK_NM: '', PASSWORD: '', LUNAR_FL: '0', BIRTH: '', ZIP_CODE: '', ADDR: '', ADDR_DETAIL: '', PHONE_1: '', PHONE_2: '', USER_GB: 'MEMBER', USER_ST: '', EMAIL: '', SEX_GB: 'F',
                INTRO: '', NOTE: '', MARRIED_FL: 'Y', PREGNENT_FL: 'N', EN_ANGE_EMAIL_FL: true, EN_ANGE_SMS_FL: true, EN_ALARM_EMAIL_FL: true, EN_ALARM_SMS_FL: true, EN_STORE_EMAIL_FL: true, EN_STORE_SMS_FL: true, CERT_GB: 'PHONE'}
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

            $scope.blog = {BLOG_GB: '', BLOG_URL: ''};
            $scope.blog.BLOG_GB = 'NAVER';
        };

        /********** 이벤트 **********/
        // 우편번호 검색
        $scope.click_openDaumPostcode = function () {

            new daum.Postcode({
                oncomplete: function(data) {
                    var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');

                    // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                    // 우편번호와 주소 정보를 해당 필드에 넣고, 커서를 상세주소 필드로 이동한다.
                    $scope.user.POST_1 = document.getElementById('post_1').value = data.postcode1;
                    $scope.user.POST_2 = document.getElementById('post_2').value = data.postcode2;
                    $scope.user.ADDR = document.getElementById('addr').value = addr;
//                        $scope.user.ADDR = document.getElementById('addr').value = data.address;

                    //전체 주소에서 연결 번지 및 ()로 묶여 있는 부가정보를 제거하고자 할 경우,
                    //아래와 같은 정규식을 사용해도 된다. 정규식은 개발자의 목적에 맞게 수정해서 사용 가능하다.
                    //var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');
                    //document.getElementById('addr').value = addr;

                    document.getElementById('addr_detail').focus();
                }
            }).open();
        };

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

//                console.log($scope.user.USER_ID)
//                console.log(check.test($scope.user.USER_ID))

                if ($scope.user.USER_ID.length < 13 && !check.test($scope.user.USER_ID)) {
                    $scope.click_checkUserId();
                } else {
                    $scope.availableID = false;
                }
            } else {
                $scope.checkID = false;
                $scope.availableID = false;
            }
        });

        $scope.$watch('user.PASSWORD', function() {
            if ($scope.user.PASSWORD != undefined && $scope.user.PASSWORD.length > 5) {
                $scope.checkPW = true;

                $scope.user.PASSWORD = $scope.user.PASSWORD.replace( /(\s*)/g, '');

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

        $scope.$watch('user.NICK_NM', function() {
            $scope.user.NICK_NM = $scope.user.NICK_NM.replace( /(\s*)/g, '');
//            console.log('NICK : '+$scope.user.NICK_NM);
            if ($scope.user.NICK_NM != undefined && $scope.user.NICK_NM.length > 1) {
                var addLen = (escape($scope.user.NICK_NM)+"%u").match(/%u/g).length-1;
                var totalLen = $scope.user.NICK_NM.length + addLen;

//                console.log($scope.user.NICK_NM.length + addLen);

                if (totalLen > 3 && totalLen < 13) {
//                    console.log("check");
                    $scope.click_checkUserNick();
                } else {
                    $scope.availableNick = false;
                }
            } else {
                $scope.checkNick = false;
            }
        });

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

            $scope.getItem('com/user', 'check', $scope.user.USER_ID, {}, false)
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
        $scope.checkValidation = function () {

            if ($scope.user.USER_ID == '' || !$scope.availableID) {
                $('#user_id').focus();
                dialogs.notify('알림', '아이디를 확인해주세요.', {size: 'md'});
                return;
            }

            if ($scope.user.PASSWORD == '' || !$scope.availablePW) {
                $('#password').focus();
                dialogs.notify('알림', '패스워드를 확인해주세요.', {size: 'md'});
                return false;
            }

            if ($scope.user.USER_NM == '') {
                $('#user_nm').focus();
                dialogs.notify('알림', '이름을 확인해주세요.', {size: 'md'});
                return false;
            } else if ($scope.user.USER_NM.length < 2) {
                $('#user_nm').focus();
                dialogs.notify('알림', '이름을 2자리 이상 입력해주세요.', {size: 'md'});
                return false;
            }

            if ($scope.user.NICK_NM == '' || !$scope.availableNick) {
                $('#nick_nm').focus();
                dialogs.notify('알림', '닉네임을 확인해주세요.', {size: 'md'});
                return false;
            }

            if ($scope.user.YEAR == '' || $scope.user.MONTH == '' || $scope.user.DAY == '') {
                $('#birth').focus();
                dialogs.notify('알림', '생년월일을 확인해주세요.', {size: 'md'});
                return false;
            } else {
                $scope.user.BIRTH = $scope.user.YEAR + ($scope.user.MONTH.length == 1 ? '0' + $scope.user.MONTH : $scope.user.MONTH) + ($scope.user.DAY.length == 1 ? '0' + $scope.user.DAY : $scope.user.DAY);
            }

            if ($scope.user.SEX_GB == '') {
                $('#sex_gb').focus();
                dialogs.notify('알림', '성별을 확인해주세요.', {size: 'md'});
                return false;
            }

            if ($scope.user.PHONE_1_1 != '' && $scope.user.PHONE_1_2 != '' && $scope.user.PHONE_1_3 != '') {
                $scope.user.PHONE_1 = $scope.user.PHONE_1_1 + $scope.user.PHONE_1_2 + $scope.user.PHONE_1_3;
            }

            if ($scope.user.POST_1 == '' || $scope.user.POST_2 == '') {
                $('#post_1').focus();
                dialogs.notify('알림', '주소를 확인해주세요.', {size: 'md'});
                return false;
            } else {
                $scope.user.ZIP_CODE = $scope.user.POST_1 + $scope.user.POST_2;
            }

            if ($scope.user.PHONE_2_1 == '' || $scope.user.PHONE_2_2 == '' || $scope.user.PHONE_2_3 == '') {
                $('#phone_2').focus();
                dialogs.notify('알림', '휴대폰을 확인해주세요.', {size: 'md'});
                return false;
            } else {
                $scope.user.PHONE_2 = $scope.user.PHONE_2_1 + $scope.user.PHONE_2_2 + $scope.user.PHONE_2_3;
            }

            if ($scope.user.EMAIL_ID == '' || $scope.user.EMAIL_TYPE == '') {
                $('#email').focus();
                dialogs.notify('알림', '이메일을 확인해주세요.', {size: 'md'});
                return false;
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

            return true;
        };


        // 사용자 정보 저장
        $scope.saveUser = function () {

            if (!$scope.checkValidation()) {
                return;
            }

            if ($scope.user.CERT_GB == 'PHONE' && !$scope.checkCert) {
                dialogs.notify('알림', '인증을 해주세요.', {size: 'md'});
                return;
            }

            $scope.user.SYSTEM_GB = 'ANGE';
            $scope.user.USER_GB = 'MEMBER';
            $scope.user.BABY = $scope.babies;
            $scope.user.BLOG = $scope.blog;

            if ($scope.file && $scope.isUpload) {
                $scope.user.FILE = $scope.file;
                $scope.user.FILE.$destroy = '';
                $scope.isUpload = false;
            }

            if (!$scope.isSave) {
                $scope.isSave = true;
                if (!$scope.checkSave) {
                    $scope.insertItem('com/user', 'item', $scope.user, false)
                        .then(function(){
                            $scope.addMileageSignon('CONGRATULATION', '1', $scope.user);
                            $scope.addMileageSignon('CONGRATULATION', '2', $scope.user);

                            $scope.checkSave = true;
                            $scope.isSave = false;
                            $scope.user.FILE = {};
                            if ($scope.user.CERT_GB == 'PHONE' && $scope.checkCert) {
                                $scope.step = '04';
                                $scope.finishUser();
                            } else {
                                $scope.step = '03';
                            }
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                } else {
                    $scope.updateItem('com/user', 'item', $scope.user.USER_ID, $scope.user, false)
                        .then(function(){
                            $scope.isSave = false;
                            $scope.user.FILE = {};

                            if ($scope.user.CERT_GB == 'PHONE' && $scope.checkCert) {
                                $scope.step = '04';
                                $scope.finishUser();
                            } else {
                                $scope.step = '03';
                            }
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                }
            }
        };

        // 사용자 인증
        $scope.click_certUser = function (cert) {
            if (cert == 'mail') {
                $scope.insertItem('com/user', 'mail', $scope.user, false)
                    .then(function(){ dialogs.notify('알림', '인증메일이 재전송되었습니다.', {size: 'md'});})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                if (!$scope.checkValidation()) {
                    return;
                }

                $scope.user.CERT_NO = Math.floor(Math.random() * (999999 - 100000) + 100000);

                $scope.insertItem('com/sms', 'item', $scope.user, false)
                    .then(function(){ $scope.isSMS = true; dialogs.notify('알림', '인증번호가 전송되었습니다.', {size: 'md'});})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 인증번호 확인
        $scope.click_checkCertNo = function () {
            if ($scope.user.CERT_NO == $scope.user.CERT_NO_CP) {
                dialogs.notify('알림', '인증 되었습니다.', {size: 'md'});
                $scope.checkCert = true;
                $scope.isSMS = false;
            } else {
                dialogs.error('오류', '인증번호가 일치하지 않습니다.', {size: 'md'});
            }
        };

        // 다음 버튼 클릭 시 등록하는 영역으로 focus 이동
        $scope.click_focus = function (id) {
            $('html,body').animate({scrollTop:$('#'+id).offset().top}, 100);
            $('#'+id).focus();
        }

        // 가입 완료
        $scope.finishUser = function () {
            if ($scope.checkCert) {
                $scope.insertItem('com/mail', 'congratulation', $scope.user, false)
                    .then(function(data){})
                    ['catch'](function(error){});
            }
        };

        // 이전 단계 클릭
        $scope.click_prevStep = function () {
            if ($scope.step == '02') {
                $scope.step = '01'
            } else if ($scope.step == '03') {
                $scope.step = '02'
                $timeout(function() { $scope.click_focus('user_id')}, 100);
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
                $timeout(function() { $scope.click_focus('user_id')}, 100);
            } else if ($scope.step == '02') {
                $scope.saveUser();
                $scope.finishUser();
//                if (!$scope.checkSave) {
//                    dialogs.notify('알림', '입력 정보를 다시 확인해 주세요.', {size: 'md'});
//                    return;
//                }
//
//                $scope.step = '03';
            } else if ($scope.step == '03') {
                if (!$scope.checkCert) {
                    $scope.getItem('com/user', 'cert', $scope.user.USER_ID, {}, false)
                        .then(function(data) {
                            if (data.CERT_GB != null && data.CERT_GB != '') {
                                $scope.step = '04';
                            } else {
                                dialogs.notify('알림', '회원 인증이 되지않았습니다.', {size: 'md'});
                            }
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                } else {
                    $scope.step = '04';
                }
            } else if ($scope.step == '04') {

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
            $scope.openModal(null, 'md');
        };

        // 로그인 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('login_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'ANGE';

                        $scope.login($scope.item.id, $scope.item)
                            .then(function(data){
                                $rootScope.authenticated = true;
                                $rootScope.user_info = data;
                                $rootScope.uid = data.USER_ID;
                                $rootScope.name = data.USER_NM;
                                $rootScope.role = data.ROLE_ID;
                                $rootScope.system = data.SYSTEM_GB;
                                $rootScope.menu_role = data.MENU_ROLE;
                                $rootScope.email = data.EMAIL;

                                $modalInstance.close();
                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.dismiss('Canceled');
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){
                $location.url('/main');
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        $scope.init();
	}]);
});
