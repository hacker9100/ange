/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-29
 * Description : subside-ad.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('subside-ad', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $controller, $location, dialogs, CONSTANT) {

        var spMenu = $location.path().split('/');

        // 초기화
        $scope.init = function() {
            var sd_01 = 0;
            var sd_02 = 0;

            if ($scope.channel.CHANNEL_NO == 2) {
                sd_01 = CONSTANT.AD_CODE_BN17;
                sd_02 = CONSTANT.AD_CODE_BN16;
            } else if ($scope.channel.CHANNEL_NO == 3) {
                sd_01 = CONSTANT.AD_CODE_BN21;
                sd_02 = CONSTANT.AD_CODE_BN20;
            } else if ($scope.channel.CHANNEL_NO == 4) {
                sd_01 = CONSTANT.AD_CODE_BN17;
                sd_02 = CONSTANT.AD_CODE_BN16;
            } else if ($scope.channel.CHANNEL_NO == 5) {
                sd_01 = CONSTANT.AD_CODE_BN24;
                sd_02 = CONSTANT.AD_CODE_BN23
            } else if ($scope.channel.CHANNEL_NO == 8) {
                sd_01 = CONSTANT.AD_CODE_BN56;
                sd_02 = CONSTANT.AD_CODE_BN30;
            }

            // ange-portlet-link-image
            $scope.option_r1 = {title: '이벤트 배너', api:'ad/banner', size: 1, gb: sd_01, link: true, open: true, image: '/imgs/ange/temp/temp_maineventbanner.png'};

            // ange-portlet-link-image2
            $scope.option_r2 = {title: '이벤트 배너', api:'ad/banner', size: 3, gb: sd_02, link: true, open: true, image: '/imgs/ange/temp/temp_maineventbanner.png'};
        }

        /********** 이벤트 **********/
        $scope.init();
	}]);
});
