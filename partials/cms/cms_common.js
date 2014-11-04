/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : cms_common.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('cms_common', ['$scope', '$stateParams', 'loginService', '$location', function ($scope, $stateParams, loginService, $location) {

//        alert(localStorage.getItem('userToken'))

        $scope.getSession = function() {
            return loginService.getSession();
        },
        $scope.sessionCheck = function(session) {
            if (session.data.USER_ID == undefined || session.data.USER_ID == '')
                throw( new String("세션이 만료되었습니다.") );
//            throw( new Error("세션이 만료되었습니다.") );
            return session;
        },
        $scope.reportProblems = function(error)
        {
            alert(error);
        };
    }]);
});
