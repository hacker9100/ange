/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : projectService 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('projectService', ['$http', '$location', function($http, $location){
        var obj = {};

        var qs = function(obj, prefix){
            var str = [];
            for (var p in obj) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];
//                    v = obj[k];
                if (p != '_method') {
                    str.push(angular.isObject(v) ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        }

        obj.getProjectOptions = function(condition){
            condition
            return $http.get('serverscript/services/project.php?_method=GET&'+qs($location.search())+'&_mode=option');
        }

        obj.getProjects = function(){
            return $http.get('serverscript/services/project.php?_method=GET&'+qs($location.search())+'&_category='+$location.path());
        }

        obj.getProject = function(key){
            return $http.get('serverscript/services/project.php?_method=GET&'+qs($location.search())+'&_category='+$location.path()+'&id='+key);
        }

        obj.createProject = function(model){
            return $http.post('serverscript/services/project.php?_method=POST&_category='+$location.path(), model);
        }

        obj.updateProject = function(key, model){
            return $http.post('serverscript/services/project.php?_method=PUT&_category='+$location.path()+'&id='+key, model);
        }

        obj.deleteProject = function(key){
            return $http.get('serverscript/services/project.php?_method=DELETE&_category='+$location.path()+'&id='+key);
        }

        return obj;
    }]);
/*
    // Loading Indicator 테스트
    services.factory('projectServiceLoader', [ 'projectService', '$route', '$q', function(projectService, $route, $q) {
        return function() {
            var delay = $q.defer();
            projectService.getProjects({ }, function(recipe) {
                delay.resolve(recipe);
            }, function() {
                delay.reject('프로젝트 목록을 가져올 수 없습니다');
            });
            return delay.promise;
        };
    }
    ]);
*/
});
