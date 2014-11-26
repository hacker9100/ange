'use strict';

define([
    '../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('lnb', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', '$filter', function ($scope, $rootScope, $stateParams, $controller, $location, $filter) {

        var spMenu = $location.path().split('/');

        /********** 페이지 타이틀 **********/
//        $scope.message = 'ANGE CMS';
        angular.forEach($rootScope.ange_menu, function(menu) {
            if (menu.MENU_URL.indexOf(spMenu[2]) > -1 || ( spMenu[1] == 'content' && menu.MENU_URL.indexOf(spMenu[2]) > -1)) {
                $scope.$parent.pageTitle = menu.MENU_NM;
                $scope.$parent.pageDescription = menu.MENU_DESC;
                $scope.$parent.tailDescription = menu.TAIL_DESC;
            }
        });

        var menu = $filter('filter')($rootScope.ange_menu, function (data) {
//            return data.MENU_URL === $location.path()
            return (data.MENU_URL.indexOf(spMenu[2]) > -1 || ( spMenu[1] == 'content' && data.MENU_URL.indexOf(spMenu[2]) > -1))
        })[0];
        var channel = $filter('filter')($rootScope.ange_channel, function (data) {
            return data.CHANNEL_NO === menu.CHANNEL_NO;
        })[0];

        $scope.item = channel;

        $scope.selectMenu = function(menu) {
            $location.url(menu.MENU_URL);
        };

	}]);
});
