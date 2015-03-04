/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : series-main.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('signin', ['$scope', '$rootScope', '$location', '$controller', 'dialogs', function ($scope, $rootScope, $location, $controller, dialogs) {

        /********** 공통 컨트롤러 호출 **********/
        angular.extend(this, $controller('cms-common', {$scope: $scope}));

        /********** 초기화 **********/
        $scope.item = {};

        //CSS 설정
        //$scope.$emit('updateCSS', ['css/css1.css']);
        $scope.message = "Welcome to ANGE CMS";

        /********** 이벤트 **********/
        $scope.click_lostAccount = function () {
            $location.url('/forgot-idpw');
        };

        $scope.loginMe = function () {
            $scope.item.SYSTEM_GB = 'CMS';

            $scope.login($scope.item.id, $scope.item)
                .then(function(data){
                    $rootScope.authenticated = true;
                    $rootScope.uid = data.USER_ID;
                    $rootScope.name = data.USER_NM;
                    $rootScope.role = data.ROLE_ID;
                    $rootScope.system = data.SYSTEM_GB;
                    $rootScope.menu_role = data.MENU_ROLE;
                    $rootScope.email = data.EMAIL;

                    $location.url('/dashboard/main');
                })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.sessionCheck = function(session) {
            if (session.USER_ID != undefined && session.USER_ID != '') {
                if (session.SYSTEM_GB != 'CMS') {
                    dialogs.error('오류', '다른 시스템에 로그인되어있습니다. 로그아웃 후 다시 로그인 하세요', {size: 'md'});
                }

                $rootScope.authenticated = true;
                $rootScope.uid = session.USER_ID;
                $rootScope.name = session.USER_NM;
                $rootScope.role = session.ROLE_ID;
                $rootScope.system = session.SYSTEM_GB;
                $rootScope.menu_role = session.MENU_ROLE;
                $rootScope.email = session.EMAIL;

                dialogs.notify('알림', "이미 로그인 되었습니다.", {size: 'md'});
                $location.url('/dashboard/main');
            }

            return session;
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            ['catch']($scope.reportProblems);

	}]);
});
