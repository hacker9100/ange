'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('signin', ['$scope', '$rootScope', '$state', '$stateParams', 'login', 'loginService', '$location', function ($scope, $rootScope, $state, $stateParams, login, loginService, $location) {

		//CSS 설정
		//$scope.$emit('updateCSS', ['css/css1.css']);
		$scope.message = "Welcome to ANGE CMS";

        // Expose $state and $stateParams to the <body> tag
        $scope.$state = $state;
        $scope.$stateParams = $stateParams;
/*
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
            var loginPromise = loginService.login($scope.login.id, $scope.login);
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
*/
        $scope.loginMe = function() {
            loginService.login($scope.login.id, $scope.login).then(function(result) {
                if (result.data.USER_ID) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = result.data.USER_ID;
                    $rootScope.name = result.data.USER_NM;
                    $rootScope.role = result.data.ROLE_ID;
                    $rootScope.menu_role = result.data.MENU_ROLE;
                    $rootScope.email = result.data.EMAIL;

                    $location.path('/dashboard');
                } else {
                    if (result.data.msg) {
                        alert(result.data.msg);
                    } else {
                        alert("로그인에 실패하였습니다..");
                    }
                }
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
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
