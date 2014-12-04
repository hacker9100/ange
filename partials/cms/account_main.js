/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : account_main.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('account_main', ['$scope', 'dialogs', function ($scope, dialogs ) {

        $scope.phoneNumberPattern = (function() {
            var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
            return {
                test: function(value) {
                    return regexp.test(value);
                }
            };
        })();

        /********** 초기화 **********/
        $scope.init = function() {

        };

        /********** 이벤트 **********/
        // 저장 버튼 클릭
        $scope.click_saveCmsUser = function () {
            $scope.updateItem('cms_user', $scope.item.USER_ID, $scope.item, true)
                .then(function(){dialogs.notify('알림', "정상적으로 수정 완료 됐습니다.", {size: 'md'});})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 로그인 사용자 조회
        $scope.getCmsUser = function (session) {
            if (session.USER_ID != '') {
                $scope.getItem('cms_user', 'item', session.USER_ID, {}, true)
                    .then(function(data){$scope.item = data;})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                dialogs.error('오류', '조회 정보가 없습니다.', {size: 'md'});
            }
        };

        // 취소
        $scope.click_cancel = function () {
            $scope.item = {};

            $scope.getSession()
                .then($scope.sessionCheck)
                .then($scope.getCmsUser)
                .catch($scope.reportProblems);
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.getCmsUser)
            .catch($scope.reportProblems);

    }]);
});
