/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-14
 * Description : member-view.html 화면 콘트롤러
 */

define([
    '../../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('member-view', ['$scope', '$stateParams', '$location', 'dialogs', function ($scope, $stateParams, $location, dialogs) {

        if ($scope.isModal) {
//            $scope.id = data;
        } else {
            $scope.id = $stateParams.id;
        }

        /********** 초기화 **********/
        // 사용자 모델
        $scope.item = {};

        $scope.checkAllAgree = true;

        // 초기화
        $scope.init = function() {

        };

        /********** 함수 **********/
        function autoHypenPhone(str){
            str = str.replace(/[^0-9]/g, '');
            var tmp = '';
            if( str.length < 4) {
                return str;
            } else if(str.length < 7) {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3);
                return tmp;
            } else if(str.length < 11) {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3, 3);
                tmp += '-';
                tmp += str.substr(6);
                return tmp;
            } else {
                tmp += str.substr(0, 3);
                tmp += '-';
                tmp += str.substr(3, 4);
                tmp += '-';
                tmp += str.substr(7);
                return tmp;
            }
            return str;
        }

        /********** 이벤트 **********/
        // 사용자 목록 이동
        $scope.click_showUserList = function () {
            if ($scope.isModal) $scope.click_close();
            else window.history.back();
//            $location.url('/member/list');
        };

        // 사용자 수정 이동
        $scope.click_showEditUser = function (item) {
            if ($scope.isModal) $scope.click_close();
//            $location.url('/member/edit/'+item.USER_ID);
        };

        // 사용자 조회
        $scope.getUser = function () {
            if ($scope.id != 0) {
                $scope.getItem('com/user', 'item', $scope.id, {DETAIL: true}, false)
                    .then(function(data) {

console.log(JSON.stringify(data))
                        $scope.item = data;

                        if ($scope.item.BIRTH.length == 8) {
                            $scope.item.BIRTH = $scope.item.BIRTH.substr(0, 4) + '-' + $scope.item.BIRTH.substr(4, 2).replace('0', '') + '-' + $scope.item.BIRTH.substr(6, 2).replace('0', '');
                        }

                        if ($scope.item.ZIP_CODE.length == 6) {
                            $scope.item.ZIP_CODE = $scope.item.ZIP_CODE.substr(0, 3) + '-' + $scope.item.ZIP_CODE.substr(3, 3);
                        }

                        $scope.item.PHONE_1 = autoHypenPhone($scope.item.PHONE_1);
                        $scope.item.PHONE_2 = autoHypenPhone($scope.item.PHONE_2);

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

                        if ($scope.item.BABY_BIRTH_DT != null) {
                            $scope.item.BABY_BIRTH_DT = $scope.item.BABY_BIRTH_DT.substr(0, 4) + '-' + $scope.item.BABY_BIRTH_DT.substr(4, 2) + '-' + $scope.item.BABY_BIRTH_DT.substr(6, 2);
                        }

                        if ($scope.item.BABY != null) {
                            $scope.babies = $scope.item.BABY;

                            for (var i=0; i < $scope.item.BABY.length; i++) {
                                if ($scope.item.BABY[i].BABY_BIRTH.length == 8) {
                                    $scope.babies[i].BABY_BIRTH = $scope.item.BABY[i].BABY_BIRTH.substr(0, 4) + '-' + $scope.item.BABY[i].BABY_BIRTH.substr(4, 2) + '-' + $scope.item.BABY[i].BABY_BIRTH.substr(6, 2);
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
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.babies = [];

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getUser)
            ['catch']($scope.reportProblems);
    }]);
});
