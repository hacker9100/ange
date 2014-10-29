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
    controllers.controller('gnb', ['$rootScope', '$scope', 'loginService', '$location', function ($rootScope, $scope, loginService, $location) {

        $scope.logout = function() {
            loginService.logout($rootScope.uid).then( function(data) {
                alert("로그아웃 되었습니다.");
                $location.path('/signin');
            });
        };

    }]);
});
