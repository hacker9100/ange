/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : webboardView.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('gnb', ['$scope', '$rootScope', 'loginService', '$location', function ($scope, $rootScope, loginService, $location) {

        $scope.list = $rootScope.cms_channel;

        $scope.logout = function() {
            loginService.logout($rootScope.uid).then( function(data) {
                alert("로그아웃 되었습니다.");
                $location.path('/signin');
            });
        };

    }]);
});
