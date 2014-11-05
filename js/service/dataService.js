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
            uri : "/serverscript/services/",
            serviceUri : "webboard",
            getParam : function(){
                return {
                    collection  : ""
                    ,db         : "ange"
                    ,match      : {}
                    ,projection : {}
                    ,jsonData   : {}
                    ,upsert     : ""
                    ,multi      : ""
                };
            }
        };

        var param = helpers.getParam();

        var obj = {

            getProject : function(projectid,callback){

                //console.log("getProject() : projectid = [" + projectid + "]");

                param.collection = "projects";
                param.match = JSON.stringify( { _id : projectid } );
                $http({
                    url : helpers.uri+"-findOne"
                    ,method : 'POST'
                    ,data : $.param(param)
                }).success(function(data, status, headers, config) {

                    if(!!callback){
                        callback(data, status, headers, config);
                    }

                }).error(function(data, status, headers, config) {

                    if(!!callback){
                        callback(data, status, headers, config);
                    }

                });
            }

            ,

            /* 연결열부하 기본값 가져오기 */
            getMasterLoadStdValues : function(callback){

                param.collection = "loadStdValue";
                param.match = JSON.stringify({_id:"default"});
                $http({
                    url : helpers.uri+"-findOne"
                    ,method : 'POST'
                    ,data : $.param(param)
                }).success(function(data, status, headers, config) {

                    if(!!callback){
                        callback(data, status, headers, config);
                    }

                }).error(function(data, status, headers, config) {$scope.status = status;});

            }

            /* 연결 열부하 목록 저장 */
            ,saveCntdHeatLoads_old : function(projectid,callback){

                var param = helpers.getParam();
                param.collection = "projects";
                param.match = JSON.stringify({_id:projectid});

                var output;

                output = angular.toJson($rootScope.ds.pj.loadStandard);
                output = angular.fromJson(output);

                param.jsonData = JSON.stringify({$set:{ "loadStandard" : output }})
                param.upsert = false;
                param.multi = false;

                $http({
                    url : helpers.uri+"-update"
                    ,method : 'POST'
                    ,data : $.param(param)
                }).success(function(data, status, headers, config) {

                    project.getProject($rootScope.ds.pj_id);
                    if(data.error){
                        alert(error.debugMsg);
                    }else{
                        alert("저장되었습니다.");
                    }

                }).error(function(data, status, headers, config) {$scope.status = status;});

            }



            /* 연결 열부하 목록 저장 */
            ,saveCntdHeatLoads : function(projectid,callback){

                var output;

                output = angular.toJson($rootScope.ds.pj.loadStandard);
                output = angular.fromJson(output);

                project.update({_id:projectid},{$set:{"loadStandard":output}},false,false,function(data, status, headers, config){
                    project.getProject($rootScope.ds.pj_id);
                    if(data.error){
                        alert(error.debugMsg);
                    }else{
                        alert("저장되었습니다.");
                    }
                })

            }

            /*
             project.update({_id:nice},{$set:{ "loadStandard" : output }},false,false,function(){})
             */
            ,update : function(match,dataObject,multi,upsert,callback){

                var param = helpers.getParam();
                param.collection = "projects";
                param.match = JSON.stringify(match);
                param.jsonData = JSON.stringify(dataObject);
                param.upsert = upsert;
                param.multi = multi;

                $http({
                    url : helpers.uri+"-update"
                    ,method : 'POST'
                    ,data : $.param(param)
                }).success(function(data, status, headers, config) {

                    callback(data,status,headers,config);

                }).error(function(data, status, headers, config) {

                    callback(data,status,headers,config);

                });

            }
            ,find : function(match,dataObject,multi,upsert,callback){

                var param = helpers.getParam();
                param.collection = "projects";
                param.match = JSON.stringify(match);
                param.jsonData = JSON.stringify(dataObject);
                param.upsert = upsert;
                param.multi = multi;

                $http({
                    url : helpers.uri+"-update"
                    ,method : 'POST'
                    ,data : $.param(param)
                }).success(function(data, status, headers, config) {

                    callback(data,status,headers,config);

                }).error(function(data, status, headers, config) {

                    callback(data,status,headers,config);

                });

            }
            ,
            /* 수용가별 연결열부하 각 항목 계산 로직 */
            calCntdHeatLoadByConsumer : function(obj,callback){

                /* 연면적 = 대지면적 * 용적률 */
                obj["realArea"]
                    = parseFloat( (obj.groundArea * obj.usingAreaRate).toFixed(2) );

                /* 난방면적 = 연면적 * 수요개발비율 * 난방면적율 */
                obj["heatingArea"]
                    = parseFloat(  (obj.realArea * obj.dmdDevRate * obj.heatingAreaRate).toFixed(2) );

                /* 냉방면적 = 난방면적  * 냉방면적율 */
                obj["coolingArea"]
                    = parseFloat(  (obj["heatingArea"] * obj.coolingAreaRate).toFixed(2) );

                /* 급탕면적 = 연면적 * 수요개발비율 * 급탕면적율 */
                obj["boilingArea"]
                    = parseFloat(  (obj.realArea * obj.dmdDevRate * obj.boilingAreaRate).toFixed(2) );

                /* 연결열부하 - 난방 = (난방면적 * 단위열부하) / 10^3 */
                obj["heatingCntdHeatLoad"]
                    = parseFloat(  ((obj.heatingArea  * obj.heatingUnitHeatLoad)  / ( 10 * 10 * 10 )).toFixed(2) );

                /* 연결열부하 - 급탕 = (급탕면적 * 단위열부하:급탕) / 10^3 */
                obj["boilingCntdHeatLoad"]
                    = parseFloat(  ((obj.boilingArea * obj.boilingUnitHeatLoad)   / ( 10 * 10 * 10 )).toFixed(2)  );

                /* 연결열부하 - 냉방 = 냉방면적 * 단위열부하 : 냉방 / 10^3 / 냉동기COP */
                obj["coolingCntdHeatLoad"]
                    = parseFloat(  (obj.coolingArea * obj.coolingUnitHeatLoad / ( 10 * 10 * 10 ) / obj.cooler).toFixed(2) );

                callback(obj);

            }

            /*        getCntdHeatLoad : function(){
             return schema.getTemplate("cntdHeatLoad");
             }*/



            , db : (function(uri,dbname) {
                var param = {
                    collection  : ""
                    ,db         : dbname
                    ,match      : {}
                    ,projection : {}
                    ,jsonData   : ""
                    ,upsert     : ""
                    ,multi      : ""
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
                                param.match  =  JSON.stringify(arguments[0]);
                                param.projection = {};
                                callback = arguments[1];
                            }else if(arguments.length===4){
                                param._method = arguments[0];
                                param._page = arguments[1];
                                param._search = arguments[2];
                                callback = arguments[3];
                            }

                            return $http({
                                url : helpers.uri+uri+".php"
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
                                param.match  = JSON.stringify(arguments[0]);
                                callback = arguments[1];
                            }else if(arguments.length===3){
                                param.match = JSON.stringify(arguments[0]);
                                param.projection = JSON.stringify(arguments[1]);
                                callback = arguments[2];
                            }

                            $http({
                                url : helpers.uri+helpers.serviceUri
                                ,method : 'POST'
                                ,data : $.param(param)
                                ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}
                            }).error(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}});
                            return true;

                        },
                        insert : function(){
                            param.jsonData = JSON.stringify(arguments[0]);
                            var callback = arguments[1];
                            $http({
                                url : helpers.uri+"-insert"
                                ,method : 'POST'
                                ,data : $.param(param)
                                ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}
                            }).error(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}});
                            return true;
                        },
                        save   : function(){
                            param.jsonData = JSON.stringify(arguments[0]);
                            var callback = arguments[1];
                            $http({
                                url : helpers.uri+"-save"
                                ,method : 'POST'
                                ,data : $.param(param)
                                ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}
                            }).error(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}});
                            return true;
                        },
                        update : function(){
                            param.match = JSON.stringify(arguments[0]);
                            param.jsonData = JSON.stringify(arguments[1])
                            param.upsert = arguments[2];
                            param.multi = arguments[3];
                            var callback = arguments[4];

                            $.post(uri+"-update",param,function(result,stat){
                                callback(result,stat);
                            },"json") ;

                            $http({
                                url : helpers.uri+"-update"
                                ,method : 'POST'
                                ,data : $.param(param)
                                ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}
                            }).error(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}});

                            return true;
                        },
                        remove : function(){
                            param.match = JSON.stringify(arguments[0]);
                            param.multi = arguments[1];
                            var callback = arguments[2];

                            $http({
                                url : helpers.uri+"-remove"
                                ,method : 'POST'
                                ,data : $.param(param)
                                ,headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}
                            }).error(function(data, status, headers, config) {if(!!callback){callback(data, status, headers, config);}});
                            return true;
                        }
                    }
                })
            })(helpers.serviceUri,"ange")

        };

        return obj;
    }]);
});
