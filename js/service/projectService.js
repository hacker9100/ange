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
        obj.getProjects = function(){
            return $http.get('serverscript/services/project.php?_method=GET&_category='+$location.path());
        }

        obj.getProject = function(id){
            return $http.get('serverscript/services/project.php?_method=GET&_category='+$location.path()+'&id='+id);
        }

        obj.createProject = function(project){
            return $http.post('serverscript/services/project.php?_method=POST&_category='+$location.path(), project);
        }

        obj.updateProject = function(id, project){
            return $http.post('serverscript/services/project.php?_method=PUT&_category='+$location.path()+'&id='+id, project);
        }

        obj.deleteProject = function(id){
            return $http.get('serverscript/services/project.php?_method=DELETE&_category='+$location.path()+'&id='+id);
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
