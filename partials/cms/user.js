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
    controllers.controller('user', ['$scope', '$stateParams', 'userService', 'permissionService', '$location', function ($scope, $stateParams, userService, permissionService, $location) {

        /********** 초기화 **********/
        $scope.search = [];

        $scope.userId = '';
        $scope.user = {};

        // 초기화
        $scope.initList = function() {
            permissionService.getPermissionOptions().then(function(results){
                $scope.roles = results.data;
                $scope.user_roles = results.data;

                if (roles.data != null) {
                    $scope.search.ROLE = results.data[0];
                    $scope.user.ROLE = results.data[0];
                }
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
        };

        $scope.initEdit = function() {
            permissionService.getPermissionOptions().then(function(results){
                $scope.user_roles = results.data;

                if (roles.data != null) {
                    $scope.user.ROLE = results.data[0];
                }
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
        };

        /********** 이벤트 **********/
        // 사용자 삭제
        $scope.deleteCmsUser = function (idx) {
            var user = $scope.users[idx];

            userService.deleteCmsUser(user.USER_ID).then(function(data){
                alert("정상적으로 삭제했습니다.");
                $scope.users.splice(idx, 1);
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
        };

        // 검색
        $scope.searchUser = function () {
            $location.search('_search', $scope.search);
            $scope.getCmsUserList();
        }

        // 사용자 목록 조회
        $scope.getCmsUserList = function () {
            $scope.isLoading = true;
            userService.getCmsUsers().then(function(results){
                if (results.data == 'null') {
                    $scope.users = null;
                } else {
                    $scope.users = results.data;
                }

                $scope.isLoading = false;
                $location.search('_search', null);
            }, function(error) {
                alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
            });
        };

        // 사용자 등록/수정
        $scope.saveCmsUser = function () {
            if ($scope.userId == '') {
                userService.createCmsUser($scope.user).then(function(data){
                    alert("정상적으로 등록했습니다.");
                    $scope.user = null;
                    $scope.getCmsUserList();
                }, function(error) {
                    alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
                });
            }
            else {
                userService.updateCmsUser($scope.userId, $scope.user).then(function(data){
                    alert("정상적으로 수정했습니다.");
                }, function(error) {
                    alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
                });
            }

            $scope.userId = '';
        };

        // 조회
        $scope.getCmsUser = function (id) {
            $scope.userId = id;

            if ($scope.userId != '') {
                userService.getCmsUser($scope.userId).then(function(result){
                    var idx = 0;
                    for (var i=0; i < $scope.user_roles.length; i ++) {
                        if (JSON.stringify(result.data.ROLE) == JSON.stringify($scope.user_roles[i])) {
                            idx = i;
                        }
                    }

                    $scope.user = result.data;
                    $scope.user.ROLE = $scope.user_roles[idx];
                }, function(error) {
                    alert("서버가 정상적으로 응답하지 않습니다. 관리자에게 문의 하세요.");
                });
            }
        }

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
