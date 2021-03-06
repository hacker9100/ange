'use strict';

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('locater', ['$scope', '$rootScope', '$stateParams', '$location', '$filter', function ($scope, $rootScope, $stateParams, $location, $filter) {

        var spMenu = $location.path().split('/');

        var menu = $filter('filter')($rootScope.cms_menu, function (data) {
            return (data.MENU_URL.indexOf(spMenu[1]) > -1)
        })[0];

        var channel = $filter('filter')($rootScope.cms_channel, function (data) {
            return data.CHANNEL_NO === menu.CHANNEL_NO;
        })[0];

        var items = [];
        items.push({LOCATOR_URL: '', LOCATOR_NM: channel.CHANNEL_NM, CHANNEL_NO: channel.CHANNEL_NO, CHANNEL_FL: 'Y'});
        items.push({LOCATOR_URL: menu.MENU_URL, LOCATOR_NM: menu.MENU_NM, CHANNEL_NO: '', CHANNEL_FL: 'N'});

        $scope.items = items;

	}]);
});
