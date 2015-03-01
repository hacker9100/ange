/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-29
 * Description : ui-ads.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('ui-ads', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $controller, $location, dialogs, CONSTANT) {

        angular.extend(this, $controller('ange-common', {$scope: $scope}));

        $scope.option_r1 = {title: '롤링', api:'ad/banner', size: 2, id: 'ads1', type: 'ange', gb: 1, dots: false, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

        $scope.option_r2 = {title: '롤링', api:'ad/banner', size: 5, id: 'ads2', type: 'ange', gb: 2, dots: false, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

        $scope.option_r3 = {title: '롤링', api:'ad/banner', size: 2, id: 'ads3', type: 'ange', gb: 3, dots: false, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

        $scope.option_r4 = {title: '롤링', api:'ad/banner', size: 2, id: 'ads4', type: 'banner', gb: CONSTANT.AD_CODE_BN02, dots: false, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

        /********** 이벤트 **********/
        $scope.click_mainLogo = function() {
            $location.url("/main");
        };

        $scope.click_intro = function() {
            $location.url("/company/intro")
        };

        $scope.click_affiliates = function() {
            $location.url("/company/affiliates")
        };

	}]);
});
