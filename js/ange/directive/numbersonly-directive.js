/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2015-01-26
 * Description : input number only 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('numbersOnly', function($window) {
        return {
           require : 'ngModel',
           link : function (scope, element, attr, ngModelCtrl){
               function fromUser(text) {
                   if(text) {
                       var transformedInput = text.replace(/[^0-9]/g, '');

                       if(transformedInput !== text){
                           ngModelCtrl.$setViewValue(transformedInput);
                           ngModelCtrl.$render();
                       }

                       return transformedInput;
                   }
                   return undefined;
               }
               ngModelCtrl.$parsers.push(fromUser);
           }
        };
    });

});