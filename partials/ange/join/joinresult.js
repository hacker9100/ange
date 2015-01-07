/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-06
 * Description : joinresult.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('joinresult', ['$scope', '$rootScope', '$location', '$controller', 'dialogs', function ($scope, $rootScope, $location, $controller, dialogs) {

        /********** 초기화 **********/
        $scope.init = function () {

        };

        /********** 이벤트 **********/

        $scope.init();
	}]);
});
