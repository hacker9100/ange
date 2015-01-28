/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : file upload 콘트롤러
 */

define([
    '../../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('file', ['$scope', 'dialogs', 'UPLOAD', function ($scope, dialogs, UPLOAD) {
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        $scope.click_deleteFile = function (idx, file) {
            $scope.deleteItem('com/file', 'item', file.no, false)
                .then(function(){$scope.queue.splice(idx, 1); dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

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
//                alert(JSON.stringify(file))
//                var img = '<img alt="" src="/upload/files/medium/'+file.name+'" />';

                if (!angular.isUndefined(CKEDITOR)) {
                    var element = CKEDITOR.dom.element.createFromHtml( '<img alt="" src="'+file.url+'" />' );
                    CKEDITOR.instances.editor1.insertElement( element );
                }

//                var img = '<img alt="" src="'+file.mediumUrl+'" />';
//                $scope.item.BODY += img;
            };
        }
    }]);
});
