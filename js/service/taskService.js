/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : taskService 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('taskService', ['$http', '$location', function($http, $location){
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

        obj.getTasks = function(){
            alert("getTasks")
            return $http.get('serverscript/services/task.php?_method=GET&'+qs($location.search())+'&_category='+$location.path());
        }

        obj.getTask = function(id){
            return $http.get('serverscript/services/task.php?_method=GET&'+qs($location.search())+'&_category='+$location.path()+'&id='+id);
        }

        obj.createTask = function(task){
            return $http.post('serverscript/services/task.php?_method=POST&_category='+$location.path(), task);
        }

        obj.updateTask = function(id, task){
            return $http.post('serverscript/services/task.php?_method=PUT&_category='+$location.path()+'&id='+id, task);
        }

        obj.updateStatusTask = function(id, task){
            return $http.post('serverscript/services/task.php?_method=PUT&'+qs($location.search())+'&_category='+$location.path()+'&id='+id, task);
        }

        obj.deleteTask = function(id){
            return $http.get('serverscript/services/task.php?_method=DELETE&_category='+$location.path()+'&id='+id);
        }

        return obj;
    }]);
});
