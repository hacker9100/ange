/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-06
 * Description : joinuserinfo.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('joinuserinfo', ['$scope', '$rootScope', '$location', '$controller', 'dialogs', function ($scope, $rootScope, $location, $controller, dialogs) {

        /********** 초기화 **********/
        $scope.init = function () {

        };
alert($scope.$parent.join.checkTerms)
        /********** 이벤트 **********/
        // 이전 단계 클릭
        $scope.click_prevStep = function () {
            $location.url('/join/terms');
        };

        // 다음 단계 클릭
        $scope.click_nextStep = function () {

//            $location.url('/join/userinfo');
        };

        //
        $scope.click_cancel = function () {
            $location.url('/main');
        };

        $scope.init();
	}]);
});
