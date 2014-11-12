/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('user', ['$scope', '$stateParams', 'dataService', '$location', function ($scope, $stateParams, dataService, $location) {

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};

        // 초기화
        $scope.initList = function() {
            dataService.db('permission').find({},{ROLE: true},function(data, status){
                if (status != 200) {
                    alert('조회에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            $scope.roles = data;
                            $scope.user_roles = data;
                            $scope.item.ROLE = data[0];
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            alert("조회 데이터가 없습니다.");
                        }
                    }
                }
            });
        };

        $scope.initEdit = function() {

        };

        /********** 이벤트 **********/
        // 사용자 삭제 버튼 클릭
        $scope.click_deleteCmsUser = function (idx) {
            var user = $scope.list[idx];

            dataService.db('cms_user').remove(user.USER_ID,function(data, status){
                if (status != 200) {
                    alert('삭제에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        $scope.list.splice(idx, 1);
                    }
                }
            });
        };

        // 검색 버튼 클릭
        $scope.click_searchCmsUser = function () {
            $scope.getCmsUserList($scope.search);
        }

        // 사용자 목록 조회
        $scope.getCmsUserList = function (search) {
            $scope.isLoading = true;

            dataService.db('cms_user').find({},search,function(data, status){
                if (status != 200) {
                    alert('조회에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        if (angular.isObject(data)) {
                            $scope.list = data;
                        } else {
                            // TODO: 데이터가 없을 경우 처리
                            alert("조회 데이터가 없습니다.");
                        }
                    }
                }

                $scope.isLoading = false;
            });
        };

        // 사용자 저장 버튼 클릭
        $scope.click_saveCmsUser = function () {
            if ($scope.key == '') {
                dataService.db('cms_user').insert($scope.item,function(data, status){
                    if (status != 200) {
                        alert('등록에 실패 했습니다.');
                    } else {
                        if (data.err == true) {
                            alert(data.msg);
                        } else {
                            $scope.getCmsUserList();
                        }
                    }
                });
            } else {
                dataService.db('cms_user').update($scope.key,$scope.item,function(data, status){
                    if (status != 200) {
                        alert('수정에 실패 했습니다.');
                    } else {
                        if (data.err == true) {
                            alert(data.msg);
                        } else {
                            $scope.getCmsUserList();
                        }
                    }
                });
            }

            $scope.key = '';
        };

        // 사용자 편집 클릭
        $scope.click_getCmsUser = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                dataService.db('cms_user').findOne($scope.key,{},function(data, status){
                    if (status != 200) {
                        alert('사용자 조회에 실패 했습니다.');
                    } else {
                        if (data.err == true) {
                            alert(data.msg);
                        } else {
                            if (angular.isObject(data)) {
                                var idx = 0;
                                for (var i=0; i < $scope.user_roles.length; i ++) {
                                    if (JSON.stringify(data.ROLE) == JSON.stringify($scope.user_roles[i])) {
                                        idx = i;
                                    }
                                }

                                $scope.item = data;
                                $scope.item.ROLE = $scope.user_roles[idx];
                            } else {
                                // TODO: 데이터가 없을 경우 처리
                                alert("사용자 조회 데이터가 없습니다.");
                            }
                        }
                    }
                });
            }
        }

        // 사용자 상태변경 버튼 클릭
        $scope.click_updateStatus = function (idx) {
            var user = $scope.list[idx];
            user.USER_ST = (user.USER_ST == "1" ? "0" : "1");

            dataService.db('cms_user').update(user.USER_ID,user,function(data, status){
                if (status != 200) {
                    alert('수정에 실패 했습니다.');
                } else {
                    if (data.err == true) {
                        alert(data.msg);
                    } else {
                        $scope.getCmsUserList();
                    }
                }
            });
        };

        // 취소 클릭
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = null;
            $scope.item.ROLE = $scope.user_roles[0];
        };

        /********** 화면 초기화 **********/
        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';
        $scope.$parent.pageTitle = '사용자 관리';
        $scope.$parent.pageDescription = 'CMS 사용자를 관리합니다.';
        $scope.$parent.tailDescription = '.';

        $scope.initList();
//        $scope.initEdit();
        $scope.getCmsUserList();

    }]);
});
