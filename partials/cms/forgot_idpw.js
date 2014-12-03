/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : forgot_idpw.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('forgot_idpw', ['$scope', '$controller', '$location', 'dialogs', function ($scope, $controller, $location, dialogs ) {

        /********** 공통 컨트롤러 호출 **********/
        angular.extend(this, $controller('cms_common', {$scope: $scope}));

        /********** 이벤트 **********/
        // 저장 버튼 클릭
        $scope.click_submitInfo = function () {
            dialogs.notify('알림', "준비 중입니다..", {size: 'md'});
//            $scope.updateItem('cms_user', $scope.item.USER_ID, $scope.item, true)
//                .then(function(){dialogs.notify('알림', "정상적으로 수정 완료 됐습니다.", {size: 'md'});})
//                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 취소 버튼 클릭
        $scope.click_cancel = function () {
            $location.url('/signin');
        };
    }]);
});
