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
    controllers.controller('task_edit', ['$scope', '$stateParams', '$location', '$controller', '$q', function ($scope, $stateParams, $location, $controller, $q) {

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

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
        $scope.init = function() {
            var deferred = $q.defer();

            $q.all([
                    $scope.getList('project', {}, {}, false).then(function(data){$scope.projects = data;}),
                    $scope.getList('category', {}, {}, false).then(function(data){
                        $scope.category = data;

                        var category_a = [];
                        var category_b = [];

                        for (var i in data) {
                            var item = data[i];

                            if (item.CATEGORY_GB == '1') {
                                category_a.push(item);
                            } else if (item.CATEGORY_GB == '2' && item.PARENT_NO == '0') {
                                category_b.push(item);
                            }
                        }

                        $scope.category_a = category_a;
                        $scope.category_b = category_b;
                    })
                ])
                .then( function(results) {
                    deferred.resolve();
                },function(error) {
                    deferred.reject(error);
                });

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
            $scope.getItem('task', $stateParams.id, {}, true)
                .then(function(data){
                    $scope.item = data;
                    $scope.CATEGORY = angular.fromJson(data.CATEGORY);

                    angular.forEach($scope.projects,function(value, idx){
                        if(value.NO == data.PROJECT_NO);
                        $scope.item.PROJECT = $scope.projects[idx];
                        return;
                    });
                })
                .catch(function(error){throw('태스크:'+error);});
        };

        // 태스크 저장 버튼 클릭
        $scope.click_saveTask = function () {
            if ($stateParams.id == 0) {
                $scope.insertItem('task', $scope.item, false)
                    .then(function(){$location.url('/task');})
                    .catch(function(error){alert(error)});
            } else {
                $scope.updateItem('task', $stateParams.id, $scope.item, false)
                    .then(function(){$location.url('/task');})
                    .catch(function(error){alert(error)});
            }
        };

        $scope.initUpdate = function() {
            if ( $stateParams.id != 0) {
                $scope.getTask();
            }
        }

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.initUpdate)
            .catch($scope.reportProblems);

    }]);
});
