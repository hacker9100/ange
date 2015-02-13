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
        "CONSTANT", {
            "SYSTEM_GB" : "ANGE",
            "DASHBOARD_PAGE_SIZE" : 5,
            "PAGE_SIZE" : 20,
            "BASE_URL" : "http://ange.marveltree.com",
            "AD_FILE_URL" : "http://angead.marveltree.com/adm/upload/"
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
            "BASE_URL" : "http://ange.marveltree.com"
        }
    );

});
