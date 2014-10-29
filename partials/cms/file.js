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

    var url = '/serverscript/upload/';

    // 사용할 서비스를 주입
    controllers.controller('file', ['$scope', '$http', '$filter', '$window', function ($scope, $http) {
        $scope.options = { url: url, autoUpload: true, dropZone: angular.element('#test') };

//        $scope.newDir = 'test1/';

/*
        $scope.loadingFiles = true;
//        $http.get(url+'?newDir='+$scope.newDir)
        $http.get(url)
            .then(
            function (response) {
                $scope.loadingFiles = false;
                $scope.queue = response.data.files || [];
            },
            function () {
                $scope.loadingFiles = false;
            }
        );
*/
    }]);

    controllers.controller('file_destroy', ['$scope', '$http', function ($scope, $http) {
        var file = $scope.file,
            state;
        if (file.url) {
            file.$state = function () {
                return state;
            };
            file.$destroy = function () {
                state = 'pending';
                return $http({
//                    url: file.deleteUrl+'&newDir='+$scope.newDir,
                    url: file.deleteUrl,
                    method: file.deleteType
                }).then(
                    function () {
                        state = 'resolved';
                        $scope.clear(file);
                    },
                    function () {
                        state = 'rejected';
                    }
                );
            };
        } else if (!file.$cancel && !file._index) {
            file.$cancel = function () {
                $scope.clear(file);
            };
        }
    }]);

    controllers.controller('file_editor', ['$scope', '$http', function ($scope, $http) {
        var file = $scope.file,
            state;
        if (file.url) {
            file.$state = function () {
                return state;
            };
            file.$editor = function () {
                var img = '<img alt="" src="/upload/files/medium/'+file.name+'" />';
                $scope.$parent.content.BODY += img;
            };
        }
    }]);
});
