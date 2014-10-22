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
    controllers.controller('edit_edit', ['$scope', '$stateParams', 'contentService', '$location', function ($scope, $stateParams, contentService, $location) {

        // 페이지 타이틀
        $scope.message = 'ANGE CMS';

        if ($scope.method != 'GET'){
            if ( $stateParams.id != 0) {
                $scope.pageTitle = '기사 수정';
                $scope.pageDescription = '기사를 수정합니다.';
            } else {
                $scope.pageTitle = '기사 등록';
                $scope.pageDescription = '기사를 등록합니다.';
            }
        }

        // ui bootstrap 달력
        $scope.today = function() {
            $scope.project.REG_DT = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.project.REG_DT = null;
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
            $location.path('/edit/list');
        };

        // 등록/수정
        $scope.saveContent = function () {
            var id = ($stateParams.id) ? parseInt($stateParams.id) : 0;

//            alert(JSON.stringify($rootScope.files));

            if (id <= 0) {
                contentService.createContent($scope.content).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/edit/list');
                });
            }
            else {
                contentService.updateContent(id, $scope.content).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/edit/list');
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
