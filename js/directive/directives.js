/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : 모든 directive를 포함할 directives 모듈 생성
 */
define([
    'angular'
], function (angular) {
    'use strict';
    var directives = angular.module('mtApp.directives', [

    ], function () {

    });

    directives.provider('plUploadProvider', function() {

        var config = {
            flashPath: 'lib/plupload/Moxie.swf',
            silverLightPath: 'lib/plupload/Moxie.xap',
            uploadPath: 'serverscript/upload.php'
        };

        this.setConfig = function(key, val) {
            config[key] = val;
        };

        this.getConfig =  function(key) {
            return config[key];
        };

        var that = this;

        this.$get = [function(){

            return {
                getConfig: that.getConfig,
                setConfig: that.setConfig
            };

        }];

    })

    return directives;
});
