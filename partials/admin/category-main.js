/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : category-main.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('category-main', ['$scope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $stateParams, $location, dialogs, ngTableParams) {

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};
        $scope.search = {};

        // 초기화
        $scope.init = function() {
            $scope.getList('cms/category', 'list', {}, {CATEGORY_GB: '2', PARENT_NO: '0'}, false)
                .then(function(data){$scope.parents = data;})
                .catch(function(error){console.log(error)});
        };

        /********** 이벤트 **********/
        // 카테고리 삭제 버튼 클릭
        $scope.click_deleteCategory = function (item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('cms/category', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        };

        // 검색 버튼 클릭
        $scope.searchCategory = function () {
            $scope.tableParams.reload();
        }

        // 카테고리 목록 조회
        $scope.getCategoryList = function () {
//            $scope.getList('cms/category', 'list', {}, search, true)
//                .then(function(data){$scope.list = data;})
//                .catch(function(error){$scope.list = []});

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 1000,          // count per page
                sorting: {
                    NO: 'asc'     // initial sorting
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('cms/category', 'list', {}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_COUNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);

//                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
//                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        .catch(function(error){$defer.resolve([]);});
                }
            });
        };

        // 카테고리 저장 버튼 클릭
        $scope.click_saveCategory = function () {
            if ($scope.key == '') {
                $scope.insertItem('cms/category', 'item', $scope.item, false)
                    .then(function(){dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('cms/category', 'item', $scope.key, $scope.item, false)
                    .then(function(){dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

            $scope.click_cancel();
        };

        // 카테고리 편집 클릭
        $scope.click_getCategory = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('cms/category', 'item', $scope.key, {}, false)
                    .then(function(data) {
                        var idx = 0;
                        for (var i=0; i < $scope.parents.length; i ++) {
                            if (data.PARENT_NO == $scope.parents[i].NO) {
                                idx = i;
                            }
                        }

                        $scope.item = data;
                        $scope.item.PARENT = data.PARENT_NO == '0' ? null : $scope.parents[idx];

                        $scope.click_focus();
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 카테고리 등록 버튼 클릭 시 등록하는 영역으로 focus 이동
        $scope.click_focus = function () {
            $('html,body').animate({scrollTop:$('#item').offset().top}, 100);
            $('#item_gb').focus();
        }

        // 카테고리 상태변경 버튼 클릭
        $scope.click_updateStatus = function (item) {
            item.CATEGORY_ST = (item.CATEGORY_ST == "1" ? "0" : "1");

            $scope.updateItem('cms/category', 'item', item.NO, item, false)
                .then(function(){dialogs.notify('알림', '카테고리 상태가 변경되었습니다.', {size: 'md'}); /*$scope.tableParams.reload(); $scope.getCmsUserList();*/})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'}); $scope.tableParams.reload();});
        };

        // 취소
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = {};
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
//            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getCategoryList)
            .catch($scope.reportProblems);

    }]);
});
