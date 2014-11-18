/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : webboard_edit.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('webboard_edit', ['$scope', '$stateParams', '$location', '$controller', 'UPLOAD', function ($scope, $stateParams, $location, $controller, UPLOAD) {

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
        $scope.addEditor = true;

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

        /********** 초기화 **********/
        // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};

        // 초기화
        $scope.init = function(session) {

        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
        $scope.ckeditor = '<p>\n<p>';

        /********** 이벤트 **********/
        // 게시판 목록 이동
        $scope.click_showCmsBoardList = function () {
            $location.url('/webboard');
        };

        // 게시판 조회
        $scope.getCmsBoard = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('webboard', $stateParams.id, {}, true)
                    .then(function(data){
                        $scope.item = data;

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }
                    })
                    .catch(function(error){alert(error)});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_saveCmsBoard = function () {
            $scope.item.FILES = $scope.queue;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = "";
//                $scope.item.FILES[i].$submit();
            }

            if ($stateParams.id == 0) {
                $scope.insertItem('webboard', $scope.item, false)
                    .then(function(){$location.url('/webboard');})
                    .catch(function(error){alert(error)});
            } else {
                $scope.updateItem('webboard', $stateParams.id, $scope.item, false)
                    .then(function(){$location.url('/webboard');})
                    .catch(function(error){alert(error)});
            }
        };

        $scope.test = function () {
            alert("test");
        }

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            .catch($scope.reportProblems);

    }]);
});
