/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : service 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('loginService', ['$http', '$location', function($http, $location){
        var obj = {};
        obj.getUsers = function(){
            return $http.get('serverscript/api.php?_method=GET&_category='+$location.path());
        }

        obj.getLogin = function(id){
            return $http.get('serverscript/api.php?_method=GET&_category='+$location.path()+'&id='+id);
        }

        return obj;
    }]);
});
