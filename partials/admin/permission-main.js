/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : permission.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('permission-main', ['$scope', '$stateParams', '$location', 'dialogs', function ($scope, $stateParams, $location, dialogs) {

        /********** 초기화 **********/
        // 초기화
        $scope.init = function() {
            $scope.getList('com/permission', 'list', {}, {SYSTEM_GB: 'ADMIN'}, false)
                .then(function(data){
                    $scope.roles = data;
                    $scope.ROLE = data[0];
                })
                .catch(function(error){console.log(error)});
        };

        /********** 이벤트 **********/
        $scope.$watch('ROLE', function(data) {
            if (typeof data !== 'undefined') {
                $scope.getPermission();
            }
        });

        // 권한 조회
        $scope.getPermission = function() {
            $scope.getItem('com/permission', 'item', $scope.ROLE.ROLE_ID, {}, false)
                .then(function(data) {$scope.list = data;})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 권한 저장 버튼 클릭
        $scope.click_savePermission = function() {
            $scope.updateItem('com/permission', 'item', $scope.ROLE.ROLE_ID, $scope.list, false)
                .then(function(){dialogs.notify('알림', '권한이 수정 되었습니다.', {size: 'md'});})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .catch($scope.reportProblems);

    }]);
});
