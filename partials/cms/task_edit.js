/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : projectEdit.html 화면 콘트롤러
 */
'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('task_edit', ['$scope', '$stateParams', 'dataService', '$q', '$location', function ($scope, $stateParams, dataService, $q, $location) {

        /********** 초기화 **********/
        // 태스크 모델 초기화
        $scope.item = {};
        // 선택 카테고리
        $scope.CATEGORY = [];
        // 카테고리 데이터
        $scope.category = [];

        // 카테고리 선택 콤보박스 설정
        $scope.select_settings = {externalIdProp: '', idProp: 'NO', displayProp: 'CATEGORY_NM', dynamicTitle: false, showCheckAll: false, showUncheckAll: false};

        // 초기화
        $scope.initEdit = function() {
            var deferred = $q.defer();

            $q.all([
                dataService.db('project').find({},{},null),
                dataService.db('category').find({},{},null)
                ])
                .then( function(results) {

                    if (results.length > 1) {
                        if (results[0].status != 200) {
                            deferred.reject('프로젝트 조회에 실패 했습니다.');
                        } else {
                            if (angular.isObject(results[0].data)) {
                                if (!results[0].err) {
                                    $scope.projects = results[0].data;
                                } else {
                                    deferred.reject(results[0].msg);
                                }
                            } else {
                                // TODO: 데이터가 없을 경우 처리
                                deferred.reject("프로젝트 데이터가 없습니다.");
                            }
                        }

                        if (results[1].status != 200) {
                            deferred.reject('카테고리 조회에 실패 했습니다.');
                        } else {
                            if (angular.isObject(results[1].data)) {
                                if (!results[1].err) {

                                    $scope.category = results[1].data;

                                    var category_a = [];
                                    var category_b = [];

                                    for (var i in results[1].data) {
                                        var item = results[1].data[i];

                                        if (item.CATEGORY_GB == '1') {
                                            category_a.push(item);
                                        } else if (item.CATEGORY_GB == '2' && item.PARENT_NO == '0') {
                                            category_b.push(item);
                                        }
                                    }

                                    $scope.category_a = category_a;
                                    $scope.category_b = category_b;
                                } else {
                                    deferred.reject(results[1].msg);
                                }
                            } else {
                                // TODO: 데이터가 없을 경우 처리
                                deferred.reject("카테고리 데이터가 없습니다.");
                            }
                        }

                        deferred.resolve();
                    }
                },function(error) {
                    deferred.reject(error);
                });

//            dataService.db('project').find({},{},function(data, status){
//                if (status != 200) {
//                    deferred.reject('프로젝트 조회에 실패 했습니다.');
//                } else {
//                    if (angular.isObject(data)) {
//                        if (!data.err) {
//                            $scope.projects = data;
//                        } else {
//                            deferred.reject(data);
//                        }
//                    } else {
//                        // TODO: 데이터가 없을 경우 처리
//                        deferred.reject("프로젝트 데이터가 없습니다.");
//                    }
//                }
//            });
//
//            // 카테고리 목록 조회
//            dataService.db('category').find({},{},function(data, status){
//                if (status != 200) {
//                    deferred.reject('카테고리 조회에 실패 했습니다.');
//                } else {
//                    if (angular.isObject(data)) {
//                        if (!data.err) {
//
//                            $scope.category = data;
//
//                            var category_a = [];
//                            var category_b = [];
//
//                            for (var i in data) {
//                                var item = data[i];
//
//                                if (item.CATEGORY_GB == '1') {
//                                    category_a.push(item);
//                                } else if (item.CATEGORY_GB == '2' && item.PARENT_NO == '0') {
//                                    category_b.push(item);
//                                }
//                            }
//
//                            $scope.category_a = category_a;
//                            $scope.category_b = category_b;
//
//                            deferred.resolve();
//                        } else {
//                            deferred.reject(data);
//                        }
//                    } else {
//                        // TODO: 데이터가 없을 경우 처리
//                        deferred.reject("카테고리 데이터가 없습니다.");
//                    }
//                }
//            });

            // ui bootstrap 달력
            $scope.today = function() {
                $scope.item.CLOSE_YMD = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.item.CLOSE_YMD = null;
            };

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            return deferred.promise;
        };

        /********** 이벤트 **********/
        // 카테고리 주제 대분류 선택
        $scope.$watch('CATEGORY_M', function(data) {
            var category_s = [];

            if (data != undefined) {
                for (var i in $scope.category) {
                    var item = $scope.category[i];

                    if (item.PARENT_NO == data.NO && item.CATEGORY_GB == '2' && item.PARENT_NO != '0') {
                        category_s.push(item);
                    }
                }
            }

            $scope.category_s = category_s;
        });

        // 추가된 카테고리 클릭
        $scope.click_removeCategory = function(idx) {
            $scope.CATEGORY.splice(idx, 1);
        }

        // 태스크 목록 이동
        $scope.click_showTaskList = function () {
            $location.path('/task');
        };

        // 태스크 조회
        $scope.getTask = function () {
            var deferred = $q.defer();

            dataService.db('task').findOne($stateParams.id,{},function(data, status){
                if (status != 200) {
                    deferred.reject('태스크 조회에 실패 했습니다.');
                } else {
                    if (angular.isObject(data)) {
                        if (!data.err) {
                            $scope.item = data;
                            $scope.CATEGORY = angular.fromJson(data.CATEGORY);

                            angular.forEach($scope.projects,function(value, idx){
                                if(value.NO == data.PROJECT_NO);
                                $scope.item.PROJECT = $scope.projects[idx];
                                return;
                            });

                            deferred.resolve();
                        } else {
                            deferred.reject(data);
                        }
                    } else {
                        // TODO: 데이터가 없을 경우 처리
                        deferred.reject("태스크 데이터가 없습니다.");
                    }
                }
            });

            return deferred.promise;
        };

        // 태스크 저장 버튼 클릭
        $scope.click_saveTask = function () {
            if ($stateParams.id == 0) {
                dataService.db('task').insert($scope.item,function(data, status){
                    if (status != 200) {
                        alert('태스크 등록에 실패 했습니다.');
                    } else {
                        if (!data.err) {
                            $location.url('/task');
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            } else {
                dataService.db('task').update($stateParams.id,$scope.item,function(data, status){
                    if (status != 200) {
                        alert('태스크 수정에 실패 했습니다.');
                    } else {
                        if (!data.err) {
                            $location.url('/task');
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            }
        };

        $scope.initUpdate = function() {
            if ( $stateParams.id != 0) {
                $scope.getTask();
            }
        }

        /********** 화면 초기화 **********/
        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';
        if ( $stateParams.id != 0) {
            $scope.$parent.pageTitle = '태스크 수정';
            $scope.$parent.pageDescription = '태스크를 수정합니다.';
        } else {
            $scope.$parent.pageTitle = '태스크 등록';
            $scope.$parent.pageDescription = '태스크를 등록합니다.';
        }

        $scope.$parent.getSession()
            .then($scope.$parent.sessionCheck)
            .then($scope.initEdit)
            .then($scope.initUpdate)
            .catch($scope.$parent.reportProblems);

    }]);
});
