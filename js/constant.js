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
        "CONFIG", {
            "test1": "test1_mode",
            "test2": "test2_mode"
        }
    );

});
