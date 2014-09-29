/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-25
 * Description : service 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('jsonFileService', ['$http', '$location', function($http){
        var obj = {};
        obj.updateContents = function(){
            return $http.get('js/:file', {file: '@file'});
        }

        return obj;
    }]);
});
