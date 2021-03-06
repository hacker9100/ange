/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : route 설정.
 * Menu Click에 따라서 화면이 바뀌는 경우에 여기서 선언해서 화면과 Controller를 지정해서 사용한다.
 * 다만 WebApp의 경우 단일 페이지에서 처리가 발생하는 경우가 많을 것으므로, 이 파일은 별로 사용되지 않을 수 있다.
 */

define([
'app'
], function(app) {
    'use strict';

    app.config(function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        // 무조건 처음에 호출하고 싶은 것이 있으면 여기서 호출
        $urlRouterProvider.otherwise('/main');

        $stateProvider
            .state("main", {
                "url": "/main",
                "templateUrl": "/partials/ange/com/ange-common.html",
                "controller": "ange-common"
            }).state("ange_home", {
            "url": "/:channel/:menu",
            "templateUrl": "/partials/ange/com/ange-common.html",
            "controller": "ange-common"
            }).state("ange_menu", {
                "url": "/:channel/:menu/:type",
                "templateUrl": "/partials/ange/com/ange-common.html",
                "controller": "ange-common"
            }).state("ange_detail", {
                "url": "/:channel/:menu/:type/:id",
                "templateUrl": "/partials/ange/com/ange-common.html",
                "controller": "ange-common"
            }).state("storylist_list", {
                "url": "/story/:menu/list",
                "views": {
                    "" : { "templateUrl": "/partials/ange/com/ange-common.html", "controller": "ange-common" },
                    "lnbView@storylist-list": { "templateUrl": "/partials/ange/com/lnb.html", "controller": "lnb" },
                    "locaterView@storyist-list": { "templateUrl": "/partials/ange/com/locater.html", "controller" : "locater" },
                    "contentView@storylist-list": { "templateUrl": "/partials/ange/user_list.html", "controller" : "user_list" }
                }
            }).state("peoplelist_list", {
                "url": "/people/:menu/list",
                "views": {
                    "" : { "templateUrl": "/partials/ange/com/ange-common.html", "controller": "ange-common" },
                    "lnbView@storylist-list": { "templateUrl": "/partials/ange/com/lnb.html", "controller": "lnb" },
                    "locaterView@storyist-list": { "templateUrl": "/partials/ange/com/locater.html", "controller" : "locater" },
                    "contentView@storylist-list": { "templateUrl": "/partials/ange/user_list.html", "controller" : "user_list" }
                }
            });

/*
        // 메뉴 정보를 별도의 파일로 분리해 관리
        // menu.json에 정의된 메뉴들을 루프를 돌리면서 바인딩
//        if (config.states !== undefined) {
        if (menu_ange !== undefined) {

            for(var i = 0; i < menu_ange.states.length; i++) {
                angular.forEach(menu_ange.states[i], function (state, stateName) {
                    angular.forEach(state.views, function (view, viewName) {
                    });

                    $stateProvider.state(stateName, state);

                    // taken from the working example which uses ngRoute
                    // $routeProvider.when(path, {templateUrl:route.templateUrl, resolve:dependencyResolverFor(route.dependencies)});

                });

//                $stateProvider.state("otherwise", { url : '/signin' });
            }
        }
*/
//        $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
//        $httpProvider.defaults.headers.common.Pragma = "no-cache";
//        $httpProvider.defaults.headers.common["If-Modified-Since"] = "0";

        $httpProvider.defaults.cache = false;
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        $httpProvider.defaults.headers.common['Pragma'] = 'no-cache';
        $httpProvider.defaults.headers.common['Expires'] = '-1';
        $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = 0;
    })

    return app;
});