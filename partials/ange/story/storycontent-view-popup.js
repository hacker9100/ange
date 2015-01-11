/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2014-12-28
 * Description : storycontent-view-popup.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("storycontent-view-popup", ['$scope', '$sce', '$controller', '$rootScope', '$location', '$modalInstance', '$q', 'dialogs', 'UPLOAD', 'data', function($scope, $sce, $controller, $rootScope, $location, $modalInstance, $q, dialogs, UPLOAD, data) {

        angular.extend(this, $controller('ange-common', {$scope: $scope}));

        /********** 초기화 **********/

        $scope.TARGET_NO = data.NO;
        $scope.TARGET_GB = 'CONTENT';

        // 초기화
        $scope.init = function () {

        };

        /********** 콘텐츠 랜더링 **********/
        $scope.renderHtml = function(html_code) {
            return html_code != undefined ? $sce.trustAsHtml(html_code) : '';
//            return html_code;
        };

        /********** 이벤트 **********/
        $scope.click_ok = function () {
            $modalInstance.close();
        };

        // 콘텐츠 조회
        $scope.getContent = function () {
            var deferred = $q.defer();
            $q.all([
                    $scope.getItem('cms/task', 'item', data.NO, {}, false).then(function(data){ $scope.task = data; }),
                    $scope.getItem('cms/content', 'item', data.NO, {}, false).then(function(data){
                        $scope.item = data;
                    }),
                    $scope.getList('cms/task', 'list', {NO:$scope.PAGE_NO, SIZE:5}, {EDITOR_ID: data.EDITOR_ID, PHASE: '30, 31'}, false).then(function(data){
                        $scope.editorList = data;
                    }),
                    $scope.getList('ad/banner', 'list', {NO:$scope.PAGE_NO, SIZE:1}, $scope.search, false).then(function(data){
                        for (var i in data) {
                            if (data[i].FILE.PATH != undefined) {
                                var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                data[i].FILE = img;
                                $scope.ad = data[i];
                            }
                        }
                    })
                ])
                .then( function(results) {
                    deferred.resolve();
                },function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        // 공감
        $scope.click_likeCntAdd = function(){

            $scope.updateItem('cms/task', 'like', data.NO, {}, false)
                .then(function(){
                    dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});
                    $scope.task.LIKE_CNT = parseInt($scope.task.LIKE_CNT) + 1;
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.init();
        $scope.getContent();
    }]);
});

