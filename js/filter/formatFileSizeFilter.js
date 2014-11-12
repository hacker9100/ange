/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : formatFileSize filter를 선언
 */
define([
    './filters'
], function (filters) {
    'use strict';

    return filters.filter('formatFileSize', function() {
        return function(bytes) {
            //            if (typeof bytes !== 'number') {
//                return '';
//            }
            alert("1")
            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }
            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }
            return (bytes / 1000).toFixed(2) + ' KB';
        };
    })
});
