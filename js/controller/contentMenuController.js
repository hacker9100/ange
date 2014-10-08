/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : Controller선언
 */

define([
    './controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('ContentMenuCtrl', ['$rootScope', '$scope', '$state', '$location', function ($rootScope, $scope, $state, $location) {

        var menus = [{ 'state' : 'content', 'menu' : [{ 'name' : '업무정의', 'path' : '/content/task'}, { 'name' : '서브메뉴1-2', 'url' : 'partials/menu1-2.html'}]}, { 'state' : 'menagement', 'menu' : [{ 'name' : '서브메뉴2-1', 'url' : 'sub_menu2_1.html'}, { 'name' : '서브메뉴2-2', 'url' : 'sub_menu2_2.html'}]}];

        var path = $location.path();

        for (var i in menus) {
            if (path.indexOf(menus[i].state) > 0) {
                $scope.service_menus = menus[i].menu;
            }
        }

        $scope.showMenu = function(menu) {
            $location.path(menu.path);
        }

        // 상단 메뉴가 변경될 경우 좌측 메뉴를 변경.
        if ($rootScope.currentState != $state.$current.name) {
            $rootScope.currentState = $state.$current.name;
        }
    }]);
});

