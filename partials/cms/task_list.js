/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('task_list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'COMMON', function ($scope, $rootScope, $stateParams, $location, dialogs, COMMON) {

        /********** 초기화 **********/
        // 목록 데이터
        $scope.listData = [];
        // 검색 조건
        $scope.search = {};
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
            $scope.oneAtATime = true;

            for (var i = nowYear - 5; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            // 카테고리 목록 조회
            var ret = $scope.getList('cms/category', 'list', {}, {}, false)
                .then(function(data){
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
                })
                .catch(function(error){console.log(error)});

            // 검색어
            var condition = [{name: "기자", value: "EDITOR_NM"}, {name: "제목+내용", value: "SUBJECT"}];

            $scope.years = year;
            $scope.condition = condition;
//            $scope.search.YEAR = nowYear+'';
            $scope.search.CONDITION = condition[0];

            return ret;
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

        // 연도 변경 선택
        $scope.$watch('search.YEAR', function (data) {
            if (data != null) {
                $scope.getList('cms/project', 'list', {}, {YEAR: data}, false)
                    .then(function(data){$scope.projects = data;})
                    .catch(function(error){$scope.projects = []; console.log(error)});
            }
        });

        // 등록 버튼 클릭
        $scope.click_createNewTask = function () {
            $location.url('/task/edit/0');
        };

        // 태스크 조회 화면 이동
        $scope.click_showViewTask = function (key) {
            $location.url('/task/view/'+key);
        };

        // 태스크 수정 화면 이동
        $scope.click_showEditTask = function (item) {
            if (!($rootScope.role == 'CMS_ADMIN' || $rootScope.role == 'MANAGER') && $rootScope.uid != item.REG_UID) {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $location.url('/task/edit/'+item.NO);
        };

        // 콘텐츠 조회 화면 이동
        $scope.click_showViewContent = function (key) {
            $location.url('/'+$stateParams.menu+'/view/'+key);
        };

        // 콘텐츠 수정 화면 이동
        $scope.click_showEditContent = function (item) {
            if (!($rootScope.role == 'CMS_ADMIN' || $rootScope.role == 'MANAGER' || $rootScope.role == 'MAGAZINE') && $rootScope.uid != item.EDITOR_ID) {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $location.url('/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 이력조회 버튼 클릭
        $scope.click_showGetHistory = function (key) {
            $scope.openModal({TASK_NO : key}, 'lg');
        };

        $scope.openModal = function (item, size) {
            var dlg = dialogs.create('/partials/cms/history.html',
                function($scope, $controller, $modalInstance, data) {
                    angular.extend(this, $controller('cms_common', {$scope: $scope}));

                    $scope.getList('cms/history', 'list', {}, item, true).then(function(data){$scope.list = data;})
                        .catch(function(error){console.log(error);});

                    $scope.list = data;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };
                },item,{size:size,keyboard: true});
            dlg.result.then(function(){

            },function(){

            });
        };

        // 삭제 버튼 클릭
        $scope.click_deleteTask = function (idx) {

            var task = $scope.list[idx];

            if (task.PHASE == '30') {
                dialogs.notify('알림', '완료 상태의 태스크는 삭제할 수 없습니다.', {size: 'md'});
                return;
            }

            $scope.deleteItem('cms/task', 'item', task.NO, true)
                .then(function(){dialogs.notify('알림', '삭제 되었습니다.', {size: 'md'});})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 페이지 사이즈
//        $scope.PAGE_SIZE = COMMON.PAGE_SIZE;
        $scope.PAGE_SIZE = 10;

        $scope.list = [];
        $scope.pageNo = 0;
        $scope.pageSize = $scope.PAGE_SIZE;
        $scope.perCnt = 0;
        $scope.perSize = $scope.PAGE_SIZE / 2;
        $scope.totalCnt = 0;

        // 검색 버튼 클릭
        $scope.click_searchTask = function() {
            $scope.list = [];
            $scope.listData = [];

            $scope.pageNo = 0;
            $scope.perCnt = 0;

            $scope.search.CATEGORY = $scope.CATEGORY;
            $scope.getTaskList();
        };

        // 태스크 목록 조회
        $scope.getTaskList = function () {
            $scope.isLoading = true;
            $scope.getList('cms/task', 'list', {NO:$scope.pageNo, SIZE:$scope.pageSize}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    $scope.totalCnt = total_cnt;

                    angular.forEach(data, function(model) {
                        $scope.listData.push(model);
                    });
                    if ($scope.list.length == 0) {
                        $scope.list = $scope.listData.slice($scope.perCnt, $scope.perSize);
                    }
                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; console.log(error);})
                .finally(function(){$scope.isLoading = false;});
        };

        $scope.$watch('perCnt', function() {
            if ( $scope.perCnt >= $scope.list.length) {
                angular.forEach($scope.listData.slice($scope.perCnt, $scope.perCnt + $scope.perSize), function(model) {
                    $scope.list.push(model);
                });
            }
        })

        $scope.addTask = function () {
            $scope.perCnt += $scope.perSize;
            if ($scope.perCnt + $scope.perSize >= $scope.totalCnt) return;

            if ($scope.perCnt + $scope.perSize >= $scope.listData.length) {
                $scope.pageNo++;
                $scope.getTaskList();
            }
        };

        /********** 화면 초기화 **********/
        $scope.isTask = false;
        $scope.isEdit = true;
        if ($stateParams.menu == 'archive') {
            $scope.search = {PHASE: '31'};
            $scope.isTask = false;
            $scope.isEdit = false;
            $scope.viewContentBtn = '원고 조회';
            $scope.editContentBtn = '원고 작성';
        } else if ($stateParams.menu == 'article') {
            $scope.search = {PHASE: '0, 10, 11, 12'};
            $scope.viewContentBtn = '원고 조회';
            $scope.editContentBtn = '원고 작성';
        } else if ($stateParams.menu == "article_confirm") {
            $scope.search = {PHASE: '11, 12, 13'};
            $scope.viewContentBtn = '원고 조회';
            $scope.editContentBtn = '원고 검수';
        } else if ($stateParams.menu == 'edit') {
            $scope.search = {PHASE: '13, 20, 21, 22'};
            $scope.viewContentBtn = '편집 조회';
            $scope.editContentBtn = '편집 작성';
        } else if ($stateParams.menu == "edit_confirm") {
            $scope.search = {PHASE: '21, 22, 30'};
            $scope.viewContentBtn = '편집 조회';
            $scope.editContentBtn = '편집 검수';
        } else {
            $scope.isTask = true;
            $scope.search = {};
            $scope.viewContentBtn = '원고 조회';
            $scope.editContentBtn = '원고 작성';
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getTaskList();

    }]);
});
