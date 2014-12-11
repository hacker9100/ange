/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : webboardView.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('gnb', ['$scope', '$rootScope', '$location', 'dialogs', function ($scope, $rootScope, $location, dialogs) {

        $scope.list = $rootScope.cms_channel;

        $scope.selectMenu = function(url) {
            if ($scope.permissionCheck(url, false)) {
                $location.url(url);
            }
        };

        $scope.logoutMe = function() {
            if ($rootScope.uid != undefined) {
                $scope.logout($rootScope.uid).then( function(data) {
                    dialogs.notify('알림', "로그아웃 되었습니다.", {size: 'md'});
                    $location.path('/signin');
                });
            }
        };
    }]);
});
