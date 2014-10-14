/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : projectService 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('contentService', ['$http', '$location', function($http, $location){
        var obj = {};
        obj.getContents = function(){
            return $http.get('serverscript/services/content.php?_method=GET&_category='+$location.path());
        }

        obj.getContent = function(id){
            return $http.get('serverscript/services/content.php?_method=GET&_category='+$location.path()+'&id='+id);
        }

        obj.createContent = function(content){
            return $http.post('serverscript/services/content.php?_method=POST&_category='+$location.path(), content);
        }

        obj.updateContent = function(id, content){
            return $http.post('serverscript/services/content.php?_method=PUT&_category='+$location.path()+'&id='+id, content);
        }

        obj.deleteContent = function(id){
            return $http.get('serverscript/services/content.php?_method=DELETE&_category='+$location.path()+'&id='+id);
        }

        return obj;
    }]);
});
