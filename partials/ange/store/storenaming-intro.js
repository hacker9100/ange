/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : storenaming-intro.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('storenaming-intro', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {
            $scope.community = "네이밍 소개";
        };

        /********** 이벤트 **********/

        $scope.click_naming_request = function(key){
            $location.url('store/naming/request/'+key);
        }

        $scope.init();

    }]);
});
