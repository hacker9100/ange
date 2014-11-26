'use strict';

define([
    '../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('signin', ['$scope', '$rootScope', '$state', '$stateParams', 'dataService', '$location', '$controller', function ($scope, $rootScope, $state, $stateParams, dataService, $location, $controller) {

		//CSS 설정
		//$scope.$emit('updateCSS', ['css/css1.css']);
		$scope.message = "Welcome to ANGE CMS";

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('ange_common', {$scope: $scope}));

        $scope.loginMe = function() {
            $scope.login($scope.item.id, $scope.item)
                .then(function(data){
                    $rootScope.authenticated = true;
                    $rootScope.uid = data.USER_ID;
                    $rootScope.name = data.USER_NM;
                    $rootScope.role = data.ROLE_ID;
                    $rootScope.menu_role = data.MENU_ROLE;
                    $rootScope.email = data.EMAIL;

                    $location.path('/user/list');
                })
                .catch(function(error){alert(error)});
        };

	}]);
});
