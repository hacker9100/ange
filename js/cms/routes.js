/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : route 설정.
 * Menu Click에 따라서 화면이 바뀌는 경우에 여기서 선언해서 화면과 Controller를 지정해서 사용한다.
 * 다만 WebApp의 경우 단일 페이지에서 처리가 발생하는 경우가 많을 것으므로, 이 파일은 별로 사용되지 않을 수 있다.
 */

define([
'./app',
'json!menu.json'
], function(app, menu) {
    'use strict';

    var stateProvider;
    app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, fileUploadProvider) {

        // use the HTML5 History API
//        $locationProvider.html5Mode(true);

        // 무조건 처음에 호출하고 싶은 것이 있으면 여기서 호출
        $urlRouterProvider.otherwise('/signin');
//        $urlRouterProvider.otherwise(function($injector, $location) {
//            $location.path('/signin')
//        });

        stateProvider = $stateProvider;
        // 메뉴 정보를 별도의 파일로 분리해 관리
        // menu.json에 정의된 메뉴들을 루프를 돌리면서 바인딩
//        if (config.states !== undefined) {
        if (menu !== undefined) {

            for(var i = 0; i < menu.states.length; i++) {
                angular.forEach(menu.states[i], function (state, stateName) {
                    angular.forEach(state.views, function (view, viewName) {
                    });

                    $stateProvider.state(stateName, state);

                    // taken from the working example which uses ngRoute
                    /* $routeProvider.when(path, {templateUrl:route.templateUrl, resolve:dependencyResolverFor(route.dependencies)}); */

                });

//                $stateProvider.state("otherwise", { url : '/signin' });
            }
        }

        // fileUpload
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        fileUploadProvider.defaults.redirect = window.location.href.replace(
            /\/[^\/]*$/,
            '/partials/result.html?%s'
        );
        angular.extend(fileUploadProvider.defaults, {
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
            maxFileSize: 5000000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf)$/i
        });
    });

//    app.controller('test', function($rootScope) {
//        alert($rootScope.cms_channel)
//        stateProvider.state("cms_list", {
//            "url": "/:menu/:type",
//            "views": {
//                "" : { templateUrl: "/partials/cms/cms_common.html", controller: "cms_common" },
//                "contentView@cms_list": { templateUrl: function($stateParams) { return '/partials/cms/'+$stateParams.menu+'_'+$stateParams.type+'.html' }}
//            }});
//    });

    return app;
});