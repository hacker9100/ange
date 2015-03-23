/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : projectEdit.html 화면 콘트롤러
 */
'use strict';

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('task-edit', ['$scope', '$rootScope', '$stateParams', '$location', '$controller', '$q', '$modal', 'dialogs', '$filter', function ($scope, $rootScope, $stateParams, $location, $controller, $q, $modal, dialogs, $filter) {

        /********** 초기화 **********/
        // 태스크 모델 초기화
        $scope.item = {};
        // 선택 카테고리
        $scope.CATEGORY = [];
        // 카테고리 데이터
        $scope.category = [];

        // 카테고리 선택 콤보박스 설정
        $scope.select_settings = {externalIdProp: '', idProp: 'NO', displayProp: 'CATEGORY_NM', dynamicTitle: false, showCheckAll: false, showUncheckAll: false};

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.init = function() {
            for (var i = 1999; i < nowYear + 2; i++) {
                year.push(i+'');
            }

            $scope.years = year;
            $scope.YEAR = nowYear+'';

            var deferred = $q.defer();

            $q.all([
//                    $scope.getList('cms/project', 'list', {}, {}, false).then(function(data){$scope.projects = data;}),
                    $scope.getList('cms/category', 'list', {}, {SYSTEM_GB: 'CMS'}, false).then(function(data){
                        $scope.category = data;

                        var category_a = [];
                        var category_b = [];

                        for (var i in data) {
                            var item = data[i];

                            if (item.CATEGORY_GB == '1' && item.CATEGORY_ST == '0') {
                                category_a.push(item);
                            } else if (item.CATEGORY_GB == '2' && item.CATEGORY_ST == '0' && item.PARENT_NO == '0') {
                                category_b.push(item);
                            }
                        }

                        $scope.category_a = category_a;
                        $scope.category_b = category_b;
                    }),
                    $scope.getList('cms/section', 'list', {}, {YEAR: ''}, false).then(function(data){$scope.projects = data;}),
                    $scope.getList('cms/section', 'list', {}, {ROLE: true}, false).then(function(data){$scope.seasons = data;}),
                    $scope.getList('cms/section', 'list', {}, {}, false).then(function(data){$scope.sections = data;})
                ])
                .then( function(results) {
                    deferred.resolve();
                },function(error) {
                    deferred.reject(error);
                });

            // ui bootstrap 달력
            $scope.format = 'yyyy-MM-dd';

            $scope.today = function() {
                $scope.item.CLOSE_YMD = new Date();
                $scope.item.DEPLOY_YMD = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.item.CLOSE_YMD = null;
            };

            $scope.open = function($event, opened) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope[opened] = true;
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

                    if (item.PARENT_NO == data.NO && item.CATEGORY_GB == '2' && item.CATEGORY_ST == '0' && item.PARENT_NO != '0') {
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

        /*// 연도 변경 선택
         $scope.$watch('YEAR', function (data) {
         if (data != null) {
         $scope.getList('cms/project', 'list', {}, {YEAR: $scope.YEAR}, false)
         .then(function(data){
         $scope.projects = data;

         //if ($scope.item.PROJECT_NO != undefined) {
         // 프로젝트
         angular.forEach($scope.projects,function(value, idx){

         console.log('value.NO = '+value.NO);

         if(value.NO == $scope.item.PROJECT){
         $scope.item.PROJECT = $scope.projects[idx];
         return;
         }else{
         $scope.item.PROJECT = $scope.projects[idx];

         console.log('$scope.item.PROJECT = '+$scope.item.PROJECT);
         }

         });

         console.log('end');
         //}
         })
         .catch(function(error){console.log(error)});
         }
         });*/

        // 연도 변경 선택
        $scope.$watch('YEAR', function (data) {
            if (data != null) {
                $scope.getList('cms/project', 'list', {}, {YEAR: data}, false)
                    .then(function(data){

                        $scope.projects = data;

                        if($stateParams.id == 0) { // 등록할 때 섹션명 리스트 조회하여 첫번째값으로 셋팅
                            $scope.item.PROJECT = data[0]
                        } else { // 수정할때 섹션명 리스트를 조회 한 후 해당 섹션명을 선택 후 셋팅
                            for(var i=0; i < $scope.projects.length; i ++){
                               $scope.item.PROJECT = $scope.projects[i];
                            }
                        }
                })
                ['catch'](function(error){$scope.projects = []; console.log(error)});
            } else {
                $scope.getList('cms/project', 'list', {}, {YEAR: ''}, false).then(function(data){$scope.projects = data;})
            }
        });

        // 태스크 목록 이동
        $scope.click_showTaskList = function () {
            $location.path('/task/list');
        };

        // 태스크 조회
        $scope.getTask = function () {
            $scope.getItem('cms/task', 'item', $stateParams.id, {}, true)
                .then(function(data){
                    $scope.item = data;

                    if (data.CATEGORY != null){
                        $scope.CATEGORY = angular.fromJson(data.CATEGORY);
                    }

                    $scope.YEAR = data.YEAR;

                    // 프로젝트
                   angular.forEach($scope.projects,function(value, idx){
                        if(value.NO == data.PROJECT_NO){
                            $scope.item.PROJECT = $scope.projects[idx];
                            return;
                        }
                    });

                    // 섹션 - 시즌명
                    var idx = 0;
                    for(var i=0; i < $scope.seasons.length; i ++){
                        if(JSON.stringify(data.SEASON_NM) == JSON.stringify($scope.seasons[i].SEASON_NM)){
                            idx = i;
                        }
                    }
                    $scope.item.SEASON_NM = $scope.seasons[idx];

                    // 섹션 - 섹션명
                    var idx = 0;
                    for(var i=0; i < $scope.sections.length; i ++){
                        if(JSON.stringify(data.SECTION_NM) == JSON.stringify($scope.sections[i].SECTION_NM)){
                            idx = i;
                        }
                    }
                    $scope.item.SECTION = $scope.sections[idx];
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };


        $scope.$watch('item.SEASON_NM', function (data) {
            if (data != null) {
                $scope.getList('cms/section', 'list', {}, {SEASON_NM: data.SEASON_NM}, false)
                    .then(function(data){
                        $scope.sections = data;

                        if($stateParams.id == 0) { // 등록할 때 섹션명 리스트 조회하여 첫번째값으로 셋팅
                            $scope.item.SECTION = data[0]
                        } else { // 수정할때 섹션명 리스트를 조회 한 후 해당 섹션명을 선택 후 셋팅
                            for(var i=0; i < $scope.sections.length; i ++){
                                if(JSON.stringify($scope.item.SECTION.SECTION_NM) == JSON.stringify($scope.sections[i].SECTION_NM)){
                                    $scope.item.SECTION = $scope.sections[i];
                                }
                            }
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }else {
                $scope.getList('cms/section', 'list', {}, {}, false).then(function(data){$scope.sections = data;})
            }

        });

        // 태스크 저장 버튼 클릭
        $scope.click_saveTask = function () {
            $scope.item.CATEGORY = $scope.CATEGORY;
            $scope.item.CLOSE_YMD = $filter('date')($scope.item.CLOSE_YMD, 'yyyy-MM-dd');
            $scope.item.DEPLOY_YMD = $filter('date')($scope.item.DEPLOY_YMD, 'yyyy-MM-dd');

            if ($stateParams.id == 0) {
                $scope.insertItem('cms/task', 'item', $scope.item, false)
                    .then(function(){$location.url('/task/list');})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('cms/task', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){$location.url('/task/list');})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.initUpdate = function() {
            if ( $stateParams.id != 0) {
                $scope.getTask();
            }
        }

        // 사용자 선택 버튼 클릭
        $scope.click_selectEditor = function () {
            $scope.openModal(true, {ROLE_ID : 'IN_EDITOR, OUT_EDITOR'});
        }

        $scope.openModal = function (modal, search, size) {
            var dlg = dialogs.create('/partials/cms/contact-list.html',
                ['$modalInstance', function ($modalInstance) {
                    $scope.isModal = true;
                    $scope.search = search;

                    // 사용자 선택 클릭
                    $scope.click_selectCmsUser = function (item) {
                        $modalInstance.close(item);
                    }

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };

                }], search, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(user){
                $scope.item.EDITOR_ID = user.USER_ID;
                $scope.item.EDITOR_NM = user.USER_NM;
            },function(){

            });
        }

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.initUpdate)
            ['catch']($scope.reportProblems);

        console.log($rootScope.uid);

    }]);
});
