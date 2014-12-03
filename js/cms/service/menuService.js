/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : service 선언
 */
define(['./services'], function (services, $http, $location) {
    var obj = {};
    obj.getContents = function(){
        return $http.get('serverscript/api.php?_method=GET&_category='+$location.path());
    }

    return obj;
});
