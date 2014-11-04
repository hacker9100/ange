/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : category.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('category', ['$scope', '$stateParams', 'categoryService', '$location', function ($scope, $stateParams, categoryService, $location) {

        /********** 초기화 **********/
        $scope.search = [];

        $scope.categoryId = '';
        $scope.category = {};

        // 초기화
        $scope.initList = function() {
            categoryService.getPermissionOptions().then(function(roles){
                $scope.roles = roles.data;

                if (roles.data != null) {
                    $scope.search.ROLE = roles.data[0];
                }
            });
        };

        $scope.initEdit = function() {
            $location.search('_search', {CATEGORY_GB: '2', PARENT_NO: '0'});
            categoryService.getCategories().then(function(results){
                $scope.parents = results.data;
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
            $location.search('_search', null);
        };

        /********** 이벤트 **********/
        // 카테고리 삭제
        $scope.deleteCategory = function (idx) {
            var category = $scope.categories[idx];

            categoryService.deleteCategory(category.NO).then(function(data){
                alert("정상적으로 삭제했습니다.");
                $scope.categories.splice(idx, 1);
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
        };

        // 검색
        $scope.searchCategory = function () {
            $location.search('_search', $scope.search);
            $scope.getCategoryList();
        }

        // 카테고리 목록 조회
        $scope.getCategoryList = function () {
            $scope.isLoading = true;
            categoryService.getCategories().then(function(results){
                if (results.data == 'null') {
                    $scope.categories = null;
                } else {
                    $scope.categories = results.data;
                }

                $scope.isLoading = false;
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
            $location.search('_search', null);
        };

        // 카테고리 등록/수정
        $scope.saveCategory = function () {
            if ($scope.categoryId == '') {
                categoryService.createCategory($scope.category).then(function(data){
                    alert("정상적으로 등록했습니다.");
                    $scope.user = null;
                    $scope.getCategoryList();
                }, function(error) {
                    alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
                });
            }
            else {
                categoryService.updateCategory($scope.categoryId, $scope.category).then(function(data){
                    alert("정상적으로 수정했습니다.");
                    $scope.getCategoryList();
                }, function(error) {
                    alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
                });
            }
        };

        // 조회
        $scope.getCategory = function (id) {
            $scope.categoryId = id;

            if ($scope.categoryId != '') {
                categoryService.getCategory($scope.categoryId).then(function(result){
                    var idx = 0;
                    for (var i=0; i < $scope.parents.length; i ++) {
                        if (result.data.PARENT_NO == $scope.parents[i].NO) {
                            idx = i;
                        }
                    }

                    $scope.category = result.data;
                    $scope.category.PARENT = result.data.PARENT_NO == 0 ? null : $scope.parents[idx];
                }, function(error) {
                    alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
                });
            }
        };

        // 취소
        $scope.cancel = function () {
            $scope.categoryId = '';
            $scope.category = null;
        };

        /********** 화면 초기화 **********/
        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';
        $scope.$parent.pageTitle = '카테고리 관리';
        $scope.$parent.pageDescription = 'CMS 사용하는 카테고리를 관리합니다.';
        $scope.$parent.tailDescription = '.';

//        $scope.initList();
        $scope.initEdit();
        $scope.getCategoryList();

    }]);
});
