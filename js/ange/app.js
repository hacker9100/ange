/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : 최상위 module를 선언하고, app 에 사용되는 모듈을 로드한다.
 * define에는 주로 각 모듈별 top level에 해당하는 파일들을 선언한다.
 */

define([ // 의존 모듈들을 나열한다. 모듈을 한 개라도 배열로 넘겨야 한다.
    // 라이브러리 로딩
    'angular',
    'js-bootstrap',
    'ui-bootstrap',
    'angular-sanitize',
    'angular-ui-router',
    'ng-table',
    'dialog',
    'dialog-translation',
    'lodash', // dropdownMultiSelect 관련 라이브러리
    'ckeditor-jquery', // ckeditor 관련 라이브러리
    'ui-widget', // fileUpload ui 관련 라이브러리
    'fileupload', // fileUpload 관련 라이브러리
    'fileupload-process', // fileUpload ui 관련 라이브러리
    'fileupload-angular', // fileUpload angularjs 관련 라이브러리

//    'jquery-masonry',
//    'masonry',
    'angular-masonry',
    'ng-infinite-scroll',

    'chartjs',
    'angular-chart',

    // 각 컨트롤러 로딩
    './service/index',
    './directive/index',
    './controller/index',
    './filter/index'
//    './mockhttp'
], function (angular, routeConfig) { // 의존 모듈들은 순서대로 매개변수에 담긴다.
    // 의존 모듈들이 모두 로딩 완료되면 이 함수를 실행한다.
    'use strict';

    // bootstrap.js에 설정한 App Name를 여기서 동일하게 설정
    var app = angular.module('mtApp', [
        'mtApp.services',
        'mtApp.directives',
        'mtApp.controllers',
        'mtApp.filters',
        'ngTable',
        'ui.router',
        'blueimp.fileupload',

//        'wu.masonry',

        'ange.portlet.tpls',

        'masonryLayout',
        'infinite-scroll',
        'chart.js'
        ], function () {
            // 여기서는 필요한 설정들을 진행.
        }
    );

    // yourApp에 사용할 전체 controller를 설정.
    // 지금은 불필요하므로 remark.
//    yourApp.controller('YourAppCtrl', function($scope) {
//    });

    app.run(function ($rootScope, $location) {
        $rootScope.$on("$stateChangeStart", function (event, next, current) {
            // com_commom에서 layout을 동적으로 생성하는데 url이 변경되는 경우 정보 이동을 위해
            $rootScope.location = $location.path();
        });
    });

    return app;
});
