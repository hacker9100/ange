/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-11-13
 * Description : section.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('section', ['$scope', '$stateParams', 'dataService', '$location', '$controller', '$filter', 'ngTableParams', function ($scope, $stateParams, dataService, $location, $controller, $filter, ngTableParams) {

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};
        $scope.search = {};

        //$scope.season_nm_check = false;

        // 초기화
        $scope.init = function() {

/*            // 날짜 콤보박스
            var year = [];
            var now = new Date();
            var nowYear = now.getFullYear();


            for (var i = 2010; i < nowYear + 5; i++) {
                year.push(i+'');
            }*/

            //$scope.years = year;
            //$scope.item.YEAR = nowYear+'';
            //$scope.search.YEAR = nowYear+''; // 연도검색 셀렉트 박스 2014년 값 셋팅

/*
            $scope.getList('project', {}, {ROLE: true, YEAR: nowYear}, false)
                .then(function(data){
                    $scope.project = data;
                    $scope.item.PROJECT_NO = data[0];
                })
                .catch(function(error){alert(error)});
*/
            // 검색조건 시즌명 셀렉트 박스 셋팅
            $scope.getList('section', {}, {ROLE: true}, false)
                .then(function(data){
                    $scope.season = data;
                    //$scope.search.PROJECT = data[0]
                })
                .catch(function(error){alert(error)});
        };

        /********** 이벤트 **********/
        // 섹션 삭제 버튼 클릭
        $scope.click_deleteSection = function (grpIdx, idx) {
            var section = $scope.tableParams.data[idx];

            console.log(grpIdx +','+ $scope.tableParams.data[idx]);
  /*          $scope.deleteItem('section', section.NO, true)
                .then(function(){alert('정상적으로 삭제했습니다.'); $scope.tableParams.data.splice(idx, 1);})
                .catch(function(error){alert(error)});*/

        };

        // 검색 버튼 클릭
        $scope.click_searchSection = function () {
            //$scope.getSectionList($scope.search);
            $scope.tableParams.reload();
        }

        // 섹션 목록 조회
        $scope.getSectionList = function (search) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 1000,          // count per page
                sorting: {
                    PROJECT_NO: 'asc',
                    SORT_IDX : 'asc'     // initial sorting
                }
            }, {
                groupBy: 'SEASON_NM',
                counts: [],
                total: 0,           // length of data
                getData: function($defer, params) {
                    $scope.getList('section', {}, $scope.search, true)
                        .then(function(data){
                            params.total(data[0].TOTAL_COUNT);
                           // var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

                            //$scope.list = data;
                            //$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            $defer.resolve(data);
                        })
                        .catch(function(error){alert(error)});
                }
            });

//            $scope.getList('cms_user', {}, search, true)
//                .then(function(data){$scope.list = data;})
//                .catch(function(error){alert(error)});
        };

        // 섹션 저장 버튼 클릭
        $scope.click_saveSection = function () {
            if ($scope.key == '') {
                $scope.insertItem('section', $scope.item, false)
                    .then(function(){$scope.tableParams.reload();})
                    .catch(function(error){alert(error)});
            } else {
                $scope.updateItem('section', $scope.key, $scope.item, false)
                    .then(function(){$scope.tableParams.reload();})
                    .catch(function(error){alert(error)});
            }

            $scope.key = '';
            //$scope.search = {};
            //$scope.item = {};
        };

        // 섹션 편집 클릭
        $scope.click_getSection = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('section', $scope.key, {}, false)
                    .then(function(data) {
                        var idx = 0;
                        $scope.item = data;

                        //ng-disabled="item.SEASON_NM != ''"
                        //if($scope.item.SEASON_NM != ''){}
                        if(data.SEASON_NM != ""){
                            $scope.season_nm_check = true;
                        }
                    })
                    .catch(function(error){alert(error)});
            }
        }

/*        // [검색] 연도별에 따른 프로젝트명 셀렉트 박스 셋팅
        $scope.$watch('search.YEAR', function (data) {
            if (data != null) {
                $scope.getList('project', {}, {ROLE: true, YEAR: data}, false)
                    .then(function(data){
                        $scope.projects = data;
                        $scope.search.PROJECT = data[0]
                    })
                    .catch(function(error){alert(error)});
            }
        });*/

/*        // 연도별에 따른 프로젝트명 셀렉트 박스 셋팅
        $scope.$watch('item.YEAR', function (data) {
            if (data != null) {
                $scope.getList('project', {}, {ROLE: true, YEAR: data}, false)// $scope.item.YEAR
                    .then(function(data){
                        $scope.project = data;
                        $scope.item.PROJECT_NO = data[0]
                    })
                    .catch(function(error){alert(error)});
            }
        });*/

        // 취소 클릭
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = null;
        };

        /********** 화면 초기화 **********/
            // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';
        $scope.$parent.pageTitle = '섹션 관리';
        $scope.$parent.pageDescription = 'CMS 섹션을 관리합니다.';
        $scope.$parent.tailDescription = '.';

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getSectionList)
            .catch($scope.reportProblems);

    }]);
});