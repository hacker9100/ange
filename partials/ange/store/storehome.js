/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : storehome.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('storehome', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $stateParams, $location, dialogs, CONSTANT) {

        // 초기화
        $scope.init = function(session) {
            // ange-portlet-slide-banner
            $scope.option_r1_c2 = {title: '롤링 스토어', api:'ange/product', size: 5, id: 'store', type: 'cummerce', url: '/store/cummerce', dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            // ange-portlet-slide-page
            $scope.option_r2_c1 = {title: '마일리지몰', api:'ange/product', size: 9, id: 'mileage', type: 'mileage', url: '/store/mileagemall', dots: false, autoplay: true, centerMode: true, showNo: 3, fade: 'false'};
        };

        /********** 화면 초기화 **********/
        $scope.init();
    }]);
});
