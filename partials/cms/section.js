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

        // 초기화
        $scope.init = function() {

            // 검색조건 시즌명 셀렉트 박스 셋팅
            $scope.getList('section', {}, {ROLE: true}, false)
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

            $scope.deleteItem('section', section.NO, true)
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
                    $scope.getList('section', {}, $scope.search, true)
                        .then(function(data){
                            params.total(data[0].TOTAL_COUNT);
                            $defer.resolve(data);
                        })
                        .catch(function(error){alert(error)});

                }

            });

        };

        // 섹션 저장 버튼 클릭
        $scope.click_saveSection = function () {
            if ($scope.key == '') {
                $scope.insertItem('section', $scope.item, false)
                    .then(function(){
                        // 리스트 재조회
                        $scope.tableParams.reload();

                        // 검색조건 시즌명 셀렉트 박스 재조회 후 셋팅 --> 추가한 시즌명 검색조건에 포함
                        $scope.getList('section', {}, {ROLE: true}, false)
                            .then(function(data){
                                $scope.season = data;
                            })
                            .catch(function(error){alert(error)});
                    })
                    .catch(function(error){alert(error)});
            } else {
                $scope.updateItem('section', $scope.key, $scope.item, false)
                    .then(function(){$scope.tableParams.reload();})
                    .catch(function(error){alert(error)});
            }
        };

        // 섹션 편집 클릭
        $scope.click_getSection = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('section', $scope.key, {}, false)
                    .then(function(data) {
                        var idx = 0;
                        $scope.item = data;

                        var idx = 0;
                        for(var i=0; i < $scope.season.length; i ++){
                            if(JSON.stringify(data.SEASON_NM) == JSON.stringify($scope.season[i].SEASON_NM)){
                                idx = i;
                            }
                        }
                        $scope.item.SELECT_SEASON_NM = $scope.season[idx];
                        $scope.season_nm_check = true;
                    })
                    .catch(function(error){alert(error)});
            }
        }

       // selectbox 시즌명 선택시 inputbox 시즌명 disabled
        $scope.$watch('item.SELECT_SEASON_NM', function (data) {
            if (data != null && data != "") {
                $scope.item.SEASON_NM = data.SEASON_NM;
                $scope.season_nm_check = true;
            }else{
                $scope.season_nm_check = false;
                $scope.item.SEASON_NM= "";
            }
        });

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