/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-10
 * Description : board-report.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('board-report', ['$rootScope', '$scope', '$window', '$sce', '$controller', '$location', '$modalInstance', '$q', 'dialogs', 'CONSTANT', 'UPLOAD', 'data', '$modal', function($rootScope, $scope, $window, $sce, $controller, $location, $modalInstance, $q, dialogs, CONSTANT, UPLOAD, data, $modal) {

        $scope.init = function (){

            console.log(data.TARGET_GB);
            console.log(data.DETAIL_GB);

            $scope.item.CHANNEL_NO = $scope.menu.CHANNEL_NO;
            $scope.item.MENU_NO = $scope.menu.NO;
            $scope.item.TARGET_NO = data.NO;
            $scope.item.TARGET_GB = data.TARGET_GB;
            $scope.item.TARGET_NOTE = data.SUBJECT;
            $scope.item.DETAIL_GB = data.DETAIL_GB;
            $scope.item.TARGET_UID = data.REG_UID;
            $scope.item.TARGET_NICK = data.NICK_NM;
            $scope.item.REG_UID = $scope.uid;
            $scope.item.REG_NICK = $rootScope.nick;

        }

        $scope.click_saveReport = function (){

            $scope.insertItem('ange/notify', 'item', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '신고가 접수되었습니다.', {size: 'md'});
                    $modalInstance.close();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        $scope.click_cancel = function () {
            $modalInstance.close();
        };

        $scope.init();
    }]);
});