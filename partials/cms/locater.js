'use strict';

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('locater', ['$scope', '$rootScope', '$stateParams', '$location', '$filter', function ($scope, $rootScope, $stateParams, $location, $filter) {

/*
        var path = [
                        { url: '/webboard', title: '게시판', last: false},
                        { url: '/webboard/edit', title: '등록', last: false}
                    ];
*/

//        var path = "/webboard/edit";
//
//        var nav = function(path) {
//            var url = "";
//            var items = new Array();
//            var sp = path.split('/');
//
//            for (var i = 1; i < sp.length; i++) {
////                alert(sp.splice(idx, sp.length));
//                url += "/" + sp[i];
//                var last = false;
//                if (i + 1 == sp.length) last = true;
//                items.push({url: url, title: sp[i], last: last });
//            }
//
////            alert(JSON.stringify(items))
//
//            return items;
//        }
//
//        $scope.items = nav(path);
//
//        $scope.isActive = function(item) {
//            if (item.last == true) {
//                return true;
//            }
//            return false;
//        };

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
