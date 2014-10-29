/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : userService 선언
 */
define([
    './services'
], function (services) {
    'use strict';

    services.service('userService', ['$http', '$location', function($http, $location){
        var obj = {};

        var qs = function(obj, prefix){
            var str = [];
            for (var p in obj) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];

                if (p != '_method')
                    str.push(angular.isObject(v) ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
            }
            return str.join("&");
        }

        obj.getCmsUsers = function(){
            return $http.get('serverscript/services/cms_user.php?_method=GET&'+qs($location.search())+'&_category='+$location.path());
        }

        obj.getCmsUser = function(id){
            return $http.get('serverscript/services/cms_user.php?_method=GET&'+qs($location.search())+'&_category='+$location.path()+'&_id='+id);
        }

        obj.deleteCmsUser = function(id){
            return $http.get('serverscript/services/cms_user.php?_method=DELETE&_category='+$location.path()+'&_id='+id);
        }

        obj.updateCmsUser = function(id, content){
            return $http.post('serverscript/services/cms_user.php?_method=PUT&_category='+$location.path()+'&_id='+id, content);
        }

        obj.createCmsUser = function(content){
            return $http.post('serverscript/services/cms_user.php?_method=POST&_category='+$location.path(), content);
        }

        return obj;
    }]);
});
