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
    controllers.controller('ContentDetailCtrl', ['$scope', '$stateParams', 'contentsService', '$location', function ($scope, $stateParams, contentsService, $location) {
        $scope.saveContent = function () {
            var id = ($stateParams.id) ? parseInt($stateParams.id) : 0;

            if (id <= 0) {
                contentsService.createContent($scope.content).then(function(data){
                    $location.path('/content/task');
                });
            }
            else {
                contentsService.updateContent(id, $scope.content).then(function(data){
                    $location.path('/content/task');
                });
            }
        };

        // callback for ng-click 'deleteContent':
        $scope.deleteContent = function (contentNo) {
            contentsService.deleteContent(contentNo).then(function(data){
                $location.path('/content/task');
            });
        };

        contentsService.getContent($stateParams.id).then(function(content){
            $scope.content = content.data;
        });
    }]);
/*
    // 사용할 서비스를 주입
    controllers.controller('ContentDetailCtrl', ['$scope', '$stateParams', 'contentsService', 'contentsFactory', 'contentFactory', '$location', function ($scope, $stateParams, contentsService, contentsFactory, contentFactory, $location) {
        $scope.saveContent = function () {
            var id = ($stateParams.id) ? parseInt($stateParams.id) : 0;

            if (id <= 0) {
                contentsFactory.create($scope.content);
                $location.path('/content/task');
            }
            else {
                alert(JSON.stringify($scope.content));
                contentFactory.update({id: id}, $scope.content);
            }
        };

        // callback for ng-click 'deleteContent':
        $scope.deleteContent = function (contentNo) {
            alert($stateParams.id);
            contentFactory.delete({id: $stateParams.id});
            $scope.contents = contentFactory.query();
        };

        $scope.content = contentFactory.show({id: $stateParams.id});
    }]);
*/
});

