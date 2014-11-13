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


        // 초기화
        $scope.init = function() {

            // 날짜 콤보박스
            var year = [];
            var now = new Date();
            var nowYear = now.getFullYear();


            for (var i = 2010; i < nowYear + 5; i++) {
                year.push(i+'');
            }

            $scope.years = year;
            $scope.item.YEAR = nowYear+'';

            $scope.getList('project', {}, {ROLE: true}, false)
                .then(function(data){
                    $scope.project = data;
                    $scope.item.PROJECT_NO = data[0];
                })
                .catch(function(error){alert(error)});
        };

        /********** 이벤트 **********/
        // 섹션 삭제 버튼 클릭
        $scope.click_deleteSection = function (idx) {
            var section = $scope.list[idx];

            $scope.deleteItem('section', section.NO, true)
                .then(function(){alert('정상적으로 삭제했습니다.'); $scope.list.splice(idx, 1); $scope.getSectionList();})
                .catch(function(error){alert(error)});

        };

        // 검색 버튼 클릭
        $scope.click_searchSection = function () {
            $scope.getSectionList(aaaaaa$scope.search);
        }

        // 섹션 목록 조회
        $scope.getSectionList = function (search) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    PROJECT_NO: 'asc',
                    SORT_IDX : 'asc'     // initial sorting
                }
            }, {
                total: 0,           // length of data
                getData: function($defer, params) {
                    $scope.getList('section', {}, search, true)
                        .then(function(data){
                            params.total(data[0].TOTAL_COUNT);
//                            $defer.resolve(data);

                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

                            $scope.list = data;


                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
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
                    .then(function(){$scope.getSectionList();})
                    .catch(function(error){alert(error)});
            } else {
                $scope.updateItem('section', $scope.key, $scope.item, false)
                    .then(function(){$scope.getSectionList();})
                    .catch(function(error){alert(error)});
            }

            $scope.key = '';
        };

        // 섹션 편집 클릭
        $scope.click_getSection = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('section', $scope.key, {}, false)
                    .then(function(data) {
                        var idx = 0;
                        for (var i=0; i < $scope.project.length; i ++) {
                           // console.log(JSON.stringify(data.PROJECT_NO));
                           // console.log(JSON.stringify($scope.project[i]));
                            if (JSON.stringify(data.PROJECT_NO) == JSON.stringify($scope.project[i].PROJECT_NO)) {
                                   idx = i;
                            }
                        }
                        $scope.item = data;
                        $scope.item.PROJECT_NO = $scope.project[idx];
                    })
                    .catch(function(error){alert(error)});
            }
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

        $scope.init();
        $scope.getSectionList();

    }]);
});