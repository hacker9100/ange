/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : user_list.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('user_list', ['$scope', '$stateParams', 'userService', 'permissionService', '$location', function ($scope, $stateParams, userService, permissionService, $location) {

        /********** 초기화 **********/
        $scope.search = [];

        // 초기화
        $scope.initList = function() {

            permissionService.getPermissionOptions().then(function(roles){
                $scope.roles = roles.data;

                if (roles.data != null) {
                    $scope.search.ROLE = roles.data[0];
                }
            });
        };

        /********** 목록 조회 이벤트 **********/
        // 등록 화면 이동
        $scope.createNewUser = function () {
            $location.search({_method: 'POST'});
            $location.path('/project/edit/0');
        };

        // 수정 화면 이동
        $scope.editUser = function (no) {
            $location.search({_method: 'PUT'});
            $location.path('/project/edit/'+no);
        };

        // 조회 화면 이동
        $scope.viewListUser = function (no) {
            $location.search({_method: 'GET'});
            $location.path('/project/view/'+no);
        };

        // 삭제
        $scope.deleteListUser = function (idx) {

            var user = $scope.users[idx];

            userService.deleteCmsUser(user.NO).then(function(data){
                $scope.users.splice(idx, 1);
            });
        };

        // 검색
        $scope.searchUser = function () {
            $location.search('_search', $scope.search);
            $scope.getListUsers();
        }

        // 목록
        $scope.getListUsers = function () {
            $scope.isLoading = true;
            userService.getCmsUsers().then(function(users){
                if (users.data == 'null') {
                    $scope.users = null;
                } else {
                    $scope.users = users.data;
                }

                $scope.isLoading = false;
                $location.search('_search', null);
            });
        };

        /********** 화면 초기화 **********/
        // 페이지 타이틀
        $scope.message = 'ANGE CMS';
        $scope.pageTitle = '사용자 관리';
        $scope.pageDescription = 'CMS 사용자를 관리합니다.';
        $scope.tailDescription = '.';

        $scope.initList();
        $scope.getListUsers();
    }]);
});
