/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2015-01-02
 * Description : poll-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("poll-edit", ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams) {

        // 게시판 초기화
/*        $scope.item = {};

        // 초기화
        $scope.init = function() { // function(session)

        };

        // 게시판 조회
        $scope.getAngePoll = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('ange/poll', 'item', $stateParams.id, {}, false)
                    .then(function(data){

                        for(var i=0; i<=data.length; i++){
                            $scope.item.SUBJECT = data[0].SUBJECT;
                        }

                        $scope.item = data;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };


        $scope.click_saveAngePoll = function () {
            $scope.insertItem('ange/poll', 'item', $scope.item, false)
                .then(function(){
                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                    $location.url('/peoplepoll/list');
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        $scope.click_showAngePollList = function() {
            $location.url('/peoplepoll/list');
        }*/

    }]);
});
