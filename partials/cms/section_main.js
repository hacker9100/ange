/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : section_main.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('section_main', ['$scope', '$stateParams', 'dataService', '$modal', '$location', '$controller', '$filter', 'ngTableParams', '$q', 'dialogs', function ($scope, $stateParams, $modal, dataService, $location, $controller, $filter, ngTableParams, $q, dialogs, UPLOAD) {

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};
        $scope.search = {};

        // 초기화
        $scope.init = function() {

            // 검색조건 시즌명 셀렉트 박스 셋팅
            $scope.getList('cms/section', 'list', {}, {ROLE: true}, false)
                .then(function(data){
                    $scope.season = data;
                })
                .catch(function(error){alert(error)});
        };

        $scope.initUpdate = function() {
            if ( $stateParams.id != 0) {
                $scope.getTask();
            }
        }

        /********** 이벤트 **********/
        // 섹션 삭제 버튼 클릭
        $scope.click_deleteSection = function (parentIdx, idx) {

            var section = $scope.tableParams.data[parentIdx].data[idx];

            console.log('parentIdx = '+parentIdx);
            console.log('idx = '+idx);
            console.log('section = '+section);

            $scope.deleteItem('cms/section', 'item', section.NO, true)
                .then(function(){alert('정상적으로 삭제했습니다.'); /*$scope.tableParams.group.data.splice(idx, 1);*/ $scope.tableParams.reload();})
                .catch(function(error){alert(error)});

            console.log('end');

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
                    $scope.getList('cms/section', 'list', {}, $scope.search, true)
                        .then(function(data){
                            params.total(data[0].TOTAL_COUNT);
                            //$defer.resolve(data);
                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        .catch(function(error){alert(error)});

                }

            });

            /*
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 20,          // count per page
                sorting: {
                    SEASON_NM: 'desc',
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

                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            //$defer.resolve(data);
                        })
                        .catch(function(error){alert(error)});
                }
            }); */

        };

        // 섹션 저장 버튼 클릭
        $scope.click_saveSection = function () {
            if ($scope.key == '') {
                $scope.insertItem('cms/section', 'item', $scope.item, false)
                    .then(function(){
                        // 리스트 재조회
                        $scope.tableParams.reload();

                        // 검색조건 시즌명 셀렉트 박스 재조회 후 셋팅 --> 추가한 시즌명 검색조건에 포함
                        $scope.getList('cms/section', 'list', {}, {ROLE: true}, false)
                            .then(function(data){
                                $scope.season = data;
                            })
                            .catch(function(error){alert(error)});
                    })
                    .catch(function(error){alert(error)});
            } else {
                $scope.updateItem('cms/section', 'item', $scope.key, $scope.item, false)
                    .then(function(){$scope.tableParams.reload();})
                    .catch(function(error){alert(error)});
            }
        };

        // 섹션 편집 클릭
        $scope.click_getSection = function (id) {

            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('cms/section', 'item', $scope.key, {}, false)
                    .then(function(data) {
                        var idx = 0;
                        for(var i=0; i < $scope.season.length; i ++){
                            if(JSON.stringify(data.SEASON_NM) == JSON.stringify($scope.season[i].SEASON_NM)){
                                idx = i;
                            }
                        }
                        $scope.item = data;
                        $scope.item.SELECT_SEASON_NM = $scope.season[idx];
                        $scope.season_nm_check = true;

                        $('#season_gb').focus();
                    })
                    .catch(function(error){alert(error)});

            }

        }

        // 섹션 등록 버튼 클릭 시 등록하는 영역으로 focus 이동
        $scope.click_focus = function () {
            $('#season_gb').focus();
        }

       // selectbox 시즌명 선택시 inputbox 시즌명 disabled
/*        $scope.$watch('item.SELECT_SEASON_NM', function (data) {
            if (data != null && data != "") {
                $scope.item.SEASON_NM = data.SEASON_NM;
                $scope.season_nm_check = true;
            }else{
                $scope.season_nm_check = false;
                $scope.item.SEASON_NM= "";
            }
        });*/

        $scope.$watch('item.SELECT_SEASON_NM', function (data) {
            if (data != null && data != "") {
                $scope.item.SEASON_NM = data.SEASON_NM;
                $scope.season_nm_check = true;
            }else{
                $scope.season_nm_check = false;
                $scope.item.SEASON_NM= "";
            }
        });

        // 시즌수정
        $scope.click_updateSeason = function () {
            console.log('$scope.item.SEASON_NM = '+$scope.item.SEASON_NM);
            $scope.updateItem('cms/section', 'item', {}, $scope.item, false)
                .then(function(){alert('시즌수정이 완료되었습니다'); $scope.tableParams.reload();})
                .catch(function(error){alert(error)});
        }

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