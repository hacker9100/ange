/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : approvalService 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('approvalService', ['$http', '$location', function($http, $location){
        var obj = {};

        var qs = function(obj, prefix){
            var str = [];
            for (var p in obj) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[k];

                if (p != '_method')
                    str.push(angular.isObject(v) ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
            }
            return str.join("&");
        }

//        obj.getContents = function(){
////            alert(qs($location.search()));
//            return $http.get('serverscript/services/content.php?_method=GET&'+qs($location.search())+'&_category='+$location.path());
//        }
//
//        obj.getContent = function(id){
//            return $http.get('serverscript/services/content.php?_method=GET&'+qs($location.search())+'&_category='+$location.path()+'&id='+id);
//        }

        obj.createApproval = function(content){
            return $http.post('serverscript/services/approval.php?_method=POST&'+qs($location.search())+'&_category='+$location.path(), content);
        }

//        obj.updateContent = function(id, content){
//            return $http.post('serverscript/services/content.php?_method=PUT&'+qs($location.search())+'&_category='+$location.path()+'&id='+id, content);
//        }
//
//        obj.updateStatusContent = function(id, content){
//            return $http.post('serverscript/services/content.php?_method=PUT&'+qs($location.search())+'&_category='+$location.path()+'&id='+id, content);
//        }
//
//        obj.deleteContent = function(id){
//            return $http.get('serverscript/services/content.php?_method=DELETE&_category='+$location.path()+'&id='+id);
//        }

        return obj;
    }]);
});
