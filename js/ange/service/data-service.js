/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : dataService 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.service('dataService', ['$http', '$location', 'SERVER', function($http, $location, SERVER){
        var helpers = {
            uri : SERVER.SERVER_URL,
            serviceUri : 'webboard',
            getParam : function(){
                return {
                    db         : 'ange'
                    ,_method    : ''        // CRUD 정보 (GET : 조회, POST : 등록, PUT : 수정, DELETE : 삭제)
                    ,_key       : ''        // 기본키
                    ,_type      : ''        // CRUD 타입 (list : 목록, item : 모델, )
                    ,_page      : {}        // 리스트 페이징 정보
                    ,_search    : {}        // 검색 조건 및 정렬
                    ,_phase     : ''        // CMS 컨텐츠 단계 (0 : 태스크등록, 10 : 원고작성, 11 : 원고승인대기, 12 : 원고반려, 13 : 원고승인완료, 20 : 편집작성, 21 : 편집승인대기, 22 : 편집반려, 23 : 편집승인완료, 30 : 출판대기, 40 : 완료)
                    ,_model     : {}        // 모델 정보 (json 형태에서 object 형태로 그대로 넘기는 방법으로 변경)
                    ,_category  : {}        // 카테고리 정보 (CMS에서는 사용안함)
                };
            }
        };

        var param = helpers.getParam();

        var obj = {

            login : function(key, model, callback){
                param._method = 'GET';
                param._type = '';
                param._key = key;
                param._model = model;
                $http({
                    url : helpers.uri+'login.php'
                    ,method : 'POST'
                    ,data : $.param(param)
                    ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }
                }).error(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }});
            }, logout : function(key, callback){
                param._method = 'DELETE';
                param._type = '';
                param._key = key;
                param._model = {};
                $http({
                    url : helpers.uri+'login.php'
                    ,method : 'POST'
                    ,data : $.param(param)
                    ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }
                }).error(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }});
            }, getSession : function(callback){
                param._method = 'GET';
                param._type = '';
                param._key = '';
                param._model = {};
                $http({
                    url : helpers.uri+'login.php'
                    ,method : 'POST'
                    ,data : $.param(param)
                    ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }
                }).error(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }});
            }, updateSession : function(key, model, callback){
                param._method = 'PUT';
                param._type = '';
                param._key = key;
                param._model = model;
                $http({
                    url : helpers.uri+'login.php'
                    ,method : 'POST'
                    ,data : $.param(param)
                    ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }
                }).error(function(data, status, headers, config) { if(!!callback){ callback(data, status, headers, config); }});
            }, updateStatus : function(uri,type,key,phase,callback){
                param._method = 'PUT';
                param._type = type;
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
                    ,_method    : ''
                    ,_type      : ''
                    ,_key       : ''
                    ,_page      : {}
                    ,_search    : {}
                    ,_model     : {}
                    ,_category  : {}
                };

                return ( function(uri) {
                    return {
                        find : function(){
                            var callback;

                            param._method = 'GET';
                            param._type = arguments[0];
                            param._key = '';
                            param._page = arguments[1];
                            param._search = arguments[2];
                            param._model = {};
                            callback = arguments[3];

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

                            param._method = 'GET';
                            param._type = arguments[0];
                            param._key = arguments[1];
                            param._page = {};
                            param._search = arguments[2];
                            param._model = {};
                            callback = arguments[3];

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
                            param._type = arguments[0];
                            param._key = "";
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
                        update : function(){
                            param._method = 'PUT';
                            param._type = arguments[0];
                            param._key = arguments[1];
                            param._page = {};
                            param._search = {};
                            param._model = arguments[2];
                            var callback = arguments[3];

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
                            param._type = arguments[0];
                            param._key = arguments[1];
                            param._page = {};
                            param._search = {};
                            param._model = {};
                            var callback = arguments[2];

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
