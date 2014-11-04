/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : permission.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('permission', ['$scope', '$stateParams', 'permissionService', '$location', function ($scope, $stateParams, permissionService, $location) {

        /********** 초기화 **********/
        // 초기화
        $scope.initEdit = function() {
            permissionService.getPermissionOptions().then(function(roles){
                $scope.roles = roles.data;

                if (roles.data != null) {
                    $scope.ROLE = roles.data[0];
                }
            });
        };

        /********** 수정, 조회 이벤트 **********/
        $scope.$watch('ROLE', function(data) {
            $scope.getPermission();
        });

        $scope.getPermission = function() {
            permissionService.getPermission($scope.ROLE.ROLE_ID).then(function(permissions){
                $scope.permissions = permissions.data;
            });
        }

        $scope.savePermission = function() {
            permissionService.updatePermission($scope.ROLE.ROLE_ID, $scope.permissions).then(function(permissions){
                alert("권한이 수정 되었습니다.");
//                $scope.permissions = permissions.data;
            });
        };

        /********** 화면 초기화 **********/
        // 페이지 타이틀
        $scope.$parent.message = 'ANGE CMS';
        $scope.$parent.pageTitle = '권한 관리';
        $scope.$parent.pageDescription = 'CMS 사용 권한을 관리합니다.';

        $scope.initEdit();

    }]);
});
