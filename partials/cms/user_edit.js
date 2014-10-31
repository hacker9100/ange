/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : user_edit.html 화면 콘트롤러
 */
'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('user_edit', ['$scope', '$stateParams', 'userService', 'permissionService', '$location', function ($scope, $stateParams, userService, permissionService, $location) {

        /********** 초기화 **********/
        $scope.userId = '';
        $scope.user = {};

        // 초기화
        $scope.initEdit = function() {
            permissionService.getPermissionOptions().then(function(roles){
                $scope.user_roles = roles.data;

                if (roles.data != null) {
                    $scope.user.ROLE = roles.data[0];
                }
            });
        };

        /********** 수정, 조회 이벤트 **********/
        // 등록/수정
        $scope.saveCmsUser = function () {
            if ($scope.userId == '') {
                userService.createCmsUser($scope.user).then(function(data){
                    alert("정상적으로 등록했습니다.");
                });
            }
            else {
                userService.updateCmsUser($scope.userId, $scope.user).then(function(data){
                    alert("정상적으로 수정했습니다.");
                });
            }

            $scope.userId = '';
        };

        // 조회
        $scope.getCmsUser = function (id) {
            $scope.userId = id;

            if ($scope.userId != '') {
                userService.getCmsUser($scope.userId).then(function(user){
                    $scope.user = user.data;
                });
            }
        }

        /********** 화면 초기화 **********/
        $scope.initEdit();
//            $scope.getTask();

    }]);
});
