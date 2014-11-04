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
        obj.login = function(key, model){
            return $http.post('serverscript/services/login.php?_method=GET&_category='+$location.path()+'&id='+key, model);
        }

        obj.getSession = function(){
            return $http.get('serverscript/services/login.php?_method=GET&_category='+$location.path());
        }

        obj.logout = function(key){
            return $http.get('serverscript/services/login.php?_method=DELETE&_category='+$location.path()+'&id='+key);
        }

        return obj;
    }]);
});
