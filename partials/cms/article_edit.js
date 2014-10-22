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
    controllers.controller('article_edit', ['$scope', '$rootScope', '$stateParams', 'contentService', '$location', function ($scope, $rootScope, $stateParams, contentService, $location) {

        // 페이지 타이틀
        $scope.message = 'ANGE CMS';

        if ($scope.method != 'GET'){
            if ( $scope.method == 'PUT') {
                $scope.pageTitle = '원고 수정';
                $scope.pageDescription = '원고를 수정합니다.';
            } else {
                $scope.pageTitle = '원고 등록';
                $scope.pageDescription = '원고를 등록합니다.';
            }
        }

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
        $scope.ckeditor = '\n';
//        $scope.project = { "BODY": '<p>Hello</p>\n' };

        // 버튼 이벤트
        // 목록
        $scope.getContents = function () {
            $location.search({_method: 'GET'});
            $location.path('/article/list');
        };

        // 등록/수정
        $scope.saveContent = function () {
            if ( $scope.method == 'POST') {
                $scope.content.PHASE = '10';
                contentService.createContent($scope.content).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/article/list');
                });
            }
            else {
                contentService.updateContent($scope.content.NO, $scope.content).then(function(data){
                    $location.search({_method: 'GET'});
                    $location.path('/article/list');
                });
            }
        };

        // 조회
        if ($scope.method != 'GET' && $stateParams.id != 0) {
            contentService.getContent($stateParams.id).then(function(content){
                $scope.content = content.data[0];
            });
        }

        var fileInfo = [{"name":"Hydrangeas.jpg","size":595284,"url":"http://localhost/app/serverscript/upload/../../upload/files/test1/Hydrangeas.jpg","thumbnailUrl":"http://localhost/app/serverscript/upload/../../upload/files/test1/thumbnail/Hydrangeas.jpg","deleteUrl":"http://localhost/app/serverscript/upload/?file=Hydrangeas.jpg","deleteType":"DELETE"},{"name":"Lighthouse.jpg","size":561276,"url":"http://localhost/app/serverscript/upload/../../upload/files/test1/Lighthouse.jpg","thumbnailUrl":"http://localhost/app/serverscript/upload/../../upload/files/test1/thumbnail/Lighthouse.jpg","deleteUrl":"http://localhost/app/serverscript/upload/?file=Lighthouse.jpg","deleteType":"DELETE"}];
        $scope.queue = fileInfo;
    }]);
});
