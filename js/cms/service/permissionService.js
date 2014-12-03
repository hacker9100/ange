/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : permissionService 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('permissionService', ['$http', '$location', function($http, $location){
        var obj = {};
        obj.getPermissionOptions = function(){
            return $http.get('serverscript/services/permission.php?_method=GET&_mode=option');
        }

//        obj.getPermissions = function(){
//            return $http.get('serverscript/services/permission.php?_method=GET&_category='+$location.path());
//        }

        obj.getPermission = function(id){
            return $http.get('serverscript/services/permission.php?_method=GET&_category='+$location.path()+'&id='+id);
        }

//        obj.createPermission = function(project){
//            return $http.post('serverscript/services/permission.php?_method=POST&_category='+$location.path(), project);
//        }

        obj.updatePermission = function(id, permission){
            return $http.post('serverscript/services/permission.php?_method=PUT&_category='+$location.path()+'&id='+id, permission);
        }

        obj.deletePermission = function(id){
            return $http.get('serverscript/services/permission.php?_method=DELETE&_category='+$location.path()+'&id='+id);
        }

        return obj;
    }]);
});
