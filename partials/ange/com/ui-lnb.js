/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-30
 * Description : ui-lnb.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('ui-lnb', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', '$filter', 'dialogs', function ($scope, $rootScope, $stateParams, $controller, $location, $filter, dialogs) {

        /********** 페이지 타이틀 **********/
//        angular.forEach($rootScope.ange_menu, function(menu) {
//
//            if (menu.MENU_URL.indexOf(spMenu[1]+"/") > -1) {
//                $scope.$parent.$parent.pageTitle = menu.MENU_NM;
//                $scope.$parent.$parent.pageDescription = menu.MENU_DESC;
//                $scope.$parent.$parent.tailDescription = menu.TAIL_DESC;
//
//                return;
//            }
//        });

        /********** 좌측 메뉴 **********/
//        var menu = $filter('filter')($rootScope.ange_menu, function (data) {
//            return (data.MENU_URL.indexOf(menu[1]) > -1)
//        })[0];

        var channelNo = "2";

        var channel = $filter('filter')($rootScope.ange_channel, function (data) {
            return data.CHANNEL_NO === channelNo;
        })[0];

        $scope.item = channel;

//        $scope.selectMenu = function(menu) {
//            if ($scope.permissionCheck(menu.MENU_URL, false)) {
//                $location.url(menu.MENU_URL);
//            }
//        };
//
//        $scope.nowMenu = spMenu[1];
        //alert(spMenu[1]);

	}]);
});
