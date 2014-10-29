'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('signin', ['$scope', '$rootScope', '$stateParams', 'loginService', '$location', function ($scope, $rootScope, $stateParams, loginService, $location) {

		//CSS 설정
		//$scope.$emit('updateCSS', ['css/css1.css']);
		$scope.message = "Welcome to ANGE CMS";

        $scope.loginMe = function() {
            loginService.login($scope.login.id).then(function(session) {
                if (session.data.USER_ID) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = session.data.USER_ID;
                    $rootScope.name = session.data.USER_NM;
                    $rootScope.role = session.data.ROLE;
                    $rootScope.menu_role = session.data.MENU_ROLE;
                    $rootScope.email = session.data.EMAIL;

                    $location.path('/dashboard');
                } else {
                    alert("아이디나 비밀번호가 틀립니다.");
                }
            });
        }

/*
        $scope.login = function () {
            var credentials = {
                username: this.username,
                token: this.token
            };

            var success = function (data) {
                var token = data.token;

                api.init(token);

                $cookieStore.put('token', token);
                $location.path('/');
            };

            var error = function () {
                // TODO: apply user notification here..
            };

            authorization.login(credentials).success(success).error(error);
        };
*/

	}]);
});
