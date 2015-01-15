/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : route 설정.
 * Menu Click에 따라서 화면이 바뀌는 경우에 여기서 선언해서 화면과 Controller를 지정해서 사용한다.
 * 다만 WebApp의 경우 단일 페이지에서 처리가 발생하는 경우가 많을 것으므로, 이 파일은 별로 사용되지 않을 수 있다.
 */

define([
'app',
'json!menu_admin.json'
], function(app, menu_admin) {
    'use strict';

    app.config(function($stateProvider, $urlRouterProvider) {

        // use the HTML5 History API
//        $locationProvider.html5Mode(true);

        // 무조건 처음에 호출하고 싶은 것이 있으면 여기서 호출
        $urlRouterProvider.otherwise('/message');

        // 메뉴 정보를 별도의 파일로 분리해 관리
        // menu.json에 정의된 메뉴들을 루프를 돌리면서 바인딩
//        if (config.states !== undefined) {
        if (menu_admin !== undefined) {

            for(var i = 0; i < menu_admin.states.length; i++) {
                angular.forEach(menu_admin.states[i], function (state, stateName) {
                    angular.forEach(state.views, function (view, viewName) {
                    });

                    $stateProvider.state(stateName, state);

                    // taken from the working example which uses ngRoute
                    /* $routeProvider.when(path, {templateUrl:route.templateUrl, resolve:dependencyResolverFor(route.dependencies)}); */

                });

//                $stateProvider.state("otherwise", { url : '/signin' });
            }
        }
    })

    return app;
});