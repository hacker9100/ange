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

    return filters.filter('split', function() {
        return function(input, delimiter) {
            var ret;
            var delimiter = delimiter || ',';

            if (input != null) {
                ret = input.split(delimiter);
            }

            return ret;
        };
    })
});
