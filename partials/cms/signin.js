'use strict';

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('signin', ['$scope', '$rootScope', '$state', '$stateParams', '$location', '$controller', 'dialogs', function ($scope, $rootScope, $state, $stateParams, $location, $controller, dialogs) {

		//CSS 설정
		//$scope.$emit('updateCSS', ['css/css1.css']);
		$scope.message = "Welcome to ANGE CMS";

        // Expose $state and $stateParams to the <body> tag
        $scope.$state = $state;
        $scope.$stateParams = $stateParams;

        /********** 공통 컨트롤러 호출 **********/
        angular.extend(this, $controller('cms_common', {$scope: $scope}));

        /********** 이벤트 **********/
        $scope.click_lostAccount = function () {
            $location.url('/forgot_idpw');
        };

        $scope.loginMe = function () {
            $scope.item.SYSTEM_GB = 'CMS';

            $scope.login($scope.item.id, $scope.item)
                .then(function(data){
                    $rootScope.authenticated = true;
                    $rootScope.uid = data.USER_ID;
                    $rootScope.name = data.USER_NM;
                    $rootScope.role = data.ROLE_ID;
                    $rootScope.menu_role = data.MENU_ROLE;
                    $rootScope.email = data.EMAIL;

                    $location.url('/dashboard');
                }).catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };
	}]);
});
