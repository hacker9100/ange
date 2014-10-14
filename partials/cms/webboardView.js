/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : webboardView.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('webboardView', ['$scope', '$stateParams', 'webboardService', '$sce', '$location', function ($scope, $stateParams, webboardService, $sce, $location) {

		$scope.message = "ANGE CMS";

		$scope.pageTitle = "게시판 조회";
		$scope.pageDescription = "CMS 게시판 조회입니다.";

        // callback for ng-click 'editContent':
        $scope.editBoard = function (no) {
            $location.path('/webboard/edit/'+no);
        };

        if ($stateParams.id != 0) {
            webboardService.getBoard($stateParams.id).then(function(board){
                $scope.board = board.data[0];
            });
        }

        $scope.renderHtml = function(html) {
            return $sce.trustAsHtml(html);
        };
    }]);
});
