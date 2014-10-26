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
                $rootScope.authenticated = true;
                $rootScope.uid = session.data.USER_ID;
                $rootScope.name = session.data.USER_NM;
                $rootScope.email = session.data.EMAIL;

                $location.path('/dashboard');
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
