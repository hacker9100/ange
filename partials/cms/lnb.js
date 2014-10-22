'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('lnb', ['$scope', '$stateParams', '$location', function ($scope, $stateParams, $location) {

        var menuinfos = [
            {"dashboard, account, scheduler, archive": [
                { url: '/dashboard', 'name': '홈' },
                { url: '/account', 'name': '개인정보' },
                { url: '/scheduler', 'name': '스케줄' },
                { url: '/archive', 'name': 'Archive' }
            ]},
            {"project, task, article, article_confirm": [
                { url: '/project/list', 'name': '프로젝트' },
                { url: '/task/list', 'name': '태스크' },
                { url: '/article/list', 'name': '원고' },
                { url: '/article_confirm/list', 'name': '원고 승인' },
                { url: '/edit/list', 'name': '편집' },
                { url: '/edit_confirm/list', 'name': '편집 승인' },
                { url: '/publish/list', 'name': '출판' }
            ]}
        ];

        var spMenu = $location.path().split('/');

        for(var i = 0; i < menuinfos.length; i++) {
            angular.forEach(menuinfos[i], function (submenu, menu) {
                if (menu.indexOf(spMenu[1]) > -1) {
                    $scope.menuInfos = submenu;
                }
            });
        }

        $scope.selectMenu = function(menu) {
            $location.path(menu.url);
            $location.search("_method=GET")
        };
	}]);
});
