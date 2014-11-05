'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('lnb', ['$scope', '$stateParams', '$location', function ($scope, $stateParams, $location) {

        var menuinfos = [
            {"dashboard, account, scheduler, archive": [
                { url: '/dashboard', 'name': '마이페이지' },
                { url: '/account', 'name': '개인정보' },
                { url: '/scheduler', 'name': '스케줄' },
                { url: '/archive', 'name': '아카이브' }
            ]},
            {"project, task, article, article_confirm, edit, edit_confirm, publish": [
                { url: '/project', 'name': '프로젝트' },
                { url: '/task', 'name': '태스크' },
                { url: '/article', 'name': '원고' },
                { url: '/article_confirm', 'name': '원고 승인' },
                { url: '/edit', 'name': '편집' },
                { url: '/edit_confirm', 'name': '편집 승인' },
                { url: '/publish', 'name': '출판' }
            ]},
            {"user, permission, series, category": [
                { url: '/user', 'name': '사용자 관리' },
                { url: '/permission', 'name': '권한 관리' },
                { url: '/series', 'name': '시리즈 관리' },
                { url: '/category', 'name': '카테고리 관리' }
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
            $location.url(menu.url);
        };
	}]);
});
