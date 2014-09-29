/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : 최상위 module를 선언하고, app 에 사용되는 모듈을 로드한다.
 * define에는 주로 각 모듈별 top level에 해당하는 파일들을 선언한다.
 */

define([ // 의존 모듈들을 나열한다. 모듈을 한 개라도 배열로 넘겨야 한다.
    'angular',
    'uiRouter',
    './controller/index',
    './directive/index',
    './filter/index',
    './service/index'
], function (angular) { // 의존 모듈들은 순서대로 매개변수에 담긴다.
    // 의존 모듈들이 모두 로딩 완료되면 이 함수를 실행한다.
    'use strict';

    // bootstrap.js에 설정한 App Name를 여기서 동일하게 설정
    var yourApp = angular.module('yourApp', [
        'yourApp.services',
        'yourApp.controllers',
        'yourApp.filters',
        'yourApp.directives',
        'ui.router'
        ], function () {
            // 여기서는 필요한 설정들을 진행.
        }
    ).provider('menu', function() {
        this.jmenu = function() {
            var json = {menu : 'menu1'};

            return json;
        };

        this.$get = function($http) {
            var jsonMenu = null;
            // code to initialize/configure the SERVICE goes here (executed during `run` stage)
            $http.get('js/menu1.js').success(function(data) {
                return data;
            });
        }
    });

    // yourApp에 사용할 전체 controller를 설정.
    // 지금은 불필요하므로 remark.
//    yourApp.controller('YourAppCtrl', function($scope) {
//    });

    // 외부에 노출할 함수들만 반환한다.
    return yourApp;

});
