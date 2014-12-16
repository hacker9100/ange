/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-11-15
 * Description : focus 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('focus', function() {
        return function(scope, element){
            console.log(element);
            element[0].focus();
        };
    });
});