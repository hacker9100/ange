/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : webboardService 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('webboardService', ['$http', '$location', function($http, $location){
        var obj = {};
        obj.getBoards = function(){
            return $http.get('serverscript/services/webboard.php?_method=GET&_category='+$location.path());
        }

        obj.getBoard = function(id){
            return $http.get('serverscript/services/webboard.php?_method=GET&_category='+$location.path()+'&id='+id);
        }

        obj.deleteBoard = function(id){
            return $http.get('serverscript/services/webboard.php?_method=DELETE&_category='+$location.path()+'&id='+id);
        }

        obj.updateBoard = function(id, board){
            return $http.post('serverscript/services/webboard.php?_method=PUT&_category='+$location.path()+'&id='+id, board);
        }

        obj.createBoard = function(board){
            return $http.post('serverscript/services/webboard.php?_method=POST&_category='+$location.path(), board);
        }

        return obj;
    }]);
});
