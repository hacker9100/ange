/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : Controller선언
 */

define([
    './controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('ContentListCtrl', ['$scope', 'contentsService', '$location', function ($scope, contentsService, $location) {

        // callback for ng-click 'editContent':
        $scope.editContent = function (contentNo) {
            $location.path('/content/task/edit/'+contentNo);
        };

        // callback for ng-click 'deleteContent':
        $scope.deleteContent = function (idx) {

            var content = $scope.contents[idx];

            contentsService.deleteContent(content.NO).then(function(data){
                $scope.contents.splice(idx, 1);
            });
        };

        // callback for ng-click 'createContent':
        $scope.createNewContent = function () {
            $location.path('/content/task/edit/0');
        };

        contentsService.getContents().then(function(contents){
            $scope.contents = contents.data;
        });
    }]);
/*
    controllers.controller('ContentListCtrl', ['$scope', '$stateParams', 'contentsService', 'contentsFactory', 'contentFactory', '$location', function ($scope, $stateParams, contentsService, contentsFactory, contentFactory, $location) {

        // callback for ng-click 'editContent':
        $scope.editContent = function (contentNo) {
            $location.path('content/task/edit/'+contentNo);
        };

        // callback for ng-click 'deleteContent':
        $scope.deleteContent = function (contentNo) {
            contentFactory.delete({'id': contentNo});
            $scope.contents = contentFactory.query();
        };

        // callback for ng-click 'createContent':
        $scope.createNewContent = function () {
            $location.path('/content/task/edit/0');
        };

        $scope.contents = contentsFactory.query();
    }]);
*/
});

