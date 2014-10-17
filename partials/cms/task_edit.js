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
    controllers.controller('task_edit', ['$scope', '$stateParams', 'contentService', '$location', function ($scope, $stateParams, contentService, $location) {

        // 페이지 타이틀
        $scope.message = 'ANGE CMS';

        if ($scope.method != 'GET'){
            if ( $stateParams.id != 0) {
                $scope.pageTitle = '태스크 수정';
                $scope.pageDescription = '태스크를 수정합니다.';
            } else {
                $scope.pageTitle = '태스크 등록';
                $scope.pageDescription = '태스크를 등록합니다.';
            }
        }

        // ui bootstrap 달력
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
//        $scope.ckeditor = '<p>Hello</p>\n';
//        $scope.project = { "BODY": '<p>Hello</p>\n' };

        // 버튼 이벤트
        // 목록
        $scope.getContents = function () {
            $location.search({_method: 'GET'});
            $location.path('/task/list');
        };

        // 등록/수정
        $scope.saveContent = function () {
            var id = ($stateParams.id) ? parseInt($stateParams.id) : 0;

            if (id <= 0) {
                contentService.createContent($scope.content).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/task/list');
                });
            }
            else {
                contentService.updateContent(id, $scope.content).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/task/list');
                });
            }
        };

        // 조회
        if ($scope.method != 'GET' && $stateParams.id != 0) {
            contentService.getContent($stateParams.id).then(function(content){
                $scope.content = content.data[0];
            });
        }
    }]);
});
