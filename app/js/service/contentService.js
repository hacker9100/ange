/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : service 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('contentsService', ['$http', '$location', function($http, $location){
        var obj = {};
        obj.getContents = function(){
            return $http.get('services/api.php?_method=GET&_category='+$location.path());
        }

        obj.getContent = function(id){
            return $http.get('services/api.php?_method=GET&_category='+$location.path()+'&id='+id);
        }

        obj.deleteContent = function(id){
            return $http.get('services/api.php?_method=DELETE&_category='+$location.path()+'&_id='+id);
        }

        obj.updateContent = function(id, content){
            return $http.post('services/api.php?_method=PUT&_category='+$location.path()+'&_id='+id, content);
        }

        obj.createContent = function(content){
            return $http.post('services/api.php?_method=POST&_category='+$location.path(), content);
        }

        return obj;
    }]);
});
