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
    controllers.controller('section_main', ['$scope', '$stateParams', '$location', '$filter', 'dialogs', 'ngTableParams', function ($scope, $stateParams, $location, $filter, dialogs, ngTableParams) {

        /********** 공통 controller 호출 **********/
        //angular.extend(this, $controller('common', {$scope: $scope}));

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

        //$("#season_upt_btn").hide();

        /********** 이벤트 **********/
        // 섹션 삭제 버튼 클릭
        $scope.click_deleteSection = function (parentIdx, idx) {

            var section = $scope.tableParams.data[parentIdx].data[idx];

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('cms/section', 'item', section.NO, true)
                    .then(function(){
                        dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $scope.tableParams.data[parentIdx].data.splice(idx, 1);

                        $scope.tableParams.reload();

                        // 검색조건 시즌명 셀렉트 박스 재조회 후 셋팅 --> 추가한 시즌명 검색조건에 포함
                        $scope.getList('cms/section', 'list', {}, {ROLE: true}, false)
                            .then(function(data){
                                $scope.season = data;
                            })
                            .catch(function(error){alert(error)});
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });

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
                    SECTION_NM : 'asc',
                    SORT_IDX : 'asc'     // initial sorting
                }
            }, {
                groupBy: 'SEASON_NM',
                counts: [],
                total: 0,           // length of data
                getData: function($defer, params) {

                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('cms/section', 'list', {}, $scope.search, true)
                        .then(function(data){
                            params.total(data[0].TOTAL_COUNT);
                            $defer.resolve(data);
                        })
                        .catch(function(error){$defer.resolve([]);});

                }

            });

        };

        // 섹션 저장 버튼 클릭
        $scope.click_saveSection = function () {
            if ($scope.key == '') {
                $scope.insertItem('cms/section', 'item', $scope.item, false)
                    .then(function(){
                        // 리스트 재조회
                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
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

            $scope.key = '';
            $scope.item = {};
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

            $scope.key = '';
            $scope.item = {};
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
                $scope.item.OLD_SEASON_NM = data.SEASON_NM;
                $("#old_season_nm").val(data.SEASON_NM);
                $("#season_upt_btn").show();
            }else{
                //$scope.season_nm_check = false;
                $scope.item.SEASON_NM= "";
                $("#season_upt_btn").hide();
            }
        });

        // 시즌수정 2014.12.10
        $scope.click_updateSeason = function () {
            console.log('$scope.item.SEASON_NM = '+$scope.item.SEASON_NM);
            $scope.updateItem('cms/section', 'item', {}, $scope.item, false)
                .then(function() {
                    alert('시즌수정이 완료되었습니다');
                    $scope.tableParams.reload();
                    // 검색조건 시즌명 셀렉트 박스 재조회 후 셋팅 --> 추가한 시즌명 검색조건에 포함
                    $scope.getList('cms/section', 'list', {}, {ROLE: true}, false)
                        .then(function(data){
                            $scope.season = data;
                        })
                        .catch(function(error){alert(error)});
                })
                .catch(function(error){alert(error)});
        }

        // 취소 클릭
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = {};
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