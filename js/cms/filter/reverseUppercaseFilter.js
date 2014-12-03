/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : Upper filter를 선언
 */
define(['./filters'], function (filters) {
    'use strict';

    return filters.filter('reverseUppercase', function() {
        return function(input, uppercase) {
            input = input || '';
            var out = "";
            for (var i = 0; i < input.length; i++) {
                out = input.charAt(i) + out;
            }

            if (uppercase) {
                out = out.toUpperCase();
            }
            return out;
        };
    })
});
