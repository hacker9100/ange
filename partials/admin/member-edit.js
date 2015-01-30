/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-14
 * Description : member-edit.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('member-edit', ['$scope', '$stateParams', '$location', '$filter', 'dialogs', function ($scope, $stateParams, $location, $filter, dialogs) {

        /********** 초기화 **********/
        // 사용자 모델
        $scope.item = {};

        // 날짜 콤보박스
        var year = [];
        var month = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.init = function() {
            var type = [{name: "일반회원", value: "MEMBER"}, {name: "앙쥬클럽", value: "CLUB"}, {name: "서포터즈", value: "SUPPORTERS"}];
            $scope.type = type;


            for (var i = 2010; i < nowYear; i++) {
                year.push(i+'');
            }

            for (var i = 1; i < 12; i++) {
                month.push(i+'');
            }

            for (var i = 1; i < 31; i++) {
                day.push(i+'');
            }

            $scope.years = year;
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
            
        };

        /********** 이벤트 **********/
        // 사용자 목록 이동
        $scope.click_showCmsBoardList = function () {
            $location.url('/member/list');
        };

        // 사용자 저장 버튼 클릭
        $scope.click_saveCmsUser = function () {
            $scope.item.BABY = $scope.babies;
            $scope.item.BLOG = $scope.blog;

            if ($stateParams.key == 0) {
                $scope.insertItem('com/user', $scope.item, false)
                    .then(function(){$location.url('/user/list');})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('com/user', $stateParams.key, $scope.item, false)
                    .then(function(){$location.url('/user/list');})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 사용자 조회
        $scope.getCmsUser = function () {
            if ($stateParams.key != 0) {
                $scope.getItem('com/user', 'item', $stateParams.key, {}, false)
                    .then(function(data) {
                        var idx = 0;
                        for (var i=0; i < $scope.user_roles.length; i ++) {
                            if (JSON.stringify(data.ROLE) == JSON.stringify($scope.user_roles[i])) {
                                idx = i;
                            }
                        }

                        $scope.item = data;
                        $scope.item.ROLE = $scope.user_roles[idx];
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
//            .then($scope.permissionCheck)
            .then($scope.init)
//            .then($scope.getCmsUser)
            .catch($scope.reportProblems);
    }]);
});
