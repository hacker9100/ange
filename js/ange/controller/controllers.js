/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : 모든 controller를 포함할 controlers mudule 생성
 */

define([
    'angular'
], function (angular) {
    'use strict';

    // bootstrap.js에 설정한 App Name를 여기서 동일하게 설정
    var controllers = angular.module('mtApp.controllers', [
        'ui.bootstrap'
        ,'ngSanitize'
        ,'dialogs.main'
        ,'pascalprecht.translate'
        ,'dialogs.default-translations'
    ], function () {

    });

    return controllers;

});
