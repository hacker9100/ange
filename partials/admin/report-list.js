/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-26
 * Description : report-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('report-list', ['$scope', '$stateParams', '$location', '$filter', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $stateParams, $location, $filter, dialogs, ngTableParams, CONSTANT) {

        /********** 초기화 **********/

        // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/


        /********** 화면 초기화 **********/
        $scope.init();

    }]);
});
