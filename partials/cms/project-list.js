/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project-list.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'COMMON', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, COMMON) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.search = {};

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.init = function() {
            for (var i = 1999; i < nowYear + 2; i++) {
                year.push(i+'');
            }

            // 검색어
            var condition = [{name: "등록자", value: "REG_NM"}, {name: "제목+내용", value: "SUBJECT"}];

            $scope.years = year;
            $scope.conditions = condition;
            $scope.search.CONDITION = condition[0];
        };

        /********** 이벤트 **********/
        // 등록 버튼 클릭
        $scope.click_createNewProject = function () {
            $location.path('/project/edit/0');
        };

        // 조회 화면 이동
        $scope.click_showViewProject = function (key) {
            $location.url('/project/view/'+key);
        };

        // 수정 화면 이동
        $scope.click_showEditProject = function (item) {
            if (!($rootScope.role == 'CMS_ADMIN' || $rootScope.role == 'MANAGER') && $rootScope.uid != item.REG_UID) {
                dialogs.notify('알림', "수정 권한이 없습니다.", {size: 'md'});
                return;
            }

            $location.path('/project/edit/'+item.NO);
        };

        // 삭제 버튼 클릭
        $scope.click_deleteProject = function (item) {
            if (item.PROJECT_ST == '3') {
                dialogs.notify('알림', '완료 상태의 프로젝트는 삭제할 수 없습니다.', {size: 'md'});
                return;
            }

            if (!($rootScope.role == 'ADMIN' || $rootScope.role == 'MANAGER') && $rootScope.uid != item.REG_UID) {
                dialogs.notify('알림', '삭제 권한이 없습니다.', {size: 'md'});
                return;
            }

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('cms/project', 'item', item.NO, false)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        };

        // 검색 버튼 클릭
        $scope.click_searchProject = function () {
            $scope.tableParams.reload();
        }

        // 페이지 사이즈
        $scope.PAGE_SIZE = COMMON.PAGE_SIZE;

        // 프로젝트 목록 조회
        $scope.getProjectList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: $scope.PAGE_SIZE,    // count per page
                sorting: {                  // initial sorting
                    REG_DT: 'desc'
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('cms/project', 'list', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_COUNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);

//                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
//                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        ['catch'](function(error){$scope.TOTAL_COUNT = 0; $defer.resolve([]);});
                }
            });
        };

        $scope.$watch('selectItems * selectCount < itemsPerPage * currentPage', function() {
            $scope.selectCount = $scope.selectCount + 1;
        });

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            ['catch']($scope.reportProblems);

        $scope.init();
        $scope.getProjectList();

    }]);
});
