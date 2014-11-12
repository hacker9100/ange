/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : dataService 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('dataService', ['$http', '$location', function($http, $location){
        var helpers = {
            uri : '/serverscript/services/',
            serviceUri : 'webboard',
            getParam : function(){
                return {
                    db         : 'ange'
                    ,_method    : ''
                    ,_key       : ''
                    ,_phase     : ''
                    ,_model     : {}
                    ,_category  : {}
                };
            }
        };

        var param = helpers.getParam();

        var obj = {

            login : function(key, model, callback){
                param._method = 'GET';
                param._key = key;
                param._model = model;
                $http({
                    url : helpers.uri+'login.php'
                    ,method : 'POST'
                    ,data : $.param(param)
                    ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }
                }).error(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }});
            },

            getSession : function(callback){
                param._method = 'GET';
                $http({
                    url : helpers.uri+'login.php'
                    ,method : 'POST'
                    ,data : $.param(param)
                    ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }
                }).error(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }});
            }, updateStatus : function(uri,key,phase,callback){

                //console.log("getProject() : projectid = [" + projectid + "]");

                param._method = 'PUT';
                param._key = key;
                param._phase = phase;
                $http({
                    url : helpers.uri+uri+'.php'
                    ,method : 'POST'
                    ,data : $.param(param)
                    ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }
                }).error(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }});
            }, db : (function(uri,dbname) {
                var param = {
                    db         : dbname
                    ,_method    : ""
                    ,_key       : ""
                    ,_page      : {}
                    ,_search    : {}
                    ,_model     : {}
                    ,_category  : {}
                };

                return ( function(uri) {
                    return {
                        find : function(){
                            var callback = function(result,stat){ console.log(result); } ;

                            if(arguments.length===2){
                                param._method = 'GET';
                                param._key = "";
                                param._page = {};
                                param._search = arguments[0];
                                param._model = {};
                                callback = arguments[1];
                            }else if(arguments.length===3){
                                param._method = 'GET';
                                param._key = "";
                                param._page = arguments[0];
                                param._search = arguments[1];
                                param._model = {};
                                callback = arguments[2];
                            }

                            return $http({
                                url : helpers.uri+uri+'.php'
                                ,method : 'POST'
                                ,data : $.param(param)
                                ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function(data, status, headers, config) { if(!!callback){callback(data, status, headers, config);}
                            }).error(function(data, status, headers, config) { if(!!callback){callback(data, status, headers, config);}});
                            return true;
                        },
                        findOne : function(){
                            var callback ;

                            if(arguments.length===2){
                                param._method = 'GET';
                                param._key = arguments[0];
                                param._page = {};
                                param._search = {};
                                param._model = {};
                                callback = arguments[1];
                            }else if(arguments.length===3){
                                param._method = 'GET';
                                param._key = arguments[0];
                                param._page = {};
                                param._search = arguments[1];
                                param._model = {};
                                callback = arguments[2];
                            }

                            $http({
                                url : helpers.uri+uri+'.php'
                                ,method : 'POST'
                                ,data : $.param(param)
                                ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}
                            }).error(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}});
                            return true;

                        },
                        insert : function(){
                            param._method = 'POST';
                            param._key = "";
                            param._page = {};
                            param._search = {};
                            param._model = arguments[0];
                            var callback = arguments[1];

                            $http({
                                url : helpers.uri+uri+'.php'
                                ,method : 'POST'
                                ,data : $.param(param)
                                ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}
                            }).error(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}});
                            return true;
                        },
                        update : function(){
                            param._method = 'PUT';
                            param._key = arguments[0];
                            param._page = {};
                            param._search = {};
                            param._model = arguments[1];
                            var callback = arguments[2];

                            $http({
                                url : helpers.uri+uri+'.php'
                                ,method : 'POST'
                                ,data : $.param(param)
                                ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}
                            }).error(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}});

                            return true;
                        },
                        remove : function(){
                            param._method = 'DELETE';
                            param._key = arguments[0];
                            param._page = {};
                            param._search = {};
                            param._model = {};
                            var callback = arguments[1];

                            $http({
                                url : helpers.uri+uri+'.php'
                                ,method : 'POST'
                                ,data : $.param(param)
                                ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}
                            }).error(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}});
                            return true;
                        }
                    }
                })
            })(helpers.serviceUri,'ange')

        };

        return obj;
    }]);
});
