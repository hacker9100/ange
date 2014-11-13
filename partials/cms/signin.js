'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('signin', ['$scope', '$rootScope', '$state', '$stateParams', 'login', 'dataService', '$location', '$controller', function ($scope, $rootScope, $state, $stateParams, login, dataService, $location, $controller) {

		//CSS 설정
		//$scope.$emit('updateCSS', ['css/css1.css']);
		$scope.message = "Welcome to ANGE CMS";

        // Expose $state and $stateParams to the <body> tag
        $scope.$state = $state;
        $scope.$stateParams = $stateParams;

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

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
            $scope.login($scope.login.id, $scope.login)
                .then(function(data){
                    $rootScope.authenticated = true;
                    $rootScope.uid = data.USER_ID;
                    $rootScope.name = data.USER_NM;
                    $rootScope.role = data.ROLE_ID;
                    $rootScope.menu_role = data.MENU_ROLE;
                    $rootScope.email = data.EMAIL;

                    $location.path('/dashboard');
                })
                .catch(function(error){alert(error)});

//            dataService.login($scope.login.id, $scope.login, function(data, status) {
//                if (status != 200) {
//                    console.log('조회에 실패 했습니다.');
//                } else {
//                    if (data.err == true) {
//                        console.log(data.msg);
//                    } else {
//                        if (angular.isObject(data)) {
//                            $rootScope.authenticated = true;
//                            $rootScope.uid = data.USER_ID;
//                            $rootScope.name = data.USER_NM;
//                            $rootScope.role = data.ROLE_ID;
//                            $rootScope.menu_role = data.MENU_ROLE;
//                            $rootScope.email = data.EMAIL;
//
//                            $location.path('/dashboard');
//                        } else {
//                            // TODO: 데이터가 없을 경우 처리
//                            console.log('조회 데이터가 없습니다.');
//                        }
//                    }
//                }
//            });
        };

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
