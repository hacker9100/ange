/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : 모든 sercive를 포함할 services 모듈 생성
 */
define([
    'angular'
], function (angular, ngResource) {
    'use strict';

    var services = angular.module('yourApp.services', ['ngResource'

    ], function () {

    });

    return services;
});
