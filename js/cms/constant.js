/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : 모든 constant를  포함할 constants 모듈 생성
 */
define([
    './app'
], function(app, menu) {
    'use strict';
    app.constant(
        "COMMON", {
            "TEST" : "test"
        }
    );
    app.constant(
        "CMS", {
            "SYSTEM_GB" : "CMS",
            "" : ""
        }
    );
    app.constant(
        "SERVER", {
            "SERVER_URL" : "/serverscript/services/"
        }
    );
    app.constant(
        "UPLOAD", {
            "UPLOAD_INDEX" : "/serverscript/upload/",
            "BASE_URL" : "http://localhost"
        }
    );

});
