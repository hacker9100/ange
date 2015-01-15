'use strict';

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('message', ['$scope', '$rootScope', '$state', '$stateParams', 'dataService', '$location', '$controller', function ($scope, $rootScope, $state, $stateParams, dataService, $location, $controller) {

        /********** 초기화 **********/

        /********** 이벤트 **********/
        $scope.click_back = function () {
            history.back();
        };

        $scope.click_home = function () {
            $location.url('/signin');
        };

        $scope.click_refresh = function () {
            location.reload();
        };
	}]);
});
