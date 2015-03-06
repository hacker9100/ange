/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momshome.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momshome', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $stateParams, $location, dialogs, CONSTANT) {

        // 초기화
        $scope.init = function(session) {
            // ange-portlet-slide-exprience
            $scope.option_r1_c1 = {title: '롤링 체험단', api:'ad/banner', size: 5, id: 'experience', type: 'experience', gb: CONSTANT.AD_CODE_BN28, dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            // ange-portlet-slide-exprience
            $scope.option_r1_c2 = {title: '롤링 이벤트', api:'ad/banner', size: 5, id: 'event', type: 'event', gb: CONSTANT.AD_CODE_BN09, dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            // ange-portlet-channel-list
            $scope.option_r2_c1 = {title: '앙쥬후기', api:'ange/review', size: 10, channel: "moms", type: 'review', url: '/moms/board', image: false, head: true, date: true, nick: false, defIdx: 3, tab: [{no: 'BOOK', menu: '/moms/bookreview', name: '북카페'}, {no: 'SAMPLE', menu: '/moms/samplereview', name: '샘플팩'}, {no: 'ANGE', menu: '/moms/angereview', name: '앙쥬'}, {no: 'PRODUCT', menu: '/moms/productreview', name: '상품'}]};
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
/*        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            ['catch']($scope.reportProblems);*/
        $scope.init();

        $scope.clickyet = function() {
            //dialogs.notify('알림', '점검중입니다.', {size: 'md'});
            $location.url('/moms/eventwinner/list');
        }

    }]);
});
