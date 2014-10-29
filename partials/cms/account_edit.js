/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : projectEdit.html 화면 콘트롤러
 */
'use strict';

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('account_edit', ['$scope', '$stateParams', 'userService', '$location', function ($scope, $stateParams, userService, $location) {

//        var userId = 'hong';

        // 버튼 이벤트
        // 등록/수정
        $scope.saveCmsUser = function () {
            if ($rootScope.uid == '') {
                userService.createCmsUser($scope.user).then(function(data){
                    alert("정상적으로 등록했습니다.");
                });
            }
            else {
                userService.updateCmsUser($rootScope.uid, $scope.user).then(function(data){
                    alert("정상적으로 수정했습니다.");
                });
            }
        };

        // 조회
        $scope.getCmsUser = function () {
            if ($rootScope.uid != '') {
                userService.getCmsUser(userId).then(function(user){
                    $scope.user = user.data[0];
                });
            }
        }

        // 취소
        $scope.cancel = function () {
            $scope.getCmsUser();
        }

        $scope.getCmsUser();

    }]);
});
