'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('lnb', ['$scope', '$stateParams', '$location', function ($scope, $stateParams, $location) {

        var menuinfos = [{"dashboard" :
                        [
                            { url: '/dashboard', 'name': '홈' },
                            { url: '/account', 'name': '개인정보' },
                            { url: '/scheduler', 'name': '스케줄' },
                            { url: '/archive', 'name': 'Archive' }
                        ]}
                    ];

        for(var i = 0; i < menuinfos.length; i++) {
            angular.forEach(menuinfos[i], function (submenu, menu) {
                if (menu == "dashboard") {
                    $scope.menuInfos = submenu;
                }
            });
        }

        $scope.selectMenu = function(menu) {
            $location.path(menu.url);
        };
	}]);
});
