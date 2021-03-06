'use strict';

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('signin', ['$scope', '$rootScope', '$location', '$controller', 'dialogs', function ($scope, $rootScope, $location, $controller, dialogs) {

        /********** 공통 컨트롤러 호출 **********/
        angular.extend(this, $controller('content', {$scope: $scope}));

        /********** 초기화 **********/
        $scope.item = {};

		//CSS 설정
		//$scope.$emit('updateCSS', ['css/css1.css']);
		$scope.message = "Welcome to ANGE ADMIN";

        /********** 이벤트 **********/
        $scope.click_lostAccount = function () {
            $location.url('/forgot-idpw');
        };

        $scope.loginMe = function() {
            $scope.item.SYSTEM_GB = 'ADMIN';

            $scope.login($scope.item.id, $scope.item)
                .then(function(data){
                    $rootScope.session = data;

                    $rootScope.authenticated = true;
                    $rootScope.uid = data.USER_ID;
                    $rootScope.name = data.USER_NM;
                    $rootScope.role = data.ROLE_ID;
                    $rootScope.system = data.SYSTEM_GB;
                    $rootScope.menu_role = data.MENU_ROLE;
                    $rootScope.email = data.EMAIL;

                    $location.path('/member/list');
                })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.sessionCheck = function(session) {
            if (session.USER_ID != undefined && session.USER_ID != '') {
                if (session.SYSTEM_GB != 'ADMIN') {
//                    dialogs.error('오류', '다른 시스템에 로그인되어있습니다. 로그인 페이지로 이동합니다.', {size: 'md'});
                    $scope.logout($rootScope.uid).then( function(data) {
//                        $location.path('/signin');
                    });

                    return;
                }

                $rootScope.authenticated = true;
                $rootScope.uid = session.USER_ID;
                $rootScope.name = session.USER_NM;
                $rootScope.role = session.ROLE_ID;
                $rootScope.system = session.SYSTEM_GB;
                $rootScope.menu_role = session.MENU_ROLE;
                $rootScope.email = session.EMAIL;

                dialogs.notify('알림', "이미 로그인 되었습니다.", {size: 'md'});
                $location.url('/member/list');
            }

            return session;
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            ['catch']($scope.reportProblems);

	}]);
});
