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
    controllers.controller('subside-ad', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', '$filter', 'dialogs', function ($scope, $rootScope, $stateParams, $controller, $location, $filter, dialogs) {

        var spMenu = $location.path().split('/');

        // 초기화
        $scope.init = function() {
            var banner_code = 0;

            if ($scope.channel.CHANNEL_NO = 2) {
                banner_code = 1;
            } else if ($scope.channel.CHANNEL_NO = 3) {
                banner_code = 2;
            } else if ($scope.channel.CHANNEL_NO = 4) {
                banner_code = 3;
            }

            // ange-portlet-link-image
            $scope.option_r1 = {title: '이벤트 배너', api:'ad/banner', size: 1, gb: 6, link: true, open: true, image: '/imgs/ange/temp/temp_maineventbanner.png'};

            // ange-portlet-link-image2
            $scope.option_r2 = {title: '이벤트 배너', api:'ad/banner', size: 3, gb: banner_code, link: true, open: true, image: '/imgs/ange/temp/temp_maineventbanner.png'};
        }

        /********** 이벤트 **********/

        $scope.init();

	}]);
});
