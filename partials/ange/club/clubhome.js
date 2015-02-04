/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-30
 * Description : clubhome.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('clubhome', ['$rootScope', '$scope', '$window', '$location', 'dialogs', 'UPLOAD', function ($rootScope, $scope, $window, $location, dialogs, UPLOAD) {

        $scope.selectIdx = 1;

        $scope.selectSubIdx = 1;
        /********** 초기화 **********/
        $scope.init = function () {

        };

        /********** 이벤트 **********/
        $scope.click_selectTab = function (idx){
            $scope.selectIdx = idx;

            if(idx == 1){
                $scope.selectSubIdx = 1;
            }else {
                $scope.selectSubIdx = 5;
            }
        }

        /********** 이벤트 **********/
        $scope.click_selectSubTab = function (idx){
            $scope.selectSubIdx = idx;
        }

        $scope.init();
	}]);
});
