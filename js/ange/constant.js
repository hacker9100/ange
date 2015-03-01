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
            "BASE_URL" : "http://localhost",

            "UPLOAD_INDEX" : "/serverscript/upload/",

            "COMM_NO_FAQ" : "53",
            "COMM_NO_QNA" : "",

            "AD_LOG_URL" : "http://angead.marveltree.com/adm/io/log.php",
            "AD_FILE_URL" : "http://angead.marveltree.com/adm/upload/",

            "AD_CODE_BN01" : "1",
            "AD_CODE_BN02" : "2",
            "AD_CODE_BN03" : "3",
            "AD_CODE_BN04" : "4",
            "AD_CODE_BN05" : "5",
            "AD_CODE_BN06" : "6",
            "AD_CODE_BN07" : "7",
            "AD_CODE_BN08" : "8",
            "AD_CODE_BN09" : "9",
            "AD_CODE_BN10" : "10",
            "AD_CODE_BN11" : "11",
            "AD_CODE_BN12" : "12",
            "AD_CODE_BN13" : "13",
            "AD_CODE_BN14" : "14",
            "AD_CODE_BN15" : "15",
            "AD_CODE_BN16" : "16",
            "AD_CODE_BN17" : "17",
            "AD_CODE_BN18" : "18",
            "AD_CODE_BN19" : "19",
            "AD_CODE_BN20" : "20",
            "AD_CODE_BN21" : "21",
            "AD_CODE_BN22" : "22",
            "AD_CODE_BN23" : "23",
            "AD_CODE_BN24" : "24",
            "AD_CODE_BN25" : "25",
            "AD_CODE_BN26" : "26",
            "AD_CODE_BN27" : "27",
            "AD_CODE_BN28" : "28",
            "AD_CODE_BN29" : "29",
            "AD_CODE_BN30" : "30",
            "AD_CODE_BN31" : "31"
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
