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
    controllers.controller('category', ['$scope', '$stateParams', 'dataService', '$location', function ($scope, $stateParams, dataService, $location) {

        /********** 초기화 **********/
        $scope.key = '';

        // 초기화
        $scope.initList = function() {

        };

        $scope.initEdit = function() {
            dataService.db('category').find({},{CATEGORY_GB: '2', PARENT_NO: '0'},function(data, status){
                if (status != 200) {
                    alert('조회에 실패 했습니다.');
                } else {
                    if (!data.err) {
                        if (angular.isObject(data)) {
                            $scope.parents = data;
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            alert("조회 데이터가 없습니다.");
                        }
                    } else {
                        alert(data.msg);
                    }
                }

                $scope.isLoading = false;
            });
        };

        /********** 이벤트 **********/
        // 카테고리 삭제 버튼 클릭
        $scope.click_deleteCategory = function (idx) {
            var category = $scope.list[idx];

            dataService.db('category').remove(category.NO,function(data, status){
                if (status != 200) {
                    alert('삭제에 실패 했습니다.');
                } else {
                    if (data.err == false) {
                        $scope.list.splice(idx, 1);
                    } else {
                        alert(data.msg);
                    }
                }
            });
        };

        // 검색 버튼 클릭
        $scope.searchCategory = function () {
            $scope.getCategoryList($scope.search);
        }

        // 카테고리 목록 조회
        $scope.getCategoryList = function (search) {
            $scope.isLoading = true;
            dataService.db('category').find({},search,function(data, status){
                if (status != 200) {
                    alert('조회에 실패 했습니다.');
                } else {
                    if (!data.err) {
                        if (angular.isObject(data)) {
                            $scope.list = data;
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            alert("조회 데이터가 없습니다.");
                        }
                    } else {
                        alert(data.msg);
                    }
                }

                $scope.isLoading = false;
            });
        };

        // 카테고리 저장 버튼 클릭
        $scope.click_saveCategory = function () {
            if ($scope.key == '') {
                dataService.db('category').insert($scope.item,function(data, status){
                    if (status != 200) {
                        alert('등록에 실패 했습니다.');
                    } else {
                        if (data.err == false) {
                            $scope.getCategoryList();
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            } else {
                dataService.db('category').update($scope.key,$scope.item,function(data, status){
                    if (status != 200) {
                        alert('수정에 실패 했습니다.');
                    } else {
                        if (data.err == false) {
                            $scope.getCategoryList();
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            }

            $scope.key = '';
        };

        // 카테고리 편집 클릭
        $scope.click_getCategory = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                dataService.db('category').findOne($scope.key,{},function(data, status){
                    if (status != 200) {
                        alert('조회에 실패 했습니다.');
                    } else {
                        if (angular.isObject(data)) {
                            var idx = 0;
                            for (var i=0; i < $scope.parents.length; i ++) {
                                if (data.PARENT_NO == $scope.parents[i].NO) {
                                    idx = i;
                                }
                            }

                            $scope.item = data;
                            $scope.item.PARENT = data.PARENT_NO == 0 ? null : $scope.parents[idx];
                        } else {
                            if (data.err == true) {
                                alert(data.msg);
                            } else {
                                // TODO: 데이터가 없을 경우 처리
                                alert("조회 데이터가 없습니다.");
                            }
                        }
                    }
                });
            }
        };

        // 카테고리 상태변경 버튼 클릭
        $scope.click_updateStatus = function (idx) {
            var category = $scope.list[idx];
            category.CATEGORY_ST = (category.CATEGORY_ST == "1" ? "0" : "1");

            dataService.db('category').update(category.NO,category,function(data, status){
                if (status != 200) {
                    alert('수정에 실패 했습니다.');
                } else {
                    if (data.err == false) {
                        $scope.getCategoryList();
                    } else {
                        alert(data.msg);
                    }
                }
            });
        };

        // 취소
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = null;
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
