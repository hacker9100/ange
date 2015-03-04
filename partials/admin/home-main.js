/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-16
 * Description : home-main.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('home-main', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, CONSTANT, UPLOAD) {

        /********** 초기화 **********/

        // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
//            .then($scope.permissionCheck)
            ['catch']($scope.reportProblems);

        $scope.init();
    }]);
});
