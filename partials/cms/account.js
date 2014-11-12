/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : account_edit.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('account', ['$scope', '$rootScope', '$stateParams', '$location', '$controller', function ($scope, $rootScope, $stateParams, $location, $controller ) {

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

        /********** 초기화 **********/
        $scope.init = function() {

        };

        /********** 이벤트 **********/
        // 저장 버튼 클릭
        $scope.click_saveCmsUser = function () {
            $scope.updateItem('cms_user', $stateParams.id, $scope.item, true)
                .then(function(){alert("정상적으로 수정했습니다.");})
                .catch(function(error){alert(error)});
        };

        // 로그인 사용자 조회
        $scope.getCmsUser = function (session) {
            if (session.USER_ID != '') {
                $scope.getItem('cms_user', session.USER_ID, {}, true)
                    .then(function(data){$scope.item = data;})
                    .catch(function(error){alert(error)});
            } else {
                alert("조회 정보가 없습니다.");
            }
        };

        // 취소
        $scope.click_cancel = function () {
            $scope.getSession()
                .then($scope.sessionCheck)
                .then($scope.getCmsUser)
                .catch($scope.reportProblems);
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.getCmsUser)
            .catch($scope.reportProblems);

    }]);
});
