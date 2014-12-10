/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : publish_list.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('publish_list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'COMMON', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, COMMON) {

        dialogs.notify('알림', '준비 중 입니다.', {size: 'md'});
        history.back();

//        alert(localStorage.getItem('userToken'))
        /********** 초기화 **********/
        // 검색 조건
        $scope.search = {STATUS: '2'};

        // 날짜 콤보박스
        var year = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        // 초기화
        $scope.init = function() {
            for (var i = 2010; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            // 검색어
            var condition = [{name: "등록자", value: "REG_NM"}, {name: "제목+내용", value: "SUBJECT"}];

            $scope.years = year;
            $scope.conditions = condition;
            $scope.search.CONDITION = condition[0];
        };

        /********** 이벤트 **********/
        $scope.click_showViewProject = function (key) {
            $location.url('/project/view/'+key);
        };

        // 등록 화면 이동
        $scope.click_publishProject = function (idx) {
            var project = $scope.tableParams.data[idx];
            $location.path('/publish/edit/'+project.NO);
        };

        // 검색 버튼 클릭
        $scope.click_searchProject = function () {
            $scope.tableParams.reload();
        }

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
                            params.total(data[0].TOTAL_COUNT);
                            $defer.resolve(data);

//                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
//                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        .catch(function(error){$defer.resolve([]);});
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
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getProjectList();

    }]);
});
