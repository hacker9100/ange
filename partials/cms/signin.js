'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('signin', ['$scope', '$rootScope', '$state', '$stateParams', 'login', 'loginService', '$location', function ($scope, $rootScope, $state, $stateParams, login, loginService, $location) {
alert("sign")
		//CSS 설정
		//$scope.$emit('updateCSS', ['css/css1.css']);
		$scope.message = "Welcome to ANGE CMS";

        // Expose $state and $stateParams to the <body> tag
        $scope.$state = $state;
        $scope.$stateParams = $stateParams;

        // loginService exposed and a new Object containing login user/pwd
        $scope.ls = login;
        $scope.login = {
            working: false,
            wrong: false
        };
        $scope.loginMe = function () {
            // setup promise, and 'working' flag
//            var loginPromise = $http.post('/login', $scope.login);
//            alert($scope.login.id);
alert("---");
            var loginPromise = loginService.login($scope.login.id);
alert("---");
            $scope.login.working = true;
            $scope.login.wrong = false;
alert("---");
            login.loginUser(loginPromise);

            loginPromise.success(function () {
                $location.path('/dashboard');
            });
            loginPromise.error(function () {
                $scope.login.wrong = true;
                $timeout(function () { $scope.login.wrong = false; }, 8000);
            });
            loginPromise.finally(function () {
                $scope.login.working = false;
            });
        };

//        $scope.loginMe = function() {
//            loginService.login($scope.login.id).then(function(session) {
//                if (session.data.USER_ID) {
//                    $rootScope.authenticated = true;
//                    $rootScope.uid = session.data.USER_ID;
//                    $rootScope.name = session.data.USER_NM;
//                    $rootScope.role = session.data.ROLE_ID;
//                    $rootScope.menu_role = session.data.MENU_ROLE;
//                    $rootScope.email = session.data.EMAIL;
//
//                    $location.path('/dashboard');
//                } else {
//                    alert("아이디나 비밀번호가 틀립니다.");
//                }
//            });
//        }

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
