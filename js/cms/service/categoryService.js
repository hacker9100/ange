/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : categoryService 선언
 */
define([
    './services'
], function (services) {
    'use strict';

    services.service('categoryService', ['$http', '$location', function($http, $location){
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

        return {
            getCategories : function(){
                return $http.get('serverscript/services/category.php?_method=GET&'+qs($location.search())+'&_category='+$location.path());
            },

            getCategory : function(key){
                return $http.get('serverscript/services/category.php?_method=GET&'+qs($location.search())+'&_category='+$location.path()+'&_id='+key);
            },

            deleteCategory : function(key){
                return $http.get('serverscript/services/category.php?_method=DELETE&_category='+$location.path()+'&_id='+key);
            },

            updateCategory : function(key, model){
                return $http.post('serverscript/services/category.php?_method=PUT&_category='+$location.path()+'&_id='+key, model);
            },

            createCategory :  function(model){
                return $http.post('serverscript/services/category.php?_method=POST&_category='+$location.path(), model);
            }
        }
//        return obj;
    }]);
});
