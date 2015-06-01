/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangealbum-view-popup.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangealbum-view-popup', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT) {

        $scope.search = {};

        /********** 초기화 **********/
        // 초기화
        $scope.init = function(session) {

        };

        /********** 이벤트 **********/
        // 게시판 목록 조회
        $scope.getMyAlbum = function () {

            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';

            $scope.isLoding = true;
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMyAlbum)
            ['catch']($scope.reportProblems);

    }]);
});
