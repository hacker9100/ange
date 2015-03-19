/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangehome.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangehome', ['$scope', '$stateParams', '$location', 'dialogs', function ($scope, $stateParams, $location, dialogs) {

        // 초기화
        $scope.init = function(session) {
            // ange-portlet-slide-album
            $scope.option_r1_c1 = {title: '나의 앨범', api:'ange/album', size: 12, id: 'album', url: '/myange/album', dots: false, autoplay: true, centerMode: true, showNo: 6, fade: 'false'};

            // ange-portlet-channel-list
            $scope.option_r3_c2 = {title: '내활동', api:'com/webboard', size: 5, channel: "people", type: 'writing', url: '/myange/writing', image: false, head: true, date: false, nick: false};
        };

        /********** 이벤트 **********/
        $scope.getItem('ange/message', 'tocount', null, false)
            .then(function(data){
                $scope.TO_CNT = data.TO_CNT;
            })
            ['catch'](function(error){$scope.TO_CNT = 0;});

        // 조회 버튼 클릭
        $scope.click_showViewMyAlbum = function (item) {
            $scope.openViewMyAlbumModal(item, 'lg');
        };

        $scope.openViewMyAlbumModal = function (item, size) {
            var dlg = dialogs.create('partials/ange/myange/myangealbum-view-popup.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', 'data', function($scope, $rootScope, $modalInstance, $controller, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));

                    $scope.item = data;

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }
                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        /********** 화면 초기화 **********/
/*        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);
});
