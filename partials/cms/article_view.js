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
    controllers.controller('article_view', ['$scope', '$stateParams', 'contentService', '$sce', '$location', function ($scope, $stateParams, contentService, $sce, $location) {

        if ($scope.method == 'GET' && $stateParams.id != undefined){
            $scope.message = 'ANGE CMS';

            $scope.pageTitle = '원고 조회';
            $scope.pageDescription = '원고를 조회합니다.';
        }

        $scope.renderHtml = function(html) {
            return $sce.trustAsHtml(html);
        }

        // 버튼 이벤트
        // 목록
        $scope.getContents = function () {
            $location.search({_method: 'GET'});
            $location.path('/article/list');
        };

        // 수정
        $scope.editContent = function (no) {
            $location.search({_method: 'PUT'});
            $location.path('/article/edit/'+no);
        };

        // 삭제
        $scope.deleteContent = function (contentNo) {
            contentService.deleteContent(contentNo).then(function(data){
                $location.search({_method: 'GET'});
                $location.path('/article/list');
            });
        };

        // 조회
        if ($scope.method == 'GET' && $stateParams.id != undefined) {
            contentService.getContent($stateParams.id).then(function(content){
                $scope.content = content.data[0];
            });
        };
    }]);
});
