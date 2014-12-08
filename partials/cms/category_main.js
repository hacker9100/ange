/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : category_main.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('category_main', ['$scope', '$stateParams', '$location', 'dialogs', function ($scope, $stateParams, $location, dialogs) {

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
        $scope.click_deleteCategory = function (idx) {
            var category = $scope.list[idx];

            $scope.deleteItem('cms/category', 'item', category.NO, true)
                .then(function(){alert('정상적으로 삭제했습니다.'); $scope.list.splice(idx, 1);})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 검색 버튼 클릭
        $scope.searchCategory = function () {
            $scope.getCategoryList($scope.search);
        }

        // 카테고리 목록 조회
        $scope.getCategoryList = function (search) {
            $scope.getList('cms/category', 'list', {}, search, true)
                .then(function(data){$scope.list = data;})
                .catch(function(error){$scope.list = []});
        };

        // 카테고리 저장 버튼 클릭
        $scope.click_saveCategory = function () {
            if ($scope.key == '') {
                $scope.insertItem('cms/category', 'item', $scope.item, false)
                    .then(function(){$scope.getCategoryList();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('cms/category', 'item', $scope.key, $scope.item, false)
                    .then(function(){$scope.getCategoryList();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

            $scope.key = '';
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
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 카테고리 상태변경 버튼 클릭
        $scope.click_updateStatus = function (idx) {
            var category = $scope.list[idx];
            category.CATEGORY_ST = (category.CATEGORY_ST == "1" ? "0" : "1");

            $scope.updateItem('cms/category', 'item', category.NO, category, false)
                .then(function(){$scope.getCategoryList(); /*$scope.tableParams.reload(); $scope.getCmsUserList();*/})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 취소
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = null;
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getCategoryList();

    }]);
});