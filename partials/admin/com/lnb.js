/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : lnb.html 화면 콘트롤러
 */

define([
    '../../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('lnb', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', '$filter', 'dialogs', function ($scope, $rootScope, $stateParams, $controller, $location, $filter, dialogs) {

        var spMenu = $location.path().split('/');

        /********** 페이지 타이틀 **********/
        angular.forEach($rootScope.admin_menu, function(menu) {
            if (menu.MENU_URL.indexOf('/'+spMenu[1]+'/') > -1) {
                $scope.$parent.$parent.pageTitle = menu.MENU_NM;
                $scope.$parent.$parent.pageDescription = menu.MENU_DESC;
                $scope.$parent.$parent.tailDescription = menu.TAIL_DESC;

                return;
            }
        });

        /********** 좌측 메뉴 **********/
        var menu = $filter('filter')($rootScope.admin_menu, function (data) {
            return (data.MENU_URL.indexOf(spMenu[1]) > -1)
        })[0];

        var channel = $filter('filter')($rootScope.admin_channel, function (data) {
            return data.CHANNEL_NO === menu.CHANNEL_NO;
        })[0];

        $scope.item = channel;

        $scope.selectMenu = function(menu) {
            if ($scope.permissionCheck(menu.MENU_URL, false)) {
                $location.url(menu.MENU_URL);
            }
        };

        $scope.nowMenu = spMenu[1];

	}]);
});
