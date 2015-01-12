/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-06
 * Description : jointerms.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('jointerms', ['$scope', '$rootScope', '$location', '$controller', 'dialogs', function ($scope, $rootScope, $location, $controller, dialogs) {

        $scope.join.checkAll = false;

        /********** 초기화 **********/
        $scope.init = function () {

        };

        /********** 이벤트 **********/
        $scope.click_checkAll = function () {
            $scope.join.checkAll = !$scope.joincheckAll;

            $scope.join.checkTerms = $scope.join.checkAll;
            $scope.join.checkInfo = $scope.join.checkAll;
            $scope.join.checkOffer = $scope.join.checkAll;
        }

        // 다음 단계 클릭
        $scope.click_nextStep = function () {
            if (!$scope.join.checkTerms) {
                dialogs.notify('알림', '이용약관에 동의해야 합니다.', {size: 'md'});
                return;
            }

            if (!$scope.join.checkTerms) {
                dialogs.notify('알림', '개인정보 취급방침에 동의해야 합니다.', {size: 'md'});
                return;
            }

            $location.url('/join/userinfo');
        };

        //
        $scope.click_cancel = function () {
            $location.url('/main');
        };

        $scope.init();
	}]);
});
