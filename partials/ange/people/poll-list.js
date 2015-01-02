/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : poll-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('poll-list', ['$scope', '$stateParams', '$location', '$controller', function ($scope, $stateParams, $location, $controller) {

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showEditPoll = function(item) {
            alert("1");
            $location.url('people/poll/edit/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
        $scope.init();

    }]);
});
